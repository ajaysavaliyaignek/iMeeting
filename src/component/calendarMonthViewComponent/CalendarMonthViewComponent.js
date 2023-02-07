import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-big-calendar';
import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import CalendarHeader from '../calendarHeader/CalendarHeader';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { selectColorAndIcon } from '../../screens/servicesScreen/addEditMeetingAppointmentVideoConference/screenRender';
import { GET_CALENDER_EVENTS } from '../../graphql/query';
import { SIZES } from '../../themes/Sizes';
let CalanderDate = moment();

const CalendarMonthViewComponent = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const [calendarDate, setCalendarDate] = useState(
    CalanderDate.format('YYYY-MM-DD')
  );
  const [monthCalenderView, setMonthCalenderView] = useState(CalanderDate);
  const [key, setKey] = useState([]);
  const [eventDetails, setEventDetails] = useState([]);

  const [events, setEvenets] = useState([]);

  const onPressArrowLeft = () => {
    const newDate = CalanderDate.add(-1, 'M');

    setCalendarDate(newDate.format('YYYY-MM-DD'));
    setMonthCalenderView(newDate);
  };

  const onPressArrowRight = (addMonth) => {
    const newDate = CalanderDate.add(1, 'month');
    setCalendarDate(newDate.format('YYYY-MM-DD'));
    setMonthCalenderView(newDate);
  };

  var begin = moment(monthCalenderView).format('YYYY-MM-01');
  var end = moment(monthCalenderView).endOf('month').format('YYYY-MM-DD');

  useEffect(() => {
    var begin = moment(monthCalenderView).format('YYYY-MM-01');
    var end = moment(monthCalenderView).endOf('month').format('YYYY-MM-DD');
    console.log('begin', begin);
    console.log('end', end);
    // setEvenets([]);
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
  }, [begin]);

  const [getCalenderEvents] = useLazyQuery(GET_CALENDER_EVENTS, {
    onCompleted: (data) => {
      console.log('API call has been done');
      //   console.log('getCalenderEvents', data?.calendarEventsMobile?.events);
      if (data?.calendarEventsMobile?.events !== {}) {
        var key = Object.keys(data?.calendarEventsMobile?.events);
        setKey(key);

        var Value = Object.values(data?.calendarEventsMobile?.events);

        let eventvalue = Value.map((val, index) => {
          var newEvent = val?.map((value) => {
            let darkColor = selectColorAndIcon(value.item_type).darkColor;
            let lightColor = selectColorAndIcon(value.item_type).lightColor;
            let tickIcon = selectColorAndIcon(value.item_type).tickIcon;
            return { ...value, darkColor, lightColor, tickIcon };
          });
          return { ...val, ...newEvent };
        });

        setEventDetails(
          eventvalue.map((event) => {
            return Object.values(event);
          })
        );
      }
    },
    onError: (data) => {
      console.log('getCalenderEvents error', data.message);
    }
  });

  useEffect(() => {
    console.log('use effect has been called');
    var eventData = [];

    eventDetails?.map((data, index) => {
      setEvenets([]);
      data?.map((d) => {
        eventData = [
          ...eventData,
          {
            title: d.title,
            start: new Date(key[index]),
            end: new Date(key[index]),
            color: d.darkColor
          }
        ];
      });
    });
    setEvenets(eventData);
  }, [eventDetails]);

  return (
    <View style={{ paddingHorizontal: SIZES[16] }}>
      <CalendarHeader
        headerData={calendarDate}
        onPressArrowLeft={onPressArrowLeft}
        onPressArrowRight={onPressArrowRight}
        horizontal={true}
      />

      <Calendar
        renderEvent={(event) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: event.color,
                borderRadius: SIZES[2],
                paddingLeft: SIZES[2]
              }}
              onPress={() => {
                let pressedDate = moment(event.start).format('YYYY-MM-DD');
                var field = key.filter(function (x) {
                  return x === pressedDate;
                });
                var index = key.indexOf(field[0]);
                if (
                  eventDetails != null &&
                  eventDetails[index] != null &&
                  eventDetails[index].length > 0
                ) {
                  navigation.navigate('EventsViewByDayScreen', {
                    events: eventDetails[index],
                    date: event.start
                  });
                }
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  ...Fonts.PoppinsRegular[10],
                  color: Colors.white
                }}
              >
                {event.title}
              </Text>
            </TouchableOpacity>
          );
        }}
        events={events}
        height={height - 170}
        mode="month"
        date={new Date(monthCalenderView)}
        swipeEnabled={false}
        onPressCell={(date) => {
          let pressedDate = moment(date).format('YYYY-MM-DD');
          var field = key.filter(function (x) {
            return x === pressedDate;
          });
          var index = key.indexOf(field[0]);
          const setdate = eventDetails?.filter((k, index) => {
            key[index] == pressedDate;
          });

          if (
            eventDetails != null &&
            eventDetails[index] != null &&
            eventDetails[index].length > 0
          ) {
            navigation.navigate('EventsViewByDayScreen', {
              events: eventDetails[index],
              date: date
            });
          }
        }}
      />
    </View>
  );
};

export default CalendarMonthViewComponent;
{
  /* <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={eventDetails}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={(month) => {
          console.log('trigger items loading');
        }}
        // Callback that fires when the calendar is opened or closed
        onCalendarToggled={(calendarOpened) => {
          console.log(calendarOpened);
        }}
        // Callback that gets called on day press
        onDayPress={(day) => {
          console.log('day pressed');
        }}
        // Callback that gets called when day changes while scrolling agenda list
        onDayChange={(day) => {
          console.log('day changed');
        }}
        // Initially selected day
        // selected={new Date().getDate()}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate={'2012-05-10'}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined

        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={50}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={50}
        // Specify how each item should be rendered in agenda
        renderItem={(item, firstItemInDay) => {
          return (
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>
              <Text>{item.name}</Text>
            </View>
          );
        }}
        // Specify how each date should be rendered. day can be undefined if the item is not first in that day
        renderDay={(day, item) => {
          return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>
              <Text>{moment(day).format('MMM DD')}</Text>
            </View>
          );
        }}
        // Specify how empty date content with no items should be rendered
        renderEmptyDate={() => {
          return <View />;
        }}
        // Specify how agenda knob should look like
        renderKnob={() => {
          return <View />;
        }}
        // Override inner list with a custom implemented component
        // renderList={(listProps) => {
        //   return <MyCustomList {...listProps} />;
        // }}
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={() => {
          return <View />;
        }}
        // Specify your item comparison function for increased performance
        rowHasChanged={(r1, r2) => {
          return r1.text !== r2.text;
        }}
        // Hide knob button. Default = false
        hideKnob={true}
        // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        // showClosingKnob={false}
        // By default, agenda dates are marked if they have at least one item, but you can override this if needed
        // markedDates={{
        //   '2012-05-16': { selected: true, marked: true },
        //   '2012-05-17': { marked: true },
        //   '2012-05-18': { disabled: true }
        // }}
        // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false

        scrollEnabled={true}
        // disabledByDefault={true}
        // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
        onRefresh={() => console.log('refreshing...')}
        // Set this true while waiting for new data from a refresh
        refreshing={false}
        // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
        refreshControl={null}
        // Agenda theme
        theme={{
          ...calendarTheme,
          agendaDayTextColor: 'yellow',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          agendaKnobColor: 'blue',
          dayTextColor: 'black',
          backgroundColor: Colors.white
        }}
        contentContainerStyle={{ backgroundColor: Colors.white }}
        calendarStyle={{ backgroundColor: Colors.white }}
        // Agenda container style
        style={{ flex: 1, backgroundColor: Colors.white }}
      /> */
}
