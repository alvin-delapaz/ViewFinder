export interface QueryState{
  minDate: number,
  maxDate: number,
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number,
}

export interface DateQuery{
  minDate: number,
  maxDate: number,
}

export interface GeoQuery{
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number,
}

