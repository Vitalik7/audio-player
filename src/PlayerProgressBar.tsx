import React from 'react'
import { Dimensions, Platform } from 'react-native'
import { has } from 'lodash'
import { useSelector } from 'react-redux'
import { oc } from 'ts-optchain'
// @ts-ignore
import { useTrackPlayerProgress } from 'react-native-track-player'

import {
  Progress,
  PlayerText,
  RowProgress,
  ViewNum,
  ProgresLine,
  ProgressWidth,
} from './PlayerElements'
import { durationToSeconds } from '../utils'

const SCREEN_WIDTH = Dimensions.get('window').width

const ProgressBar = (props: { onlyLine: boolean }) => {
  const progress = useTrackPlayerProgress()
  const trackPosition = useSelector(
    (state: { user: { currentTrack: { position: number } } }) =>
      oc(state).user.currentTrack.position(progress.position)
  )

  let duration =
    progress.duration == 0 && Platform.OS != 'ios'
      ? progress.bufferedPosition * 1.46
      : progress.duration

  const currentPosition =
    progress.position > 1 ? progress.position : trackPosition

  let positionSec =
    currentPosition - duration > -0.9 ? 0 : currentPosition - duration

  const positionDurat = durationToSeconds(currentPosition, positionSec)
  return (
    <RowProgress>
      <Progress style={props.onlyLine && { width: SCREEN_WIDTH - 20 }}>
        <ProgressWidth flex={currentPosition} />
        <ProgresLine flex={duration - currentPosition} />
      </Progress>
      {!props.onlyLine && has(progress, 'position') && currentPosition > 0 && (
        <ViewNum>
          <PlayerText>{positionDurat.start}</PlayerText>
          <PlayerText>{positionDurat.end}</PlayerText>
        </ViewNum>
      )}
    </RowProgress>
  )
}

export default ProgressBar
