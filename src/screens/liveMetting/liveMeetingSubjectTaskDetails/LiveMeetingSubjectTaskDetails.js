import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { Icon, IconName } from '../../../component';
import { SIZES } from '../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { GET_ALL_TASKS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import TasksDetailsCard from '../../../component/Cards/tasksDetailsCard/TasksDetailsCard';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';

const LiveMeetingSubjectTaskDetails = ({ meetingData, item: subjectData }) => {
  const [searchText, setSearchText] = useState('');
  const [tasksData, setTasksData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);

  const Tasks = useQuery(GET_ALL_TASKS, {
    variables: {
      searchValue: searchText,
      onlyMyTask: false,
      meetingId: meetingData?.meetingId,
      subjectId: subjectData?.subjectId
    },

    onCompleted: (data) => {
      console.log('tasks of subject', data.tasks);
      setTasksData(data?.tasks.items);
    },
    onError: (data) => {
      console.log('all tasks error', data);
    }
  });
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          style={styles.textInput}
          placeholder={'Search'}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={() => {}}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      <Divider style={styles.divider} />
      {tasksData.length > 0 ? (
        <FlatList
          data={tasksData}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => {
            return (
              <TasksDetailsCard
                item={item}
                index={index}
                visibleIndex={visibleIndex}
                setVisibleIndex={setVisibleIndex}
                text={searchText}
                editable={false}
                isDeleteable={false}
                isSubjectTask={true}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : Tasks.error ? (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          <Text style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}>
            {Tasks.error.message}
          </Text>
        </View>
      ) : Tasks.loading ? (
        <Loader color={Colors.primary} />
      ) : (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          <Text style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}>
            No tasks found
          </Text>
        </View>
      )}
    </View>
  );
};

export default LiveMeetingSubjectTaskDetails;
