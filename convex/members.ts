import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { use } from "react";

export const current = query({
    args:{workspaceId:v.id("workspaces")},  // jis workspace se connect ho 
    handler:async(ctx, args)=>{
             const userId = await getAuthUserId(ctx);  // apne user auth id 
             if(!userId){
                return null;
             }

             const members = await ctx.db
             .query('members')
             .withIndex('by_workspace_id_by_user_id',(q)=>  // user and workspaces connected walamember return krega jisme sirf me member hu 
                q.eq("userId", userId).eq('workspaceId', args.workspaceId)
             ).unique()
             if(!members){
                return null
             }
             return members;
    }
})

export const get = query({                                                                   
   args:{workspaceId:v.id('workspaces')},
   handler:async(ctx, args)=>{
      const userId = await getAuthUserId(ctx);  // apne user auth id 
      if(!userId){
         return [];
      }

      const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_by_user_id',(q)=>  // user and workspaces connected walamember return krega jisme sirf me member hu 
         q.eq("userId", userId).eq('workspaceId', args.workspaceId)
      ).unique()
      if(!member){
         return []
      }

      // ab jons workspace dalunga uske sare connected user ajaege 
      const data = await ctx.db.query('members').withIndex('by_workspace_id',(q)=>q.eq('workspaceId',args.workspaceId)).collect();

      const members = []; // is khali arry me sare members jo is woerkspace se connect honge wo ajenge 

      for(const member of data){
         // poulate kenge data me userId wala data 
         const user = await populateUser(ctx , member.userId)
      if(user){
         members.push({
            ...member,
            user,
         })
      }
      }
      return members;
}
})
// populate krene ke kam
const populateUser =(ctx:QueryCtx, id:Id<'users'>)=>{
   return ctx.db.get(id);
}