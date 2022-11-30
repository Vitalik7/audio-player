import React from 'react'
// @ts-ignore
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerProgress,
} from 'react-native-track-player'

import { ButtonPlay, Icon, Reverse, Button, SmallText } from './PlayerElements'

const images = {
  play_button: require('../../../assets/images/play-button.png'),
  pause_button: require('../../../assets/images/pause.png'),
  reverse: require('../../../assets/images/reverse.png'),
  reverse_left: require('../../../assets/images/reverse_left.png'),
}

const ControlButton = (props: {
  type: string
  onPress: () => void
  small: boolean
}) => {
  const playbackState = usePlaybackState()
  const progress = useTrackPlayerProgress()

  let middleButtonText = 'Play'
  if (
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING
  ) {
    middleButtonText = 'Pause'
  }

  async function togglePlayback() {
    const currentTrack = await TrackPlayer.getCurrentTrack()
    if (!currentTrack) return
    if (playbackState === 'ready') {
      await TrackPlayer.play()
    } else if (playbackState === TrackPlayer.STATE_PAUSED) {
      await TrackPlayer.play()
    } else {
      await TrackPlayer.pause()
    }
  }

  const seekTo = async (type: string, num: number) => {
    if (playbackState === 'paused') {
      await TrackPlayer.play()
    }
    if (type === '-') {
      await TrackPlayer.seekTo(progress.position - num)
    } else {
      if (progress.position + num >= progress.duration) {
        await TrackPlayer.seekTo(progress.duration - 1)
      } else {
        await TrackPlayer.seekTo(progress.position + num)
      }
    }
  }

  if (props.type === 'center') {
    return (
      <ButtonPlay onPress={togglePlayback} isSmall={props.small}>
        <Icon
          isSmall={props.small}
          source={
            middleButtonText === 'Play'
              ? images.play_button
              : images.pause_button
          }
          resizeMode="contain"
        />
      </ButtonPlay>
    )
  } else if (props.type === 'left' || props.type === 'right') {
    return (
      <Button
        onPress={() =>
          props.type === 'left' ? seekTo('-', 15) : seekTo('+', 15)
        }>
        <Reverse
          source={props.type === 'left' ? images.reverse_left : images.reverse}>
        </Reverse>
      </Button>
    )
  } else {
    return null
  }
}

export default ControlButton
