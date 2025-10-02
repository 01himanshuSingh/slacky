import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const getMember = async(
    ctx:QueryCtx,
    userId:Id<'users'>,
      workspaceId:Id<'workspaces'>
)=>{
    const members = await ctx.db
    .query('members')
    .withIndex('by_workspace_id_by_user_id', (q) =>
      q.eq('userId', userId).eq('workspaceId', workspaceId)
    )
    .unique();

if(!members) throw new Error('Unauthorized');
return members;
}

export const toggle = mutation({
    args:{
       
        messageId:v.id('messages'),
        value:v.string(),
    },
    handler:async(ctx,args)=>{
               const userId = await getAuthUserId(ctx);  // apne user auth id 
                             if(!userId){
                         throw new Error('user Unauthorized')
                             }
                             const message = await ctx.db.get(args.messageId);
                             if(!message){
                                throw new Error('Message not found')
                             }

                const member = await getMember(ctx, userId, message.workspaceId);
                if(!member){
                    throw new Error('Member not found')
                }
                const exisistingMessageFromUser = await ctx.db
                .query('reactions')
                .filter((q)=>
                    q.and(
                        q.eq(q.field('messageId'), args.messageId),
                        q.eq(q.field('memberId'), member._id),
                        q.eq(q.field('value'), args.value)
                        
                    ))
                    .first()
                    if(exisistingMessageFromUser){
                        await ctx.db.delete(exisistingMessageFromUser._id)
                        return exisistingMessageFromUser._id;
                    }else{
                    const newReactionId =     await ctx.db.insert('reactions',{
                            messageId:args.messageId,
                            memberId:member._id,
                            value:args.value,
                            workspaceId:message.workspaceId,
                        })
                        return newReactionId;
                    }
                
                },})