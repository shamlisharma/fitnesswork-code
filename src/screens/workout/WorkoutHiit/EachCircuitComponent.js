import React, {useRef, forwardRef, useImperativeHandle, useEffect, useState, memo} from 'react';
import {View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import {ExerciseVideo} from './ExerciseVideo';

const EachCircuitComponent = memo((props) => {
  const eachCircuitRef = useRef(null);
  const {eachCircuit, currentExcercise} = props;
  useEffect(() => {
     onExerciseMove();
  },[currentExcercise])

const onExerciseMove = () => {
    // alert(currentExcercise)
    if(eachCircuitRef!= null && eachCircuitRef.current){
      eachCircuitRef.current?.scrollTo({
        x: (Dimensions.get('window').width - scale(20)) * currentExcercise,
    animated: false,
})
    }

      
}

  return (
    
    <View
      style={{
        height: scale(350),
        width: Dimensions.get('window').width - scale(20),
      }}>
      <ScrollView ref={eachCircuitRef} scrollEnabled={false} horizontal pagingEnabled>
        {eachCircuit.map((item, index) => {
          
          return <ExerciseVideo 
          key={index+ ''}
          item={item} 
          currentExcercise={currentExcercise}
          index={index}
        {...props}
          />;
        })}
      </ScrollView>
    </View>
  );
});

export {EachCircuitComponent};
