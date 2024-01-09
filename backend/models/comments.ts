import mongoose from "mongoose";

export interface ICommentCreate {
  author_id: mongoose.Types.ObjectId
  post_id: mongoose.Types.ObjectId
  comment_id?: mongoose.Types.ObjectId
  text: string,
  time: number,
}

export interface IComment extends ICommentCreate {
  _id: mongoose.Types.ObjectId,
}
export interface ICommentResponse extends IComment {
  author_name: string
}

const CommentSchema = new mongoose.Schema<IComment>({
  author_id: { type: mongoose.Schema.ObjectId, required: true, ref: "User", index: true },
  post_id: { type: mongoose.Schema.ObjectId, required: true, ref: "Post", index: true },
  comment_id: { type: mongoose.Schema.ObjectId, ref: "Comment", sparse: true },

  text: { type: String, required: true, maxLength: 300, minlength: 1, index: "text" },
  time: { type: Number, default: Date.now() },
})

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;