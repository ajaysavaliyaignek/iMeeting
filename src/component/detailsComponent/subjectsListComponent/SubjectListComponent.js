import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

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
  editable
}) => {
  const [filterData, setFilterData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [userData, setUserData] = useState([]);
  const AllTypesSubjects = 0;
  let queryParams = {};

  if (meetingId == null) {
    console.log('isNull');
    queryParams = {
      committeeIds: committeeIds,
      searchValue: searchText,
      screen: AllTypesSubjects,
      page: -1,
      pageSize: -1
    };
  } else {
    console.log('isNotNull');
    console.log('searchtext', searchText);
    queryParams = {
      committeeIds: committeeIds,
      searchValue: searchText,
      screen: AllTypesSubjects,
      page: -1,
      pageSize: -1,
      meetingId: meetingId
    };
  }

  // get ALL SUBJECTS

  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: queryParams,

    onCompleted: (data) => {
      setFilterData(data?.subjects.items);

      // setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('subjects error---', data.message);
    }
  });

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      // onPress={() => setEditModal(false)}
    >
      {SubjectsLoading ? (
        <Loader />
      ) : SubjectsError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            {SubjectsError.message}
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
