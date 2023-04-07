import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Modal,
  Pressable
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import CalendarStrip from 'react-native-calendar-strip';
import { Divider, useTheme } from 'react-native-paper';
import Timetable from 'react-native-calendar-timetable';
import moment from 'moment';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import Avatar from '../../../../component/Avatar/Avatar';
import { Fonts } from '../../../../themes';
import { useQuery } from '@apollo/client';
import { GET_TIMELINE_REVIEW } from '../../../../graphql/query';
import Loader from '../../../../component/Loader/Loader';
import EventCalendar from 'react-native-events-calendar';

const TimelineScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUsers } = route?.params;
  const [date, setDate] = useState(new Date());
  const [event, setEvents] = useState(null);
  const [items, setItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [timelineUser, setTimelineUser] = useState([]);
  const [selectUser, setSelectuser] = useState([]);
  const [userIds, setUserIds] = useState([]);

  useEffect(() => {
    let selectForTimeline = selectedUsers.map((user) => {
      let isSelectedForTimeline = true;
      return { ...user, isSelectedForTimeline };
    });
    if (selectForTimeline) {
      setTimelineUser(selectForTimeline);
      setSelectuser(selectForTimeline);
    }
    // setTimelineUser(selectForTimeline);
  }, []);

  useEffect(() => {
    const userId = selectUser?.map((com) => {
      return com.userId;
    });
    setUserIds(userId?.join());
  }, [selectUser]);

  const { data, error, loading } = useQuery(GET_TIMELINE_REVIEW, {
    fetchPolicy: 'cache-and-network',
    variables: {
      startTime: `${moment(date).format('YYYY-MM-DD')} 00:00 AM `,
      endTime: `${moment(date).format('YYYY-MM-DD')} 11:59 PM `,
      date: moment(date).format('YYYY-MM-DD'),
      requiredUserIds: userIds,
      optionalUserIds: '',
      timeStart: '00:00 AM',
      timeEnd: '11:59 PM'
    },
    onCompleted: (data) => {
      Object.keys(data.timeReviewMobile.userEvents).forEach(function (key) {
        var value = data.timeReviewMobile.userEvents[key];

        setEvents(value);
        // ...
      });
    },
    onError: (data) => {
      console.log('timeline error', data);
    }
  });

  useEffect(() => {
    if (event !== null) {
      setItems([
        {
          title: event,
          startDate: moment(event?.startTime, 'YYYY-MM-DD hh:mm A'),
          endDate: moment(event?.endTime, 'YYYY-MM-DD hh:mm A'),

          color: '#FDF5F1',
          borderColor: '#E79D73'
        }
      ]);
    }
  }, [event]);

  function MyItemCard({ style, item, dayIndex, daysTotal }) {
    return (
      <TouchableOpacity
        style={{
          ...style,
          backgroundColor: item.color,
          borderRadius: SIZES[8],
          // elevation: 5,
          width: width - 102,
          borderLeftWidth: SIZES[4],
          borderLeftColor: item.borderColor
        }}
        activeOpacity={0.5}
        onPress={() => setOpenModal(true)}
      >
        <FlatList
          // maxToRenderPerBatch={3}
          contentContainerStyle={{ paddingVertical: SIZES[8] }}
          initialNumToRender={3}
          keyExtractor={(index) => index.toString()}
          data={item.title.events}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: SIZES[4],
                  marginBottom: SIZES[4]
                }}
                key={index.toString()}
              >
                <Avatar source={item.portraitURL} size={SIZES[24]} />
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold,
                    marginLeft: SIZES[8]
                  }}
                >
                  {item.userName}
                </Text>
              </View>
            );
          }}
        />

        <Text
          style={{
            position: 'absolute',
            bottom: 0,
            left: SIZES[10],
            zIndex: 40,
            ...Fonts.PoppinsRegular[12],
            color: Colors.secondary
          }}
        >
          {moment(event?.startTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A')} -
          {moment(event?.endTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A')} -{' '}
          {event?.events.length} {''}
          {event?.events.length > 1 ? 'Users' : 'User'}
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
          onPress={() =>
            navigation.navigate('SelectUser', {
              selectedUsers: timelineUser,
              setTimelineUser: setTimelineUser,

              selectUser,
              setSelectuser
            })
          }
        >
          <Text style={styles.txtUsers}>Users</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>
              Selected {selectUser?.length} users
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
          style={{ height: 100, marginTop: SIZES[16] }}
          calendarHeaderPosition={'above'}
          // calendarHeaderFormat={moment(date).format('MMMM DD,YYYY')}

          showMonth={false}
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
          selectedDate={date}
          // datesWhitelist={datesWhitelist}
          // datesBlacklist={datesBlacklist}
          markedDates={markedDatesArray}
          onDateSelected={(date) => {
            setDate(new Date(date));
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
        {loading && <Loader color={Colors.primary} />}
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
          {event?.events.length} events
        </Text>
        <ScrollView style={{ flex: 1 }}>
          <Timetable
            items={items}
            cardComponent={MyItemCard}
            date={date} // optional
            // range={range} // optional
            // width={width - 40}
            theme={{ text: Colors.bold }}
            hideNowLine={true}
            linesLeftInset={-5}
            linesTopOffset={20}
            timeWidth={50}
            enableSnapping={false}
            hourHeight={DeviceInfo.isTablet() ? 200 : 60}
          />
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.mainBoxView}>
            <View style={styles.rowHeader}>
              <Text style={styles.txtModalHeader}>
                {moment(event?.startTime, 'YYYY-MM-DD hh:mm A').format(
                  'hh:mm A'
                )}{' '}
                -
                {moment(event?.endTime, 'YYYY-MM-DD hh:mm A').format('hh:mm A')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setOpenModal(false)}
              >
                <Icon
                  name={IconName.Close}
                  height={SIZES[16]}
                  width={SIZES[16]}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.txtUserCount}>
              {event?.events.length} users
            </Text>
            <ScrollView>
              {event?.events.map((item, index) => {
                {
                  /* console.log(items); */
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setOpenModal(!openModal);
                    }}
                    style={[
                      styles.userContainer,
                      {
                        backgroundColor: items[0]?.color,
                        borderLeftColor: items[0]?.borderColor
                      }
                    ]}
                    key={index.toString()}
                  >
                    <View style={styles.userDataContainer}>
                      <View style={styles.userInfoContainer}>
                        <Avatar
                          name={item.userName}
                          source={item.portraitURL}
                          size={SIZES[24]}
                        />
                        <Text style={styles.txtUserName}>{item.userName}</Text>
                      </View>
                      <Text style={styles.txtTime}>
                        {moment(item?.startTime, 'YYYY-MM-DD hh:mm A').format(
                          'hh:mm A'
                        )}{' '}
                        -
                        {moment(item?.endTime, 'YYYY-MM-DD hh:mm A').format(
                          'hh:mm A'
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.closeContainer}
            onPress={() => setOpenModal(false)}
          >
            <Text style={styles.txtClostBtn}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TimelineScreen;
