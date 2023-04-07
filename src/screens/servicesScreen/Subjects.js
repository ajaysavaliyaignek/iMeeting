import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import Header from '../../component/header/Header';
import { Icon, IconName } from '../../component';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import SubjectCard from '../../component/Cards/subjectCard/SubjectCard';
import { Button } from '../../component/button/Button';
import { GET_All_SUBJECTS, GET_SUBJECT_BY_ID } from '../../graphql/query';
import moment from 'moment';
import SerachAndButtoncomponent from '../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const Subjects = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingData, deadlinedDate } = route?.params;
  const [searchText, setSearchText] = useState('');
  const [subject, setSubject] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [valueIndex, setValueIndex] = useState(-1);

  // let subjects = [];
  let queryParams = [];

  if (meetingData?.yourRoleName == 'Member') {
    queryParams = {
      committeeIds: '',
      searchValue: searchText,
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: meetingData?.meetingId,
      isDraft: true
    };
  } else {
    queryParams = {
      committeeIds: '',
      searchValue: searchText,
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: meetingData?.meetingId,
      isDraft: false
    };
  }

  // get ALL SUBJECTS
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      committeeIds: '',
      searchValue: searchText,
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: meetingData?.meetingId,
      isDraft: false
    },

    onCompleted: (data) => {
      setSubject(data?.subjects.items);
      setFilterData(data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

  const searchFilterUsers = (text) => {
    if (text) {
      const newData = filterData?.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setSubject(newData);
    } else {
      setSearchText(text);
      setSubject(filterData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => setValueIndex(-1)}
      >
        <Header
          name={'Subjects'}
          leftIconName={IconName.Arrow_Left}
          onLeftPress={() => navigation.goBack()}
        />
        <View style={styles.subContainer}>
          <SerachAndButtoncomponent
            isButtonShow={false}
            value={searchText}
            onChangeText={setSearchText}
            role={'Member'}
            containerStyle={{ marginHorizontal: 0 }}
          />

          <View style={styles.deadlineContainer}>
            <Text style={styles.txtDeadlineTitle}>
              RECIEVING SUBJECTS DEADLINE
            </Text>

            <TouchableOpacity
              style={styles.chooseDateContainer}
              onPress={() => navigation.navigate('DeadlineSuggestion')}
              disabled={true}
            >
              <View
                style={{
                  borderBottomWidth: SIZES[1],
                  borderBottomColor: Colors.primary,
                  marginRight: SIZES[14]
                }}
              >
                <Text style={styles.txtChooseDate}>
                  {meetingData?.deadlineDate}
                </Text>
              </View>

              <Icon
                name={IconName.Calendar_Focused}
                height={SIZES[20]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
          </View>
          {meetingData?.yourRoleName == 'Member' &&
            moment(meetingData?.deadlineDate).isSameOrAfter(
              moment(new Date()).format('YYYY-MM-DD')
            ) &&
            meetingData.subjectSuggestion && (
              <Button
                title="Add draft subject"
                layoutStyle={styles.cancelBtnLayout}
                textStyle={styles.txtCancelButton}
                onPress={() =>
                  navigation.navigate('AddDraftSubject', {
                    meetingId: meetingData?.meetingId
                  })
                }
              />
            )}
          <Divider style={styles.divider} />
          <FlatList
            data={subject}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item, index }) => (
              <SubjectCard
                item={item}
                index={index}
                searchText={searchText}
                role={meetingData?.yourRoleName}
                valueIndex={valueIndex}
                setValueIndex={setValueIndex}
                showdots={false}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Subjects;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    paddingHorizontal: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[22]
    // height: SIZES[36]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6]
  },
  divider: {
    width: '100%',
    color: Colors.line,
    height: 1
  },
  txtDeadlineTitle: {
    width: '60%',
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtChooseDate: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  chooseDateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SIZES[24]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginBottom: SIZES[46]
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  }
});
