import mongoose from "mongoose";

export interface IPostCreate {
  author_id: mongoose.Types.ObjectId
  title: string,
  description: string,
  tags: string[],
  time: number,
  num_comments: number
}
export interface IPost extends IPostCreate {
  _id: mongoose.Types.ObjectId,
}
export interface IPostResponse extends IPost {
  author_name: string
}

const postSchema = new mongoose.Schema<IPost>({
  author_id: { type: mongoose.Schema.ObjectId, required: true, ref: "User", index: true },
  title: { type: String, required: true, maxLength: 30, minlength: 1 },
  description: { type: String, required: true, maxLength: 300, minlength: 1 },
  tags: [{ type: String, maxLength: 10, minlength: 1 }],
  time: { type: Number, default: Date.now(), index: "descending" },
  num_comments: { type: Number, default: 0 }
})

const Post = mongoose.model<IPost>("post", postSchema);
export default Post;