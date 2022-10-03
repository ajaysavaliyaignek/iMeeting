import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';

const CommitteeScreen = () => {
  const navigation = useNavigation();
  const ref = useRef();
  const [isChecked, setChecked] = useState(false);

  //   {
  //     committeeReportName: "English Learner Stackholder",
  //     committeeCode: "00001",
  //     committeeType: "2",
  //     committeeId: 1,
  //     committeeName: "English Learner Stackholder",
  //   },
  //   {
  //     committeeReportName: "Special Education Advisory Panel (S...",
  //     committeeCode: "00001",
  //     committeeType: "2",
  //     committeeId: 1,
  //     committeeName: "Special Education Advisory Panel (S...",
  //     childs: [
  //       {
  //         committeeReportName: "English Learner Stackholder",
  //         committeeCode: "00001",
  //         committeeType: "2",
  //         committeeId: 1,
  //         committeeName: "English Learner Stackholder",
  //         childs: [
  //           {
  //             committeeReportName: "English Learner Stackholder",
  //             committeeCode: "00001",
  //             committeeType: "2",
  //             committeeId: 1,
  //             committeeName: "English Learner Stackholder",
  //           },
  //           {
  //             committeeReportName: "English Learner Stackholder",
  //             committeeCode: "00001",
  //             committeeType: "2",
  //             committeeId: 1,
  //             committeeName: "English Learner Stackholder",
  //           },
  //         ],
  //       },
  //       {
  //         committeeReportName: "English Learner Stackholder",
  //         committeeCode: "00001",
  //         committeeType: "2",
  //         committeeId: 1,
  //         committeeName: "English Learner Stackholder",
  //       },
  //     ],
  //   },
  //   {
  //     committeeReportName: "English Learner Stakeholder Input Gr...",
  //     committeeCode: "00001",
  //     committeeType: "2",
  //     committeeId: 1,
  //     committeeName: "English Learner Stakeholder Input Gr...",
  //     childs: [],
  //   },
  //   {
  //     committeeReportName: "Objectives & Targets",
  //     committeeCode: "00001",
  //     committeeType: "2",
  //     committeeId: 1,
  //     committeeName: "Objectives & Targets",
  //     childs: [],
  //   },
  //   {
  //     committeeReportName: "Assess Role of Category.",
  //     committeeCode: "00001",
  //     committeeType: "2",
  //     committeeId: 1,
  //     committeeName: "Assess Role of Category.",
  //     childs: [],
  //   },
  //   {
  //     committeeReportName: "Nonpublic Education Council",
  //     committeeCode: "00001",
  //     committeeType: "2",
  //     committeeId: 1,
  //     committeeName: "Nonpublic Education Council",
  //     childs: [],
  //   },
  // ];

  // useEffect(() => {
  //   if (ref && ref.current) {
  //     ref.current.setSelectedItem([
  //       {
  //         committeeReportName: "English Learner Stackholder",
  //         committeeCode: "00001",
  //         committeeType: "2",
  //         committeeId: 1,
  //         committeeName: "English Learner Stackholder",
  //       },
  //       {
  //         committeeReportName: "Name 2",
  //         committeeCode: "00002",
  //         committeeType: "3",
  //         committeeId: 2,
  //         committeeName: "Name 2",
  //       },
  //     ]);
  //   }
  // }, [ref]);

  const rowData = ({ title }) => {
    return (
      <View style={styles.rowDataContainer}>
        <Checkbox
          color={Colors.primary}
          value={isChecked}
          onValueChange={setChecked}
        />
        <Text style={styles.txtCheckboxTitle}>{title}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        name={'Committees'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text
          style={{
            ...Fonts.PoppinsBold[24],
            color: Colors.bold,
            marginTop: SIZES[16]
          }}
        >
          Committees
        </Text>

        {rowData({ title: 'Advisory Committee on Financial Management' })}
        {rowData({ title: 'Assessment Accommodations Review Panel' })}
        {rowData({ title: 'English Learner Stakeholder Input Group (ELSIG)' })}
        {rowData({ title: 'Indigenous Education Action Team' })}
        {rowData({ title: 'Local Assessment Advisory Committee (LAAC)' })}
        {rowData({ title: 'Nonpublic Education Council' })}
        {rowData({ title: 'Special Education Advisory Panel (SEAP)' })}
      </View>
    </SafeAreaView>
  );
};

export default CommitteeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: SIZES[16],
    height: '100%'
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: SIZES[8]
  },
  name: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  rowDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[24]
  },
  txtCheckboxTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16],
    marginRight: SIZES[16]
  }
});
