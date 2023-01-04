import { View, Text, SafeAreaView, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASK_STATUS, GET_TASK_TYPES } from '../../../../graphql/query';
import Header from '../../../../component/header/Header';
import { styles } from './styles';
import { IconName } from '../../../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import TaskTypeCard from '../../../../component/taskTypeCard/TaskTypeCard';
import TaskStatusCard from '../../../../component/taskStatusCard/TaskStatusCard';

const FilterTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskType, taskStatusList, onUpdateFilter, onlyMyTask } =
    route?.params;
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [onlyMyTasks, setOnlyMyTasks] = useState(onlyMyTask);
  const [checkedTypes, setCheckedTypes] = useState({});
  var newTaskType = [];
  var newTaksStatus = [];

  // get all task type
  const TaskType = useQuery(GET_TASK_TYPES, {
    onCompleted: (data) => {
      if (data) {
        // setTaskTypes(data.taskType.items);
        newTaskType = data?.taskType?.items.map((item, index) => {
          let previousTaskIndex = taskType?.findIndex(
            (task) => task.id === item.id
          );
          let isSelected = false;

          if (previousTaskIndex >= 0) {
            isSelected = true;
          }
          return { ...item, isSelected };
        });
        if (newTaskType) {
          //set all user to the user list
          setTaskTypes(newTaskType);
        }
      }
    },
    onError: (data) => {
      console.log('get task type error', data);
    }
  });

  // get all task status
  const taskStatusData = useQuery(GET_TASK_STATUS, {
    onCompleted: (data) => {
      if (data) {
        console.log('task status', taskStatus);
        setTaskStatus(data.taskStatus.items);
        newTaksStatus = data.taskStatus.items.map((item, index) => {
          let previousTaskStatusIndex = taskStatusList?.findIndex(
            (task) => task.id === item.id
          );
          let isSelected = false;

          if (previousTaskStatusIndex >= 0) {
            isSelected = true;
          }
          return { ...item, isSelected };
        });
        if (newTaksStatus) {
          //set all user to the user list
          setTaskStatus(newTaksStatus);
        }
      }
    },
    onError: (data) => {
      console.log('get task status error', data);
    }
  });

  const setOnTaskTypeClick = (item) => {
    taskTypes?.map((task) => {
      if (task.id === item.id) {
        task.isSelected = !task.isSelected;
      }
    });
    setTaskTypes([...taskTypes]);
  };
  const setOnTaskStatusClick = (item) => {
    taskStatus?.map((task) => {
      if (task.id === item.id) {
        task.isSelected = !task.isSelected;
      }
    });
    setTaskStatus([...taskStatus]);
  };

  const setSelectedFilterTaskInSelectedList = () => {
    const selectTaskFilterValue = [];
    const selectedTypes = [];
    const selectedStatus = [];
    taskTypes?.map((type) => {
      if (type.isSelected) {
        selectedTypes.push(type);
      }
    });

    taskStatus?.map((status) => {
      if (status.isSelected) {
        selectedStatus.push(status);
      }
    });
    // selectTaskFilterValue.push([...selectTaskFilterValue, onlyMyTasks]);
    onUpdateFilter({ selectedTypes, selectedStatus, onlyMyTasks });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName={IconName.Arrow_Left}
        name={'Filter'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.subContainer}>
        {/* task types filter */}
        <View style={styles.typeContainer}>
          <Text style={styles.txtTitle}>Type</Text>
          {taskTypes.map((type, index) => {
            return (
              <TaskTypeCard
                type={type}
                index={index}
                onChecked={setOnTaskTypeClick}
              />
            );
          })}
        </View>

        {/* task status filter */}
        <View style={styles.typeContainer}>
          <Text style={styles.txtTitle}>Status</Text>
          {taskStatus.map((status, index) => {
            return (
              <TaskStatusCard
                status={status}
                index={index}
                onChecked={setOnTaskStatusClick}
              />
            );
          })}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.switchContainer}>
          <Text style={styles.txtSwitchLabel}>Only my tasks</Text>
          <Switch
            color={Colors.switch}
            value={onlyMyTasks}
            onChange={() => setOnlyMyTasks(!onlyMyTasks)}
          />
        </View>
        <Divider style={styles.divider} />
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => setSelectedFilterTaskInSelectedList()}
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

export default FilterTask;
