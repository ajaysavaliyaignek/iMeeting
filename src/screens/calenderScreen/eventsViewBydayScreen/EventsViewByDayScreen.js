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
        <Text style={styles.txtHeader}>{moment(date).format('DD MMMM')}</Text>
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
        <Text style={styles.txtDateTitle}>{`${Day}, ${moment(date).format(
          'DD MMMM'
        )}`}</Text>
        <FlatList
          data={events}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item, index }) => {
            return <EventDetailsCard item={item} index={index} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default EventsViewByDayScreen;
