import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { GET_ALL_DECISIONS } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { Button } from '../button/Button';
import { useNavigation } from '@react-navigation/native';

const SubjectDecisionDropDown = ({
  subjectId,
  decisionData,
  setDecisionData,
  isMomDecision,
  item,
  meetingData
}) => {
  const navigation = useNavigation();
  const [subjectDecision, setSubjectDecision] = useState(null);

  // get subject decision
  const getDecision = useQuery(GET_ALL_DECISIONS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      subjectId: subjectId,
      page: -1,
      pageSize: -1,
      meetingId: 0,
      momDecision: isMomDecision ? true : false
    },
    onCompleted: (data, error) => {
      if (data) {
        // console.log('approve subject decision', data.decisions);
        setDecisionData(data?.decisions?.items[0]);
      }
      if (error) {
        console.log('getDecision error', error);
      }
    }
  });

  return (
    <View>
      {decisionData !== undefined ? (
        <View
          style={{
            marginLeft: 24,
            backgroundColor:
              decisionData?.statusTitle == 'Approved'
                ? 'rgba(129, 171, 150,0.1)'
                : decisionData?.statusTitle == 'Approved with escalation'
                ? 'rgba(129, 171, 150,0.1)'
                : decisionData?.statusTitle == 'Approve'
                ? 'rgba(129, 171, 150,0.1)'
                : decisionData?.statusTitle == 'Approve with comment'
                ? 'rgba(129, 171, 150,0.1)'
                : decisionData?.statusTitle == 'Rejected'
                ? 'rgba(231, 157, 115, 0.1)'
                : decisionData?.statusTitle == 'Reject'
                ? 'rgba(231, 157, 115, 0.1)'
                : decisionData?.statusTitle == 'Rejected with escalation'
                ? ' rgba(231, 157, 115, 0.1)'
                : decisionData?.statusTitle == 'Withdraw'
                ? ' rgba(221, 120, 120, 0.1)'
                : Colors.white,
            paddingVertical: SIZES[6],
            paddingHorizontal: SIZES[16],
            borderRadius: SIZES[6]
          }}
        >
          <Text
            style={{
              ...Fonts.PoppinsSemiBold[14],
              color:
                decisionData?.statusTitle == 'Approved'
                  ? 'rgba(129, 171, 150,1)'
                  : decisionData?.statusTitle == 'Approve'
                  ? 'rgba(129, 171, 150,1)'
                  : decisionData?.statusTitle == 'Approved with escalation'
                  ? 'rgba(129, 171, 150,1)'
                  : decisionData?.statusTitle == 'Approve with comment'
                  ? 'rgba(129, 171, 150,1)'
                  : decisionData?.statusTitle == 'Rejected'
                  ? 'rgba(231, 157, 115, 1)'
                  : decisionData?.statusTitle == 'Reject'
                  ? 'rgba(231, 157, 115, 1)'
                  : decisionData?.statusTitle == 'Rejected with escalation'
                  ? ' rgba(231, 157, 115, 1)'
                  : decisionData?.statusTitle == 'Withdraw'
                  ? ' rgba(221, 120, 120, 1)'
                  : Colors.bold
            }}
          >
            {decisionData?.statusTitle}
          </Text>
        </View>
      ) : isMomDecision && meetingData?.meetingStatusTitle !== 'Closed' ? (
        <Button
          title={'Add approve decision'}
          layoutStyle={{ backgroundColor: Colors.white }}
          textStyle={{ color: Colors.primary }}
          onPress={() => {
            navigation.navigate('AddApproveDecision', {
              subjectsData: item
            });
          }}
        />
      ) : (
        <Text style={{ marginLeft: 24 }}>{'---------'}</Text>
      )}
    </View>
  );
};

export default SubjectDecisionDropDown;
