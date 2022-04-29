import React, { Component, useState, useEffect, useContext } from 'react'
import { Grid, Paper, Box, Typography, Button, Drawer, Toolbar, Divider } from '@mui/material'
import axios from 'axios'
import moment from 'moment'

import store from '../store/store'
import clipSlice from '../store/reducers/clipSlice'

import {Clip} from '../types/clip'
import {QueryState} from '../types/query'
import Map from './Map'
import ClipPlayer from './ClipPlayer'
import ClipHistogram from './ClipHistogram'
import ClipBrowser from './ClipBrowser'

/**
 * Main component. Manages contexts and main layout of application
**/

const Explorer = () => {
  const drawerWidth = '415px'

  // Fetch clips from backend on page load
  // TODO: Do not hardcode API
  useEffect(() => {
    axios.get(`http://localhost:8000/clips`)
      .then(res => {
        store.dispatch(clipSlice.actions.setClips(JSON.parse(JSON.stringify(res.data))))
      })
  }, [])

  return (
    <>
      <ClipPlayer />
      <Box sx={{ display: 'flex'}}>
        <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                overflowY: 'hidden'
              },
            }}
            variant="permanent"
            anchor="left"
          >
          <Toolbar>
            <Typography variant="subtitle1" noWrap component="div">
              Viewfinder
            </Typography>
          </Toolbar>
          <Divider />
          <ClipBrowser />
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1 }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Map />
            </Grid>
            <Grid item xs={12}>
                <ClipHistogram />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default Explorer
