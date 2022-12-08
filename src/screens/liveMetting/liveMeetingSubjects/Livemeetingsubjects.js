import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';

import { Icon, IconName } from '../../../component';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { subjectData } from '../../../Constans/data';
import SubjectsCard from '../../../component/Cards/subjectCard/SubjectsCard';
import { GET_SUBJECT_BY_ID } from '../../../graphql/query';
import Loader from '../../../component/Loader/Loader';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';

const Livemeetingsubjects = ({ item, meeting }) => {
  console.log('item from LM Subjects', item);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);

  meeting?.subjectIds?.map((id) => {
    console.log('id', id);
    const { loading: getSubjectLoading, error: getSubjectError } = useQuery(
      GET_SUBJECT_BY_ID,
      {
        variables: {
          subjectId: id
        },
        onCompleted: (data) => {
          console.log('get subject by id', data.subject);
          if (data) {
            setSubjects((prev) => {
              const pevDaa = prev.filter((ite) => {
                return ite.subjectId !== data.subjectId;
              });
              return [...pevDaa, data.subject];
            });
            setSubjectsLoading(false);
          }
        }
      }
    );
    if (getSubjectError) {
      console.log('file error', getSubjectError);
    }
    if (getSubjectLoading) {
      setSubjectsLoading(true);
    }
  });

  const searchFilterSubject = (text) => {
    // if (text) {
    //   const newData = selectedSubjects.filter((item) => {
    //     const itemData = item.subjectTitle ? item.subjectTitle : '';
    //     const textData = text;
    //     return itemData.indexOf(textData) > -1;
    //   });
    //   setSearchText(text);
    //   setFilterData(newData);
    // } else {
    //   setSearchText(text);
    //   setFilterData(selectedSubjects);
    // }
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

      {subjectsLoading ? (
        <Loader />
      ) : subjects.length > 0 ? (
        <FlatList
          data={subjects}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => {
            return (
              <SubjectsCard
                item={item}
                index={index}
                searchText={searchText}
                visibleIndex={visibleIndex}
                setVisibleIndex={setVisibleIndex}
                subjectStatus={item.statusTitle}
              />
            );
          }}
        />
      ) : subjects.length == 0 ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            No subjects
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default Livemeetingsubjects;
