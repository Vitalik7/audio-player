import React, { useState, memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Platform } from 'react-native'
import updateHelper from 'immutability-helper'

import TrackPlayer, {
  useTrackPlayerEvents,
  TrackPlayerEvents,
  usePlaybackState,
} from 'react-native-track-player'

import { SafeArea } from './PlayerElements'
import AppleMusicUI from './AnimatedPlayer'

const Player: React.FC = memo(() => {
  const track = useSelector(
    (state: { user: { currentTrack: object } }) =>
      state && state.user && state.user.currentTrack
  )

  const playbackState = usePlaybackState()
  const isPlaying =
    playbackState === TrackPlayer.STATE_PLAYING ||
    playbackState === TrackPlayer.STATE_BUFFERING

  const [firstLoad, setLoad] = useState(true)
  const [isEndQuaue, setEnd] = useState(false)

  useEffect(() => {
    let interval: number
    if (isPlaying) {
      interval = setInterval(() => {
        setPos()
      }, 5000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [isPlaying])

  useEffect(() => {
    let trackQueueEnded = TrackPlayer.addEventListener(
      'playback-queue-ended',
      _handleTrack
    )
    return () => {
      trackQueueEnded.remove()
    }
  }, [])

  useEffect(() => {
    setUpPlayer()
  }, [])

  useEffect(() => {
    changeTrack()
    addToPopularCount(track && track.id)
  }, [track && track.id])

  const events = [
    TrackPlayerEvents.PLAYBACK_STATE,
    TrackPlayerEvents.PLAYBACK_ERROR,
  ]

  useTrackPlayerEvents(events, event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occured while playing the current track.')
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      if (event.state === 'paused') {
        setPos()
      }
    }
  })

  const setPos = async () => {
    if (track && track.position) {
      const pos = await TrackPlayer.getPosition()
      let trackData = updateHelper(track, {
        position: { $set: pos },
      })
      changeUserData('currentTrack', trackData)
    }
  }

  const goToPos = async () => {
    if (track && track.position) {
      await TrackPlayer.play()
      await TrackPlayer.seekTo(track.position)
      await TrackPlayer.pause()
      await TrackPlayer.setVolume(1)
      setLoad(false)
    }
  }

  const _handleTrack = async (state: { track: string }) => {
    if (track && track.id === state.track) {
      setEnd(true)
      await TrackPlayer.seekTo(0)
      await TrackPlayer.pause()
      return
    }
    const nextTrack = await TrackPlayer.getTrack(state.track)
    // local Url
    changeUserData('currentTrack', nextTrack)
  }

  const changeTrack = async () => {
    const currentTrackId = await TrackPlayer.getCurrentTrack()
    if (currentTrackId !== null && track.id !== currentTrackId) {
      await TrackPlayer.stop()
      await setUpPlayer()
    }
  }

  const setUpPlayer = async () => {
    if (!track) return
    if (!track.id || isEndQuaue) return

    let localUrl = checkLinkIsLocal(track.url)
    await TrackPlayer.add({
      id: track.id,
      url: localUrl,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      position: track.position,
    })
    if (firstLoad && track && track.position && track.position > 1) {
      await TrackPlayer.play()
      await TrackPlayer.setVolume(0)
      setTimeout(() => {
        goToPos()
      }, 2000)
    } else {
      await TrackPlayer.play()
    }
  }

  const closePlayer = () => {
    TrackPlayer.reset()
    changeUserData('isShowPlayer', false)
    changeUserData('currentTrack', {})
  }

  if (Platform.OS === 'android') {
    return <AppleMusicUI track={track} closePlayer={closePlayer} />
  } else {
    return (
      <SafeArea>
        <AppleMusicUI track={track} closePlayer={closePlayer} />
      </SafeArea>
    )
  }
})

export default Player
