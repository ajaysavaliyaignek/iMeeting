import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';

import { Icon, IconName } from '../../../component';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { GET_SUBJECT_BY_ID } from '../../../graphql/query';
import SubjectListComponent from '../../../component/detailsComponent/subjectsListComponent/SubjectListComponent';

const Livemeetingsubjects = ({ item }) => {
  // console.log('item from LM Subjects', item);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = selectedSubjects.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setFilterData(newData);
    } else {
      setSearchText(text);
      setFilterData(selectedSubjects);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('startHandler', e);
  };

  const onSpeechEndHandler = (e) => {
    console.log('onSpeechEndHandler', e);
  };

  const onSpeechResultsHandler = (e) => {
    console.log('onSpeechResultsHandler', e);
    let text = e.value[0];
    setSearchText(text);
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('voice error', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      activeOpacity={1}
    >
      <View style={styles.searchContainer}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          style={styles.textInput}
          placeholder={'Search subjects'}
          onChangeText={(text) => searchFilterSubject(text)}
        />
        <TouchableOpacity onPress={() => startRecording()}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      <Button
        title={'Add subject'}
        onPress={() => navigation.navigate('AddSubject', { committee: null })}
        layoutStyle={styles.cancelBtnLayout}
        textStyle={styles.txtCancelButton}
      />
      <Divider style={styles.divider} />
      <SubjectListComponent
        committeeIds={''}
        meetingId={item.meetingId}
        searchText={searchText}
        isSubjectStatus={false}
        editable={false}
        searchFilterSubject={searchFilterSubject}
        setSearchText={setSearchText}
      />
    </TouchableOpacity>
  );
};

export default Livemeetingsubjects;
