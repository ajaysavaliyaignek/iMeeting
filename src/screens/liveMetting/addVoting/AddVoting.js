import { View, Text, SafeAreaView, TextInput, Switch } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import Header from '../../../component/header/Header';
import { IconName } from '../../../component';
import { styles } from './styles';
import MeetingSubjectTypeComponent from '../../../component/meetingSubjectTypesComponent/MeetingSubjectTypeComponent';
import { Button } from '../../../component/button/Button';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';

const AddVoting = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingDetails, isAddVotingScreen } = route?.params;
  const [valueType, setValueType] = useState(null);
  const [valueSubject, setValueSubject] = useState(null);
  const [switchPrivate, setSwitchPrivate] = useState(false);
  const [switchMultiple, setSwitchMultiple] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={isAddVotingScreen ? 'Add voting' : 'Edit voting'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtTitleAddVoting}>
          {isAddVotingScreen ? 'Add voting' : 'Edit voting'}
        </Text>
        <MeetingSubjectTypeComponent
          valueType={valueType}
          setValueType={setValueType}
          valueSubject={valueSubject}
          setValueSubject={setValueSubject}
          meetingDetails={meetingDetails}
        />
        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>TITLE VOTING</Text>
          <TextInput style={styles.textInput} />
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>ANSWER</Text>
          <TextInput style={styles.textInput} />
        </View>
        <Button
          title={'Add answer'}
          layoutStyle={styles.cancelBtnLayout}
          textStyle={styles.txtCancelButton}
        />
        <Divider style={styles.divider} />
        <View
          style={[
            styles.rowContainer,
            {
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              paddingVertical: SIZES[8]
            }
          ]}
        >
          <Text style={styles.txtLabel}>Private</Text>
          <Switch
            value={switchPrivate}
            onValueChange={() => {
              setSwitchPrivate(!switchPrivate);
            }}
            color={Colors.switch}
          />
        </View>
        <View
          style={[
            styles.rowContainer,
            {
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              paddingVertical: SIZES[8],
              marginBottom: SIZES[16]
            }
          ]}
        >
          <Text style={styles.txtLabel}>Select multiple</Text>
          <Switch
            value={switchMultiple}
            onValueChange={() => {
              setSwitchMultiple(!switchMultiple);
            }}
            color={Colors.switch}
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
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={() => {
              navigation.goBack();
            }}
            layoutStyle={[
              styles.cancelBtnLayout,
              { marginVertical: SIZES[12], width: '48%' }
            ]}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {}}
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

export default AddVoting;
