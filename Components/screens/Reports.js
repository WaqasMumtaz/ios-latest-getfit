import React from 'react';
import { Text, View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import styles from '../Styling/ReportsScreenStyle';
import Wheelspiner from '../Progress Wheel/Progress';
import ChartScreen from '../BarChart/BarChart';
import HttpUtils from '../Services/HttpUtils';
import AsyncStorage from '@react-native-community/async-storage';

const { height } = Dimensions.get('window');

class Reportscreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      dataExcersices: [],
      currentDateDataWeights: [],
      weekAgoDateDataWeights: [],
      weekAgoDateDataGoalSteps: [],
      weekAgoDateDataRunSteps: [],
      monthName: ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"],
      loseWeight: '',
      gainWeight: '',
      lastWeek: '',
      cureentWeek: '',
      userID: '',
      stepCountData: '',
      goalSteps: '',
      goalStepsDate: '',

    }
  }
  async componentWillMount() {
    await this.getData();
    // console.log('componentWillMount Run ')

  }



  //get data from database
  getData = async () => {
    const { monthName } = this.state;
    //create varibale for useage
    let dataExcersiceArr = [];
    let userId;
    let weekBefore;
    let cureentWeekData;
    let loseWeight;
    //get user id from local storage
    AsyncStorage.getItem("currentUser").then(value => {
      if (value) {
        let dataFromLocalStorage = JSON.parse(value);
        userId = dataFromLocalStorage._id;
        // console.log('localstorage data >>', dataFromLocalStorage);
      }
    });
    //getting api complete data excersice or weight mearsment
    let dataExcersice = await HttpUtils.get('getallexerciselog');
    let dataWeight = await HttpUtils.get('getweightlog');
    let userObj = {
      userId: userId
    };
    // console.log('user id >>', userObj)
    let userPedometerData = await HttpUtils.post('getpedometerbyid', userObj);
    // console.log('user get pedometer data >>', userPedometerData);
    let retrieveGoalSteps = await HttpUtils.post('getgoal', userObj);

    // console.log('user pedometer data >>',userPedometerData.content);

    if (userPedometerData.code == 200 && retrieveGoalSteps.code == 200) {
      const userContent = userPedometerData.content;
      const userGoalSteps = retrieveGoalSteps.content;
      // console.log('user goal steps >>', userGoalSteps);
      for (let i in userContent) {
        // console.log(userContent[i])
        const userSteps = userContent[i].stepCount;
        // console.log(userSteps)
        this.setState({
          stepCountData: userSteps
        })
      }


    }
    // for(let i in userPedometerData){
    //   const dataUser = userPedometerData[i].stepCount;
    //   console.log(dataUser);
    //   // console.log('step counts >>',dataUser.stepCount)
    //   // this.setState({
    //   //   stepCountData:dataUser.stepCount
    //   // })
    // }
    let data = dataExcersice.content;
    let weightData = dataWeight.content;
    let userGoalSteps = retrieveGoalSteps.content;
    let userPedometerDataSteps = userPedometerData.content

    //gettibg curent date
    const currentDayOfWeek = new Date().getDay() + 1;
    // console.log('current day of week >>', currentDayOfWeek);
    const currentDate = new Date().getDate();
    let currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    if (currentMonth == 1 || currentMonth == 2 || currentMonth == 3 || currentMonth == 4 || currentMonth == 5 ||
      currentMonth == 6 || currentMonth == 7 || currentMonth == 8 || currentMonth == 9) {
      currentMonth = `0${currentMonth}`
    }
    //getting weekly excersices 
    for (var i in data) {
      let dataApi = data[i];
      if (dataApi.userId == userId) {
        //get month name
        let getMonthNo = dataApi.month.slice(1) - 1;
        let getMontName = monthName[getMonthNo];
        dataApi.monthName = getMontName;
        //check week of the month
        let checkDate = Number(dataApi.dayOfMonth) - currentDate;
        let checkMonth = Number(dataApi.month) - currentMonth;
        let checkYear = Number(dataApi.year) - currentYear;
        if (checkDate == 0 || checkDate == -1 || checkDate == -2 || checkDate == -3 || checkDate == -4 || checkDate == -5 ||
          checkDate == -6 || checkDate == -7 && checkMonth == 0 && checkYear == 0) {
          dataExcersiceArr = [...dataExcersiceArr, dataApi];
          this.setState({
            dataExcersices: dataExcersiceArr
          })
        }
      }
    }

    //get week wise goal steps
    for (let i in userGoalSteps) {
      // console.log(userGoalSteps[i])
      if (userGoalSteps[i].userId == userId) {
        const goalStepsData = userGoalSteps[i];
        const justGoalSteps = userGoalSteps[i].goalSteps;
         console.log('goalSteps >>', goalStepsData)
        const date = goalStepsData.date;
        console.log('goal date >>', date);
        const getMonth = goalStepsData.month;
        const getMontName = monthName[getMonth];
        goalStepsData.monthName = getMontName;
        console.log('goal month >>', getMonth);
        const getYear = goalStepsData.year;
        console.log('goal steps year >>', getYear);
        // let checkWeekDay = (Math.abs(currentDayOfWeek - goalStepsData.dayOfWeek));
        // console.log('weekDay >>', checkWeekDay)
        // let checkDate = Number(date) - currentDate;
        // let checkMonth = Number(getMonth) - currentMonth;
        // let checkYear = Number(getYear) - currentYear;
        // const weekDate = Number(currentDate - 7);
        // console.log('week Date >>', weekDate);
        // console.log('check date >>', checkDate);
        // console.log('check month >>', checkMonth);
        // console.log('checkyear >>', checkYear);
         console.log('moment time >>', moment())
        let dayCount = 7;
        var toDate = new Date();
        for (var k = dayCount; k = dayCount; k--) {
          var sevenDaysAgo = moment().subtract(dayCount, 'days').toDate();
          console.log('SevenDaysAgo Data >>', sevenDaysAgo);
          var dayOfMonthAgo = sevenDaysAgo.getDate() + 1;
          console.log('dayOfMonthAgo >>', dayOfMonthAgo);
          var monthNoOfYear = sevenDaysAgo.getMonth() + 1;
          console.log('monthNoOfYear >>', monthNoOfYear);
           var yearNo = sevenDaysAgo.getFullYear();
           dayCount--;
           console.log('DayCount >>', dayCount);
          //  console.log('jo date dali >', Number(date));
          //  console.log('jo month dala >',Number(getMonth));
          //  console.log('jo year dala tha >', Number(getYear));
          // for (var j = 0; j < data.length; j++) {
            if (dayOfMonthAgo == Number(date) && monthNoOfYear == Number(getMonth) &&
              yearNo == Number(getYear)) {
                dataExcersiceArr = [...dataExcersiceArr, justGoalSteps];
                console.log('If Condition Data Exercise >>', dataExcersiceArr);
                this.setState({
                  weekAgoDateDataGoalSteps: dataExcersiceArr
                })
              // weeksProduct.push(data[j])
            }
          }

        // console.log('Waqas Mumtaz');
        // if (checkDate == 0 || checkDate == -1 || checkDate == -2 || checkDate == -3 || checkDate == -4 || checkDate == -5 ||
        //   checkDate == -6 || checkDate == -7 && checkMonth == 0 && checkYear == 0) {
        //   dataExcersiceArr = [...dataExcersiceArr, goalStepsData];
        //   this.setState({
        //     weekAgoDateDataGoalSteps: dataExcersiceArr
        //   },()=>{console.log('State Goal Steps >>',this.state.weekAgoDateDataGoalSteps)})
        // }
        // if (checkDate === 0 || checkDate === -1 || checkDate === -2 ||
        //     checkDate === -3 || checkDate === -4 || checkDate === -5 ||
        //     checkDate === -6 || checkDate === -7 && checkMonth === 0
        //     ) {
        //   console.log('True Condition')
        //   dataExcersiceArr = [...dataExcersiceArr, justGoalSteps];
        //   console.log('If Condition Data Exercise >>', dataExcersiceArr);
        //   this.setState({
        //     weekAgoDateDataGoalSteps: dataExcersiceArr
        //   })
        // }
        // else {
        //   dataExcersiceArr = [...dataExcersiceArr, 0];
        //   console.log('Else Condition Data Exercise >>', dataExcersiceArr);
        //   this.setState({
        //     weekAgoDateDataGoalSteps: dataExcersiceArr
        //   })
        // }
      }

    }
    //get week wise runing steps
    for (let i in userPedometerDataSteps) {
      // console.log(userPedometerDataSteps[i])
      if (userPedometerDataSteps[i].userId == userId) {
        const goalStepsData = userPedometerDataSteps[i];
        const justGoalSteps = userPedometerDataSteps[i].stepCount;
        //  console.log('goalSteps >>', goalStepsData)
        const date = Number(goalStepsData.date);
        // console.log('date >>', date);
        const getMonth = Number(goalStepsData.month);
        // const getMontName = Number(monthName[getMonth]);
        // goalStepsData.monthName = getMontName;
        // console.log('month >>', getMonth);
        const getYear = Number(goalStepsData.year);
        // console.log('current year >>', getYear);
        // let checkWeekDay = (Math.abs(currentDayOfWeek - goalStepsData.dayOfWeek));
        // console.log('weekDay >>', checkWeekDay)
        // let checkDate = Number(date) - currentDate;
        // let checkMonth = Number(getMonth) - currentMonth;
        // let checkYear = Number(getYear) - currentYear;
        // const weekDate = Number(currentDate - 7);
        // console.log('week Date >>', weekDate);
        // console.log('check date >>', checkDate);
        // console.log('check month >>', checkMonth);
        // console.log('checkyear >>', checkYear);
        // if (checkDate == 0 || checkDate == -1 || checkDate == -2 || checkDate == -3 || checkDate == -4 || checkDate == -5 ||
        //   checkDate == -6 || checkDate == -7 && checkMonth == 0 && checkYear == 0) {
        //   dataExcersiceArr = [...dataExcersiceArr, goalStepsData];
        //   this.setState({
        //     weekAgoDateDataGoalSteps: dataExcersiceArr
        //   },()=>{console.log('State Goal Steps >>',this.state.weekAgoDateDataGoalSteps)})
        // }

        let dayCount = 7;
        var toDate = new Date();
        for (var k = dayCount; k = dayCount; k--) {
          var sevenDaysAgo = moment().subtract(dayCount, 'days').toDate();
          console.log('SevenDaysAgo Data >>', sevenDaysAgo);
          var dayOfMonthAgo = sevenDaysAgo.getDate() + 1;
          console.log('dayOfMonthAgo >>', dayOfMonthAgo);
          var monthNoOfYear = sevenDaysAgo.getMonth() + 1;
          console.log('monthNoOfYear >>', monthNoOfYear);
           var yearNo = sevenDaysAgo.getFullYear();
           dayCount--;
          //  console.log('jo date dali >', Number(date));
          //  console.log('jo month dala >',Number(getMonth));
          //  console.log('jo year dala tha >', Number(getYear));
          // for (var j = 0; j < data.length; j++) {
            if (dayOfMonthAgo == date && monthNoOfYear == getMonth &&
              yearNo == getYear) {
                dataExcersiceArr = [...dataExcersiceArr, justGoalSteps];
                console.log('If Condition Data Exercise >>', dataExcersiceArr);
                this.setState({
                  weekAgoDateDataRunSteps: dataExcersiceArr
                })
              // weeksProduct.push(data[j])
            }
          }

        // if (checkDate == 0 || checkDate == -1 || checkDate == -2 || checkDate == -3 || checkDate == -4 || checkDate == -5 ||
        //   checkDate == -6 || checkDate == -7 
        //   && checkMonth == 0 || checkMonth == -1 || checkMonth == -2 || checkMonth == -3 ||
        //   checkMonth == -4 || checkMonth == -5 || checkMonth == -6 || checkMonth == -7
        //   || checkMonth == -8 || checkMonth == -9 || checkMonth == -10 ||
        //   checkMonth == -11 || checkMonth == 0 && checkYear == 0) {
        //   dataExcersiceArr = [...dataExcersiceArr, justGoalSteps];
        //   this.setState({
        //     weekAgoDateDataRunSteps: dataExcersiceArr
        //   })
        // }
      }
    }

    //get week wise data and show bar chart line 
    for (var i in weightData) {
      let dataApi = weightData[i];
      if (dataApi.userId == userId) {
        //check week of the month
        let checkWeekDay = (Math.abs(currentDayOfWeek - dataApi.dayOfWeek));
        let checkDate = Number(dataApi.dayOfMonth) - currentDate;
        let checkMonth = Number(dataApi.month) - currentMonth;
        let checkYear = Number(dataApi.year) - currentYear;
        //condition check week ago data
        if (checkWeekDay == 0 && checkDate != 0 && checkMonth == 0 && checkYear == 0) {
          // console.log('weekago data')
          weekBefore = dataApi
          this.setState({
            weekAgoDateDataWeights: weekBefore
          })
        }
        //if data not has week ago then check a last week any day data
        if (checkWeekDay != 0 && checkMonth == 0 && checkYear == 0) {
          if (checkWeekDay == 1 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          }
          else if (checkWeekDay == 2 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          }
          else if (checkWeekDay == 3 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          }
          else if (checkWeekDay == 4 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          } else if (checkWeekDay == 5 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          } else if (checkWeekDay == 6 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          } else if (checkWeekDay == 7 && checkMonth == 0 && checkYear == 0) {
            weekBefore = dataApi
            this.setState({
              weekAgoDateDataWeights: weekBefore
            })
          }
        }
        //current date data
        if (checkDate == 0 && checkMonth == 0 && checkYear == 0) {
          // console.log(currentDateDataWeights)
          cureentWeekData = dataApi
          this.setState({
            currentDateDataWeights: cureentWeekData
          })
        }


      }
    }
    //availbe current date and week ago ago data then get lose or gain wieght
    if (cureentWeekData != undefined && weekBefore != undefined) {
      let weekAgoWieght = weekBefore.weight.substring(0, weekBefore.weight.length - 2);
      let currentWeekWieght = cureentWeekData.weight.substring(0, cureentWeekData.weight.length - 2);
      loseWeight = weekAgoWieght - currentWeekWieght;
    }
    //lose weight
    if (loseWeight > 0) {
      this.setState({
        loseWeight: loseWeight,
        lastWeek: 6,
        cureentWeek: 5
      })
    }
    //gain weight
    else if (loseWeight < 0) {
      let gainWeight = Math.abs(loseWeight);
      this.setState({
        lastWeek: 5,
        cureentWeek: 6,
        gainWeight: gainWeight
      })
    }
    //not gain or lose weight
    else if (loseWeight == 0) {
      this.setState({
        loseWeight: loseWeight,
        lastWeek: 6,
        cureentWeek: 6
      })
    }
    //not availeble today data
    else if (cureentWeekData == undefined) {
      this.setState({
        loseWeight: 0,
        lastWeek: 6,
        cureentWeek: 0
      })
    }
  }
  render() {
    const { dataExcersices,
      currentDateDataWeights,
      weekAgoDateDataWeights,
      loseWeight,
      gainWeight,
      lastWeek,
      cureentWeek,
      stepCountData,
      weekAgoDateDataGoalSteps,
      weekAgoDateDataRunSteps
    } = this.state
    console.log(loseWeight, 'loseWeight')
    let initialValue = Number(0)
    weekAgoDateDataGoalSteps && weekAgoDateDataGoalSteps.map((item, index) => {
      return initialValue = initialValue + Number(item);
    })
    console.log('Total Steps >>', initialValue);
    let runSteps = Number(0);
    weekAgoDateDataRunSteps && weekAgoDateDataRunSteps.map((item, index) => {
      return runSteps = runSteps + Number(item)
    })
    const multiplySteps = runSteps / initialValue;
    //console.log('multiply >>',multiplySteps);
    const divideSteps = multiplySteps * 100;
    //console.log('divided >>',divideSteps )
    const roundedValue = Math.round(divideSteps);
    //console.log('percentage steps >>',roundedValue)
    // this.setState({
    //   stepsPercentage: roundedValue
    // })
    let weeklyExcersice = dataExcersices && dataExcersices.map((elem, key) => {
      return (
        <View style={styles.exerciseResultCard}>
          <Text style={styles.resultHeading}>
            {elem.exerciseName}
          </Text>
          <View style={styles.dataResultParent}>
            <View style={styles.timeShowContainer}>
              <Text style={styles.timeShow}>
                {`${elem.exerciseAmount} ${elem.exerciseUnit}`}
              </Text>
            </View>
            <View style={styles.dateAndMonth}>
              <Text maxLength={3} style={styles.dateAndMonthShow}>
                {elem.monthName}
              </Text>
              <Text style={styles.dateNumber}>
                {elem.dayOfMonth}
              </Text>
              <Text style={styles.superScriptTextStyle}>
                {elem.dayOfMonth == 1 ? 'st' : elem.dayOfMonth == 2 ? '2nd' : elem.dayOfMonth == 3 ? 'rd' : 'th'}
              </Text>
            </View>
          </View>
        </View>
      )
    });
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <Text style={styles.textStyleOne}>Weekly</Text>
          <Text style={styles.textStyleTwo}>Report</Text>
        </View>
        {/* <View style={styles.arrowContainer}>
          <TouchableOpacity style={{ marginRight: 20 }}>
            <Image source={require('../icons/left.png')} style={styles.forImgs} /></TouchableOpacity>
          <Text>This week</Text>
          <TouchableOpacity style={{ marginLeft: 20 }}>
            <Image source={require('../icons/right.png')} style={styles.forImgs} /></TouchableOpacity>
        </View> */}
        <ScrollView style={{ flex: 1, backgroundColor: 'white', height: height }} contentContainerStyle={{ flexGrow: 1 }}  >
          <View style={styles.bodyContainer}>
            <View style={styles.cardLeft}>
              <View style={styles.weeklyStepWalk}>
                <Text style={styles.headingText}>Total steps walked</Text>
                <View style={styles.spinerContainer}>
                  <Wheelspiner
                    size={65}
                    width={10}
                    color={'#FF6200'}
                    progress={runSteps > 1 && runSteps < 250 ? 25 :
                      runSteps > 250 && runSteps < 500 ? 50 :
                      runSteps > 500 && runSteps < 750 ? 75 :
                      runSteps > 750 && runSteps <= 10000 ? 100
                            : 0
                    }
                    backgroundColor={'gray'}
                    animateFromValue={0}
                    fullColor={'#FF6200'}
                  />
                </View>
                <View style={styles.resultContainer}>
                  <Text style={{ color: '#FF6200' }}>{runSteps == 0 ? 0 : runSteps}</Text>
                  <Text style={{ color: '#a6a6a6' }}>/{initialValue == 0 ? 0 : initialValue}</Text>
                </View>
                <Text style={{ color: '#a6a6a6', marginLeft: 14 }}>steps</Text>
              </View>
              <View style={styles.weightStatus}>
                <Text style={styles.headingText}>Weight{'\n'}status</Text>
                <View style={styles.statusGraphContainer}>
                  <View style={styles.midBox}>
                    <ChartScreen lastWeek={lastWeek} cureentWeek={cureentWeek} />
                  </View>
                  <View style={styles.borderLines1}>
                    <Text style={styles.kgTextOne}>
                      {currentDateDataWeights.weight}
                    </Text>
                    <Text style={styles.kgTextTwo}>
                      {weekAgoDateDataWeights.weight}
                    </Text>
                  </View>
                  <View style={styles.weeksTextContainer}>
                    <Text style={styles.thisWeek}>This week</Text>
                    <Text style={styles.lastWeek}>Last week</Text>
                  </View>
                  {loseWeight || loseWeight == 0 || loseWeight != '' ?
                    <View>
                      <Text style={styles.lostKg}>{`${loseWeight} KG`} </Text>
                      <Text style={styles.lostText}>Lost</Text>
                    </View>
                    :
                    <View>
                      <Text style={styles.lostKg}>{`${gainWeight} KG`} </Text>
                      <Text style={styles.lostText}>Gain</Text>
                    </View>
                  }
                </View>
              </View>
            </View>
            <View style={styles.cardRight}>
              <View style={styles.totalExerciseContainer}>
                <Text style={styles.totalExercisHeading}>Total exercise{'\n'}done</Text>
                {weeklyExcersice}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Reportscreen;
