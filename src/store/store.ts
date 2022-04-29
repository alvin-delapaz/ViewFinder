import clipSlice from './reducers/clipSlice'
import playerSlice from './reducers/playerSlice'
import querySlice from './reducers/querySlice'

import { configureStore, combineReducers } from '@reduxjs/toolkit'

const reducer = combineReducers({
  clip: clipSlice.reducer,
  player: playerSlice.reducer,
  query: querySlice.reducer
})

const store = configureStore({ reducer: reducer })
export type RootStoreState = ReturnType<typeof store.getState>

export default store