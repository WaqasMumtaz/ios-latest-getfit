import React from 'react';
import { Alert, Text, View, ScrollView, Dimensions, Image, TouchableOpacity, BackHandler } from 'react-native';
import Wheelspiner from '../Progress Wheel/Progress';
import styles from '../Styling/HomeStyle';
import HttpUtils from '../Services/HttpUtils';
import AsyncStorage from '@react-native-community/async-storage';
// import firebase from 'react-native-firebase';
import HandleBack from '../BackHandler/BackHandler';
//import { StackActions, NavigationActions } from 'react-navigation';

const { height } = Dimensions.get('window');
let userId = {};

class Homescreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeScreen:false,
      todayData: '',
      yestertdayData: '',
      pedometerData: '',
      userId: '',
      goalSteps: '',
      userAllData: [],
      userCurrentWeight: '',
      excerciseArry: [],
      bmiData: [],
      currentUserBMI: '',
      fitnessGoal:'',
      stepsPercentage:''

    }
    //console.log('constructor method run here')
  }


  componentWillMount() {
    // console.log('end')    
    this.getTodayOrYesterdayExcersice()
    // this.getTodayOrYesterdayExcersice();
    this.getDaysData();
    this.pedometerFun();

    //getting user id from local storage
    AsyncStorage.getItem("currentUser").then(value => {
      if (value) {
        let dataFromLocalStorage = JSON.parse(value);

        //console.log(dataFromLocalStorage, 'value')

        // dataFromLocalStorage.status = 'Online'
        // console.log(dataFromLocalStorage ,'dataFromLocalStorage')
        // db.ref(`users/${dataUser._id}`).update(userDataForOnlineOff)
        //console.log(dataFromLocalStorage ,'value')

        this.setState({
          userId: dataFromLocalStorage._id,
          
        })
      }
    });


    
  }

  
  getTodayOrYesterdayExcersice = async () => {
    //console.log('getTodayOrYesterdayExcersice')
    const { userId } = this.state;
    //get all excersice log data
    //let dataUser = await HttpUtils.get('getallexerciselog');
    await AsyncStorage.getItem('logExercises').then((value) => {
      let dataFromLocalStorage = JSON.parse(value);
      //console.log('log exercises data >>', dataFromLocalStorage);
      this.setState({
        excerciseArry: dataFromLocalStorage
      })
    })
    //console.log('exercis data >>', this.state.excerciseArry);
    let data = this.state.excerciseArry;
    //let data = dataUser.content;
    //get current date 
    const currentDate = new Date().getDate();
    let currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    if (currentMonth == 1 || currentMonth == 2 || currentMonth == 3 || currentMonth == 4 || currentMonth == 5 || currentMonth == 6 || currentMonth == 7 || currentMonth == 8 || currentMonth == 9) {
      currentMonth = `0${currentMonth}`
    }
    //looping with data
    for (var i in data) {
      let dataApi = data[i];
      // console.log('exer array ',dataApi)
      //   //check user id with api data and get current user data
      if (dataApi.userId == userId) {
        //get today & yesterday of excersice from database 
        let currMonth = Number(currentMonth)
        let checkDate = Number(dataApi.dayOfMonth) - currentDate;
        let checkMonth = Number(dataApi.month) - currMonth;
        let checkYear = Number(dataApi.year) - currentYear;
        if (checkDate == 0 && checkMonth == 0 && checkYear == 0) {
          //console.log('today excersice')
          this.setState({
            todayData: dataApi
          })
        }
        else if (checkDate == -1 && checkMonth == 0 && checkYear == 0) {
          //console.log('yestertdayData excersice')
          this.setState({
            yestertdayData: dataApi
          })
        }
      }
    }

  }

  getUserData = async () => {
    this.setState({
      homeScreen:true
    })
    
    let obj = {
      userId: this.state.userId
    }
    //console.log(obj)
    let retrieveData = await HttpUtils.post('getgoal', obj);
   // console.log('retrieve data >>>', retrieveData)
    if (retrieveData.code == 200) {
      this.setState({
        userAllData: retrieveData.content
      }, () => {
        //console.log(this.state.userAllData)
        const userData = this.state.userAllData;
        for (var i in userData) {
          //console.log(userData[i].currentWeight)
          this.setState({
            userCurrentWeight: userData[i].currentWeight,
            goalSteps:userData[i].goalSteps,
          })
        }
      })
    }
    const userBmiApi = await HttpUtils.post('getbmi', obj);
    //console.log('current user bmi >>>', userBmiApi);
    if (userBmiApi.code == 200) {
      this.setState({
        bmiData: userBmiApi.content
      }, () => {
        //console.log(this.state.userAllData)
        const userBmiData = this.state.bmiData;
        for (var i in userBmiData) {
          //console.log(userData[i].currentWeight)
          this.setState({
            currentUserBMI: userBmiData[i].bmi
          })
        }
      })
    }

  }

  // backScreen=()=>{
  //   //console.log('press back button');

  // }

  pedometerFun = (data) => {
    //console.log('data from child component >>>', data)
    if (data != undefined) {
      const multiplySteps = data / Number(this.state.goalSteps);
      //console.log('multiply >>',multiplySteps);
      const divideSteps = multiplySteps*100;
      //console.log('divided >>',divideSteps )
      const roundedValue = Math.round(divideSteps);
      //console.log('percentage steps >>',roundedValue)
      this.setState({
          stepsPercentage:roundedValue,
          pedometerData: data
      })    

      // this.setState({
      //   pedometerData: data,
      // })
    }

  }
  changeRout(e) {
    const {userCurrentWeight , goalSteps,fitnessGoal}=this.state;
    const { navigate } = this.props.navigation;
    if (e == 'logexercise') {
      navigate('Exerciselog')
    }
    else if (e == 'stepcount') {
      if(userCurrentWeight != '' && goalSteps != ''){
        navigate('StepCountScreen', {
          'pedometerFun': (data) => this.pedometerFun(data),
          currentWeight: this.state.userCurrentWeight,
          goalSteps:this.state.goalSteps,
          pedometerData:this.state.pedometerData
        })
      }
      else {
        Alert.alert('Please set goal')
      }
      
    }
  else if (e == 'Macrocalculator'){
      navigate('Macrocalculator')
  }

  }

  getBmiData = async () => {
    const { userId } = this.state;
    const userBMI = {
      userId: userId
    }
    //console.log('user id >>', userBMI)
    const userBmiApi = await HttpUtils.post('getbmi', userBMI);
    //console.log('current user bmi >>>', userBmiApi);
    // AsyncStorage.getItem("bmiData").then((value)=>{
    //   if(value){
    //     console.log('bmi result >>',JSON.parse(value))
    //     this.setState({
    //       bmiData:value
    //     })
    //   }
    // })
  }


  getDaysData = () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', (res) => {
      BackHandler.addEventListener("hardwareBackPress", this.onBack)
      this.getUserData();
      this.getTodayOrYesterdayExcersice();
      this.setState({
        homeScreen:true
      })
      //this.getBmiData();
    });
  }
  componentDidMount(){
         BackHandler.addEventListener('hardwareBackPress',this.handleBackButton);
         this.willBlur = this.props.navigation.addListener("willBlur", payload =>
         BackHandler.removeEventListener("hardwareBackPress", this.onBack),
       );
  }
  componentWillUnmount() {
    this.didFocus.remove();
    this.willBlur.remove();
    BackHandler.removeEventListener("hardwareBackPress", this.onBack);
  }


  handleBackButton = async () => {
   // console.log('pressed back button')
    const { navigate } = this.props.navigation;
    const getData = await AsyncStorage.getItem("currentUser");
    // const parsForm = JSON.parse(getData)
    // console.log('current user data >>>',parsForm)
    if (getData) {
      navigate('Home')
    }
    else {
      navigate('Login')
    }

  }

  onBack = () => {
    if (this.state.homeScreen == true) {
      return true;
    }
    return false;
  };



  render() {
    const { todayData, yestertdayData, pedometerData, goalSteps, userCurrentWeight, currentUserBMI,fitnessGoal,stepsPercentage } = this.state;
    const { navigate } = this.props.navigation;
    //console.log('current steps home >>',stepsPercentage)
    return (
      // <HandleBack onBack={this.onBack}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.textStyleOne}>GetFit</Text>
          <Text style={styles.textStyleTwo}>Athletic</Text>
        </View>
        {/* <View style={styles.arrowContainer}>
          <TouchableOpacity style={{ marginRight: 20 }}><Image source={require('../icons/left.png')} style={styles.forImgs} /></TouchableOpacity>
          <Text>Today</Text>
          <TouchableOpacity style={{ marginLeft: 20 }}><Image source={require('../icons/right.png')} style={styles.forImgs} /></TouchableOpacity>
        </View> */}
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: height }} contentContainerStyle={{ flexGrow: 1 }}  >
          <View style={styles.cardsContainer}>
            <View style={styles.childContainerOne}>
              <TouchableOpacity style={styles.goalSetCard} TouchableOpacity={0.6} onPress={() => navigate('Setupscreen1')}>
                {/* <Text style={{ color: 'white', fontSize: 15, fontFamily: 'MontserratExtraBold' }}>Set Goal</Text> */}
                <Image source={require('../icons/setgoal.png')} style={styles.imgsStyle} />

              </TouchableOpacity>
              <View style={styles.waitContainer}>
                <Text style={styles.waitText}>{userCurrentWeight == '' ? 0 : userCurrentWeight} KG</Text>
                <Text style={styles.weightLabel}>current weight</Text>
                <Text style={styles.bmiText}>{currentUserBMI == '' ? 0 : currentUserBMI}</Text>
                <Text style={styles.weightLabel}>current BMI</Text>
              </View>
              <TouchableOpacity style={styles.cardOne} onPress={() => { navigate('AddExercise') }}>
                <Image source={require('../icons/log-exer.png')} style={styles.imgsStyle} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardThree} onPress={() => navigate('LogMeasurementsScreen')}>
                <Image source={require('../icons/log-weight.png')} style={styles.imgsStyle} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardFive} onPress={this.changeRout.bind(this, 'Macrocalculator')}>
                <Image source={require('../icons/calc-macros.png')} style={styles.imgsStyle} />
              </TouchableOpacity>

            </View>
            <View style={styles.childContainerTwo}>
              <TouchableOpacity style={styles.cardTwo} activeOpacity={0.7}
                onPress={this.changeRout.bind(this, 'stepcount')}
              >
                <Text style={styles.cardTwoTextStyle}>Today's {'\n'}step count</Text>
                <View style={styles.whelSpinerContainer}>
                  <Wheelspiner
                    size={65}
                    width={10}
                    color={'#FF6200'}
                    progress={stepsPercentage == '' ? 0 : stepsPercentage}
                    backgroundColor={'gray'}
                    animateFromValue={0}
                    fullColor={'#FF6200'}
                  />
                </View>
                <View style={styles.resultContainer}>
                  <Text style={{ color: '#FF6200', 
                  // fontFamily: 'MontserratLight' 
                  }}>{pedometerData == '' ? 0 : pedometerData}</Text>
                  <Text style={{ color: '#a6a6a6', 
                  // fontFamily: 'MontserratLight' 
                  }}> / {goalSteps == '' || goalSteps == undefined ? 0 : goalSteps}</Text>
                </View>
                <Text style={{ color: '#a6a6a6', marginLeft: 14, 
                // fontFamily: 'MontserratLight'
                 }}>steps</Text>
                <View style={styles.detailReport}>
                  <Text style={{ color: '#FFFFFF', 
                  // fontFamily: 'MontserratLight', 
                  fontSize: 12, marginTop: 33 }}>View detailed report</Text>
                  <Image source={require('../icons/forward-arrow.png')} style={styles.arrowIcon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardFour} activeOpacity={0.7}
                onPress={this.changeRout.bind(this, 'logexercise')}
              >
                <Text style={styles.cardFourTextStyle}>{todayData != '' ? `Today's ${'\n'} exercise` : yestertdayData != '' ? `Yesterday's${'\n'} exercise` : `No ${'\n'}exercise`}</Text>
                <Text style={{ color: '#a6a6a6', 
                // fontFamily: 'MontserratLight', 
                marginTop: 20, marginLeft: 14 }}>
                  {todayData != '' ? `${todayData.exerciseName} ${'\n'}exercise` : yestertdayData != '' ? `${yestertdayData.exerciseName} ${'\n'}exercise` : 'No Record Found'}
                </Text>
                <View style={{ borderBottomColor: '#a6a6a6', borderBottomWidth: 1, marginHorizontal: 14, marginTop: 20 }}></View>
                <Text style={{ color: '#FF6200', 
                // fontFamily: 'MontserratLight', 
                marginLeft: 14, marginTop: 10 }}>
                  {todayData != '' ? todayData.exerciseAmount : yestertdayData != '' ? yestertdayData.exerciseAmount : 'No Record Found'}
                </Text>
                <Text style={{ color: '#a6a6a6', marginLeft: 14, 
                // fontFamily: 'MontserratLight' 
                }}>
                  {todayData != '' ? todayData.exerciseUnit : yestertdayData != '' ? yestertdayData.exerciseUnit : 'No Record Found'}
                </Text>
                <Text style={{ color: '#FFFFFF', 
                // fontFamily: 'MontserratLight', 
                fontSize: 12, marginTop: 20, marginLeft: 14 }}>View detailed report</Text>
                <Image source={require('../icons/forward-arrow.png')} style={styles.lastArrow} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      // </HandleBack>  
    );
  }
}

export default Homescreen;

