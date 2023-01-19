import { View, Text, SafeAreaView, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import {
  GET_All_SUBJECTS_CATEGORY,
  GET_COMMITTEES_BY_ROLE,
  GET_ROLES,
  GET_TASK_SECRETARY_PERMISSION
} from '../../../../graphql/query';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import { Fonts } from '../../../../themes';
import RoleListCard from '../../../../component/roleListCard/RoleListCard';
import { UPDATE_SECRETARY_PERMISSION } from '../../../../graphql/mutation';

const SecretaryPermission = () => {
  const navigation = useNavigation();
  const [committees, setCommittees] = useState([]);
  const [valueCommitee, setValueCommittee] = useState(null);
  const [roles, setRoles] = useState([]);
  const [secretaryPermission, setSecretoryPermission] = useState([]);
  const [subjectApprovedData, setSubjectApprovedData] = useState({});
  const [meetingApprovedData, setMeetingApprovedData] = useState({});
  const [taskApprovedData, setTaskApprovedData] = useState({});
  var newRoles = [];

  // fetch commitees by role
  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
    fetchPolicy: 'cache-and-network',
    variables: { head: true, secretary: true, member: false },
    onCompleted: (data) => {
      if (data) {
        setCommittees(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('commitee error', data);
    }
  });

  // get task secretary permission
  const [getTaskSecretaryPermission, {}] = useLazyQuery(
    GET_TASK_SECRETARY_PERMISSION,
    {
      onCompleted: (data) => {
        if (data) {
          console.log('secretary permission', data.taskSecretaryPermission);

          setSecretoryPermission(data.taskSecretaryPermission);
          getRoles({
            variables: {
              taskRole: true
            }
          });
        }
      },
      onError: (data) => {
        console.log('secretary permission error', data);
      }
    }
  );
  const [getRoles] = useLazyQuery(GET_ROLES, {
    onCompleted: (data) => {
      if (data) {
        newRoles = data.roleList.roles.map((role, index) => {
          let isAccess =
            role?.name == 'SubjectApproval'
              ? secretaryPermission?.isSubjectApproval !== null
                ? secretaryPermission?.isSubjectApproval
                : false
              : role?.name == 'MeetingApproval'
              ? secretaryPermission?.isMinutesofMeetingApproval !== null
                ? secretaryPermission?.isMinutesofMeetingApproval
                : false
              : role?.name == 'TaskApproval'
              ? secretaryPermission?.allTaskTypesApproveByHead
                ? secretaryPermission?.allTaskTypesApproveByHead
                : false
              : false;

          return { ...role, isAccess };
        });
        if (newRoles) {
          //set all user to the user list
          setRoles(newRoles);
        }
      }
    },
    onError: (data) => {
      console.log('secretary permission error', data);
    }
  });

  const onChecked = (item) => {
    roles?.map((role) => {
      if (role.id === item.id) {
        role.isAccess = !role.isAccess;
      }
    });
    setRoles([...roles]);
  };

  useEffect(() => {
    const subjectApprovedId = roles?.filter((role) => {
      return role?.name == 'SubjectApproval';
    });

    setSubjectApprovedData(subjectApprovedId[0]);

    const meetingApprovedId = roles?.filter((role) => {
      return role?.name == 'MeetingApproval';
    });

    setMeetingApprovedData(meetingApprovedId[0]);

    const TaskApproval = roles?.filter((role) => {
      return role?.name == 'TaskApproval';
    });

    setTaskApprovedData(TaskApproval[0]);
  }, [roles]);

  const [updateSecretaryPermission] = useMutation(UPDATE_SECRETARY_PERMISSION, {
    refetchQueries: ['taskSecretaryPermission'],
    onCompleted: (data) => {
      console.log(
        'updateSecretaryPermission',
        data.updateTaskSecretaryPermission
      );
      if (data.updateTaskSecretaryPermission.status[0].statusCode == '200') {
        alert(data.updateTaskSecretaryPermission.status[0].statusMessage);
      }
    },
    onError: (data) =>
      console.log('updateSecretaryPermissionerror', data.message)
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Secretary permission'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>General</Text>
        <DropDownPicker
          data={committees?.map((comm) => ({
            label: comm.committeeTitle,
            value: comm.organizationId
          }))}
          disable={false}
          placeholder={''}
          setData={(item) => {
            setValueCommittee(item);
            getTaskSecretaryPermission({
              variables: { committeeId: item }
            });
          }}
          title={'COMMITTEE'}
          value={valueCommitee}
        />
        <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
        {valueCommitee !== null ? (
          <View>
            {roles?.map((role, index) => {
              return (
                <RoleListCard
                  role={role}
                  index={index}
                  onChecked={onChecked}
                  secretaryPermission={secretaryPermission}
                />
              );
            })}
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text>Please select one committee</Text>
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View
          style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
        >
          <Button
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            disable={secretaryPermission?.userRole == 'Head' ? false : true}
            onPress={() => {
              console.log('updateSecretaryPermission', {
                committeeId: valueCommitee,
                isMinutesofMeetingApproval: meetingApprovedData?.isAccess,
                isSubjectApproval: subjectApprovedData?.isAccess,
                allTaskTypesApproveByHead: taskApprovedData?.isAccess,
                TaskTypesApproveByHeadRoleId: taskApprovedData?.id,
                minutesofMeetingApprovalRoleId: meetingApprovedData?.id,
                subjectApprovalRoleId: subjectApprovedData?.id
              });
              updateSecretaryPermission({
                variables: {
                  taskSecretaryPermission: {
                    committeeId: valueCommitee,
                    isMinutesofMeetingApproval: meetingApprovedData?.isAccess,
                    isSubjectApproval: subjectApprovedData?.isAccess,
                    allTaskTypesApproveByHead: taskApprovedData?.isAccess,
                    TaskTypesApproveByHeadRoleId: taskApprovedData?.id,
                    minutesofMeetingApprovalRoleId: meetingApprovedData?.id,
                    subjectApprovalRoleId: subjectApprovedData?.id
                  }
                }
              });
            }}
            layoutStyle={[
              {
                opacity: secretaryPermission?.userRole !== 'Head' ? 0.5 : null
              },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SecretaryPermission;
