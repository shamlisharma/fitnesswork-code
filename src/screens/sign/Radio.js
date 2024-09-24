import * as React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';

const MyComponent = () => {
  const [checked, setChecked] = React.useState('false');

  return (
    <View style={{marginHorizontal:10}} >
      <View style={{ flexDirection: "row", alignItems: "center",marginLeft:17,marginTop:10 }} >
        <RadioButton  color='rgba(13, 184, 218, 1)'
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('first')}
        />
          <Text style={{fontSize:15,color:"white",fontWeight:"400"}}>
            Monday
          </Text>
          <View style={{flexDirection:"row",alignItems:"center",marginLeft:"26%"}}>
          <RadioButton  color='rgba(13, 184, 218, 1)'
          value="second"
          status={checked === 'second' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('second')}
        />
        <Text style={{fontSize:15,color:"white",fontWeight:"400"}}>
          Friday
        </Text>
          </View>
        
      </View>
      <View style={{ flexDirection: "row", alignItems: "center",marginLeft:17,marginTop:10 }} >
        <RadioButton   color='rgba(13, 184, 218, 1)'
          value="third"
          status={checked === 'third' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('third')}
        />
          <Text style={{fontSize:15,color:"white",fontWeight:"400"}}>
            Thursday
          </Text>
          <View style={{flexDirection:"row",alignItems:"center",marginLeft:"24%"}}>
          <RadioButton  color='rgba(13, 184, 218, 1)'
          value="fourth"
          status={checked === 'fourth' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('fourth')}
        />
        <Text style={{fontSize:15,color:"white",fontWeight:"400"}}>
          Saturday
        </Text>
          </View>
        
      </View>
      <View style={{ flexDirection: "row", alignItems: "center",marginLeft:17,marginTop:10 }} >
        <RadioButton  color='rgba(13, 184, 218, 1)'
          value="fifth"
          status={checked === 'fifth' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('fifth')}
        />
          <Text style={{fontSize:15,color:"white",fontWeight:"400"}}>
            Tuesday
          </Text>
          <View style={{flexDirection:"row",alignItems:"center",marginLeft:"26%"}}>
          <RadioButton color='rgba(13, 184, 218, 1)'
          value="sixth"
          status={checked === 'sixth' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('sixth')}
        />
        <Text style={{fontSize:15,color:"white",fontWeight:"400",}}>
          Sunday
        </Text>
          </View>
        
      </View>
      <View style={{ flexDirection: "row", alignItems: "center",marginLeft:17,marginTop:10 }} >
        <RadioButton  color='rgba(13, 184, 218, 1)'
          value="seventh"
          status={checked === 'seventh' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('seventh')}
        />
          <Text style={{fontSize:15,color:"white",fontWeight:"400"}}>
            Wednesday
          </Text>
       
        
      </View>
    </View>
  );
};

export default MyComponent;