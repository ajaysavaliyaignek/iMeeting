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
import Loader from '../Loader/Loader';
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

  const [getCalenderEvents, { loading }] = useLazyQuery(GET_CALENDER_EVENTS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.calendarEventsMobile?.events !== {}) {
        var key = Object.keys(data?.calendarEventsMobile?.events);
        setKey(key);

        var Value = Object.values(data?.calendarEventsMobile?.events);

        let eventvalue = Value.map((val, index) => {
          var newEvent = val?.map((value) => {
            let darkColor = selectColorAndIcon(value.item_type)?.darkColor;
            let lightColor = selectColorAndIcon(value.item_type)?.lightColor;
            let tickIcon = selectColorAndIcon(value.item_type)?.tickIcon;
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
      {loading && (
        <View style={{ flex: 1, marginVertical: 16 }}>
          <Loader color={Colors.primary} size={'small'} />
        </View>
      )}
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
