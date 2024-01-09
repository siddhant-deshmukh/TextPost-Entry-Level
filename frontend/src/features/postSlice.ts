import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface IPostSliceState {
  loading: boolean
  feed: IPost[]
  errMsg: string | null
  msg: string | null
  isFinished: boolean
  postChoosenId: null | string
}

const initialState: IPostSliceState = {
  loading: false,
  feed: [],
  errMsg: null,
  msg: null,
  isFinished: false,
  postChoosenId: null,
}

const newPostLimit = 10

export const fetchPost = createAsyncThunk(
  'postFeed/fetchPosts',
  async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/p`)
    const data = await res.data
    const code = res.status
    return { code, data }
  }
)

export const postFeedSlice = createSlice({
  name: 'postFeed',
  initialState,
  reducers: {
    startingToLoadPostFeed: (state) => {
      state.loading = true
    },
    loadPostFeedFailed: (state, action: PayloadAction<{ errorMsg: string }>) => {
      state.loading = false
      state.errMsg = action.payload.errorMsg
    },
    loadPostFeedSuccess: (state, action: PayloadAction<{ newPosts: IPost[], msg: string | null }>) => {
      state.loading = false
      if (!action.payload.newPosts || action.payload.newPosts.length == 0 || action.payload.newPosts.length < newPostLimit) {
        state.isFinished = true
      }
      if (action.payload.newPosts) {
        const oldfeed = state.feed.slice()
        state.feed = oldfeed.concat(action.payload.newPosts)
      } else if (action.payload.msg) {
        state.msg = action.payload.msg
      }
    },
    addNewPost: (state, action: PayloadAction<{ newPost: IPost }>) => {
      const oldfeed = state.feed.slice()
      state.feed = [action.payload.newPost].concat(oldfeed)
    },
    chooseAPost: (state, action: PayloadAction<{ post_id: string | null}>) =>{
      state.postChoosenId = action.payload.post_id
    }
  },
})

// Action creators are generated for each case reducer function
export const { startingToLoadPostFeed, loadPostFeedFailed, loadPostFeedSuccess, addNewPost, chooseAPost } = postFeedSlice.actions

export default postFeedSlice.reducer

