import React, {useRef, useEffect} from 'react';
import {
  View,
  ImageBackground,
  Text,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import moment from 'moment';
import GradientButton from '../../components/GradientButton';
import {CrossIcon, PenIcon, RectAngleIcon} from '../../Svg';
import styles from './styles';
// import df from '../../../assets/'

const DaysChallengeModal = React.memo(props => {
  const {challange, onClose, mediaPath, onJoin} = props;
  // console.log('props comng===', props);
  const {description, endDate, startDate, title, programmeImage} = challange;
  const marginTopAnimated = useRef(new Animated.Value(0));
  const opacityAnimated = useRef(new Animated.Value(0));

  useEffect(() => {
    renderModal();
  }, []);

  const renderModal = () => {
    Animated.parallel([
      Animated.spring(marginTopAnimated.current, {
        toValue: 1,
        speed: 5,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnimated.current, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const marginTopInterpolateMotion = marginTopAnimated.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['200%', '20%'],
  });

  const opacityInterpolateMotion = opacityAnimated.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const marginInterpolateStyle = {
    marginTop: marginTopInterpolateMotion,
  };

  const opacityInterpolateStyle = {
    opacity: opacityInterpolateMotion,
  };

  const renderHeadingLabelView = (heading, value) => {
    return (
      <View
        style={[
          styles.itemsInRow,
          styles.itemSeperate,
          styles.headingLabelView,
        ]}>
        <Text style={styles.headingLabel}>{heading}</Text>
        <Text style={styles.valueLabel}>{value}</Text>
      </View>
    );
  };

  const renderJoinButton = () => {
    return (
      <View style={[styles.gradientButtonStyle]}>
        <GradientButton
          title="Join now"
          // style={styles.gradientButtonStyle}
          onPress={onJoin}
        />
      </View>
    );
  };

  return (
    <View style={styles.wholeView}>
      <Animated.View
        style={[styles.blackSheetOverlay, opacityInterpolateStyle]}
      />
      <View style={{flex: 1}}>
        <Animated.View style={[styles.modelContainer, marginInterpolateStyle]}>
        <View style={{alignItems: 'flex-end'}}>
        <TouchableOpacity onPress={onClose}>
              <CrossIcon />
        </TouchableOpacity>
          </View>
          <ImageBackground
            source={
              programmeImage
                ? {
                    uri: `${mediaPath}${programmeImage}`,
                  }
                : require('../../../assets/challange.png')
            }
            style={styles.bannerImage}>
            
          </ImageBackground>
          <View style={styles.labelContentsView}>
            {renderHeadingLabelView('Title', title)}
            {renderHeadingLabelView(
              'Start Date',
              moment(startDate).format('DD/MM/YYYY'),
            )}
            {renderHeadingLabelView(
              'End Date',
              moment(endDate).format('DD/MM/YYYY'),
            )}
            <Text style={[styles.headingLabel, styles.descriptionLabel]}>
              Description
            </Text>
            <Text numberOfLines={2} style={styles.valueLabel}>
              {description}
            </Text>
            {renderJoinButton()}
          </View>
        </Animated.View>
      </View>
    </View>
  );
});

export {DaysChallengeModal};
