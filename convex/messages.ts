import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { count, error, timeStamp } from "console";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { auth } from "./auth";

const populateUser = (ctx:QueryCtx, userId:Id<'users'>)=>{
return ctx.db.get(userId);
}

 const populatMember = (ctx:QueryCtx, memberId:Id<'members'>)=>{
    return ctx.db.get(memberId);
}

const populateReaction = (ctx:QueryCtx, messageId:Id<'messages'>)=>{
        return ctx.db.query('reactions').withIndex('by_message_id',(q)=>q.eq('messageId',messageId)).collect();
} 

const populateThread = async(ctx:QueryCtx, messageId:Id<'messages'>)=>{
    const messages = await ctx.db.query('messages').withIndex('by_parent_message_id',(q)=>q.eq('parentMessageId', messageId))
    .collect()

    if(messages.length == 0){
        return{
            count:0,
            image:undefined,
            timeStamp:0,

        }
    }
    const lastmessage = messages[messages.length-1]
    const lastMessagemmber = await populatMember(ctx, lastmessage.memberId);
    if(!lastMessagemmber){
        return{
            count:messages.length,
            image:undefined,
            timeStamp:0
        }
    }
    const lastMessageUser = await populateUser(ctx, lastMessagemmber.userId);
    return{
        count: messages.length,
        image:lastMessageUser?.image,
        timeStamp:lastmessage._creationTime
    }
}
export const create = mutation({
    args:{
        body:v.string(),
        image:v.optional(v.id('_storage')),
        workspaceId:v.id('workspaces'),
        channelId:v.optional(v.id('channels')),
        parentMessageId:v.optional(v.id('messages')),
        conversationId:v.optional(v.id('conversations'))
    },
    handler:async(ctx, args) =>{
         const userId = await getAuthUserId(ctx);  // apne user auth id 
                     if(!userId){
                 throw new Error('user Unauthorized')
                     }
                     const members = await ctx.db
                     .query('members')
                     .withIndex('by_workspace_id_by_user_id',(q)=>  // user and workspaces connected walamember return krega jisme sirf me member hu 
                        q.eq("userId", userId).eq('workspaceId', args.workspaceId)
                     ).unique()
                     if(!members){
                            throw new Error('Unauthorized')
                     }
                     let _conversationId = args.conversationId
                            // me apneap se reply krke chat kra hu 
                    if(!args.conversationId && args.channelId && args.parentMessageId){
                            const parentMessage = await ctx.db.get(args.parentMessageId);
                            if(!parentMessage){
                                throw new Error('parent message not found')
                            }
                            _conversationId  = parentMessage.conversationId

                    }
                     
                     const messageId = await ctx.db.insert('messages',{
                        memberId:members._id,
                        body:args.body,
                        image:args.image,
                        channelId:args.channelId,
                        workspaceId:args.workspaceId,
                        conversationId:_conversationId,
                        parentMessageId:args.parentMessageId,
                        
                     })
                     return messageId;
        
    },
})

export const get = query({
  args: v.object({
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    parentMessageId: v.optional(v.id('messages')),
  }),

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('User unauthorized');

    let _conversationId = args.conversationId;

    if (!args.conversationId && args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) throw new Error('Parent message not found');
      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query('messages')
      .withIndex('by_channel_parentid_messageid_conversationid', (q) =>
        q
          .eq('channelId', args.channelId)
          .eq('conversationId', _conversationId)
          .eq('parentMessageId', args.parentMessageId)
      )
      .order('desc')
      .collect();

    const page = (
      await Promise.all(
        results.map(async (message) => {
          const member = await populatMember(ctx, message.memberId);
          if (!member) return null;

          const user = await populateUser(ctx, member.userId);
          const reactions = await populateReaction(ctx, message._id);
          const thread = await populateThread(ctx, message._id);
          const image = message.image
            ? await ctx.storage.getUrl(message.image)
            : undefined;

          // Aggregate reactions
          const reactionsWithCounts = reactions.map((reaction) => ({
            ...reaction,
            count: results.filter((msg) => msg._id === reaction.messageId).length,
          }));

          const dedupedReactions = reactionsWithCounts.reduce((acc, reaction) => {
            const existing = acc.find((r) => r.value === reaction.value);
            if (existing) {
              existing.memberIds = Array.from(
                new Set([...existing.memberIds, reaction.memberId])
              );
            } else {
              acc.push({
                ...reaction,
                memberIds: [reaction.memberId],
              });
            }
            return acc;
          }, [] as (Doc<'reactions'> & { count: number; memberIds: Id<'members'>[] })[]);

          const reactionWithoutMemberIds = dedupedReactions.map(({ memberIds, ...reaction }) => ({
            ...reaction,
            count: memberIds.length,
          }));

          return {
            ...message,
            image,
            member,
            user,
            reactions: reactionWithoutMemberIds,
            threadCount: thread.count,
            threadImage: thread.image,
            threadTimeStamp: thread.timeStamp,
          };
        })
      )
    ).filter((m) => m !== null);

    return {
      page,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id('messages'),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('User unauthorized');

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error('Message not found');

    const members = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_by_user_id', (q) =>
        q.eq('userId', userId).eq('workspaceId', message.workspaceId)
      )
      .unique();

    if (!members) throw new Error('Unauthorized');

    if (message.memberId !== members._id) {
      throw new Error('You are not authorized to edit this message');
    }

    await ctx.db.patch(args.id, { body: args.body, updatedAt: Date.now() });
    return args.id;
  },
});


export const remove = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('User unauthorized');

    const message = await ctx.db.get(args.id);
    if (!message) throw new Error('Message not found');

    const members = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_by_user_id', (q) =>
        q.eq('userId', userId).eq('workspaceId', message.workspaceId)
      )
      .unique();

    if (!members) throw new Error('Unauthorized');

    if (message.memberId !== members._id) {
      throw new Error('You are not authorized to edit this message');
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const getById = query({
args:{
    id:v.id('messages')
},
handler:async(ctx, args)=>{
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('User unauthorized');


  const message = await ctx.db.get(args.id);
    if(!message){
     
       return null;
    }

   
    const member = await populatMember(ctx, message.memberId);
    if(!member){
        return null;

    }


    const user = await populateUser(ctx, member.userId);
    if(!user){
      return null;
    }
    const reactions = await populateReaction(ctx, message._id);
      const reactionsWithCounts = reactions.map((reaction) => ({
            ...reaction,
            count: reactions.filter((msg) => msg.value === reaction.value).length,
          }));

            const dedupedReactions = reactionsWithCounts.reduce((acc, reaction) => {
            const existing = acc.find((r) => r.value === reaction.value);
            if (existing) {
              existing.memberIds = Array.from(
                new Set([...existing.memberIds, reaction.memberId])
              );
            } else {
              acc.push({
                ...reaction,
                memberIds: [reaction.memberId],
              });
            }
            return acc;
          }, [] as (Doc<'reactions'> & { count: number; memberIds: Id<'members'>[] })[]);
 
          const reactionWithoutMemberIds = dedupedReactions.map(({ memberIds, ...reaction }) => ({
            ...reaction,
            count: memberIds.length,
          }));
return {
  ...message,
  image:message.image ? await ctx.storage.getUrl(message.image):undefined,
  user, member, reactions:reactionWithoutMemberIds,

}
  },
})