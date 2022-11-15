import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import CalendarStrip from 'react-native-calendar-strip';
import { Divider } from 'react-native-paper';
import Timetable from 'react-native-calendar-timetable';
import moment from 'moment';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import Avatar from '../../../../component/Avatar/Avatar';
import { Fonts } from '../../../../themes';

const TimelineScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUsers } = route?.params;
  console.log(' from timeline', selectedUsers);
  const [date, setDate] = useState(new Date().toISOString());
  const [selected, setSelected] = useState(false);
  const [from] = useState(moment().subtract(3, 'days').toDate());
  const [till] = useState(moment().add(3, 'days').toISOString());
  // moment().add(3, 'days').toISOString()
  const [myEvents, setEvents] = useState([]);

  const events = [
    {
      start: '2022-11-14T08:00:00.000Z',
      end: '2022-11-17T17:00:00.000Z',
      title: 'Business of Software Conference',
      color: '#ff6d42'
    },
    {
      start: '2022-11-12T12:00:00.000Z',
      end: '2022-11-13T20:00:00.000Z',
      title: 'Friends binge marathon',
      color: '#7bde83'
    }
  ];

  const onEventClick = React.useCallback((event) => {
    console.log('pressed event', event.event.title);
    // toast({
    //   message: event.event.title
    // });
  }, []);

  const view = React.useMemo(() => {
    return {
      schedule: { type: 'day' }
    };
  }, []);

  const range = { from, till };
  console.log('from', range);
  console.log(
    moment(new Date(2022, 11, 11, 20, 20)).subtract(1, 'hour').toDate()
  );
  console.log(moment().add(1, 'hour').toDate());
  const [items] = useState([
    {
      title: [
        { title: 'Some event' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' }
      ],
      startDate: moment().subtract(1, 'hour').toDate(),
      endDate: moment().add(1, 'hour').toDate(),
      color: '#F7F5F9',
      borderColor: '#AB9EC8'
    },
    {
      title: [
        { title: 'Some event' },
        { title: 'Business of Software Conference' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' }
      ],
      startDate: moment('2022-11-12T08:00:00.000Z').toDate(),
      endDate: moment('2022-11-12T12:00:00.000Z').toDate(),
      color: '#FDF5F1',
      borderColor: '#E79D73'
    }
  ]);

  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(3, 'days') // total 4 days enabled
    }
  ];
  let datesBlacklist = [moment().add(1, 'days')];

  function MyItemCard({ style, item, dayIndex, daysTotal }) {
    return (
      <TouchableOpacity
        style={{
          ...style,
          backgroundColor: item.color,
          borderRadius: SIZES[8],
          // elevation: 5,
          width: width - 102,
          flexDirection: 'row'
        }}
        activeOpacity={0.9}
      >
        <View
          style={{
            backgroundColor: item.borderColor,
            width: SIZES[4],
            borderTopLeftRadius: SIZES[10],
            borderBottomLeftRadius: SIZES[10]
          }}
        />

        <FlatList
          // maxToRenderPerBatch={3}
          contentContainerStyle={{ paddingVertical: SIZES[8] }}
          initialNumToRender={3}
          data={
            DeviceInfo.isTablet()
              ? item.title.slice(0, 2)
              : item.title.slice(0, 3)
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: SIZES[4],
                  marginBottom: SIZES[4]
                }}
                key={index}
              >
                <Avatar
                  source={'https://picsum.photos/200/300'}
                  size={SIZES[24]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold,
                    marginLeft: SIZES[8]
                  }}
                >
                  {item.title}
                </Text>
              </View>
            );
          }}
        />
        {/* {item.title.map((ite, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: SIZES[4],
                  marginBottom: SIZES[4]
                }}
                key={index}
              >
                <Avatar
                  source={'https://picsum.photos/200/300'}
                  size={SIZES[24]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold,
                    marginLeft: SIZES[8]
                  }}
                >
                  {ite.title}
                </Text>
              </View>
            );
          })} */}

        <Text
          style={{
            position: 'absolute',
            bottom: SIZES[8],
            left: SIZES[12],
            zIndex: 20,
            ...Fonts.PoppinsRegular[12],
            color: Colors.secondary
          }}
        >
          10:00 - 12:10 PM - 12 users
        </Text>
      </TouchableOpacity>
    );
  }

  markedDatesArray = [
    {
      date: new Date(),
      dots: [
        {
          color: Colors.primary,
          selectedColor: Colors.white
        }
      ]
    },
    {
      date: new Date(),
      lines: [
        {
          color: Colors.primary
          // selectedColor: <string> (optional),
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Timeline'}
        rightIconName={IconName.Search}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <TouchableOpacity
          style={styles.usersView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('SelectUser', { selectedUsers })}
        >
          <Text style={styles.txtUsers}>Users</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>
              Selected {selectedUsers.length} users
            </Text>
            <Icon
              name={IconName.Arrow_Right}
              height={SIZES[12]}
              width={SIZES[6]}
            />
          </View>
        </TouchableOpacity>
        <Divider style={styles.divider} />

        <CalendarStrip
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          // daySelectionAnimation={{
          //   type: 'border',
          //   duration: 200,
          //   borderWidth: 1,
          //   borderHighlightColor: 'white'
          // }}
          style={{ height: 100 }}
          calendarHeaderPosition={'above'}
          // calendarHeaderFormat={moment(date).format('MMMM DD,YYYY')}
          calendarHeaderStyle={{
            color: 'white',
            alignSelf: 'flex-start'
          }}
          // iconLeftStyle={{}}
          dateNumberStyle={{ color: Colors.bold, ...Fonts.PoppinsSemiBold[14] }}
          dateNameStyle={{ color: '#AEB0B5', ...Fonts.PoppinsRegular[12] }}
          highlightDateNumberStyle={{
            color: Colors.white,
            ...Fonts.PoppinsSemiBold[14]
          }}
          highlightDateNameStyle={{
            color: Colors.white,
            ...Fonts.PoppinsRegular[12]
          }}
          disabledDateNameStyle={{ color: 'grey' }}
          disabledDateNumberStyle={{ color: 'grey' }}
          highlightDateContainerStyle={{
            backgroundColor: Colors.primary,
            height: 80,
            borderRadius: 10
          }}
          startingDate={new Date()}
          // datesWhitelist={datesWhitelist}
          // datesBlacklist={datesBlacklist}
          markedDates={markedDatesArray}
          onDateSelected={(date) => {
            // setDate(date);
            console.log(date.toISOString());
          }}
          scrollable={true}
          dayComponentHeight={100}
          dayContainerStyle={{
            height: 80,
            borderRadius: 10,
            alignSelf: 'center',

            zIndex: 20
          }}
        />
        <Text
          style={{
            ...Fonts.PoppinsBold[20],
            color: Colors.bold,
            marginBottom: SIZES[4]
          }}
        >
          {moment(date).format('MMMM DD,YYYY')}
        </Text>
        <Text
          style={{
            ...Fonts.PoppinsRegular[14],
            color: Colors.secondary,
            marginBottom: SIZES[24]
          }}
        >
          6 events
        </Text>
        <ScrollView style={{ flex: 1 }}>
          <Timetable
            items={items}
            cardComponent={MyItemCard}
            date={date} // optional
            range={range} // optional
            // width={width - 40}
            hideNowLine={true}
            linesLeftInset={-5}
            linesTopOffset={20}
            timeWidth={50}
            enableSnapping={false}
            hourHeight={DeviceInfo.isTablet() ? 200 : 60}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TimelineScreen;
