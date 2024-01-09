import express, { Request, Response } from 'express'
import { body, check, query } from 'express-validator';

import Post, { IPostResponse } from '../models/posts';
import auth from '../middleware/auth'
import validate from '../middleware/validate';
import User from '../models/users';
import Comment, { ICommentResponse } from '../models/comments';

var router = express.Router();

/* GET home page. */
router.get('/:post_id',
  auth,
  query('limit').optional().isInt().default(10),
  query('skip').optional().isInt().default(0),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { comment_id }: { comment_id?: string } = req.query

      const { post_id } = req.params
      const post = await CheckIfPostIdExist(post_id)
      const parentComment = await CheckIfCommentExist(comment_id, post_id)

      if (!post || (comment_id && !parentComment)) {
        return res.status(409).json({ msg: "Post or Parent Comment not found" })
      }

      let { limit, skip }: { limit?: number, skip?: number } = req.query

      if (!limit) limit = 10;
      if (!skip) skip = 0
      const comments = await Comment.find({ post_id, comment_id }).sort({ time: "descending" }).limit(limit).skip(skip)

      const getCommentsWithAuthorInfoPromise = comments.map(async (comment): Promise<ICommentResponse | undefined> => {
        const authorInfo = await User.findById(comment.author_id).select({ name: 1 })
        if (!authorInfo) {
          return undefined
        }
        return {
          ...comment.toObject(),
          author_name: authorInfo.name
        }
      })

      const CommentsWithAuthorsInfo = await Promise.all(getCommentsWithAuthorInfoPromise)

      return res.status(200).json({ comments: CommentsWithAuthorsInfo, from: skip + 1, till: skip + limit });
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.post('/:post_id',
  auth,
  body('text').exists().isString().isLength({ max: 300, min: 1 }),
  query('comment_id').optional().isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { comment_id }: { comment_id?: string } = req.query

      const { post_id } = req.params
      const post = await CheckIfPostIdExist(post_id)
      const parentComment = await CheckIfCommentExist(comment_id, post_id)

      if (!post || (comment_id && !parentComment)) {
        return res.status(409).json({ msg: "Post or Parent Comment not found" })
      }

      const { text }: { text: string } = req.body

      const [comment, updatedPost] = await Promise.all([
        Comment.create({
          author_id: res.user?._id,
          post_id,
          text,
          comment_id,
          time: Date.now()
        }),
        Post.findByIdAndUpdate(
          post_id,
          { $inc: { num_comments: 1 } }
        )
      ])


      res.status(201).json({ comment })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.get('/s',
  auth,
  query('search').exists().isString(),
  validate,
  async function (req: Request, res: Response) {
    try {
      let { search }: { search?: string } = req.query

      if (!search || search !== "") {
        return res.status(400).json({ msg: "no search parameter" })
      }
      const comments = await Comment.find({ $text: { $search: search } }).limit(10)

      const getCommentsWithAuthorInfoPromise = comments.map(async (comment): Promise<ICommentResponse | undefined> => {
        const authorInfo = await User.findById(comment.author_id).select({ name: 1 })
        if (!authorInfo) {
          return undefined
        }
        return {
          ...comment.toObject(),
          author_name: authorInfo.name
        }
      })

      const CommentsWithAuthorsInfo = await Promise.all(getCommentsWithAuthorInfoPromise)

      return res.status(200).json({ comments: CommentsWithAuthorsInfo });
      
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  }
)

async function CheckIfPostIdExist(post_id: string | null) {
  if (post_id) {
    const post = await Post.findById(post_id)
    if (post) {
      return post
    }
  }
  return null
}
async function CheckIfCommentExist(comment_id: string | null | undefined, post_id: string | null) {
  if (post_id && comment_id) {
    const comment = await Comment.findById(comment_id)
    if (comment && comment?.post_id.toString() === post_id) {
      return comment
    }
  }
  return null
}

export default router