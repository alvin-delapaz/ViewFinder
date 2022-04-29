import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Clip } from '../../types/clip'

const initialState : Clip[] = []

const clipSlice = createSlice({
  name: 'clips',
  initialState,
  reducers: {
    setClips(state, action: PayloadAction<Clip[]>) {
      state = action.payload
      return state
    },
  },
})

export default clipSlice