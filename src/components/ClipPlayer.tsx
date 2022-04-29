import React from 'react'
import ReactPlayer from 'react-player'
import { Modal, Box } from '@mui/material'
import moment from 'moment'

import store, {RootStoreState} from '../store/store'
import playerSlice from '../store/reducers/playerSlice'
import {Clip} from '../types/clip'
import { useSelector } from 'react-redux'

/**
 * Modal with a video player to display selected clips
**/

const getSegmentFromClips = (clip : Clip): string => {
  let eventTime = moment(clip.timestamp)
  let currentVideo = ""

  for(let i=0; i<clip.videos.length; i++){
    let videoTime = moment(clip.videos[i].split("-").slice(0, -1).join("-"), "YYYY-MM-DD_HH-mm-ss");
    if(videoTime.unix() <= eventTime.unix()){
      if(clip.camera == 0 || clip.camera == 1 || clip.camera == 2){
        if(clip.videos[i].includes("front")){
          currentVideo = clip.videos[i]
        }
      }
      else if(clip.camera == 4 || clip.camera == 6){
        if(clip.videos[i].includes("right")){
          currentVideo = clip.videos[i]
        }
      }
      else if(clip.camera == 5 || clip.camera == 3){
        if(clip.videos[i].includes("left")){
          currentVideo = clip.videos[i]
        }
      }
      else{
        if(clip.videos[i].includes("rear")){
          currentVideo = clip.videos[i]
        }
      }
    }
  }
  
  // TODO: Remove hard-coded backend URL
  return "http://localhost:8000/teslacam/" + clip.basedir + "/" + currentVideo
}

const ClipPlayer = () => {
  const player = useSelector((state: RootStoreState) => state.player)
  const handleClose = () => store.dispatch(playerSlice.actions.setOpen(false))

  return (
    <Modal
    open={player.open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
      <Box m="auto">
        <ReactPlayer url={getSegmentFromClips(player.video)} controls={true} playing={true} style={{
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)"
        }}/>
      </Box>
    </Modal>
  )
}

export default ClipPlayer
