import { StyleSheet, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({

    wholeView: {
        ...StyleSheet.absoluteFillObject
    },

    blackSheetOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        opacity: 0.6
    },

    itemsInCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    modelContainer: {
        height: scale(390),
        width: width - scale(40),
        backgroundColor: 'white' ,
        alignSelf: 'center',
        marginTop: '30%',
        borderRadius: scale(10),
        overflow:'hidden'
    },

    bannerImage: {
        height: scale(175),
        marginBottom: scale(10),
        alignItems: 'flex-end'
    },

    labelContentsView: {
        marginHorizontal: scale(15),
        flex: 1
    },

    itemSeperate: {
        justifyContent: 'space-between'
    },
    itemsInRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    headingLabelView: {
        marginBottom: scale(5)
    },

    headingLabel: {
        fontSize: scale(12),
        fontWeight: 'bold'  
    },

    valueLabel: {
        fontSize: scale(11)
    },

    gradientButtonStyle: {
        flex: 1,
        justifyContent: 'center'
    }

});

export default styles;