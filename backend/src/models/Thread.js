import mongoose from "mongoose"

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { _id: false },
)

const replySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    votes: { type: [voteSchema], default: [] },
    replies: { type: [] /* will hold nested replySchema objects */, default: [] },
  },
  { timestamps: true },
)
// Self-reference for nested replies
replySchema.add({ replies: [replySchema] })

const threadSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: { type: [String], default: [], index: true },
    category: { type: String, required: true, index: true },
    votes: { type: [voteSchema], default: [] },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true },
)

// Define a single text index across title + description for $text searches
threadSchema.index({ title: "text", description: "text" })

export const Thread = mongoose.model("Thread", threadSchema)
