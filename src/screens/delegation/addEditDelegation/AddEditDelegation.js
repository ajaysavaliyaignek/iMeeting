import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import { styles } from './styles';
import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { GET_All_USERS, GET_COMMITTEES_BY_ROLE } from '../../../graphql/query';
import DropDownPicker from '../../../component/DropDownPicker/DropDownPicker';
import Loader from '../../../component/Loader/Loader';
import { UPDATE_DELEGETION } from '../../../graphql/mutation';

const AddEditDelegation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isEdit, delegationData } = route?.params;
  const [committees, setCommittee] = useState([]);
  const [users, setUsers] = useState([]);
  const [isStartDate, setIsStartDate] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [generaldData, setGeneralData] = useState({
    valueCommitee: isEdit ? delegationData.committeeId : null,
    startDate: isEdit
      ? `${moment(delegationData.startDate, 'YYYY-MM-DD hh:mm A').format(
          'DD MMM YYYY'
        )}`
      : new Date(),
    endDate: isEdit
      ? `${moment(delegationData.endDate, 'YYYY-MM-DD hh:mm A').format(
          'DD MMM YYYY'
        )}`
      : generaldData?.startDate,
    whoReplaces: isEdit ? delegationData.transferredUserId : null
  });
  // get users data from the server
  const { loading: UsersLoading, error: UsersError } = useQuery(GET_All_USERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      isDeleted: true,
      externalUser: false,
      searchValue: ''
    },
    onCompleted: (data) => {
      // console.log('get all user data', data.committeeMembersList.items);
      setUsers(data?.committeeMembersList.items);
    },
    onError: (data) => {
      console.log('get all user error', data.message);
    }
  });

  // fetch commitees
  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
    fetchPolicy: 'cache-and-network',
    variables: { head: true, secretary: true, member: false },
    onCompleted: (data) => {
      if (data) {
        setCommittee(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('commitee error', data);
    }
  });

  // set date time from clock model
  const handleConfirmCalendar = (date) => {
    if (isStartDate) {
      setGeneralData({ ...generaldData, startDate: date, endDate: date });
    } else {
      setGeneralData({ ...generaldData, endDate: date });
    }

    setOpenCalendar(false);
  };

  // update delegation
  const [updateDelegation, { loading: UpdateDelegationLoading }] = useMutation(
    UPDATE_DELEGETION,
    {
      refetchQueries: ['delegations'],
      onCompleted: (data) => {
        console.log('update delegation', data);
        if (data.updateDelegation.status.statusCode == '200') {
          navigation.goBack();
        }
      },
      onError: (data) => console.log('update delegation error', data)
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={isEdit ? 'Edit delegation' : 'Add delegation'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtAddDelegationTitle}>
          {isEdit ? 'Edit delegation' : 'Add delegation'}
        </Text>
        {CommitteeLoading && <Loader color={Colors.primary} />}

        {/* choose committe */}
        <DropDownPicker
          data={committees?.map((comm) => ({
            label: comm.committeeTitle,
            value: comm.organizationId
          }))}
          disable={delegationData == null ? false : true}
          placeholder={''}
          setData={(item) => {
            setGeneralData((prev) => {
              return { ...prev, valueCommitee: item };
            });
          }}
          title={'COMMITTEE'}
          value={generaldData?.valueCommitee}
        />

        <Text style={styles.txtTitle}>START DATE</Text>

        {/* select start date */}
        <TouchableOpacity
          style={styles.dateContainer}
          onPress={() => {
            setIsStartDate(true);
            setOpenCalendar(!openCalendar);

            // setValue('startDate');
          }}
        >
          <Text style={styles.textInput}>
            {moment(generaldData?.startDate).format('DD MMM,YYYY')}
          </Text>

          <Icon name={IconName.Calendar} height={SIZES[20]} width={SIZES[18]} />
        </TouchableOpacity>

        {/* for select start time */}

        <Text style={styles.txtTitle}>END DATE</Text>

        {/* for select end date */}
        <TouchableOpacity
          style={styles.dateContainer}
          onPress={() => {
            setIsStartDate(false);

            setOpenCalendar(!openCalendar);

            // setValue('endDate');
          }}
        >
          <Text style={styles.textInput}>
            {moment(generaldData?.endDate).format('DD MMM,YYYY')}
          </Text>

          <Icon name={IconName.Calendar} height={SIZES[20]} width={SIZES[18]} />
        </TouchableOpacity>

        {/* who replaces */}
        <DropDownPicker
          data={users?.map((user) => ({
            label: `${user.firstName} ${user.secondName}`,
            value: user.userId
          }))}
          placeholder={''}
          setData={(item) => {
            setGeneralData((prev) => {
              return { ...prev, whoReplaces: item };
            });
          }}
          title={'WHO REPLACES'}
          value={generaldData?.whoReplaces}
          styleContainer={{ marginTop: SIZES[24] }}
        />
        {/* date  picker modal */}
        <DateTimePickerModal
          isVisible={openCalendar}
          mode="date"
          onConfirm={handleConfirmCalendar}
          onCancel={() => setOpenCalendar(false)}
          minimumDate={
            isStartDate ? new Date() : new Date(generaldData?.startDate)
          }
          //   date={
          //     isStartDate
          //       ? new Date(generaldData?.startDateTime)
          //       : new Date(generaldData?.endDateTime)
          //   }
        />
      </View>
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
            onPress={() => {
              console.log('update delegation', {
                delegation: {
                  delegationId: isEdit ? delegationData.delegationId : 0,
                  committeeId: generaldData.valueCommitee,
                  startDate: moment(generaldData?.startDate).format(
                    'YYYY-MM-DD hh:mm A'
                  ),
                  endDate: moment(generaldData?.endDate).format(
                    'YYYY-MM-DD hh:mm A'
                  ),
                  transferredUserId: generaldData.whoReplaces
                }
              });
              updateDelegation({
                variables: {
                  delegation: {
                    delegationId: isEdit ? delegationData.delegationId : 0,
                    committeeId: generaldData.valueCommitee,
                    startDate: moment(generaldData?.startDate).format(
                      'YYYY-MM-DD hh:mm A'
                    ),
                    endDate: moment(generaldData?.endDate).format(
                      'YYYY-MM-DD hh:mm A'
                    ),
                    transferredUserId: generaldData.whoReplaces
                  }
                }
              });
            }}
            isLoading={UpdateDelegationLoading}
            disable={
              generaldData.valueCommitee == null ||
              generaldData.startDate === '' ||
              generaldData.whoReplaces == null
                ? true
                : false
            }
            layoutStyle={[
              {
                opacity:
                  generaldData.valueCommitee == null ||
                  generaldData.startDate === '' ||
                  generaldData.whoReplaces == null
                    ? 0.5
                    : null
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

export default AddEditDelegation;
