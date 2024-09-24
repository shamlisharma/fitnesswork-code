import React from 'react';
import {View,Text, StyleSheet} from 'react-native';

// This components used for show inline errors
const InlineError = props => (
    <Text style={[styles.cm_alert_danger, props.style]}>{props.errorMessage}</Text>
);

const styles = StyleSheet.create({
  cm_alert_danger: {
    color: 'red',
    fontFamily:'Manrope-SemiBold'
  },
});

export default InlineError;
