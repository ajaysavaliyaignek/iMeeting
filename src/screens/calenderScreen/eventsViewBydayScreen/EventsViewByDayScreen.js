import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Icon, IconName } from '../../../component';
import moment from 'moment';
import EventDetailsCard from '../../../component/eventDetailsCard/EventDetailsCard';
import CalenderdayEventsComponent from '../../../component/calenderDayEventsComponent/CalenderdayEventsComponent';
import Header from '../../../component/header/Header';

const EventsViewByDayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { events, date } = route?.params;
  const [eventDetails, setEventDetails] = useState(events);
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const Day = weekday[new Date(date).getDay()];

  const searchFilterEvents = (text) => {
    if (text) {
      const newData = events?.filter((item) => {
        const itemData = item.title ? item.title : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setEventDetails(newData);
    } else {
      setSearchText(text);
      setEventDetails(events);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={moment(date).format('DD MMMM')}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      {/* <View style={styles.headerContainer}>
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
        <Text style={styles.txtHeader}>{moment(date).format('DD MMMM')}</Text>
      </View> */}
      <CalenderdayEventsComponent date={date} events={events} />
    </SafeAreaView>
  );
};

export default EventsViewByDayScreen;
