import React from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { Paper } from '@mui/material'

import { Clip } from '../types/clip'
import store, {RootStoreState} from '../store/store'
import Plot from 'react-plotly.js'
import moment from 'moment'
import querySlice from '../store/reducers/querySlice'


/**
 * Daily Bucketed histogram of clips matching current query
 * Narrowing time range updates query date filter
**/

function ClipHistogram(){
  const [sentryClips, setSentryClips] = React.useState<string[]>([] as string[]) 
  const [dashcamClips, setDashcamClips] = React.useState<string[]>([] as string[])
  let [revision, setRevision] = React.useState(0)

  const clips = useSelector((state: RootStoreState): Clip[] => state.clip)
  const query = useSelector((state: RootStoreState) => state.query)

  React.useEffect(() => {
    let newSentry: string[] = []
    let newDashcam: string[] = []

    clips.filter(clip => {
      return (moment(clip.timestamp).unix() >= query.minDate &&
       moment(clip.timestamp).unix() <= query.maxDate &&
       clip.latitude >= query.minLat &&
       clip.latitude <= query.maxLat &&
       clip.longitude >= query.minLon &&
       clip.longitude <= query.maxLon
      )
    }).forEach(clip => {
      if(clip.reason.includes("sentry")){
        newSentry.push(moment(clip.timestamp).set({hour:0,minute:0,second:0,millisecond:0}).format())
      }
      else{
        newDashcam.push(moment(clip.timestamp).set({hour:0,minute:0,second:0,millisecond:0}).format())
      }
    })

    setSentryClips([...newSentry])
    setDashcamClips([...newDashcam])
    setRevision(revision + 1)
  }, [clips, query])

  const handleRelayout = (figure: Plotly.PlotRelayoutEvent) => {
    if(figure.autosize){
      return
    }
    if(figure.hasOwnProperty('xaxis.autorange')){
        store.dispatch(querySlice.actions.queryByDate({
          minDate: moment(0).unix(),
          maxDate: moment().unix()
        }))
    }
    else{
      store.dispatch(querySlice.actions.queryByDate({
        minDate: moment(figure['xaxis.range[0]']).unix(),
        maxDate: moment(figure['xaxis.range[1]']).unix()
      }))
    }
  }

  const getHistogram = () => {
    return (
      <Plot
        onRelayout={(figure) => handleRelayout(figure)}
        revision={revision}
        data={[
          {
            histfunc: "count",
            x: sentryClips,
            type: "histogram",
            name: "Sentry",
            xbins: {
              end: Date.now(),
              size: 60000 * 60 * 24,
              start: '2017-01-01 00:00'
            },
            marker: {
              color: 'rgb(17, 124, 189)',
              line: {
                color: 'rgb(30, 30, 30)',
                width: 1
              }
            }
          },
          {
            histfunc: "count",
            x: dashcamClips,
            type: "histogram",
            name: "Saved",
            xbins: {
              end: Date.now(),
              size: 60000 * 60 * 24,
              start: '2017-01-01 00:00'
            },
            marker: {
              color: 'rgb(166, 99, 33)',
              line: {
                color: 'rgb(30, 30, 30)',
                width: 1
              }
            }
          },
        ]}
        layout={{
          showlegend: false,
          xaxis: {
            range: [moment(query.minDate), moment(query.maxDate)],
            type: 'date'
          },
          yaxis: {
            fixedrange: true
          },
          barmode: 'stack',
          autosize: true,
          margin:{l: 0, r: 0, b: 20, t:0},
          paper_bgcolor: '#272727',
          plot_bgcolor: '#090909',
          font: {color:"#ffffff"},
          datarevision: revision
        }}
        useResizeHandler={true}
        config={{
          displayModeBar: false
        }}

        style={{width: "100%", height: "100%"}}
      />
    )
  }

  return(
      <Paper style={{height: '15vh', padding: 0, overflow: 'hidden'}}>
        {React.useMemo(getHistogram, [revision])}
      </Paper>
  )
}

export default ClipHistogram
