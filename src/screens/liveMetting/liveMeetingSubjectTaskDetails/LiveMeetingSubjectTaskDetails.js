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
import { GET_ALL_TASKS, GET_TASK_TYPES } from '../../../graphql/query';
import { useLazyQuery, useQuery } from '@apollo/client';
import TasksDetailsCard from '../../../component/Cards/tasksDetailsCard/TasksDetailsCard';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import { useNavigation } from '@react-navigation/native';

const LiveMeetingSubjectTaskDetails = ({ meetingData, item: subjectData }) => {
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
            meetingId: meetingData?.meetingId,
            subjectId: subjectData?.subjectId,
            taskTypeIds: filterTaskType[0]?.id?.toString()
          }
        });

        console.log('filterTaskType', filterTaskType);
        // setTaskTypes(data.taskType.items);
      }
    },
    onError: (data) => {
      console.log('get task type error', data);
    }
  });

  const [TasksData, { Tasks }] = useLazyQuery(GET_ALL_TASKS, {
    fetchPolicy: 'cache-and-network',

    onCompleted: (data) => {
      console.log('TasksData', data?.tasks.items);
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
                isSubjectTask={true}
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
            {Tasks?.error?.message}
          </Text>
        </View>
      ) : Tasks?.loading ? (
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
