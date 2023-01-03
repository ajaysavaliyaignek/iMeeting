import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GET_ALL_TASKS } from '../../../graphql/query';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
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

  const Tasks = useQuery(GET_ALL_TASKS, {
    variables: {
      searchValue: searchText,
      onlyMyTask: onlyMyTasks,
      meetingId: meetingData?.meetingId,
      subjectId: 0
    },

    onCompleted: (data) => {
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
    if (socketEventUpdateMessage == 'Updated Task') {
      client.refetchQueries({
        include: ['tasks']
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
                editable={meetingData.yourRoleName == 'Member' ? false : true}
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
      ) : Tasks.error ? (
        <View
          style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
        >
          <Text
            style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}
          ></Text>
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
    </TouchableOpacity>
  );
};

export default LiveMeetingTasks;
