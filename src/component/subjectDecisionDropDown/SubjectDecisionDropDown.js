import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { GET_ALL_DECISIONS } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';

const SubjectDecisionDropDown = ({
  subjectId,
  decisionData,
  setDecisionData
}) => {
  const [subjectDecision, setSubjectDecision] = useState(null);
  console.log('subject dropdown', subjectId);

  // get subject decision
  const getDecision = useQuery(GET_ALL_DECISIONS, {
    variables: {
      subjectId: subjectId,
      page: -1,
      pageSize: -1,
      meetingId: 0,
      momDecision: false
    },
    onCompleted: (data, error) => {
      if (data) {
        console.log('data', data?.decisions);
        setDecisionData(data?.decisions?.items[0]);
      }
      if (error) {
        console.log('getDecision error', error);
      }
    }
  });

  return (
    <View
      style={{
        marginLeft: 24,
        backgroundColor:
          decisionData?.statusTitle == 'Approved'
            ? 'rgba(129, 171, 150,0.1)'
            : decisionData?.statusTitle == 'Approved with escalation'
            ? 'rgba(129, 171, 150,0.1)'
            : decisionData?.statusTitle == 'Rejected'
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
              : decisionData?.statusTitle == 'Approved with escalation'
              ? 'rgba(129, 171, 150,1)'
              : decisionData?.statusTitle == 'Rejected'
              ? 'rgba(231, 157, 115, 1)'
              : decisionData?.statusTitle == 'Rejected with escalation'
              ? ' rgba(231, 157, 115, 1)'
              : decisionData?.statusTitle == 'Withdraw'
              ? ' rgba(221, 120, 120, 1)'
              : Colors.white
        }}
      >
        {decisionData?.statusTitle}
      </Text>
    </View>
  );
};

export default SubjectDecisionDropDown;
