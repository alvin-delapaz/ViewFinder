import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { QueryState, DateQuery, GeoQuery } from '../../types/query'

import moment from 'moment'

const initialState = {
  minDate: moment(0).unix(),
  maxDate: moment().unix(),
  minLat: -90.0,
  maxLat: 90.0,
  minLon: -180.0,
  maxLon: 180.0
} as QueryState

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    queryByDate(state, action: PayloadAction<DateQuery>) {
    state.minDate = action.payload.minDate
    state.maxDate = action.payload.maxDate
    },
    queryByGeo(state, action: PayloadAction<GeoQuery>) {
    state.minLat = action.payload.minLat
    state.maxLat = action.payload.maxLat
    state.minLon = action.payload.minLon
    state.maxLon = action.payload.maxLon
    },
  },
})

export default querySlice