import React from 'react';
import {ActivityIndicator,Modal,View,StyleSheet} from 'react-native';

export const Loader = React.memo(props => {

    const {
        loading,
        ...attributes
    } = props;

  return (
    <Modal transparent={true} animationType="none" visible={loading}>
        <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                    animating={loading} size="large" color="#0DB8DA"/>
            </View>
        </View>
      {/*<ActivityIndicator size="large" color="#0DB8DA" />*/}
    </Modal>
  );
});
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: 'transparent',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});
