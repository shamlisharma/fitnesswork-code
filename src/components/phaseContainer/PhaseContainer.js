import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import PhaseCard from './PhaseCard';
import { useIsFocused } from '@react-navigation/native';

const PhaseContainer = React.memo(props => {
  // const phaseIdArr = props.phase.map(item => item._id);
  let phase2StartDay = props?.weeks&&props?.weeks + 1;
  let phase2EndDay = props?.weeks&&props?.weeks + props?.weeks;
  let phase3StartDay = props?.weeks&&phase2EndDay + 1;
  let phase3EndDay =props?.weeks&&phase2EndDay + props?.weeks;
  let weeks = props?.weeks

  const [phaseOnPress, setPhaseOnPress] = useState(false);
  const [selected, setSelected] = useState(props?.customePhase||1);
  const isFocused= useIsFocused()
  const{workoutProgrammeHistory,workoutsData}=props
const scrollRef=useRef()
  React.useEffect(() => {
    setSelected(props?.customePhase)
    
  }, [props?.customePhase])
  console.log({selected,workoutProgrammeHistory});
 
  
  console.log({scrollRef});
  let phase=props?.customePhase||1
  if(phase>8){
    if(scrollRef!= null && scrollRef.current) {
      scrollRef.current?.scrollTo({x: (phase+20||0)*20, y: 0, animated: true})
    }
   
  }
  else if(phase>3){
    if(scrollRef!= null && scrollRef.current){
    scrollRef.current?.scrollTo({x: (phase+7||0)*20, y: 0, animated: true})
    }
  }
  const handlePress = item => {
    console.log({item,props});
    if (item !== undefined) {
      setSelected(item);
      props.handlePhaseChange(item, props?.weeks[0]?._id);
      setPhaseOnPress(true);
    }
  };

  return (
   <ScrollView horizontal ref={scrollRef} showsHorizontalScrollIndicator={false}>
     <View style={styles.container}>
      {
        weeks?.map((val, index) => {
          return (<PhaseCard
            key={index}
            title={`Week ${val?.weekNo}`}
            // subtitle={`Week ${1} to ${props?.phase[0]?.weeks|| 0}`}
            phaseArr={props.phase}
            isActive={props?.goal?.workoutPhase === 1}
            disabled={false}
            // phase={props?.goal?.workoutWeek === index+1}
            phase={selected === index+1}
            // onPress={() => {}}
            // onPress={() => props?.goal?.workoutWeek <= index+1&&handlePress(index + 1)}
            onPress={() => handlePress(index + 1)}
          />)
        })
      }
      {/* <PhaseCard
        key="phase1"
        title={'Phase 1'}
        subtitle={`Week ${1} to ${props?.phase[0]?.weeks || 0}`}
        phaseArr={props.phase}
        isActive={props?.goal?.workoutPhase === 1}
        disabled={true}
        phase={selected === 1 ? phaseOnPress : false}
        pId={phaseIdArr.includes(props?.phase[0]?._id)}
        onPress={() => handlePress(1)}
      />
      <View style={styles.flex} />
      <PhaseCard
        key="phase2"
        title={'Phase 2'}
        subtitle={`Week ${phase2StartDay || 0} to ${phase2EndDay || 0}`}
        phase={selected === 2 ? phaseOnPress : false}
        disabled={true}
        phaseArr={props.phase}
        pId={phaseIdArr.includes(props?.phase[1]?._id)}
        isActive={props?.goal?.workoutPhase === 2}
        onPress={() => handlePress(2)}
      />

      <View style={styles.flex} />
      <PhaseCard
        key="phase3"
        title={'Phase 3'}
        subtitle={`Week ${phase3StartDay || 0} to ${phase3EndDay || 0}`}
        phaseArr={props.phase}
        phase={selected === 3 ? phaseOnPress : false}
        disabled={true}
        pId={phaseIdArr.includes(props?.phase[2]?._id)}
        isActive={props?.goal?.workoutPhase === 3}
        onPress={() => handlePress(3)}
      /> */}
    </View>
   </ScrollView>
  );
});

export default PhaseContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  flex: {
    flex: 0.12,
  },
});
