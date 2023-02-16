import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import moment from 'moment';

import { GET_ALL_DECISIONS, GET_FILE } from '../../../graphql/query';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { Fonts } from '../../../themes';

const LiveMeetingSubjectDecision = ({
  meetingData,
  item: subjectData,
  isMom,
  isMeeting
}) => {
  const navigation = useNavigation();
  const [decisionData, setDecisionData] = useState([]);
  const [fileResponse, setFileResponse] = useState([]);
  let queryParams;

  if (isMom) {
    queryParams = {
      subjectId: subjectData?.subjectId,
      page: -1,
      pageSize: -1,
      meetingId: 0,
      momDecision: true
    };
  } else if (isMeeting) {
    queryParams = {
      subjectId: 0,
      page: -1,
      pageSize: -1,
      meetingId: meetingData.meetingId,
      momDecision: true
    };
  } else {
    queryParams = {
      subjectId: subjectData?.subjectId,
      page: -1,
      pageSize: -1,
      meetingId: 0,
      momDecision: false
    };
  }

  const getDecision = useQuery(GET_ALL_DECISIONS, {
    fetchPolicy: 'cache-and-network',
    variables: queryParams,
    onCompleted: (data, error) => {
      if (data) {
        console.log('decision', data.decisions.items);
        setDecisionData(data.decisions.items);
        data.decisions.items[0]?.attachFileIds?.map((id) => {
          const getFile = useQuery(GET_FILE, {
            fetchPolicy: 'cache-and-network',
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
      {decisionData.length > 0 ? (
        <FlatList
          data={decisionData}
          keyExtractor={(index) => {
            index.toString();
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={{ paddingVertical: 16 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text style={styles.txtDecisionTitle}>{`${moment(
                    item?.dateOfCreation
                  ).format('DD MMMM,YYYY')}`}</Text>

                  <Button
                    title={'Edit'}
                    layoutStyle={{
                      backgroundColor: Colors.white,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.primary,
                      paddingVertical: 0
                    }}
                    textStyle={{ color: Colors.primary }}
                    onPress={() => {
                      isMom
                        ? navigation.navigate('AddApproveDecision', {
                            subjectsData: subjectData,
                            isEdit: true,
                            item: item
                          })
                        : isMeeting
                        ? navigation.navigate('AddMinutesOfMeetingDecision', {
                            isEdit: true,
                            momDecisionData: item,
                            meetingData: meetingData,
                            decisionId: item.decisionId
                          })
                        : navigation.navigate('AddEditDecision', {
                            meetingDetails: meetingData,
                            decisionId: item.decisionId,
                            isEdit: true,
                            decisionData: null,
                            subjectId: subjectData?.subjectId
                          });
                    }}
                  />
                </View>
                {!isMeeting ? (
                  <Details
                    title={'Status'}
                    discription={item?.statusTitle}
                    descriptionContainer={{
                      backgroundColor:
                        item?.statusTitle == 'Approved'
                          ? 'rgba(129, 171, 150,0.1)'
                          : item?.statusTitle == 'Approve'
                          ? 'rgba(129, 171, 150,0.1)'
                          : item?.statusTitle == 'Approve with escalation'
                          ? 'rgba(129, 171, 150,0.1)'
                          : item?.statusTitle == 'Approve with comment'
                          ? 'rgba(129, 171, 150,0.1)'
                          : item?.statusTitle == 'Rejected'
                          ? 'rgba(231, 157, 115, 0.1)'
                          : item?.statusTitle == 'Reject'
                          ? 'rgba(231, 157, 115, 0.1)'
                          : item?.statusTitle == 'Rejected with escalation'
                          ? ' rgba(231, 157, 115, 0.1)'
                          : item?.statusTitle == 'Withdraw'
                          ? ' rgba(221, 120, 120, 0.1)'
                          : Colors.white,
                      paddingVertical: SIZES[6],
                      alignItems: 'center',
                      marginTop: SIZES[10],
                      borderRadius: SIZES[8]
                    }}
                    txtDescriptionStyle={{
                      color:
                        item?.statusTitle == 'Approved'
                          ? 'rgba(129, 171, 150,1)'
                          : item?.statusTitle == 'Approved with escalation'
                          ? 'rgba(129, 171, 150,1)'
                          : item?.statusTitle == 'Approve with comment'
                          ? 'rgba(129, 171, 150,1)'
                          : item?.statusTitle == 'Approve'
                          ? 'rgba(129, 171, 150,1)'
                          : item?.statusTitle == 'Rejected'
                          ? 'rgba(231, 157, 115, 1)'
                          : item?.statusTitle == 'Reject'
                          ? 'rgba(231, 157, 115, 1)'
                          : item?.statusTitle == 'Rejected with escalation'
                          ? ' rgba(231, 157, 115, 1)'
                          : item?.statusTitle == 'Withdraw'
                          ? ' rgba(221, 120, 120, 1)'
                          : Colors.bold
                    }}
                  />
                ) : (
                  <Details title={'Status'} discription={item?.statusTitle} />
                )}
                <Details
                  title={'Committee'}
                  discription={item?.committeeName}
                />
                <Details
                  title={'Head/Secretary'}
                  discription={item.createrName}
                />
                {item.description !== '' && (
                  <Details title={'Comments'} discription={item?.description} />
                )}
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
                <Divider
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: Colors.line,
                    marginTop: 16
                  }}
                />
              </View>
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}
          >
            There is no decision yet{' '}
          </Text>
          {meetingData?.yourRoleName == 'Head' && (
            <Button
              title={
                isMom
                  ? 'Add approve decision'
                  : isMeeting
                  ? 'Add minutes of meeting decision'
                  : 'Add decision'
              }
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
              onPress={() => {
                isMom
                  ? navigation.navigate('AddApproveDecision', {
                      subjectsData: subjectData,
                      isEdit: false,
                      item: null
                    })
                  : navigation.navigate('AddEditDecision', {
                      meetingDetails: meetingData,
                      decisionId: null,
                      isEdit: false,
                      decisionData: null,
                      subjectId: subjectData?.subjectId
                    });
                // navigation.navigate('AddEditDecision', {
                //   meetingDetails: meetingData,
                //   isEdit: false,
                //   decisionData: null,
                //   subjectId: subjectData?.subjectId
                // });
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default LiveMeetingSubjectDecision;
