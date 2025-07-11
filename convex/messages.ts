import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { count, error, timeStamp } from "console";
import { Id } from "./_generated/dataModel";
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
                        updatedAt:Date.now()
                     })
                     return messageId;
        
    },
})

// export const get= query({
//     args:{
//         channelId:v.optional(v.id('channels')),
//         conversationId:v.optional(v.id('conversations')),
//         parentMessageId:v.optional(v.id('messages')),
//         paginationOptions:paginationOptsValidator
//     },
//     handler:async(ctx, args)=> {
//         const userId = await getAuthUserId(ctx);  // apne user auth id 
//         if(!userId){
//     throw new Error('user Unauthorized')
//         }
//         let _conversationId = args.conversationId;
        
//     },
// })