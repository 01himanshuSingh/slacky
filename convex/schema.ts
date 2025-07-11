import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  // Your other tables...
  workspaces:defineTable({
    name: v.string(),
    userId:v.id('users'), // kis user ke dwara bna hai 
    joinCode:v.string(),
  }),

  members:defineTable({
    userId:v.id("users"),
    workspaceId:v.id('workspaces'),
    role:v.union(v.literal('admin'),v.literal('member'))
  })
  .index('by_user_id',['userId'])
  .index('by_workspace_id',['workspaceId'])
  .index('by_workspace_id_by_user_id',["userId","workspaceId"]),

  channels:defineTable({
    name:v.string(),
    workspaceId:v.id('workspaces')
  })
  .index('by_workspace_id',['workspaceId']),
  conversations:defineTable({
    workspaceId:v.id('workspaces'),
    memberOneId:v.id('members'),
    memberTwoId:v.id('members')
  })
  .index('by_workspace_id', ['workspaceId']),
  
  messages:defineTable({
    body:v.string(),
    image:v.optional(v.id('_storage')),
    memberId:v.id('members'),
    workspaceId:v.id('workspaces'),
    channelId:v.optional(v.id('channels')),
    parentMessageId:v.optional(v.id('messages')), // swipe reply
    conversationId:v.optional(v.id('conversations')),
    updatedAt:v.number(),
    //we will add conversationId
  }).index('by_workspace_id',['workspaceId'])
  .index('by_member_id',['memberId'])
  .index('by_channel_id',['channelId'])
  .index('by_conversation_id',['conversationId'])
  .index('by_parent_message_id', ['parentMessageId'])
  // ek channel ke anther one by one message ka swipe reply krna 
  .index('by_channel_parentid_messageid_conversationid',['channelId','conversationId','parentMessageId']),
  reactions:defineTable({
    workspaceId:v.id('workspaces'),
    messageId:v.id('messages'),
    memberId:v.id('members'),
    value:v.string()
  })
  .index('by_workspace_id',['workspaceId'])
  .index('by_member_id',['memberId'])
 .index('by_message_id',['messageId'])
});
 
export default schema;