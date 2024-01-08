interface IPostCreate {
  title: string
  description: string
  tags: string[]
}
interface IPost extends IPostCreate{
  _id: string
  author_id: string
  time: number
  num_comments: number
  author_name: string
}

interface IUserCreate {
  name: string
  email: string
  password: string
}
interface IUser {
  _id: string
  name: string
  email: string
}

interface ICommentCreate {
  text: string
  comment_id?: string
  post_id: string
}
interface IComment extends ICommentCreate{
  _id: string 
  author_name: string
  author_id: string
  time: number
}