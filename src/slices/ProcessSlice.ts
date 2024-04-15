import { createSlice } from '@reduxjs/toolkit'

export interface ProcessState {
  isLoading?: boolean
}

const initialState: ProcessState = {
  isLoading: false
}

export default createSlice({
  name: 'process',
  initialState,
  reducers: {
    set (state, action) {
      state.isLoading = action.payload.isLoading
    }
  }
})
