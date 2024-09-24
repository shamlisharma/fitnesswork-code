import React, {Children} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {StarFavIcon} from '../Svg';

export const Button = React.memo(props => {
  const {btnStyle, textStyle, title, onPress, share} = props;
  return (
    <TouchableOpacity activeOpacity={0.7} 
    style={[btnStyle]} 
    
    onPress={onPress}>
      <View style={{flexDirection: 'row'}}>
        {props?.share == true ? null : (
          <View style={{paddingRight: 15}}>
            <StarFavIcon />
          </View>
        )}
        <Text style={textStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
});
