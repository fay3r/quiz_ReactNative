const React = require('react-native');
const {StyleSheet} =React;

export default {
    container: {
        flex: 1
    },
    container2: {
        backgroundColor: 'gray'
    },
    item: {
        backgroundColor: '#e3e3e3',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 24,
    },
    tags:{
        color:'blue',
        textDecorationLine: 'underline',
        marginEnd:15,
        paddingBottom:5
    },
    footerText:{
        textAlign:'center',
        fontSize: 20,
        padding: 10
    },
    answersBox:{
        flexDirection: 'row',
        alignSelf:'center',
        justifyContent:'space-evenly',
        width: '80%',
        marginTop:20,
        backgroundColor:'#d4d3d2',
        marginBottom: 20

    },
    answersRow:{
        flexDirection: 'column',
        alignConent:'space-between',
        marginTop: 15,
        marginBottom:15
    },
    answers:{
        width: 20,
        marginStart:10
    },
    header:{
        flex:1,
        backgroundColor:'#999999',
        flexDirection:'row',
        alignItems:'center'
    },
    content:{
        flex:10
    },
    text: { textAlign: 'center' },
    font22:{fontSize: 16,
    fontWeight:'bold'},
    centerMode:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    border:{padding:2,borderWidth:1,},
    opensansb:{fontFamily:'OpenSans-Bold'},
    opensansitalic:{fontFamily:'OpenSans-BoldItalic'},
    raleway:{fontFamily: 'Raleway-VariableFont_wght',fontWeight: 'Black'},
    langar:{fontFamily: 'Langar-Regular'}
}
