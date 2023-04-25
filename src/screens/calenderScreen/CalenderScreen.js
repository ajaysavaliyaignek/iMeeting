import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { Icon, IconName } from '../../component';
import { SIZES } from '../../themes/Sizes';
import { Button } from '../../component/button/Button';
import { Colors } from '../../themes/Colors';
import CalendarMonthViewComponent from '../../component/calendarMonthViewComponent/CalendarMonthViewComponent';
import CalendarScheduleViewComponent from '../../component/calendarScheduleViewComponent/CalendarScheduleViewComponent';

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
        {/* <View style={styles.headeRightView}>
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
        </View> */}
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
        {activeTab == '0' && <CalendarScheduleViewComponent />}
        {activeTab == '1' && <CalendarMonthViewComponent />}
      </View>
    </SafeAreaView>
  );
};

export default CalenderScreen;
