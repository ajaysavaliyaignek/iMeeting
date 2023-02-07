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
import CalendarScheduleViewComponentNew from '../../component/calendarScheduleViewComponent/CalendarScheduleViewComponentNew';
import Header from '../../component/header/Header';

let CalanderDate = moment();
const CalenderScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('0');

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Calendar'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
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
