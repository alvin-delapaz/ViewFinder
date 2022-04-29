import React from 'react'
import Moment from 'react-moment'
import moment from 'moment'
import { Box, Paper, Chip } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Typography, Grid, List, ListItem, ButtonBase } from '@mui/material'
import { useSelector } from 'react-redux'

import { Clip } from '../types/clip'
import store, {RootStoreState} from '../store/store'
import playerSlice from '../store/reducers/playerSlice'

/**
 * Sidebar list of videos matching query.
 * Clicking entries will update the active video for playback in ClipPlayer
**/

const ClipBrowser = () => {
  const clips = useSelector((state: RootStoreState): Clip[] => state.clip)
  const query = useSelector((state: RootStoreState) => state.query)

  const handleClick = (clip : Clip) => {
    store.dispatch(playerSlice.actions.setVideo(clip))
    store.dispatch(playerSlice.actions.setOpen(true))
  }

  return (
    <Paper variant = "outlined">
      <Box sx={{ pb: 7 }} style={{overflowY: "scroll", height: '95vh'}}>
        <CssBaseline />
        <List>
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
                <ListItem button key={index} onClick={() => handleClick(currClip)}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <ButtonBase sx={{ padding: 0}}>
                          <img style={{ maxWidth: '100px' }} alt="thumbnail" src={"http://localhost:8000/teslacam/" + basedir + "/thumb.png"} />
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography gutterBottom variant="subtitle1">
                            <Moment format="MMM DD, YYYY">{timestamp}</Moment>
                          </Typography>
                          <Typography variant="subtitle2">
                            { city }
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1">
                            <Moment format="h:mm a">{timestamp}</Moment>
                        </Typography>
                        <Box sx={{textAlign: 'right'}}>
                          { getReasonChip(reason) }
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            }
          )}
        </List>
      </Box>
    </Paper>
  )
}

const getReasonChip = (reason: string) => {
  switch(reason){
    case "sentry_aware_object_detection":
      return(<Chip label="Sentry" size="small" style={{backgroundColor:"#137CBD"}}/>)
    case "user_interaction_honk":
      return(<Chip label="Horn" size="small" style={{backgroundColor:"#A66321"}}/>)
    case "user_interaction_dashcam_icon_tapped":
    case "user_interaction_dashcam_panel_save":
      return(<Chip label="Saved" size="small" style={{backgroundColor:"#A66321"}}/>)
    default: {
      if (reason.includes('sentry')){
        return(<Chip label="Sentry" size="small" style={{backgroundColor:"#137CBD"}}/>)
      }
      else{
        return(<Chip label={reason} size="small"/>)
      }
    }
  }
}


export default ClipBrowser
