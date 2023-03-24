import { View, Text, FlatList, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { GET_CALENDER_EVENTS } from '../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { selectColorAndIcon } from '../../screens/servicesScreen/addEditMeetingAppointmentVideoConference/screenRender';
import { SIZES } from '../../themes/Sizes';
import CalenderdayEventsComponent from '../calenderDayEventsComponent/CalenderdayEventsComponent';

const CalendarScheduleViewComponentNew = () => {
  const { width } = useWindowDimensions();
  const [scrollIndex, setScrollIndex] = useState(
    parseInt(moment(new Date()).format('DD')) - 1
  );
  var dataInList = [];
  var eventsOnDate = [];
  var firstScrollDone = false;
  var isNextPage = true;
  const flatListRef = useRef(null);
  var calDateList = [];
  const [eventDetails, setEventDetails] = useState(calDateList);
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  let recentUsedMonth = moment().format('YYYY-MM-01');
  const [itemHeights, setItemHeights] = useState([]);
  useEffect(() => {
    if (eventDetails.length > 0) {
      const scrollingNumber = Math.floor(
        Math.random() * eventDetails.length - 1
      );

      scrollList(scrollIndex);
    }
  }, [eventDetails]);

  const scrollList = (index) => {
    if (index < 0) return;
    setTimeout(() => {
      flatListRef?.current?.scrollToIndex({
        animation: true,
        index: index
      });
    }, 1000);
  };
  const [getCalenderEvents, { loading }] = useLazyQuery(GET_CALENDER_EVENTS, {
    onCompleted: (data) => {
      if (data?.calendarEventsMobile?.events != {}) {
        previousList = [];

        if (eventDetails.length > 0) {
          calDateList = eventDetails;
        }

        let startDate = moment(recentUsedMonth, 'YYYY-MM-DD').daysInMonth();

        let month = parseInt(
          moment(recentUsedMonth, 'YYYY-MM-DD').format('MM')
        );
        let year = moment(recentUsedMonth, 'YYYY-MM-DD').year();

        const getDaysInMonth = (month, year) =>
          new Array(startDate)
            .fill('')
            .map((v, i) =>
              moment(new Date(year, month - 1, i + 1)).format('YYYY-MM-DD')
            );
        let newList = [];

        let newArray = [];

        getDaysInMonth(month, year).map((date) => {
          newArray.push(0);
          if (data?.calendarEventsMobile?.events[date]?.length > 0) {
            newList = {
              ...newList,
              [date]: data?.calendarEventsMobile?.events[date]
            };
            eventsOnDate.push(date);
          } else {
            newList = { ...newList, [date]: [] };
          }
        });

        setItemHeights(newArray);

        Object.keys(newList).forEach((element) => {
          var listOfEventsOfTheSelectedDate = newList[element];
          let dateEventList = [];

          listOfEventsOfTheSelectedDate.forEach((event) => {
            let darkColor = selectColorAndIcon(event.item_type).darkColor;
            let lightColor = selectColorAndIcon(event.item_type).lightColor;
            let tickIcon = selectColorAndIcon(event.item_type).tickIcon;
            dateEventList.push({ ...event, darkColor, lightColor, tickIcon });
          });

          if (isNextPage) {
            calDateList.push({
              date: element,
              displayDate: moment(element).format('MMM DD').toString(),
              displayDay: weekday[new Date(element).getDay()],
              eventsOfTheDay: dateEventList.map((item) => {
                return { ...item, user_images: [] };
              })
            });
          } else {
            previousList.push({
              date: element,
              displayDate: moment(element).format('MMM DD').toString(),
              displayDay: new Date(element).toLocaleString('en-us', {
                weekday: 'long'
              }),
              eventsOfTheDay: dateEventList.map((item) => {
                return { ...item, user_images: [] };
              })
            });
          }
        });

        setEventDetails(previousList.concat(calDateList));
      }
    },
    onError: (data) => {
      console.log('getCalenderEvents error', data.message);
    }
  });

  useEffect(() => {
    recentUsedMonth = moment().format('YYYY-MM-01');

    if (dataInList.findIndex((item) => item == recentUsedMonth) == -1) {
      dataInList.push(recentUsedMonth);
      getCalenderEvents({
        variables: {
          startDate: recentUsedMonth,
          endDate: moment().endOf('month').format('YYYY-MM-DD'),
          meeting: true,
          appointment: true,
          videoConferences: true,
          tasks: true
        }
      });
    }
  }, []);

  return (
    <FlatList
      data={eventDetails}
      initialNumToRender={eventDetails.length ?? 0}
      keyExtractor={(item) => item.date}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: true
          });
        });
      }}
      ref={flatListRef}
      renderItem={({ item, index }) => {
        return (
          <View
            style={{ marginBottom: SIZES[24] }}
            // onLayout={(object) => {
            //   const _itemHeight = [...itemHeights];
            //   _itemHeight[index] = object.nativeEvent.layout.height;
            //   setItemHeights(_itemHeight);
            // }}
          >
            <CalenderdayEventsComponent
              events={item.eventsOfTheDay}
              date={item.displayDate}
              day={item.displayDay}
              isSchedulerView={true}
            />
          </View>
        );
      }}
    />
  );
};

export default CalendarScheduleViewComponentNew;
