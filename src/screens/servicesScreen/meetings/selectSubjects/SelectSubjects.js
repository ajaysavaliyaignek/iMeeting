import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { useQuery } from '@apollo/client';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import SelectSubjectCard from '../../../../component/Cards/selectSubjectcard/SelectSubjectCard';
import { Button } from '../../../../component/button/Button';
import { Colors } from '../../../../themes/Colors';
import { GET_All_SUBJECTS } from '../../../../graphql/query';
import Loader from '../../../../component/Loader/Loader';
import { UserContext } from '../../../../context';

const SelectSubjects = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { committee } = route?.params;
  console.log('committee from select subjects', committee);
  const [searchText, setSearchText] = useState('');
  const [subjectData, setSubjectData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [checked, setChecked] = useState(false);
  const { selectedSubjects, setSelectedSubjects } = useContext(UserContext);
  console.log('selectedSubjects', selectedSubject);
  var subjects = [];

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

  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      searchValue: searchText,
      screen: 1,
      committeeId: committee
    },

    onCompleted: (data) => {
      console.log(data?.subjects.items, 'get all subjects');
      subjects = data?.subjects.items.map((item, index) => {
        let isSelected = checked;
        return { ...item, isSelected };
      });
      if (subjects) {
        setSubjectData(subjects);
      }
      // setSubjectData(data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

  useEffect(() => {
    const filterUser = subjectData.filter((user) => user.isSelected == true);
    console.log('filterUser', filterUser);
    setSelectedSubjects(filterUser);
  }, [checked]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Select subject'}
        rightIconName={IconName.Add}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('AddSubject', { committee })}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity onPress={() => startRecording()}>
            <Icon
              name={IconName.Speaker}
              height={SIZES[15]}
              width={SIZES[10]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.committeeView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Role')}
        >
          <Text style={styles.txtCommittee}>Role</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>All</Text>
            <Icon
              name={IconName.Arrow_Right}
              height={SIZES[12]}
              width={SIZES[6]}
            />
          </View>
        </TouchableOpacity>
        <Divider style={styles.divider} />
        {SubjectsLoading ? (
          <Loader />
        ) : SubjectsError ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>{SubjectsError.message}</Text>
          </View>
        ) : subjectData.length > 0 ? (
          <FlatList
            data={subjectData}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item, index }) => (
              <SelectSubjectCard
                item={item}
                index={index}
                searchText={searchText}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubject}
                visibleIndex={visibleIndex}
                setVisibleIndex={setVisibleIndex}
                subjectData={subjectData}
                setChecked={setChecked}
                checked={checked}
                key={item.userId}
              />
            )}
          />
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>No subjects found</Text>
          </View>
        )}
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
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add subjects'}
            onPress={() => navigation.goBack()}
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

export default SelectSubjects;
