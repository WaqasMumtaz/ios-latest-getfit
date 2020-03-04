import React from 'react';
import { Alert, StyleSheet,Dimensions} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const styles=StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'white',
    marginHorizontal:20,
},
headingContainer:{
    height:'8%',
    //backgroundColor:'red',
    flexDirection:'row',
    marginTop:40

},
textStyleOne:{
    color:'black',
    // fontFamily: "MontserratMedium",
    fontSize:20
},
textStyleTwo:{
    color:'#FF6200',
    // fontFamily: "MontserratMedium",
    fontSize:20
},
arrowContainer:{
    height:'10%',
    //backgroundColor:'red',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
},
forImgs:{
    height:15,
    width:15,
},
cardsContainer:{
    flex:1,
    flexDirection:'row',
    //backgroundColor:'green',
    //width:'47%'
    //  flexWrap:'wrap',
   //justifyContent:'space-between'
},
childContainerOne:{
    flex:1,
    //backgroundColor:'green'
},
childContainerTwo:{
    flex:1,
    //backgroundColor:'red'
},
cardOne:{
    height:140,
    width:155,
    marginTop:12
    // borderWidth:2,
    // borderColor:'black',
    // borderRadius:3,
    // marginLeft:10
},
cardTwo:{
    // justifyContent:'flex-end',
    height:290,
    width:157,
    borderWidth:2,
    //borderColor:'white',
    borderRadius:5,
    backgroundColor:'#000000',
    marginLeft:2
},
cardTwoTextStyle:{
    color:'#FFFFFF',
    // fontFamily:"MontserratMedium",
    marginLeft:14,
    marginTop:20
},
cardThree:{
    height:140,
    width:155,
    // borderWidth:2,
    // borderColor:'black',
    // borderRadius:3,
    marginTop:12
},
cardFour:{
    height:280,
    width:157,
    //borderWidth:2,
    //borderColor:'white',
    backgroundColor:'black',
    borderRadius:5,
    marginTop:15,
    marginLeft:2
},
cardFourTextStyle:{
    color:'#FFFFFF',
    // fontFamily:"MontserratMedium",
    marginLeft:14,
    marginTop:20
},
cardFive:{
    height:140,
    width:155,
    // borderWidth:2,
    // borderColor:'black',
    // borderRadius:3,
    marginTop:12
},
goalSetCard:{
    height:140,
    width:152,
    // borderWidth:2,
    // borderColor:'black',
    //borderRadius:3,
    borderTopLeftRadius:3,
    borderTopRightRadius:3
    //marginTop:12,
    //backgroundColor:'black',
    //padding:15
},
imgsStyle:{
    flex: 1,
    height: 130,
    width: 152,
    alignSelf: 'stretch',
    borderRadius:5
    
},
whelSpinerContainer:{
    height:'23%',
    //backgroundColor:'white',
    marginLeft:14,
    marginTop:8
},
resultContainer:{
     flexDirection:'row',
    height:'6%',
    //backgroundColor:'red',
    marginLeft:14,
    marginTop:10
},
detailReport:{
    height:'38%',
    //backgroundColor:'red',
    marginLeft:14
},
arrowIcon:{
    height:23,
    width:23,
    marginTop:22
},
lastArrow:{
    height:23,
    width:23,
    marginTop:22,
    marginLeft:14
},
waitContainer:{
    //height:60,
    width:152,
    // borderWidth:2,
    // borderColor:'black',
    borderBottomLeftRadius:3,
    borderBottomRightRadius:3,
    //marginTop:12,
    backgroundColor:'#000000',
    padding:12
    
},
waitText:{
    color: '#FF6200',
    // fontFamily: 'MontserratMedium',
},
weightLabel:{
    color:'#7e7e7e',
    // fontFamily: 'MontserratLight',
},
bmiText:{
    color: '#FF6200',
    // fontFamily: 'MontserratMedium',
    marginTop:5
}

})

export default styles; 