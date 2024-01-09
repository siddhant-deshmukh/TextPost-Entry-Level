import axios from 'axios'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface IUserSliceState {
  loading: boolean
  user: IUser | undefined
  errMsg: string | null
  msg: string | null
}

const initialState: IUserSliceState = {
  loading: true,
  user: undefined,
  errMsg: null,
  msg: null
}

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const res = await axios(`${import.meta.env.VITE_API_URL}/`)
    const data = await res.data
    const code = res.status
    return { code, data }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startingToLoadUser: ( state ) => {
      state.loading = true
    },
    loadUserFailed: (state, action: PayloadAction<{ errorMsg: string }>) => {
      state.loading = false
      state.errMsg = action.payload.errorMsg
    }, 
    loadUserSuccess: (state, action: PayloadAction<{ user: IUser | undefined, msg: string | null }>) => {
      state.loading = false
      if(action.payload.user){
        state.user = action.payload.user
      } else if(action.payload.msg){
        state.msg = action.payload.msg
      }
    },
    logoutUser: (state) => {
      state.user = undefined
      axios.get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true })
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<{
      code: number;
      data: any;
    }>) => {
      state.loading = false
      if (action.payload.code === 200 && action.payload.data.user) {
        state.user = action.payload.data.user
      } else {
        state.errMsg = "error while getting the user data"
      }
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.errMsg = "error while getting the user data"
      console.log("the error", action.payload)
    })
  }
})

// Action creators are generated for each case reducer function
export const { loadUserFailed, loadUserSuccess, startingToLoadUser, logoutUser } = userSlice.actions

export default userSlice.reducer

