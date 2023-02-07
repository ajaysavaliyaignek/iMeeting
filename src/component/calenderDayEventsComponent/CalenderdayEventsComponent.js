import { View, Text, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import EventDetailsCard from '../eventDetailsCard/EventDetailsCard';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import moment from 'moment';

const CalenderdayEventsComponent = ({ events, date, day, isSchedulerView }) => {
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  // console.log('events', events);

  const Day = weekday[new Date(date).getDay()];
  return (
    <View
      style={[
        styles.subContainer,
        { padding: isSchedulerView ? null : SIZES[16] }
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text style={styles.txtDateTitle}>
          {isSchedulerView
            ? `${date}   `
            : `${Day}, ${moment(date).format('DD MMMM')}`}
        </Text>
        {isSchedulerView && (
          <Text
            style={{
              ...Fonts.PoppinsRegular[14],
              color: Colors.secondary
            }}
          >
            {day}
          </Text>
        )}
      </View>

      {events?.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item.item_id}
          renderItem={({ item, index }) => {
            return <EventDetailsCard item={item} index={index} />;
          }}
        />
      ) : (
        <View
          style={{
            backgroundColor: '#F8F8F8',
            paddingVertical: SIZES[10],
            paddingLeft: SIZES[16],
            borderLeftWidth: SIZES[4],
            borderLeftColor: '#CECFD2',
            borderRadius: SIZES[8],
            marginTop: SIZES[16]
          }}
        >
          <Text
            style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}
          >
            No events
          </Text>
        </View>
      )}
    </View>
  );
};

export default CalenderdayEventsComponent;

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,

    backgroundColor: Colors.white
  },
  txtDateTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  }
});

// let month = parseInt(
//     moment(recentUsedMonth, 'YYYY-MM-DD').format('MM')
//   );
//   let year = moment(recentUsedMonth, 'YYYY-MM-DD').year();

//   const allDayArray = new Array(startDate);
//   const getDaysInMonth = (month, year) =>
//     new Array(startDate)
//       .fill('')
//       .map((v, i) =>
//         moment(new Date(year, month - 1, i + 1)).format('YYYY-MM-DD')
//       );
//   let newList = [];

//   getDaysInMonth(month, year).map((days) => {
//     if (data?.calendarEventsMobile?.events[days]?.length > 0) {
//       newList = {
//         ...newList,
//         [days]: data?.calendarEventsMobile?.events[days]
//       };
//     } else {
//       newList = { ...newList, [days]: [] };
//     }
//   });
//   var newdateArray = Object.keys(newList);
