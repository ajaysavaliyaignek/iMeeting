import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { subjectData } from '../../../../Constans/data';
import SelectSubjectCard from '../../../../component/Cards/selectSubjectcard/SelectSubjectCard';
import { Button } from '../../../../component/button/Button';
import { Colors } from '../../../../themes/Colors';
import { useQuery } from '@apollo/client';
import { GET_All_SUBJECTS } from '../../../../graphql/query';

const SelectSubjects = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [subjectData, setSubjectData] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  console.log('selectedSubjects', selectedSubjects);

  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      searchValue: searchText,
      screen: 1
    },

    onCompleted: (data) => {
      // setFilterData(data?.subjects.items);
      console.log(data.subjects.items, 'commiitee by id');
      setSubjectData(data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }
  useEffect(() => {
    // const newData = subjectData?.map((subject) => {
    //   if (subject.subjectId !== selectedSubjects?.subjectId) {
    //     return [...subject, selectedSubjects];
    //   }
    // });
    // console.log(newData);
  }, [selectedSubjects]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Select subject'}
        rightIconName={IconName.Add}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('AddSubject')}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity>
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
        <FlatList
          data={subjectData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <SelectSubjectCard
              item={item}
              index={index}
              searchText={searchText}
              selectedSubjects={selectedSubjects}
              setSelectedSubjects={setSelectedSubjects}
            />
          )}
        />
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
