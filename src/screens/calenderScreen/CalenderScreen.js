import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-big-calendar';
import CalendarHeader from '../../component/calendarHeader/CalendarHeader';
import moment from 'moment';
import { styles } from './styles';
import { Icon, IconName } from '../../component';
import { SIZES } from '../../themes/Sizes';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../component/button/Button';
import { Colors } from '../../themes/Colors';
import {
  selectColor,
  selectColorAndIcon
} from '../servicesScreen/addEditMeetingAppointmentVideoConference/screenRender';
import { Fonts } from '../../themes';
import { useQuery } from '@apollo/client';
import { GET_CALENDER_EVENTS } from '../../graphql/query';
import CalendarMonthViewComponent from '../../component/calendarMonthViewComponent/CalendarMonthViewComponent';

let CalanderDate = moment();
const CalenderScreen = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('0');
  const [monthCalenderView, setMonthCalenderView] = useState(CalanderDate);
  const [calenderEventsList, setCalenderEventsList] = useState([]);
  const [key, setKey] = useState([]);
  const [Value, setValue] = useState([]);
  const [calendarDate, setCalendarDate] = useState(
    CalanderDate.format('YYYY-MM-DD')
  );
  const [events, setEvenets] = useState([
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
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: SIZES[24],
            width: SIZES[24],
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon
            name={IconName.Arrow_Left}
            height={SIZES[14]}
            width={SIZES[14]}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Calender</Text>
        <View style={styles.headeRightView}>
          <TouchableOpacity style={styles.searchIconView} onPress={() => {}}>
            <Icon name={IconName.Search} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.5}
            style={{
              height: SIZES[24],
              width: SIZES[24],
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name={IconName.Plus} height={SIZES[14]} width={SIZES[14]} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.subContainer}>
        <View style={styles.btnContainer}>
          <Button
            title={'Schedule'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '0' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => {
              setActiveTab('0');
            }}
          />

          {/* add external user button */}
          <Button
            title={'Month'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '1' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('1')}
          />
        </View>
        {activeTab == '1' && <CalendarMonthViewComponent />}
      </View>
      {/* <View>
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
                      let pressedDate = moment(event.start).format(
                        'YYYY-MM-DD'
                      );
                      var field = key.filter(function (x) {
                        return x === pressedDate;
                      });
                      var index = key.indexOf(field[0]);

                      navigation.navigate('EventsViewByDayScreen', {
                        events: eventDetails[index],
                        date: event.start
                      });
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
              height={height}
              mode="month"
              date={new Date(monthCalenderView)}
              swipeEnabled={true}
              onPressCell={(date) => {
                let pressedDate = moment(date).format('YYYY-MM-DD');
                var field = key.filter(function (x) {
                  return x === pressedDate;
                });
                var index = key.indexOf(field[0]);
                const setdate = eventDetails?.filter((k, index) => {
                  key[index] == pressedDate;
                });

                navigation.navigate('EventsViewByDayScreen', {
                  events: eventDetails[index],
                  date: date
                });
              }}
            />
          </View> */}
    </SafeAreaView>
  );
};

export default CalenderScreen;
