import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
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

let CalanderDate = moment();
const CalenderScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('0');
  const [monthCalenderView, setMonthCalenderView] = useState(CalanderDate);
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

  const onPressArrowLeft = () => {
    const newDate = CalanderDate.add(-1, 'M');
    console.log('newDate', newDate);
    setCalendarDate(newDate.format('YYYY-MM-DD'));
    setMonthCalenderView(newDate);

    // calendarDate = calendarDate.add(-1, 'month');
    // updateCalendarDate();
  };

  const onPressArrowRight = (addMonth) => {
    const newDate = CalanderDate.add(1, 'month');
    setCalendarDate(newDate.format('YYYY-MM-DD'));
    setMonthCalenderView(newDate);
  };

  const sampleData = {
    '2023-01-01': [
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1,
        darkColor: '#658EB4',
        lightColor: '#F0F4F8'
      }
    ],
    '2023-01-02': [
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1,
        darkColor: '#658EB4',
        lightColor: '#F0F4F8'
      },
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1,
        darkColor: '#E79D73',
        lightColor: '#FDF5F1'
      },
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1,
        darkColor: '#DD7878',
        lightColor: '#FCF1F1'
      },
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1,
        darkColor: '#E79D73',
        lightColor: '#FDF5F1'
      }
    ],
    '2023-01-03': [
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1
      }
    ],
    '2023-01-20': [
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1
      },
      {
        title: 'new meeting',
        startTime: '2023-01-01',
        endTime: '2023-01-09',
        location: 'block',
        user_images: ['http://asasasaas', 'image2', 'image3', 'image4'],
        attendance_count: 20,
        total_users: 1,
        item_id: 10120,
        item_type: 1
      }
    ]
  };

  var key = Object.keys(sampleData);
  var Value = Object.values(sampleData);

  // useEffect(() => {
  //   setEvenets(
  //     Value?.map((data, index) => {
  //       return {
  //         title: data.map((val) => {
  //           return val.title;
  //         }),
  //         start: new Date(key[index]),
  //         end: new Date(key[index])
  //       };
  //     })
  //   );
  // }, []);

  useEffect(() => {
    Value?.map((data, index) => {
      data.map((d) => {
        events.push({
          title: d.title,
          start: new Date(key[index]),
          end: new Date(key[index])
        });
        console.log('-----', {
          title: d.title,
          start: new Date(key[index]),
          end: new Date(key[index])
        });
      });
    });
  }, []);

  // console.log('----', events);

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
        {activeTab == '1' && (
          <View>
            <CalendarHeader
              headerData={calendarDate}
              onPressArrowLeft={onPressArrowLeft}
              onPressArrowRight={onPressArrowRight}
              horizontal={true}
            />
            <Calendar
              events={events}
              height={600}
              mode="month"
              date={new Date(monthCalenderView)}
              swipeEnabled={true}
              onPressCell={(date) => {
                console.log('date', date);

                let pressedDate = moment(date).format('YYYY-MM-DD');
                var field = key.filter(function (x) {
                  return x === pressedDate;
                });
                var index = key.indexOf(field[0]);
                const setdate = Value.filter((k, index) => {
                  key[index] == pressedDate;
                });
                console.log('setdate', Value[index]);
                navigation.navigate('EventsViewByDayScreen', {
                  events: Value[index],
                  date: date
                });
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CalenderScreen;
