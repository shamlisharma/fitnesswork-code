import React from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';


let LinkView = React.memo(function LinkView(props) {
  return (
    <View style={{flex: 1}}>
      <WebView source={{uri:props.route.params.url}}/>
    </View>
  );
})
export default LinkView;
