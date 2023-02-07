import { View, FlatList, useWindowDimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useLazyQuery } from '@apollo/client';

import { Colors } from '../../themes/Colors';
import { GET_CALENDER_EVENTS } from '../../graphql/query';
import { selectColorAndIcon } from '../../screens/servicesScreen/addEditMeetingAppointmentVideoConference/screenRender';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';
import CalenderdayEventsComponent from '../calenderDayEventsComponent/CalenderdayEventsComponent';
import Loader from '../Loader/Loader';
import CalendarStrip from '../calendarStripLib/CalendarStrip';

var dataInList = [];
var curruntItemDateInView = '';
var eventsOnDate = [];
var firstScrollDone = false;
var isNextPage = true;
var calDateList = [];
var scrollIndex = parseInt(moment(new Date()).format('DD')) - 1;
let CalanderDate = moment();
let recentUsedMonth = CalanderDate.format('YYYY-MM-01');

const CalendarScheduleViewComponent = () => {
  const [eventDetails, setEventDetails] = useState(calDateList);
  const flatListRef = useRef(null);
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const today = parseInt(moment(new Date()).format('DD'));
  // const [scrollIndex, setScrollIndex] = useState(
  //   parseInt(moment(new Date()).format('DD')) - 1
  // );

  // const [isNextPage, setIsNextPage] = useState(true);
  console.log('today', { today });
  var previousList = [];
  var setDateOnScroll = false;

  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  // let recentUsedMonth = CalanderDate.format('YYYY-MM-01');

  useEffect(() => {
    recentUsedMonth = CalanderDate.format('YYYY-MM-01');
    console.log('useeffect');
    if (dataInList.findIndex((item) => item == recentUsedMonth) == -1) {
      dataInList.push(recentUsedMonth);
      getCalenderEvents({
        variables: {
          startDate: recentUsedMonth,
          endDate: CalanderDate.endOf('month').format('YYYY-MM-DD'),
          meeting: true,
          appointment: true,
          videoConferences: true,
          tasks: true
        }
      });
    }
    // if (eventDetails?.length > 0) {
    //   scrollToDate(moment(new Date()).format('YYYY-MM-DD'));
    // }
  }, []);

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

        getDaysInMonth(month, year).map((date) => {
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

        Object.keys(newList).forEach((element) => {
          var listOfEventsOfTheSelectedDate = newList[element];
          let dateEventList = [];

          listOfEventsOfTheSelectedDate.forEach((event) => {
            let darkColor = selectColorAndIcon(event.item_type).darkColor;
            let lightColor = selectColorAndIcon(event.item_type).lightColor;
            let tickIcon = selectColorAndIcon(event.item_type).tickIcon;
            dateEventList.push({
              ...event,
              darkColor,
              lightColor,
              tickIcon
            });
          });

          if (isNextPage) {
            calDateList.push({
              date: element,
              displayDate: moment(element).format('MMM DD').toString(),
              displayDay: weekday[new Date(element).getDay()],
              eventsOfTheDay: dateEventList
            });
          } else {
            console.log('isPrevious');
            previousList.push({
              date: element,
              displayDate: moment(element).format('MMM DD').toString(),
              displayDay: new Date(element).toLocaleString('en-us', {
                weekday: 'long'
              }),
              eventsOfTheDay: dateEventList
            });
            // calDateList = previousList.concat(calDateList);
          }
        });

        setEventDetails(previousList.concat(calDateList));

        // if (!firstScrollDone) {
        //   scrollToDate(moment(new Date()).format('YYYY-MM-DD'));
        // } else {
        //   console.log('curruntItemDateInView', curruntItemDateInView);
        //   scrollToDate(curruntItemDateInView);
        // }
      }
    },
    onError: (data) => {
      console.log('getCalenderEvents error', data.message);
    }
  });
  useEffect(() => {
    if (eventDetails.length > 0) {
      console.log('eventDetails.length', eventDetails.length);
      // const scrollingNumber = Math.floor(
      //   Math.random() * eventDetails.length - 1
      // );
      // console.log('item to be Scoll', eventDetails[scrollingNumber]);

      if (!firstScrollDone) {
        scrollList(parseInt(moment(new Date()).format('DD')) - 1);
      }
      if (!isNextPage) {
        let index = eventDetails?.findIndex(
          (data) => data?.date === curruntItemDateInView
        );
        console.log('index', index);
        scrollList(index);
      }
    }
  }, [eventDetails]);

  const scrollList = (index) => {
    firstScrollDone = true;
    if (index < 0) return;
    if (eventDetails.length !== 0 && flatListRef !== null) {
      setTimeout(() => {
        flatListRef?.current?.scrollToIndex({
          animation: true,
          index: index
        });
      }, 500);
    }
  };
  // const scrollToDate = (date) => {
  //   firstScrollDone = true;
  //   console.log('date===>', date);
  //   console.log('calDatelist======>', eventDetails.length);

  //   let index = eventDetails?.findIndex((data) => data?.date === date);
  //   console.log('index', index);
  //   scrollIndex = index;
  //   if (index > 0 && eventDetails?.length > 0) {
  //     setTimeout(() => {
  //       console.log('index:::::', index);

  //       flatListRef?.current?.scrollToIndex({
  //         animation: true,
  //         index: index
  //       });
  //     }, 500);
  //   }
  // };

  const renderNextMonthEvents = () => {
    isNextPage = true;
    // setIsNextPage(true);

    let newDate = moment(eventDetails[eventDetails.length - 1].date).add(
      1,
      'month'
    );

    var begin = moment(newDate).format('YYYY-MM-01');
    if (dataInList.findIndex((item) => item == begin) == -1) {
      dataInList.push(begin);
      var end = moment(newDate).endOf('month').format('YYYY-MM-DD');
      recentUsedMonth = moment(newDate).format('YYYY-MM-01');

      console.log(`Calling next page with date ${begin} and ${end}`);
      getCalenderEvents({
        variables: {
          startDate: begin.toString(),
          endDate: end.toString(),
          meeting: true,
          appointment: true,
          videoConferences: true,
          tasks: true
        }
      });
    }
  };

  const renderPreviousMonthEvents = () => {
    if (eventDetails.length <= 0) return;
    isNextPage = false;
    // setIsNextPage(false);

    let newDate = moment(eventDetails[0].date).add(-1, 'month');

    var begin = moment(newDate).format('YYYY-MM-01');
    recentUsedMonth = begin;

    var end = moment(newDate).endOf('month').format('YYYY-MM-DD');
    // console.log(begin, end);
    getCalenderEvents({
      variables: {
        startDate: begin.toString(),
        endDate: end.toString(),
        meeting: true,
        appointment: true,
        videoConferences: true,
        tasks: true
      }
    });
  };

  const onViewCallBack = useRef(({ changed, viewableItems }) => {
    curruntItemDateInView = viewableItems[0]?.item?.date;
    scrollIndex = viewableItems[0]?.index;
    // setDate(curruntItemDateInView);
    console.log('Current displaying data of the ', curruntItemDateInView);
  });

  const viewabilityConfig = useRef({
    waitForInteraction: true,
    minimumViewTime: 100,
    viewAreaCoveragePercentThreshold: 50
  });

  return (
    <View style={{ flex: 1 }}>
      <CalendarStrip
        selectedDate={date}
        onPressDate={(date) => {
          setDate(moment(new Date(date)).format('YYYY-MM-DD'));

          // scrollToDate(moment(new Date(date)).format('YYYY-MM-DD'));
          const index = eventDetails?.findIndex(
            (data) => data?.date === moment(new Date(date)).format('YYYY-MM-DD')
          );

          scrollList(index);
        }}
        markedDate={eventsOnDate}
        weekStartsOn={0} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
      />

      {loading && !firstScrollDone ? (
        <Loader color={Colors.primary} />
      ) : (
        eventDetails?.length > 0 && (
          <FlatList
            ref={flatListRef}
            initialNumToRender={eventDetails?.length ?? 0}
            onScrollToIndexFailed={(info) => {
              flatListRef.current.scrollToOffset({
                offset: error.averageItemLength * error.index,
                animated: true
              });
              setTimeout(() => {
                if (eventDetails.length !== 0 && flatListRef !== null) {
                  flatListRef.current.scrollToIndex({
                    index: error.index,
                    animated: true
                  });
                }
              }, 100);
              console.log('scrolling faid::::', info);
              // const wait = new Promise((resolve) => setTimeout(resolve, 500));
              // wait.then(() => {
              //   flatListRef.current?.scrollToIndex({
              //     index: info.index,
              //     animated: true
              //   });
              // });
            }}
            data={eventDetails}
            style={{ paddingHorizontal: SIZES[16] }}
            onViewableItemsChanged={onViewCallBack.current}
            viewabilityConfig={viewabilityConfig.current}
            keyExtractor={(item, index) => item.date}
            onEndReached={() => {
              renderNextMonthEvents();
            }}
            onEndReachedThreshold={0.5}
            onScrollBeginDrag={(e) => {
              console.log('onScrollBeginDrag');

              setDateOnScroll = true;
            }}
            onScrollEndDrag={() => {
              if (setDateOnScroll) {
                if (scrollIndex == 0 && eventDetails.length > 0) {
                  renderPreviousMonthEvents();
                }
                if (
                  curruntItemDateInView !== undefined &&
                  curruntItemDateInView !== ''
                ) {
                  setDate(curruntItemDateInView);
                }
              }
              setDateOnScroll = false;
            }}
            onMomentumScrollEnd={(e) => {
              console.log(
                'onMomentumScrollEnd with date ',
                curruntItemDateInView
              );

              if (setDateOnScroll && eventDetails.length > 0) {
                if (scrollIndex == 0) {
                  renderPreviousMonthEvents();
                }
                if (
                  curruntItemDateInView !== undefined &&
                  curruntItemDateInView !== ''
                ) {
                  setDate(curruntItemDateInView);
                }
              }
              setDateOnScroll = false;
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{ marginBottom: SIZES[24] }}>
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
        )
      )}
      {/* {loading && <Loader color={Colors.primary} />} */}
    </View>
  );
};

export default CalendarScheduleViewComponent;
