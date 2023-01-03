import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-big-calendar';
import CalendarHeader from '../../component/calendarHeader/CalendarHeader';
import moment from 'moment';

let CalanderDate = moment();
const CalenderScreen = () => {
  const [calendarDate, setCalendarDate] = useState(
    CalanderDate.format('YYYY-MM-DD')
  );
  const events = [
    {
      title: 'Meeting...........',
      start: new Date(2022, 10, 15, 10, 0),
      end: new Date(2022, 10, 15, 10, 30)
    },
    {
      title: 'Meeting',
      start: new Date(2022, 10, 15, 10, 0),
      end: new Date(2022, 10, 15, 10, 30)
    }
  ];

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
    <SafeAreaView>
      <Text>CalenderScreen</Text>
      <Calendar
        events={events}
        height={600}
        mode="month"
        onPressCell={(date) => console.log('date', date)}
        renderHeader={() => {
          return (
            <CalendarHeader
              headerData={calendarDate}
              onPressArrowLeft={onPressArrowLeft}
              onPressArrowRight={onPressArrowRight}
              horizontal={true}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CalenderScreen;
