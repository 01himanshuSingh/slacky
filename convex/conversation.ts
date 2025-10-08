import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGet   = mutation({    
    args:{
        workspaceId:v.id('workspaces'),
        memberId:v.id('members')
    },
    handler:async(ctx, args_0) =>{
           const userId = await getAuthUserId(ctx);  // apne user auth id 
                     if(!userId){
                        return null;
                     }
                     const currentMember = await ctx.db.query('members').withIndex('by_workspace_id_by_user_id',(q)=>
                     q.eq('userId', userId).eq('workspaceId', args_0.workspaceId)).unique();
                     const otherMember= await ctx.db.get(args_0.memberId)
                        if(!otherMember || !currentMember){
                            throw new Error("Member not found");
                        }
                        const existingConversation = await ctx.db.query('conversations').filter((q)=>q.eq(q.field('workspaceId'),args_0.workspaceId))
                        .filter((q)=>q.or(
                            q.and(
                                q.eq(q.field('memberOneId'), currentMember._id),
                                q.eq(q.field('memberTwoId'), otherMember._id)
                            ),
                            q.and(
                                q.eq(q.field('memberOneId'), otherMember._id),
                                q.eq(q.field('memberTwoId'), currentMember._id)
                            )
                        )).unique();
                        if(existingConversation){
                            return existingConversation._id;
                        }
                        const conversationId = await ctx.db.insert('conversations',{
                            workspaceId:args_0.workspaceId,
                            memberOneId:currentMember._id,
                            memberTwoId:otherMember._id,
                        })
                       
                        return conversationId;
    },})