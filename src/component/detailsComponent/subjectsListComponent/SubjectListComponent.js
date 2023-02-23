import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client';

import Loader from '../../Loader/Loader';
import SubjectsCard from '../../Cards/subjectCard/SubjectsCard';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { GET_All_SUBJECTS, GET_USER_PAYLOAD } from '../../../graphql/query';

const SubjectListComponent = ({
  meetingId,
  committeeIds,
  searchText,
  download,
  deleted,
  isSubjectStatus,
  editable,
  onPressView,
  socketEventUpdateMessage,
  isDecisionSubject,
  onPressEdit,
  meetingData,
  setSearchText,
  isLiveMeetingSubject,
  isApproveMeetingSubject
}) => {
  const [filterData, setFilterData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [userData, setUserData] = useState([]);
  const [Subjects, setSubjectData] = useState([]);
  const [user, setUser] = useState(null);
  const client = useApolloClient();
  const AllTypesSubjects = 0;
  let queryParams = {};

  // page: $page;
  // pageSize: $pageSize;
  // searchValue: $searchValue;
  // sort: $sort;
  // committeeIds: $committeeIds;
  // isDraft: $isDraft;
  // screen: $screen;
  // meetingId: $meetingId;
  if (meetingId == null) {
    queryParams = {
      committeeIds: committeeIds,
      searchValue: searchText,
      screen: AllTypesSubjects,
      page: -1,
      pageSize: -1,
      meetingId: 0,
      isDraft: false,
      sort: ''
    };
  } else {
    queryParams = {
      committeeIds: committeeIds,
      searchValue: searchText,
      screen: 2,
      page: -1,
      pageSize: -1,
      meetingId: meetingId,
      isDraft: false,
      sort: ''
    };
  }

  // filter subjects
  const searchFilterSubject = (text) => {
    if (text) {
      const newData = Subjects.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setFilterData(newData);
    } else {
      setSearchText(text);
      setFilterData(Subjects);
    }
  };

  useEffect(() => {
    searchFilterSubject(searchText);
  }, [Subjects]);

  // get ALL SUBJECTS

  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: queryParams,

    onCompleted: (data) => {
      setFilterData(data?.subjects.items);

      setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('subjects error---', data.message);
    }
  });

  // use effect for when socket is update subject
  useEffect(() => {
    if (socketEventUpdateMessage == 'subjects') {
      client.refetchQueries({
        include: ['subjects']
      });
    }
  }, [socketEventUpdateMessage]);

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      // onPress={() => setEditModal(false)}
    >
      {SubjectsLoading ? (
        <Loader color={Colors.primary} />
      ) : SubjectsError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            {SubjectsError.message == 'Network request failed'
              ? 'No Internet connection'
              : SubjectsError.message}
          </Text>
        </View>
      ) : filterData.length > 0 ? (
        <FlatList
          data={filterData}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => (
            <SubjectsCard
              item={item}
              index={index}
              searchText={searchText}
              visibleIndex={visibleIndex}
              setVisibleIndex={setVisibleIndex}
              isSubjectStatus={isSubjectStatus}
              download={download}
              deleted={deleted}
              editable={editable}
              userData={userData}
              onPressView={onPressView}
              isDecisionSubject={isDecisionSubject}
              onPressEdit={onPressEdit}
              meetingData={meetingData}
              isLiveMeetingSubject={isLiveMeetingSubject}
              isApproveMeetingSubject={isApproveMeetingSubject}
            />
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            No subjects found
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectListComponent;
