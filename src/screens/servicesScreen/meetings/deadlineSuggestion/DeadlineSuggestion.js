import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import CalendarHeader from '../../../../component/calendarHeader/CalendarHeader';
import { Button } from '../../../../component/button/Button';
import { SIZES } from '../../../../themes/Sizes';

let CalanderDate = moment();
const DeadlineSuggestion = () => {
  const calendarRef = React.useRef();
  const route = useRoute();
  const { setCalendarValue } = route?.params;
  const navigation = useNavigation();
  const [calendarDate, setCalendarDate] = useState(
    CalanderDate.format('YYYY-MM-DD')
  );
  const [horizontal, setHorizontal] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  console.log(calendarDate);

  const updateCalendarDate = () => {
    setCalendarDate(calendarDate.format('YYYY-MM-DD'));
  };

  const onPressArrowLeft = () => {
    const newDate = CalanderDate.add(-1, 'M').format('YYYY-MM-DD');
    console.log('newDate', newDate);
    setCalendarDate(newDate);

    // calendarDate = calendarDate.add(-1, 'month');
    // updateCalendarDate();
  };

  const onPressArrowRight = (addMonth) => {
    const newDate = CalanderDate.add(1, 'month').format('YYYY-MM-DD');
    setCalendarDate(newDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Recieving subjects deadline'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>
          Recieving subjects deadline
        </Text>
        <Calendar
          markingType="custom"
          hideArrows={true}
          current={calendarDate}
          onDayPress={(date) => {
            console.log('date', date.dateString);
            setCalendarValue(date.dateString);
            navigation.goBack();
          }}
          minDate={new Date()}
          monthFormat={'yyyy MM'}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: 'red',
            calendarBackground: '#ffffff',
            todayTextColor: Colors.primary,
            dayTextColor: '#222222',
            textDisabledColor: Colors.line,
            monthTextColor: '#57B9BB',
            arrowColor: '#57B9BB',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: 'white',
            textDayHeaderFontSize: 8
          }}
          renderHeader={() => {
            return (
              <CalendarHeader
                headerData={calendarDate}
                onPressArrowLeft={onPressArrowLeft}
                onPressArrowRight={onPressArrowRight}
                horizontal={horizontal}
              />
            );
          }}
          //   style={{
          //     paddingLeft: 0,
          //     paddingRight: 0
          //   }}

          // markedDates={{
          //   '2022-10-19': { soldOut: false, blocked: false, inventory: 2 },
          //   '2019-02-24': { soldOut: false, blocked: false, inventory: 2 },
          //   '2019-02-25': { soldOut: false, blocked: true, inventory: 0 },
          //   '2019-02-26': { soldOut: true, blocked: true, inventory: 2 }
          // }}
          //   horizontal={this.state.horizontal}
          //   onDayPress={this.onDayPress}
        />
        <View style={styles.upcomingContainer}>
          <Button
            title={'Tommorow'}
            layoutStyle={[
              styles.btnLayout,
              {
                backgroundColor: activeTab === '1' ? Colors.gray : Colors.white
              }
            ]}
            textStyle={[
              styles.txtBtn,
              { color: activeTab === '1' ? Colors.primary : '#AEB0B5' }
            ]}
            onPress={() => setActiveTab('1')}
          />
          <Button
            title={'Weekend'}
            layoutStyle={[
              styles.btnLayout,
              {
                backgroundColor: activeTab === '2' ? Colors.gray : Colors.white
              }
            ]}
            textStyle={[
              styles.txtBtn,
              { color: activeTab === '2' ? Colors.primary : '#AEB0B5' }
            ]}
            onPress={() => setActiveTab('2')}
          />
          <Button
            title={'Next week'}
            layoutStyle={[
              styles.btnLayout,
              {
                backgroundColor: activeTab === '3' ? Colors.gray : Colors.white
              }
            ]}
            textStyle={[
              styles.txtBtn,
              { color: activeTab === '3' ? Colors.primary : '#AEB0B5' }
            ]}
            onPress={() => setActiveTab('3')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeadlineSuggestion;
