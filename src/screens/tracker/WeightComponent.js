import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { DropdownIcon } from '../../Svg';
import DropDownPicker from 'react-native-dropdown-picker'
import { COLORS } from '../../common/Constant';
export const Weight = React.memo((props) => {
    const { btnView, length, onChangeText, textInputValue, style, zIndex, getDropDownValue, inputRef } = props;
    const [status, setStatus] = useState(true);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(length ? 'CM' : 'KG');
    const [items, setItems] = useState(length
        ? ([
            { label: 'CM', value: 'CM' },
            { label: 'IN', value: 'IN' }
        ])
        : ([
            { label: 'KG', value: 'KG' },
            { label: 'LBS', value: 'LBS' }
        ]));


    return (
        <View style={[styles.container, btnView]}>
            <View style={{ flex: 6 }}>
                <TextInput
                    placeholder={'60'}
                    style={{ marginLeft: 10, width: '100%' }}
                />
            </View>
            <View activeOpacity={0.5} style={styles.kgContainer}>
                <DropDownPicker
                    items={[
                        { label: 'KG', value: 'kg', selected: true },
                        { label: 'LBS', value: 'lbs' },
                    ]}
                    defaultIndex={0}
                    containerStyle={{ height: 40 }}
                    onChangeItem={item => console.log(item.label, item.value)}
                    open={open}
                    setOpen={setOpen}
                    listMode='SCROLLVIEW'
                />
            </View>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 8,
        borderWidth: 1.2,
        borderColor: 'rgb(230,230,230)',
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dropDownTxt: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'Manrope-SemiBold',
    },
    kgContainer: {
        flex: 4,
        backgroundColor: 'rgb(245,245,245)',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    dropDownStyle: {
        backgroundColor: COLORS.light_grey,
        borderWidth: 1,
        borderColor: COLORS.grey_6,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    dropDownContainerStyle: {
        width: '100%',
        borderColor: COLORS.light_grey,
        borderWidth: 0,
        // marginBottom:100
    },
    dropDownTextStyle: {
        fontFamily: 'Manrope-Regular',
        fontSize: 13
    },
    dropMenuStyle: {
        borderWidth: 1,
        borderColor: COLORS.light_grey,
    },
})