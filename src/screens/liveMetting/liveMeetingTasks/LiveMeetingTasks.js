import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GET_ALL_TASKS, GET_TASK_TYPES } from '../../../graphql/query';
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery
} from '@apollo/client';
import { styles } from './styles';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../../component/Loader/Loader';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import TasksDetailsCard from '../../../component/Cards/tasksDetailsCard/TasksDetailsCard';
import { Divider } from 'react-native-paper';
import { DELETE_TASK } from '../../../graphql/mutation';

const LiveMeetingTasks = ({ item: meetingData, socketEventUpdateMessage }) => {
  const navigation = useNavigation();
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [tasksData, setTasksData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const client = useApolloClient();

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
            onlyMyTask: onlyMyTasks,
            meetingId: meetingData?.meetingId,
            subjectId: 0,
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

  // delete task function
  const [deleteTask, { data, loading, error }] = useMutation(DELETE_TASK, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_ALL_TASKS,
        variables: {
          searchValue: '',
          onlyMyTask: false,
          meetingId: meetingData?.meetingId
        }
      }
    ],
    onCompleted: (data) => {
      console.log('delete meeting', data.deleteTask.status);
    }
  });

  const onDeleteHandler = (item) => {
    Alert.alert('Delete task', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteTask({
            variables: {
              id: item?.taskId
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  useEffect(() => {
    console.log(
      'socketEventUpdateMessage from tasks',
      socketEventUpdateMessage
    );
    if (socketEventUpdateMessage == 'tasks') {
      client.refetchQueries({
        include: [GET_ALL_TASKS]
      });
    }
  }, [socketEventUpdateMessage]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
    >
      <SerachAndButtoncomponent
        buttonText={'Add task'}
        isButtonShow={meetingData?.yourRoleName != 'Member' ? true : false}
        role={meetingData?.yourRoleName}
        onPress={() =>
          navigation.navigate('AddTask', {
            meetingDetails: meetingData,
            isEdit: false,
            taskData: null,
            isMeetingTask: true
          })
        }
        onChangeText={(text) => setSearchText(text)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.txtSwitchLabel}>Only my tasks</Text>
        <Switch
          color={Colors.switch}
          value={onlyMyTasks}
          onChange={() => setOnlyMyTasks(!onlyMyTasks)}
        />
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
                onPressView={() => {
                  navigation.navigate('TaskDetails', { item });
                  setVisibleIndex(-1);
                }}
                editable={false}
                isDeleteable={false}
                onPressDelete={(item) => {
                  setVisibleIndex(-1);
                  onDeleteHandler(item);
                }}
                onPressEdit={(item) => {
                  setVisibleIndex(-1);

                  navigation.navigate('AddTask', {
                    meetingDetails: meetingData,
                    isEdit: true,
                    taskData: item,
                    isMeetingTask: true
                  });
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
          <Text
            style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}
          ></Text>
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
    </TouchableOpacity>
  );
};

export default LiveMeetingTasks;
