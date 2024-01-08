import express, { Request, Response } from 'express'
import { body, check, query } from 'express-validator';

import Post, { IPostResponse } from '../models/posts';
import auth from '../middleware/auth'
import validate from '../middleware/validate';
import User from '../models/users';

var router = express.Router();

/* GET home page. */
router.get('/',
  auth,
  query('limit').optional().isInt().default(10),
  query('skip').optional().isInt().default(0),
  validate,
  async function (req: Request, res: Response) {
    try {
      let { limit, skip }: { limit?: number, skip?: number } = req.query

      if (!limit) limit = 10;
      if (!skip) skip = 0
      const posts = await Post.find().sort({ time: "descending" }).limit(limit).skip(skip)

      const getPostWithAuthorInfoPromise = posts.map(async (post) : Promise<IPostResponse | undefined> =>{
        const authorInfo = await User.findById(post.author_id).select({ name: 1 })
        if(!authorInfo){
          return undefined
        }
        return {
          ...post.toObject(),
          author_name: authorInfo.name
        } 
      })

      const PostWithAuthorsInfo = await Promise.all(getPostWithAuthorInfoPromise)

      return res.status(200).json({ posts: PostWithAuthorsInfo, from: skip + 1, till: skip + limit });
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.post('/',
  auth,
  body('title').exists().isString().isLength({ max: 30, min: 1 }),
  body('description').exists().isString().isLength({ max: 300, min: 1 }),
  body('tags').optional().isArray({ max: 5 }),
  check('tags.*').isString().isLength({ max: 10, min: 1 }),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { title, description, tags }: { title: string, description: string, tags: string[] } = req.body

      const post = await Post.create({
        author_id: res.user?._id,
        tags,
        title,
        description,
        time: Date.now(), 
      })

      res.status(201).json({ post })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

export default router