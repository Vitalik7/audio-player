import React, { useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'

import {
  Title,
  SubTitle,
  CancelBtn,
  FoterView,
  ControlButtonsView,
  TitlesView,
  ImageView,
} from './PlayerElements'
import ProgressBar from './PlayerProgressBar'
import ControlButton from './PlayerControlButtons'
import FooterButtons from './FooterButtons'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const isIphoneX = SCREEN_HEIGHT >= 812
const maxPlayerHeight =
  Platform.OS === 'ios'
    ? isIphoneX
      ? SCREEN_HEIGHT - 80
      : SCREEN_HEIGHT - 40
    : SCREEN_HEIGHT - 70
const yPositionPlayer = isIphoneX ? SCREEN_HEIGHT - 150 : SCREEN_HEIGHT - 120

const images = {
  down: require('../../../assets/images/arrow_down.png'),
  cancel: require('../../../assets/images/cancel.png'),
  default: require('../../../assets/images/default.png'),
  dots: require('../../../assets/images/options_dot.png'),
}

interface Props {
  track: TrackTypes
  closePlayer: () => void
}

const funcAnimation = (
  animation: any,
  inputRange: any[],
  outputRange: any[]
) => {
  return animation.y.interpolate({
    inputRange: inputRange,
    outputRange: outputRange,
    extrapolate: 'clamp',
  })
}

const AppleMusicUI: React.FC<Props> = ({ track, closePlayer }) => {
  const [isScrollEnabled, setState] = useState(false)
  const [animation] = useState(
    new Animated.ValueXY({
      x: 0,
      y: yPositionPlayer,
    })
  )

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return isScrollEnabled
    },
    onPanResponderGrant: (evt, gestureState) => {
      if (isScrollEnabled) {
        animation.extractOffset()
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (isScrollEnabled) {
        if (gestureState.dy < 0) return
        animation.setValue({ x: 0, y: gestureState.dy })
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        setState(false)
        Animated.spring(animation.y, {
          toValue: yPositionPlayer,
          tension: 1,
        }).start()
      }
    },
  })

  const animateUp = () => {
    Animated.spring(animation.y, {
      toValue: 0,
      tension: 1,
    }).start()
    setState(true)
  }

  const animateDown = () => {
    Animated.spring(animation.y, {
      toValue: yPositionPlayer,
      tension: 1,
    }).start()
    setState(false)
  }

  const checkHeight = () => {
    if (isIphoneX) {
      return SCREEN_HEIGHT - 150
    } else {
      return SCREEN_HEIGHT - 120
    }
  }

  const onCancelBtnPress = () => {
    if (!isScrollEnabled) {
      closePlayer()
    }
  }

  const animatedHeight = {
    transform: animation.getTranslateTransform(),
  }

  let animatedImageHeight = funcAnimation(
    animation,
    [0, checkHeight()],
    [maxPlayerHeight / 2.5, 50]
  )
  let animatedImageWidth = funcAnimation(
    animation,
    [0, checkHeight()],
    [SCREEN_WIDTH / 1.3, 50]
  )
  let animatedSongTitleOpacity = funcAnimation(
    animation,
    [0, maxPlayerHeight - 500, checkHeight()],
    [0, 0, 1]
  )
  let animatedImageMarginLeft = funcAnimation(
    animation,
    [0, checkHeight()],
    [SCREEN_WIDTH / 5 / 2, 10]
  )
  let animatedHeaderHeight = funcAnimation(
    animation,
    [0, checkHeight()],
    [maxPlayerHeight * 0.7, 50]
  )
  let animatedFooterHeight = funcAnimation(
    animation,
    [0, checkHeight()],
    [maxPlayerHeight * 0.3, 0]
  )
  let animatedSongDetailsOpacity = funcAnimation(
    animation,
    [0, maxPlayerHeight - 500, checkHeight()],
    [1, 0, 0]
  )
  let animatedBackgroundColor = funcAnimation(
    animation,
    [0, checkHeight()],
    ['transparent', 'rgba(72, 72, 72, 0.3)']
  )
  let animatedDisplayHeight = funcAnimation(
    animation,
    [0, checkHeight()],
    [40, 0]
  )
  let animatedBackgPlayer = funcAnimation(
    animation,
    [0, checkHeight()],
    ['rgba(255, 255, 255, 1)', 'rgba(54, 62, 93, 0.97)']
  )

  let imageUrl = checkLinkIsLocal(track && track.artwork)

  return (
    <Animated.View
      style={
        Platform.OS === 'ios'
          ? [styles.styleIos, { backgroundColor: animatedBackgroundColor }]
          : [styles.styleAndroid, { bottom: !isScrollEnabled ? 60 : 20 }]
      }>
      <Animated.View
        style={[
          animatedHeight,
          styles.container,
          Platform.OS === 'ios' && {
            position: 'absolute',
            marginTop: isScrollEnabled ? (isIphoneX ? 40 : 20) : 0,
          },
          {
            backgroundColor: animatedBackgPlayer,
            maxHeight: maxPlayerHeight,
          },
        ]}>
        <Animated.View
          style={{
            height: animatedDisplayHeight,
            opacity: animatedSongDetailsOpacity,
          }}>
          <TouchableOpacity style={styles.arrowDown} onPress={animateDown}>
            <Image style={{ alignSelf: 'center' }} source={images.down} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.header, { height: animatedHeaderHeight }]}>
          <TouchableOpacity
            disabled={isScrollEnabled}
            style={styles.btnUp}
            onPress={() => animateUp()}>
            <ImageView>
              <Animated.View
                style={{
                  height: animatedImageHeight,
                  width: animatedImageWidth,
                  marginLeft: animatedImageMarginLeft,
                }}>
                <Image
                  style={{ flex: 1, borderRadius: 9, width: 'auto' }}
                  source={imageUrl ? { uri: imageUrl } : images.default}
                />
              </Animated.View>
              <Animated.Text
                numberOfLines={1}
                style={[styles.title, { opacity: animatedSongTitleOpacity }]}>
                {track && track.title}
              </Animated.Text>
            </ImageView>
            <Animated.View
              style={[styles.songTitle, { opacity: animatedSongTitleOpacity }]}>
              <ControlButton type="center" onPress={() => {}} small />
              <CancelBtn onPress={onCancelBtnPress}>
                <Image source={images.cancel} />
              </CancelBtn>
            </Animated.View>
          </TouchableOpacity>
          <Animated.View style={{ opacity: animatedSongTitleOpacity }}>
            <ProgressBar onlyLine />
          </Animated.View>
          <Animated.View style={{ opacity: animatedSongDetailsOpacity }}>
            <TitlesView>
              <Title numberOfLines={2}>{track && track.title}</Title>
              <SubTitle>{track && track.artist}</SubTitle>
            </TitlesView>
          </Animated.View>
          <Animated.View
            style={[
              styles.progresView,
              {
                height: animatedDisplayHeight,
                opacity: animatedSongDetailsOpacity,
              },
            ]}>
            <ProgressBar onlyLine={false} />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            {
              height: animatedFooterHeight,
              opacity: animatedSongDetailsOpacity,
            },
            styles.footer,
            isScrollEnabled && { paddingBottom: 50 },
          ]}>
          <ControlButtonsView
            pointerEvents={!isScrollEnabled ? 'none' : 'auto'}>
            <ControlButton type="left" onPress={() => {}} small={false} />
            <ControlButton type="center" onPress={() => {}} small={false} />
            <ControlButton type="right" onPress={() => {}} small={false} />
          </ControlButtonsView>
          <FoterView>
            <FooterButtons track={track} funcCollapcePlayer={animateDown} />
          </FoterView>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

export default AppleMusicUI

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(56, 103, 214, 0.3)',
  },
  styleAndroid: {
    position: 'absolute',
    width: SCREEN_WIDTH - 16,
    left: 8,
    height: maxPlayerHeight,
  },
  styleIos: {
    flex: 1,
    height: 'auto',
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 9999999,
  },
  footer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  arrowDown: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  btnUp: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 4,
  },
  title: {
    paddingLeft: 10,
    fontSize: 18,
    color: '#fff',
    width: '70%',
  },
  songTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progresView: {
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 0,
  },
})
