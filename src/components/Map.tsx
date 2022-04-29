import {Typography, Grid, ButtonBase} from '@mui/material'

import React from 'react'
import Moment from 'react-moment'
import moment from 'moment'
import { useSelector } from 'react-redux'

import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// React-Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

import { Clip } from '../types/clip'
import store, {RootStoreState} from '../store/store'
import playerSlice from '../store/reducers/playerSlice'
import querySlice from '../store/reducers/querySlice'

// API for custom leaflet marker icons
// TODO: Move this to a configuration file
const markerIconKey="174e2d2d14504774b69b703f54fb8948"

/**
 * Leaflet map view of clips matching query
**/
const Map = () => {
  const clips = useSelector((state: RootStoreState): Clip[] => state.clip)
  const query = useSelector((state: RootStoreState) => state.query)

    const handleClick = (clip : Clip) => {
      store.dispatch(playerSlice.actions.setOpen(true))
      store.dispatch(playerSlice.actions.setVideo(clip))
    }

    return(
        <MapContainer center={{lat: 38.8462, lng: -77.3064} } zoom={10} bounds={[[query.maxLat, query.minLon], [query.minLat, query.maxLon]]}>
            <MapListener />
            <TileLayer
                url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=DVYLgzqJ74ahoMAWabdTOE0yAd7MWb9v1RVetwMDsYd2Y4Ch8WuBpAu1NHFHxCL6"
            />
            {
            clips.filter(clip => {
              return (moment(clip.timestamp).unix() >= query.minDate &&
               moment(clip.timestamp).unix() <= query.maxDate &&
               clip.latitude >= query.minLat &&
               clip.latitude <= query.maxLat &&
               clip.longitude >= query.minLon &&
               clip.longitude <= query.maxLon
              )
            }).map(({ timestamp, city, basedir, reason, videos, camera, latitude, longitude }, index) => {
              let currClip : Clip = {
                timestamp: timestamp,
                city: city,
                latitude: latitude,
                longitude: longitude,
                reason: reason,
                camera: camera,
                basedir: basedir,
                videos: videos
              }
              return(
                <Marker position={[latitude, longitude]} icon={getMarkerIcon(reason)} key={index}>
                  <Popup minWidth={300}>
                      <Grid container>
                          <Grid item xs={12} style={{textAlign: "center"}}>
                          <ButtonBase sx={{ padding: 0, margin: "auto"}} style={{width: "100%", paddingBottom: "20px"}} onClick={() => handleClick(currClip)}>
                              <img style={{ width: '60%' }} alt="thumbnail" src={"http://localhost:8000/teslacam/" + basedir + "/thumb.png"} />
                          </ButtonBase>
                          </Grid>
                          <Grid item xs={12} sm container>
                          <Grid item xs container direction="column" spacing={2}>
                              <Grid item xs>
                              <Typography gutterBottom variant="subtitle1" component="div" color="common.white">
                                  <Moment format="MMM DD, YYYY">{timestamp}</Moment>
                              </Typography>
                              <Typography variant="body2" color="common.white">
                                  { reason }
                              </Typography>
                              <Typography variant="body2" color="common.white">
                                  { city }
                              </Typography>
                              </Grid>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1" component="div" color="common.white">
                                  <Moment format="h:mm a">{timestamp}</Moment>
                              </Typography>
                          </Grid>
                          </Grid>
                      </Grid>
                  </Popup>
                </Marker>
              )
              }
            )}
        </MapContainer>

    )
}

const getMarkerIcon = (reason: string) => {
  // TODO: Simplify this
  switch(reason){
    case "sentry_aware_object_detection":
      return L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%23137CBD&size=x-large&icon=male&noWhiteCircle=true&scaleFactor=2&apiKey=${markerIconKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      })
    case "user_interaction_honk":
      return L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%23A66321&size=x-large&icon=volume-up&noWhiteCircle=true&scaleFactor=2&apiKey=${markerIconKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      })
    case "user_interaction_dashcam_icon_tapped":
    case "user_interaction_dashcam_panel_save":
      return L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%23A66321&size=x-large&icon=video&noWhiteCircle=true&scaleFactor=2&apiKey=${markerIconKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      })
    default:
      return L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?type=awesome&color=%23A66321&size=x-large&icon=circle&noWhiteCircle=true&scaleFactor=2&apiKey=${markerIconKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      })
  }
}

const MapListener = () => {
  const map = useMapEvent('moveend', () => {
    store.dispatch(querySlice.actions.queryByGeo(
      {
        minLat: map.getBounds().getSouth(),
        minLon: map.getBounds().getWest(),
        maxLat: map.getBounds().getNorth(),
        maxLon: map.getBounds().getEast()
      }
    ))
  })

  return null
}

export default Map
