import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import EventCalendar from 'react-native-events-calendar';
import { Divider } from 'react-native-paper';
import Calendar from 'react-native-big-calendar';

const NUM_ITEMS = 10;
function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

// const backgroundColor = getColor(index);

const TimelineScreen = () => {
  const navigation = useNavigation();
  // const [events, setEvents] = useState([
  //   {
  //     start: '2022-10-14 00:00:00',
  //     end: '2022-10-14 02:00:00',
  //     title: 'New Year Party',
  //     summary: 'xyz Location'
  //   },
  //   {
  //     start: '2022-10-14 00:00:00',
  //     end: '2022-10-14 02:00:00',
  //     title: 'New Year Wishes',
  //     summary: 'Call to every one'
  //   },
  //   {
  //     start: '2022-10-14 00:00:00',
  //     end: '2022-10-14 02:00:00',
  //     title: 'New Year Wishes',
  //     summary: 'Call to every one'
  //   }
  // ]);

  const events = [
    {
      title: 'Meeting',
      start: new Date(2022, 10, 28, 11, 0),
      end: new Date(2022, 10, 28, 11, 30)
    },
    {
      title: 'Coffee break',
      start: new Date(2022, 10, 28, 15, 45),
      end: new Date(2020, 10, 28, 16, 30)
    }
  ];

  const eventClicked = (event) => {
    //On Click of event showing alert from here
    alert(JSON.stringify(event));
  };

  const renderEvent = (event) => {
    return (
      <TouchableOpacity style={{ width: 1000 }}>
        <Text>{`My custom event: ${event.title} `}</Text>
      </TouchableOpacity>
    );
  };

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
          onPress={() => navigation.navigate('Committee')}
        >
          <Text style={styles.txtUsers}>Users</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>Selected 7 users</Text>
            <Icon
              name={IconName.Arrow_Right}
              height={SIZES[12]}
              width={SIZES[6]}
            />
          </View>
        </TouchableOpacity>
        <Divider style={styles.divider} />
        {/* <EventCalendar
          eventTapped={eventClicked}
          // Function on event press
          events={events}
          // Passing the Array of event
          width={400}
          // Container width
          size={60}
          // number of date will render before and after initDate
          // (default is 30 will render 30 day before initDate
          // and 29 day after initDate)
          initDate={
            '2022-10-14'
            //   `${new Date().getFullYear()}-${
            //   new Date().getMonth() < 10
            //     ? '0' + new Date().getMonth()
            //     : new Date().getMonth()
            // }-${
            //   new Date().getDate() < 10
            //     ? '0' + new Date().getDate()
            //     : new Date().getDate()
            //   }`
          }
          // Show initial date (default is today)
          scrollToFirst
          // Scroll to first event of the day (default true)
          renderEvent={(event) => (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ backgroundColor: getColor(event.index) }}>
                {event.title}
              </Text>
            </View>
          )}
        /> */}
        <Calendar
          events={events}
          height={600}
          mode="week"
          swipeEnabled={true}
          // hourRowHeight={300}
          showAllDayEventCell={true}
          renderEvent={(event) => renderEvent(event)}
          ampm={true}
        />
        {/* <Calendar
          // The list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key has to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={{
            '2012-05-16': [{ name: 'item 1 - any js object' }],
            '2012-05-23': [{ name: 'item 2 - any js object', height: 80 }],
            '2012-05-24': [],
            '2012-05-25': [
              { name: 'item 3 - any js object' },
              { name: 'any js object' }
            ]
          }}
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
          selected={'2012-05-16'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2012-05-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2012-05-30'}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          scrollEnabled={true}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {
            return (
              <View>
                <Text>{item.name}</Text>
              </View>
            );
          }}
          // Specify how each date should be rendered. day can be undefined if the item is not first in that day
          renderDay={(day, item) => {
            return <View />;
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
          renderList={(listProps) => {
            return <View />;
          }}
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
          showClosingKnob={false}
          // By default, agenda dates are marked if they have at least one item, but you can override this if needed
          markedDates={{
            '2012-05-16': { selected: true, marked: true },
            '2012-05-17': { marked: true },
            '2012-05-18': { disabled: true }
          }}
          // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
          disabledByDefault={true}
          // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
          onRefresh={() => console.log('refreshing...')}
          // Set this true while waiting for new data from a refresh
          refreshing={false}
          // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
          refreshControl={null}
          // Agenda theme
          theme={{
            agendaDayTextColor: 'yellow',
            agendaDayNumColor: 'green',
            agendaTodayColor: 'red',
            agendaKnobColor: 'blue'
          }}
          // Agenda container style
          // style={{ flex: 1 }}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default TimelineScreen;
