import { View, Text, SafeAreaView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import Header from '../../../component/header/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconName } from '../../../component';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import { Divider } from 'react-native-paper';
import moment from 'moment';
import { Button } from '../../../component/button/Button';
import {
  UPDATE_DECISION,
  UPDATE_MEETING_STATUS
} from '../../../graphql/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_MEETING_STATUS } from '../../../graphql/query';

const AddMinutesOfMeetingDecision = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isEdit, momDecisionData, meetingData, decisionId } = route?.params;
  console.log('momDecisionData', momDecisionData);
  const [comment, setComment] = useState(
    isEdit ? momDecisionData.description : ''
  );
  const [meetingStatus, setMeetingStatus] = useState([]);
  const [decision, setDecision] = useState('');

  // getMeetingSubjects for meeting
  const getMeetingSubjects = useQuery(GET_MEETING_STATUS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data) {
        setMeetingStatus(data.meetingStatus.items);
      }
    },
    onError: (data) => {
      console.log('error getMeetingSubjects ', data.message);
    }
  });

  const [updateMeetingStatus] = useMutation(UPDATE_MEETING_STATUS, {
    refetchQueries: ['meetings'],
    onCompleted: (data) => {
      console.log('updateMeetingSttaus', data.updateMeetingStatus.status);
      if (data?.updateMeetingStatus?.status?.statusCode == '200') {
        navigation.navigate('Details', {
          title: 'Meetings',
          active: '0'
        });
      }
    },
    onError: (data) => {
      console.log('updateMeetingSttaus', data.message);
    }
  });

  const [
    updateDecision,
    { data, loading: addDecisionLoading, error: addDecisionError }
  ] = useMutation(UPDATE_DECISION, {
    refetchQueries: ['decisions'],
    onCompleted: (data) => {
      if (data) {
        console.log('update Decision', data?.updateDecision?.status);
        if (data?.updateDecision?.status?.statusCode == '200') {
          if (decision == 'Send' || decision == 'Approve') {
            navigation.navigate('Details', {
              title: 'Meetings',
              active: '0'
            });
          } else {
            const filterStatus = meetingStatus?.filter((status) => {
              if (status.meetingStatusTitle == 'Closed') {
                return status;
              }
            });
            // navigation.goBack();
            console.log('filterstatus for final close', filterStatus);
            updateMeetingStatus({
              variables: {
                meeting: {
                  meetingId: meetingData?.meetingId,
                  meetingStatusId: filterStatus[0]?.meetingStatusId
                }
              }
            });
          }
        }
      }
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Decision'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        {addDecisionError && (
          <Text style={styles.txtError}>{addDecisionError.message}</Text>
        )}
        <Text style={styles.txtTitle}>
          {isEdit
            ? 'Edit minutes of meeting decision'
            : 'Add minutes of meeting decision'}
        </Text>
        <View style={{ marginTop: SIZES[24] }}>
          <Text style={styles.txtNameTitle}>COMMITTEE TITLE</Text>
          <View style={styles.viewContainer}>
            <Text style={styles.txtCommittee}>
              {meetingData?.committeeTitle}
            </Text>
          </View>
          <Divider style={styles.divider} />
        </View>
        <View style={{ marginTop: SIZES[24] }}>
          <Text style={styles.txtNameTitle}>DATE OF APPROVAL</Text>
          <View style={styles.viewContainer}>
            <Text style={styles.txtCommittee}>
              {moment(new Date()).format('DD.MM.YYYY')}
            </Text>
          </View>
          <Divider style={styles.divider} />
        </View>
        <View style={{ marginTop: SIZES[24] }}>
          <Text style={styles.txtNameTitle}>COMMENTS</Text>
          <TextInput
            value={comment}
            multiline={true}
            style={styles.textInput}
            onChangeText={(text) => {
              setComment(text);
            }}
          />
          <Divider style={styles.divider} />
        </View>
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
            title={'Send'}
            onPress={() => {
              setDecision('Send');
              updateDecision({
                variables: {
                  decision: {
                    decisionId: isEdit ? decisionId : 0,
                    subjectId: 0,
                    committeeId: meetingData?.committeeId,
                    committeeName: meetingData?.committeeTitle,
                    statusId: 0,
                    description: comment,
                    attachFileIds: [],
                    meetingId: meetingData?.meetingId,
                    dateOfCreation: moment(new Date()).format('DD/MM/YYYY'),
                    statusTitle: 'Send',
                    id: 1
                  }
                }
              });
            }}
            layoutStyle={[
              styles.cancelBtnLayout,
              { marginVertical: SIZES[12], width: '22%' }
            ]}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Approve'}
            onPress={() => {
              setDecision('Approve');
              updateDecision({
                variables: {
                  decision: {
                    decisionId: isEdit ? decisionId : 0,
                    subjectId: 0,
                    committeeId: meetingData?.committeeId,
                    committeeName: meetingData?.committeeTitle,
                    statusId: 0,
                    description: comment,
                    attachFileIds: [],
                    meetingId: meetingData?.meetingId,
                    dateOfCreation: moment(new Date()).format('DD/MM/YYYY'),
                    statusTitle: 'Approve',
                    id: 1
                  }
                }
              });
            }}
            layoutStyle={[
              styles.cancelBtnLayout,
              { marginVertical: SIZES[12], width: '35%' }
            ]}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Final approve'}
            // isLoading={addDecisionLoading}
            // disable={
            //   subjectsData?.committeeName === '' ||
            //   valueApproveDecision === null
            //     ? true
            //     : false
            // }
            isLoading={addDecisionLoading}
            onPress={() => {
              setDecision('Final approve');
              updateDecision({
                variables: {
                  decision: {
                    decisionId: isEdit ? decisionId : 0,
                    subjectId: 0,
                    committeeId: meetingData?.committeeId,
                    committeeName: meetingData?.committeeTitle,
                    statusId: 0,
                    description: comment,
                    attachFileIds: [],
                    meetingId: meetingData?.meetingId,
                    dateOfCreation: moment(new Date()).format('DD/MM/YYYY'),
                    statusTitle: 'Final approve',
                    id: 1
                  }
                }
              });
            }}
            layoutStyle={[
              // {
              //   opacity:
              //     subjectsData?.committeeName === '' ||
              //     valueApproveDecision === null
              //       ? 0.5
              //       : null
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

export default AddMinutesOfMeetingDecision;
