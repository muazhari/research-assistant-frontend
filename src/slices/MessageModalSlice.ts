import { createSlice } from '@reduxjs/toolkit'

export interface MessageModalState {
  isShow?: boolean
  type?: string
  title?: string
  content?: string
}

const initialState: MessageModalState = {
  isShow: false,
  type: undefined,
  title: undefined,
  content: undefined
}

export default createSlice({
  name: 'messageModal',
  initialState,
  reducers: {
    set: (state, action) => {
      state = { ...state, ...action.payload }
    }
  }
})
