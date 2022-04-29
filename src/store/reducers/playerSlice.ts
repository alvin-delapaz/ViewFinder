import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayerState } from '../../types/player'
import { Clip } from '../../types/clip'

const initialState = {
  open: false,
  video: {
    timestamp: "",
    city: "",
    latitude: 0,
    longitude: 0,
    reason: "",
    camera: 0,
    basedir: "",
    videos: []
  } as Clip
} as PlayerState

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<boolean>) {
    state.open = action.payload
    },
    setVideo(state, action: PayloadAction<Clip>) {
    state.video = action.payload
    },
  },
})

export default playerSlice