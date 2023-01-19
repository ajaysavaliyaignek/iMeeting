import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from '../DropDownPicker/DropDownPicker';
import { styles } from './styles';
import { GET_All_SUBJECTS } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import { SIZES } from '../../themes/Sizes';

const MeetingSubjectTypeComponent = ({
  valueType,
  setValueType,
  subjectData,
  valueSubject,
  setValueSubject,
  meetingDetails
}) => {
  const [subjects, setSubjects] = useState([]);
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      committeeIds: '',
      searchValue: '',
      screen: 2,
      page: -1,
      pageSize: -1,
      meetingId: meetingDetails?.meetingId
    },

    onCompleted: (data) => {
      setSubjects(data?.subjects.items);

      // setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('subjects error---', data.message);
    }
  });
  return (
    <View>
      <DropDownPicker
        data={[
          { label: 'Meeting', value: 'Meeting' },
          { label: 'Subject', value: 'Subject' }
        ]}
        title={'TYPE'}
        value={valueType}
        setData={setValueType}
        placeholder={''}
      />
      {valueType == 'Subject' && (
        <DropDownPicker
          data={subjects?.map((item) => ({
            label: item.subjectTitle,
            value: item.subjectId
          }))}
          title={'SUBJECT'}
          value={valueSubject}
          setData={setValueSubject}
          placeholder={''}
          styleContainer={{ marginTop: SIZES[24] }}
        />
      )}
    </View>
  );
};

export default MeetingSubjectTypeComponent;
