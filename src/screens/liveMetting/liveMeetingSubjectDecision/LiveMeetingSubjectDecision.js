import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_DECISIONS, GET_FILE } from '../../../graphql/query';
import { styles } from './styles';
import moment from 'moment';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { Fonts } from '../../../themes';
import { useNavigation } from '@react-navigation/native';

const LiveMeetingSubjectDecision = ({ meetingData, item }) => {
  const navigation = useNavigation();
  const [decisionData, setDecisionData] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);

  const getDecision = useQuery(GET_ALL_DECISIONS, {
    variables: {
      subjectId: item.subjectId,
      page: -1,
      pageSize: -1
    },
    onCompleted: (data, error) => {
      if (data) {
        console.log('filterSubject', data.decisions.items[0]);
        setDecisionData(data.decisions.items[0]);
        data.decisions.items[0]?.attachFileIds?.map((id) => {
          const getFile = useQuery(GET_FILE, {
            variables: {
              fileEntryId: id
            },
            onCompleted: (data) => {
              fileResponse.push(data.uploadedFile);
            }
          });
          if (getFile.error) {
            console.log('File error', getFile.error);
          }
        });
      }
      if (error) {
        console.log('getDecision error', error);
      }
    }
  });

  const Details = ({
    title,
    discription,
    descriptionContainer,
    txtDescriptionStyle
  }) => {
    return (
      <View style={{ marginTop: SIZES[24] }}>
        <Text style={styles.txtDetailTitle}>{title}</Text>
        <View style={descriptionContainer}>
          <Text style={[styles.txtDetailDiscription, txtDescriptionStyle]}>
            {discription}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {decisionData ? (
        <View>
          <Text style={styles.txtDecisionTitle}>{`${
            decisionData?.subjectTitle
          }, ${moment(decisionData?.dateOfCreation).format(
            'DD MMMM,YYYY'
          )}`}</Text>
          <Details
            title={'Status'}
            discription={decisionData?.statusTitle}
            descriptionContainer={{
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
              alignItems: 'center',
              marginTop: SIZES[10],
              borderRadius: SIZES[8]
            }}
            txtDescriptionStyle={{
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
          />
          <Details
            title={'Committee'}
            discription={decisionData?.committeeName}
          />
          <Details title={'Head/Secretary'} discription={'Esther Howard'} />
          <Details title={'Comments'} discription={decisionData?.description} />
          {fileResponse?.length > 0 && (
            <AttachFiles
              fileResponse={fileResponse}
              setFileResponse={setFileResponse}
              showAttachButton={false}
              deleted={false}
              download={true}
              isShowAttchTitle={true}
            />
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}
          >
            There is no decision yet{' '}
          </Text>
          {meetingData?.yourRoleName !== 'Member' && (
            <Button
              title={'Add decision'}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
              onPress={() => {
                navigation.navigate('AddEditDecision', {
                  meetingDetails: meetingData,
                  isEdit: false,
                  decisionData: null,
                  subjectId: item?.subjectId
                });
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default LiveMeetingSubjectDecision;
