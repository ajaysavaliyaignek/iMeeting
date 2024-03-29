import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
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
import SerachAndButtoncomponent from '../../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const SelectSubjects = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    meetingName,
    committee,
    onUpdateSelection,
    previosSubjects,
    meetingId
  } = route?.params;
  const [searchText, setSearchText] = useState('');
  const [subjectData, setSubjectData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [checked, setChecked] = useState(false);
  const { selectedSubjects, setSelectedSubjects } = useContext(UserContext);
  var subjects = [];
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      searchValue: searchText,
      screen: 1,
      committeeIds: `${committee}`
    },

    onCompleted: (data) => {
      console.log({ data: data?.subjects.items });
      subjects = data?.subjects.items.map((item, index) => {
        let previousUserIndex = previosSubjects?.findIndex(
          (user) => user.subjectId === item.subjectId
        );
        let isSelected = false;

        if (previousUserIndex >= 0) {
          isSelected = true;
        }
        return { ...item, isSelected };
      });
      if (subjects) {
        setSubjectData(subjects);
      }
      // setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('subjects error---', data);
    }
  });
  const setOnSubjectClick = (item) => {
    subjectData.map((subject) => {
      if (subject.subjectId === item.subjectId) {
        subject.isSelected = !subject.isSelected;
      }
    });
    setSubjectData([...subjectData]);
  };

  const setSelectedUserInSelectedList = () => {
    const selectedUserList = [];
    subjectData.map((subject) => {
      if (subject.isSelected) {
        selectedUserList.push(subject);
      }
    });

    onUpdateSelection(selectedUserList);

    navigation.goBack();
  };

  useEffect(() => {
    const filterUser = subjectData.filter((user) => user.isSelected == true);
    setSelectedSubjects(filterUser);
  }, [checked]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Select subject'}
        rightIconName={IconName.Add}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() =>
          navigation.navigate('AddSubject', {
            committee: committee,
            isEdit: false,
            subjectDetails: null,
            screenName: 'Add subject',
            meetingName: meetingName,
            meetingId: null
          })
        }
      />

      <View style={styles.subContainer}>
        <SerachAndButtoncomponent
          isButtonShow={false}
          role={'Member'}
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />

        {SubjectsLoading ? (
          <Loader color={Colors.primary} size={'large'} />
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
                onCheked={setOnSubjectClick}
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
            onPress={() => {
              setSelectedUserInSelectedList();
            }}
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
