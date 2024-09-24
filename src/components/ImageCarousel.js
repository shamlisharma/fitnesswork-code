import React, { useRef, useState } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { ArrowIcon, FadedBackground } from '../Svg'



const ImageCarousel = React.memo((props) => {
  const { data, cardComponent, height } = props;
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewRef = useRef((props) => {
    const { viewableItems, changed } = props
    setCurrentIndex(viewableItems)
  })
  const length = data?.length
  return (
    <View>
      <FlatList
        ref={listRef}
        data={data}
        renderItem={cardComponent}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      {currentIndex[0]?.index === 0
        ? null
        : <>
          <View style={styles.leftFadedBackgroundContainer}><FadedBackground height={height} /></View>
          <View style={[styles.leftButtonStyle, { height: height }]}>
            <TouchableOpacity
              onPress={() => {
                if (listRef != null && listRef.current) {
                  listRef.current.scrollToIndex({ index: currentIndex[0].index - 1, viewPosition: 0.5 })
                }
              }}>
              <ArrowIcon />
            </TouchableOpacity>
          </View>
        </>}
      {currentIndex[currentIndex?.length - 1]?.index === length - 1
        ? null
        : (
          <>
            <View style={styles.rightFadedBackgroundContainer}><FadedBackground /></View>
            <View style={[styles.rightButtonStyle, { height: height }]}>
              <TouchableOpacity
                onPress={() => {
                  if (listRef != null && listRef.current) {
                    listRef.current.scrollToIndex({ index: currentIndex[currentIndex?.length - 1].index + 1, viewPosition: 0.5 })
                  }

                }}>
                <ArrowIcon />
              </TouchableOpacity>
            </View>
          </>)}
    </View>
  )
})

export default ImageCarousel

const styles = StyleSheet.create({
  leftFadedBackgroundContainer: {
    position: 'absolute',
    marginTop: 10,
    transform: [{ scaleX: -1 }]
  },
  rightFadedBackgroundContainer: {
    position: 'absolute',
    right: 0,
    marginTop: 10
  },
  leftButtonStyle: {
    position: 'absolute',
    height: 150,
    justifyContent: 'center',
    transform: [{ scaleX: -1 }],
    marginTop: 10
  },
  rightButtonStyle: {
    position: 'absolute',
    height: 150,
    justifyContent: 'center',
    right: 0,
    marginTop: 10
  }
})