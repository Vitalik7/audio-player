import React, { memo, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as Progress from 'react-native-progress'
import updateHelper from 'immutability-helper'
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  View,
  Dimensions,
} from 'react-native'
import GoogleCast, { CastButton } from 'react-native-google-cast'
import { useTrackPlayerProgress } from 'react-native-track-player'
import { AirPlayButton } from 'react-native-airplay-btn'

import {
  ViewOptions,
  ViewOptionsRight,
  ViewOptionsEmpty,
} from './PlayerElements'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const images = {
  dots: require('../../../assets/images/options_dot.png'),
  icon_dwn: require('../../../assets/images/icon_dwn.png'),
  trash: require('../../../assets/images/trash.png'),
  cancel: require('../../../assets/images/cancel.png'),
}

const FooterButtons = memo(
  (props: { track: TrackTypes; funcCollapcePlayer: () => void }) => {
    const user = useSelector(
      (state: {
        user: {
          data: {
            favourites: number
            apiKey: string
            notes: number
          }
        }
      }) => state.user && state.user.data
    )
    const downloads = useSelector(
      (state: { data: { downloads: any[] } }) =>
        state && state.data && state.data.downloads
    )
    const isConnected = useSelector(
      (state: { network: { isConnected: boolean } }) =>
        state && state.network && state.network.isConnected
    )

    const { track } = props
    const trackProgress = useTrackPlayerProgress()

    const [showSpinner, setShowSpinner] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const [isCastAvailable, setCastAvailable] = useState(true)
    const [progress, setProgress] = useState(0)
    const [isLoading, setStatus] = useState(false)

    const checkDefaultOptions = () => {
      let arr = [
        { name: 'note', title: 'Take Note', func: () => takeNote() },
        {
          name: 'chromecast',
          title: 'Chromecast',
          func: () => chromecastConnect(),
        },
      ]
      if (track && track.text_version) {
        arr.unshift({
          name: 'textversion',
          title: 'Text Version',
          func: () => textVersion(),
        })
      }
      return arr
    }

    const defaultOptions = checkDefaultOptions()

    const spinnerStyles = {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      position: 'absolute',
      top: -SCREEN_HEIGHT + 72,
      left: -23,
      zIndex: 999,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }

    useEffect(() => {
      GoogleCast.getCastState()
        .then(state => {
          console.log(state)
        })
        .catch(reason => {
          setCastAvailable(false)
        })
      GoogleCast.EventEmitter.addListener(
        GoogleCast.SESSION_STARTED,
        googleCastStart
      )
      GoogleCast.EventEmitter.addListener(
        GoogleCast.SESSION_ENDED,
        googleCastEnd
      )

      return () => {
        GoogleCast.EventEmitter.removeListener(
          GoogleCast.SESSION_STARTED,
          googleCastStart
        )
        GoogleCast.EventEmitter.removeListener(
          GoogleCast.SESSION_ENDED,
          googleCastEnd
        )
      }
    }, [])

    const googleCastStart = () => {
      GoogleCast.castMedia({
        mediaUrl: track.url,
        imageUrl: track.artwork,
        title: track.title,
        contentType: 'audio/mp3',
        playPosition: trackProgress.position,
      })
    }
    const googleCastEnd = error => {
      console.log(error)
      GoogleCast.stop()
    }

    const checkOptions = (options: any[]) => {
      if (isConnected) {
        return options
      } else {
        return textVersionOption()
      }
    }

    const downloadFile = async (fileUrl: string, fileName: string) => {
      await downloadFilesRNFS(
        fileUrl,
        fileName,
        setProgress,
        countPercentage,
        setStatus
      )
    }

    const saveToStorage = async () => {
      if (isConnected) {
        await downloadFileToStorage(
          track,
          downloads,
          downloadFile,
          () => setStatus(true),
          isLoading,
          true
        )
      } else {
        noInternetMessage()
      }
    }

    const removeItem = () => {
      console.log('downloads', downloads)
      console.log('track', track)
      removeFromStorage(downloads, track.id, track.url)
    }

    const takeNote = async () => {
      NavigationService.navigate('Notes', { id: track && track.id })
      props.funcCollapcePlayer()
    }

    const updateCounts = (notesLength: number, prop: string) => {
      let userData = updateHelper(user, {
        [prop]: { $set: notesLength },
      })
      changeUserData('data', userData)
    }

    const localOptions = defaultOptions

    const textVersionOption = () => {
      if (track && track.text_version) {
        return [
          {
            name: 'textversion',
            title: 'Text Version',
            func: () => textVersion(),
          },
        ]
      } else return []
    }

    let options = () => {
      let arr = defaultOptions
      if (track && track.serie) {
        arr.push({
          name: 'serie',
          title: 'Go to Series',
          func: () => {
            goToSerie(track.serie, track.title)
            props.funcCollapcePlayer()
          },
        })
      }
      arr.unshift({
        name: 'favourite',
        title: 'Favourite',
        func: () => addFavourite(),
      })
      arr.unshift({ name: 'share', title: 'Share', func: () => share() })

      return arr
    }

    const optionsNotLogin = () => {
      let arr = [
        {
          name: 'chromecast',
          title: 'Chromecast',
          func: () => chromecastConnect(),
        },
      ]
      if (track && track.text_version) {
        arr.splice(1, 0, {
          name: 'textversion',
          title: 'Text Version',
          func: () => textVersion(),
        })
      }
      return arr
    }

    const textVersion = async () => {
      if (track && track.text_version) {
        setShowSpinner(true)
        await openDocument(track.text_version, track.title, track.isLocal)
        setShowSpinner(false)
        props.funcCollapcePlayer()
      }
    }

    const chromecastConnect = () => {
      if (isCastAvailable) {
        GoogleCast.showCastPicker()
      } else {
        Alert.alert('Google Cast is not available')
      }
      props.funcCollapcePlayer()
    }

    const airplayButton =
      Platform.OS == 'ios' && isConnected ? (
        <ViewOptionsRight style={{ backgroundColor: '#dce0f2' }}>
          <AirPlayButton />
        </ViewOptionsRight>
      ) : (
        <View />
      )

    let checkIsDownloaded =
      track &&
      track.id &&
      downloads &&
      downloads.find(item => item.id === track.id)

    return (
      <>
        {(user && user.apiKey) || (!track.isLocal && checkIsDownloaded) ? (
          isLoading ? (
            <ViewOptions>
              <Progress.Circle size={33} progress={progress} />
            </ViewOptions>
          ) : (
            <ViewOptions
              onPress={() =>
                checkIsDownloaded ? removeItem() : saveToStorage()
              }>
              <Image
                source={checkIsDownloaded ? images.trash : images.icon_dwn}
                resizeMode="contain"
              />
            </ViewOptions>
          )
        ) : (
          <ViewOptionsEmpty />
        )}
        {/* Added this invisible button, required by library to open Google Cast menu programmatially */}
        <CastButton
          style={{
            width: 0,
            height: 0,
            opacity: 0,
            position: 'absolute',
          }}
        />
        {airplayButton}
        <ViewOptionsRight onPress={() => checkOpen()}>
          <Image source={images.dots} resizeMode="contain" />
        </ViewOptionsRight>
        {showSpinner && (
          <ActivityIndicator
            size={'large'}
            animating
            color={'#000'}
            hidesWhenStopped
            style={spinnerStyles}
          />
        )}
      </>
    )
  }
)

export default FooterButtons
