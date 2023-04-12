import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { Icon, IconName } from '../../../component';
import { SIZES } from '../../../themes/Sizes';
import { GET_ALL_TASKS, GET_TASK_TYPES } from '../../../graphql/query';
import TasksDetailsCard from '../../../component/Cards/tasksDetailsCard/TasksDetailsCard';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const LiveApproveMeetingSubjectTaskDetails = ({
  meetingData,
  item: subjectData
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tasksData, setTasksData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);

  const TaskType = useQuery(GET_TASK_TYPES, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data) {
        const filterTaskType = data.taskType.items?.filter((type) => {
          if (type.name == 'Meeting task') {
            return type;
          }
        });

        TasksData({
          variables: {
            searchValue: searchText,
            onlyMyTask: false,
            meetingId:
              meetingData !== null
                ? meetingData?.meetingId
                : subjectData.meetingId !== null
                ? subjectData.meetingId
                : 0,
            subjectId:
              subjectData.subjectId == undefined ? 0 : subjectData.subjectId,
            taskTypeIds: filterTaskType[0]?.id?.toString(),
            page: -1,
            pageSize: -1,
            sort: ''
          }
        });
      }
    },
    onError: (data) => {
      console.log('get task type error', data);
    }
  });

  const [TasksData, Tasks] = useLazyQuery(GET_ALL_TASKS, {
    fetchPolicy: 'cache-and-network',

    onCompleted: (data) => {
      console.log({ task: data?.tasks.items });
      setTasksData(data?.tasks.items);
    },
    onError: (data) => {
      console.log('all tasks error', data);
    }
  });
  return (
    <View style={{ flex: 1 }}>
      <SerachAndButtoncomponent
        isButtonShow={false}
        role={'Member'}
        onChangeText={setSearchText}
        value={searchText}
      />

      {tasksData?.length > 0 ? (
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
                isSubjectTask={false}
                onPressView={() => {
                  navigation.navigate('TaskDetails', { item });
                  setVisibleIndex(-1);
                }}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : Tasks?.error ? (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          <Text style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}>
            {Tasks.error.message == 'Network request failed'
              ? 'No Internet connection'
              : Tasks.error.message}
          </Text>
        </View>
      ) : Tasks?.loading ? (
        <Loader color={Colors.primary} size={'large'} />
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

export default LiveApproveMeetingSubjectTaskDetails;
