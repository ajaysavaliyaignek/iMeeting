import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';

const AddMeetingSubjects = () => {
  const navigation = useNavigation();
  const [calendarValue, setCalendarValue] = useState('5-11 September');
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={1}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 5/5</Text>
        </View>
        <Text style={styles.txtAddSubjectTitle}>Subjects</Text>

        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput style={styles.textInput} placeholder={'Search'} />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.deadlineContainer}>
          <Text style={styles.txtTitle}>DEADLINE SUGGESTING</Text>
          <TouchableOpacity style={styles.deadlineRowContainer}>
            <TextInput value={calendarValue} editable={false} />
            <Icon name={IconName.Calendar} />
          </TouchableOpacity>

          <Divider style={styles.divider} />
          <Button
            title={'Select subjects'}
            layoutStyle={styles.selectsubjectBtnLayouts}
            textStyle={styles.txtCancelButton}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View
          style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
        >
          <Button
            title={'Back'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Next'}
            onPress={() => navigation.navigate('AddMeetingSubjects')}
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMeetingSubjects;
