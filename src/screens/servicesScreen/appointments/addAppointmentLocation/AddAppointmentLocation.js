import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';

const AddAppointmentLocation = () => {
  const navigation = useNavigation();
  const [openLocation, setOpenLocation] = useState(false);
  const [valueLocation, setValueLocation] = useState(null);
  const [openVideoConference, setOpenVideoConference] = useState(false);
  const [valueVideoConference, setValueVideoConference] = useState(null);
  const [items, setItems] = useState([
    { label: 'Office 2', value: 'Office 2' }
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add appointment'}
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
          <Text style={styles.txtProgress}>Step 4/4</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Location</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.txtTitle}>LOCATION</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openLocation}
            value={valueLocation}
            items={
              items
              //               category.map((item) => ({
              // label: item.categoryTitle,
              // value: item.id
              //               }))
            }
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            setOpen={() => {
              setOpenLocation(!openLocation);
            }}
            setValue={setValueLocation}
            setItems={setItems}
            placeholder={'Location'}
            placeholderStyle={{
              ...Fonts.PoppinsRegular[12],
              color: Colors.secondary
            }}
            style={{
              borderWidth: 0,
              paddingRight: SIZES[16],
              paddingLeft: 0
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={'View details'}
            onPress={() => navigation.navigate('LocationDetails')}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add location'}
            onPress={() => navigation.navigate('AddLocation')}
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.cancelBtnLayout
            ]}
            textStyle={styles.txtCancelButton}
          />
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.txtTitle}>VIDEO CONFERENCING PLATFORM</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openVideoConference}
            value={valueVideoConference}
            items={
              items
              //               category.map((item) => ({
              // label: item.categoryTitle,
              // value: item.id
              //               }))
            }
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            setOpen={() => {
              setOpenVideoConference(!openVideoConference);
            }}
            setValue={setValueVideoConference}
            setItems={setItems}
            placeholder={'Video conference'}
            placeholderStyle={{
              ...Fonts.PoppinsRegular[12],
              color: Colors.secondary
            }}
            style={{
              borderWidth: 0,
              paddingRight: SIZES[16],
              paddingLeft: 0
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
          <Divider style={styles.divider} />
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
            title={'Save'}
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

export default AddAppointmentLocation;
