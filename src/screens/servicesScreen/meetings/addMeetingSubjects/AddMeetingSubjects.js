import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import Voice from '@react-native-community/voice';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { subjectData } from '../../../../Constans/data';
import AddSubjectsCard from './AddSubjectsCard';

const AddMeetingSubjects = () => {
  const navigation = useNavigation();
  const [calendarValue, setCalendarValue] = useState('5-11 September');
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(subjectData);
  const [subjectDatas, setSubjectDatas] = useState(subjectData);

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = subjectData.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });

      setSearchText(text);
      setFilterData(newData);
    } else {
      setSearchText(text);
      setFilterData(subjectData);
    }
  };

  //   useEffect(() => {
  //     function onSpeechStart(e) {
  //       console.log('onSpeechStart: ', e);
  //     }
  //     function onSpeechResults(e) {
  //       console.log('onSpeechResults: ', e);
  //     }
  //     function onSpeechPartialResults(e) {
  //       console.log('onSpeechPartialResults: ', e);
  //     }
  //     function onSpeechVolumeChanged(e) {
  //       console.log('onSpeechVolumeChanged: ', e);
  //     }
  //     function onSpeechError(e) {
  //       console.log('onSpeechError: ', e);
  //     }
  //     function onSpeechEnd(e) {
  //       console.log('onSpeechEnd: ', e);
  //     }
  //     Voice.onSpeechStart = onSpeechStart;
  //     Voice.onSpeechEnd = onSpeechEnd;
  //     Voice.onSpeechError = onSpeechError;
  //     Voice.onSpeechResults = onSpeechResults;
  //     Voice.onSpeechPartialResults = onSpeechPartialResults;
  //     Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
  //     return () => {
  //       Voice.destroy().then(Voice.removeAllListeners);
  //     };
  //   }, []);

  //   _startRecognizing = async () => {
  //     try {
  //       await Voice.start('en-US');
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   _stopRecognizing = async () => {
  //     //Stops listening for speech
  //     try {
  //       await Voice.stop();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   _cancelRecognizing = async () => {
  //     //Cancels the speech recognition
  //     try {
  //       await Voice.cancel();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //     error(e);
  //   };

  //   _destroyRecognizer = async () => {
  //     //Destroys the current SpeechRecognizer instance
  //     try {
  //       await Voice.destroy();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

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
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => searchFilterSubject(text)}
          />
          <TouchableOpacity>
            <Icon
              name={IconName.Speaker}
              height={SIZES[15]}
              width={SIZES[10]}
            />
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {filterData?.map((subject, index) => {
            return (
              <AddSubjectsCard
                item={subject}
                searchText={searchText}
                index={index}
              />
            );
          })}
          <View style={styles.deadlineContainer}>
            <Text style={styles.txtTitle}>DEADLINE SUGGESTING</Text>
            <TouchableOpacity
              style={styles.deadlineRowContainer}
              onPress={() => navigation.navigate('DeadlineSuggestion')}
            >
              <TextInput value={calendarValue} editable={false} />
              <Icon
                name={IconName.Calendar}
                width={SIZES[18]}
                height={SIZES[20]}
              />
            </TouchableOpacity>

            <Divider style={styles.divider} />
            <Button
              title={'Select subjects'}
              layoutStyle={styles.selectsubjectBtnLayout}
              textStyle={styles.txtCancelButton}
              onPress={() => navigation.navigate('SelectSubjects')}
            />
          </View>
        </ScrollView>
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
