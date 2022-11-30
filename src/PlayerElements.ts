import styled from 'styled-components/native'

export const SafeArea = styled.View`
  position: absolute;
  z-index: 9999;
  width: 100%;
  background-color: rgba(79, 79, 79, 0.6);
  justify-content: flex-end;
`

export const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 25px;
  margin-horizontal: 10px;
  padding: 15px;
  width: 95%;
  height: 94%;
  box-shadow: 1px 2px 7px rgba(75, 75, 99, 0.8);
  border-radius: 11px;
  background-color: rgba(255, 255, 255, 1);
`

export const ContainerNote = styled.View`
  width: 100%;
  padding: 20px;
`

export const Image = styled.Image`
  width: 80%;
  height: 50%;
  margin-horizontal: 25px;
  margin-top: 25px;
  box-shadow: 0px 2px 10px rgba(54, 62, 93, 0.14);
  border-radius: 9px;
`

export const Title = styled.Text`
  text-align: center;
  margin-top: 10px;
  color: #363e5d;
  font-family: Jost-Semi;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.25px;
  line-height: 26px;
`

export const SubTitle = styled.Text`
  text-align: center;
  color: #363e5d;
  font-family: Jost-Book;
  font-size: 18px;
  font-weight: 300;
  line-height: 21px;
`

export const Progress = styled.View`
  height: 2px;
  width: 90%;
  flex-direction: row;
`

export const ControlsView = styled.View`
  width: 90%;
  height: auto;
  margin-top: 40px;
  flex-direction: row;
  justify-content: space-between;
`

export const ButtonPlay = styled.TouchableOpacity`
  width: ${(props: { isSmall: boolean }) => (props.isSmall ? '40px' : '72px')};
  height: ${(props: { isSmall: boolean }) => (props.isSmall ? '40px' : '72px')};
  margin-right: ${(props: { isSmall: boolean }) =>
    props.isSmall ? '30px' : 0};
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  box-shadow: 0px 5px 10px rgba(54, 62, 93, 0.6);
  background-color: #ff913a;
`

export const Icon = styled.Image`
  width: ${(props: { isSmall: boolean }) => (props.isSmall ? '15px' : '25px')};
  height: ${(props: { isSmall: boolean }) => (props.isSmall ? '15px' : '25px')};
`

export const Reverse = styled.ImageBackground`
  width: 26px;
  height: 30px;
  align-items: center;
  justify-content: center;
`

export const Button = styled.TouchableOpacity`
  width: 30%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

export const SmallText = styled.Text`
  margin-top: 3px;
  align-self: center;
  color: #3c425b;
  font-family: Jost-Medium;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: -0.56px;
`

export const Foter = styled.View`
  width: 100%;
  height: auto;
  flex-direction: row;
  justify-content: space-between;
`

export const ViewOptions = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  box-shadow: 1px 2px 7px rgba(75, 75, 99, 0.1);
  border-radius: 99px;
`

export const ViewOptionsRight = styled(ViewOptions)``
export const ViewOptionsEmpty = styled(ViewOptions)`
  opacity: 0px;
`

export const AirPayView = styled.View`
  position: absolute;
  right: -10px;
  top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  box-shadow: 1px 2px 7px rgba(75, 75, 99, 0.1);
  background-color: #dce0f2;
  border-radius: 99px;
`

export const PlayerText = styled.Text`
  width: auto;
  opacity: 0.5;
  color: #565a69;
  font-family: Jost-Book;
  font-size: 13px;
  font-weight: 300;
`

export const RowProgress = styled.View`
  flex-direction: column;
  height: auto;
`

export const ViewNum = styled.View`
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
`

export const ProgresLine = styled.View`
  flex: ${(props: { flex: number }) => props && props.flex};
  background-color: #3867d6;
  opacity: 0.2;
`

export const ProgressWidth = styled.View`
  flex: ${(props: { flex: number }) => props && props.flex};
  background-color: #ff913a;
`

export const CancelBtn = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  margin-right: 20px;
  margin-left: 7px;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 2px 7px rgba(75, 75, 99, 0.1);
  background-color: #fff;
  border-radius: 99px;
`

export const CancelBtnModal = styled(CancelBtn)`
  margin-left: auto;
  box-shadow: 1px 2px 7px rgba(75, 75, 99, 0.7);
`

export const FoterView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 10px;
`

export const ControlButtonsView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ProgressBarView = styled.View`
  align-items: center;
  height: auto;
  margin-top: 10px;
`

export const TitlesView = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 25px;
`

export const ImageView = styled.View`
  flex: 4;
  flex-direction: row;
  align-items: center;
`

export const ModalView = styled.View`
  height: 100%;
  justify-content: center;
`

export const ModalContent = styled.View``
