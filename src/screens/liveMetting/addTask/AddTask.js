import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../../themes/Colors';
import { Divider } from 'react-native-paper';
import { SIZES } from '../../../themes/Sizes';
import MeetingSubjectTypeComponent from '../../../component/meetingSubjectTypesComponent/MeetingSubjectTypeComponent';
import DropDownPicker from '../../../component/DropDownPicker/DropDownPicker';
import moment from 'moment';
import AttachFiles from '../../../component/attachFiles/AttachFiles';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ALL_TASKS,
  GET_TASK_EXECUTORS,
  GET_TASK_PRIORITY
} from '../../../graphql/query';
import { UPDATE_TASK, UPDATE_VOTING } from '../../../graphql/mutation';

const AddTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingDetails, isEdit, taskData, isMeetingTask } = route?.params;
  console.log('onpress edit task', meetingDetails);
  const [valueType, setValueType] = useState(
    isEdit ? (taskData?.subjectId == null ? 'Meeting' : 'Subject') : null
  );
  const [valueSubject, setValueSubject] = useState(
    isEdit ? (taskData?.subjectId !== 0 ? taskData?.subjectId : null) : null
  );
  const [titleTask, setTitleTask] = useState(isEdit ? taskData?.title : '');
  const [taskDescription, setTaskDescription] = useState(
    isEdit ? taskData?.description : ''
  );
  const [fileResponse, setFileResponse] = useState([]);
  const [taskExecutors, setTaskExecutors] = useState([]);
  const [fileId, setFilesId] = useState([]);
  const [taskPriority, setTaskPriority] = useState([]);
  const [valuePriority, setValuePriority] = useState(
    isEdit ? taskData?.priorityId : null
  );
  const [valueExecutor, setValueExecutor] = useState(
    isEdit ? taskData?.executorId : null
  );
  const [calendarValue, setCalendarValue] = useState({
    calendarValue: isEdit
      ? moment(taskData?.deadlineDate).format('DD MMM, YYYY')
      : new Date()
  });

  // get task executors
  const getTaskExecutor = useQuery(GET_TASK_EXECUTORS, {
    onCompleted: (data, error) => {
      if (data) {
        let executor = data?.taskExecutor?.executorIds?.map((exe, index) => {
          return { value: exe, label: data.taskExecutor?.executorNames[index] };
        });

        setTaskExecutors(executor);
      }
      if (error) {
        console.log('getTaskExecutor error', error);
      }
    }
  });

  // get task priority
  const getTaskPriority = useQuery(GET_TASK_PRIORITY, {
    onCompleted: (data, error) => {
      if (data) {
        setTaskPriority(data.taskPriority.items);
      }
      if (error) {
        console.log('gettask priority error', error);
      }
    }
  });

  useEffect(() => {
    const fileId = fileResponse?.map((file) => file?.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

  const [updateTask, { data, loading: addTaskLoading, error: addTaskError }] =
    useMutation(UPDATE_TASK, {
      refetchQueries: [
        {
          query: GET_ALL_TASKS,
          variables: {
            searchValue: '',
            onlyMyTask: false,
            meetingId: meetingDetails?.meetingId
          }
        }
      ],
      onCompleted: (data) => {
        if (data) {
          console.log('updateTask', data.updateTask.status[0]);
          if (data.updateTask.status[0].statusCode == '200') {
            navigation.goBack();
          }
        }
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={isEdit ? 'Edit task' : 'Add task'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.subContainer}>
        <Text style={styles.txtTitleAddVoting}>
          {isEdit ? 'Edit task' : 'Add task'}
        </Text>
        {isMeetingTask && (
          <MeetingSubjectTypeComponent
            valueType={valueType}
            setValueType={setValueType}
            valueSubject={valueSubject}
            setValueSubject={setValueSubject}
            meetingDetails={meetingDetails}
          />
        )}
        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>TITLE</Text>
          <TextInput
            value={titleTask}
            style={styles.textInput}
            onChangeText={(text) => {
              setTitleTask(text);
            }}
          />
          <Divider style={styles.divider} />
        </View>

        <DropDownPicker
          data={taskExecutors?.map((item) => ({
            label: item.label,
            value: item.value
          }))}
          title={'EXECUTOR'}
          styleContainer={{ marginTop: SIZES[24] }}
          placeholder={''}
          value={valueExecutor}
          setData={setValueExecutor}
        />

        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>DESCRIPTION</Text>
          <TextInput
            value={taskDescription}
            style={styles.textInput}
            onChangeText={(text) => {
              setTaskDescription(text);
            }}
            multiline={true}
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>RECIEVING SUBJECTS DEADLINE</Text>
          <TouchableOpacity
            style={styles.deadlineRowContainer}
            onPress={() =>
              navigation.navigate('DeadlineSuggestion', {
                setCalendarValue: setCalendarValue
              })
            }
          >
            <TextInput
              value={moment(calendarValue?.calendarValue).format(
                'DD MMM, YYYY'
              )}
              editable={false}
            />
            <Icon
              name={IconName.Calendar}
              width={SIZES[18]}
              height={SIZES[20]}
            />
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </View>

        <DropDownPicker
          data={taskPriority?.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          title={'PRIORITY'}
          styleContainer={{ marginTop: SIZES[24] }}
          placeholder={''}
          value={valuePriority}
          setData={setValuePriority}
        />

        <AttachFiles
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
          showAttachButton={true}
          styleFileCard={{
            borderBottomWidth: SIZES[1],
            borderBottomColor: Colors.Approved
          }}
          deleted={true}
          download={true}
          isShowAttchTitle={true}
        />
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
            onPress={() => {
              navigation.goBack();
            }}
            layoutStyle={[
              styles.cancelBtnLayout,
              { marginVertical: SIZES[12], width: '48%' }
            ]}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            // isLoading={addVotingLoading}
            onPress={() => {
              console.log('updat task data', {
                attachFiles: fileId,
                deadlineDate: new Date(calendarValue.calendarValue),
                description: taskDescription,
                executorId: valueExecutor,
                priorityId: valuePriority,
                taskStatusId: isEdit ? taskData?.taskStatusId : 0,
                taskId: isEdit ? taskData?.taskId : 0,
                title: titleTask,
                taskTypeId: isEdit ? taskData?.taskTypeId : 607
              });
              updateTask({
                variables: {
                  task: {
                    attachFiles: fileId,
                    deadlineDate: new Date(calendarValue.calendarValue),
                    description: taskDescription,
                    executorId: valueExecutor,
                    priorityId: valuePriority,
                    taskStatusId: isEdit ? taskData?.taskStatusId : 0,
                    taskId: isEdit ? taskData?.taskId : 0,
                    title: titleTask,
                    taskTypeId: isEdit ? taskData?.taskTypeId : 0,
                    subjectId: valueSubject == null ? 0 : valueSubject,
                    meetingId:
                      meetingDetails == null ? 0 : meetingDetails?.meetingId
                  }
                }
              });
            }}
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

export default AddTask;