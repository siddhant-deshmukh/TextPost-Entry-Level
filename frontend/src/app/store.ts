import { configureStore } from '@reduxjs/toolkit'

import userReducer from '../features/userSlice'
import postFeedReducer from '../features/postSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    postFeed: postFeedReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch