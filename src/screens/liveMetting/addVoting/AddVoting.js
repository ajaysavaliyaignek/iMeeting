import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Switch,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import Header from '../../../component/header/Header';
import { Icon, IconName } from '../../../component';
import { styles } from './styles';
import MeetingSubjectTypeComponent from '../../../component/meetingSubjectTypesComponent/MeetingSubjectTypeComponent';
import { Button } from '../../../component/button/Button';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import { UPDATE_VOTING } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { GET_VOTING_DETAILS } from '../../../graphql/query';

const AddVoting = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingDetails, isAddVotingScreen, votingDetails } = route?.params;
  const [valueType, setValueType] = useState(
    !isAddVotingScreen
      ? votingDetails?.subjectId == 0
        ? 'Meeting'
        : 'Subject'
      : null
  );
  const [valueSubject, setValueSubject] = useState(
    !isAddVotingScreen ? votingDetails?.subjectId : null
  );
  const [switchPrivate, setSwitchPrivate] = useState(
    !isAddVotingScreen ? votingDetails?.isPrivate : false
  );
  const [switchMultiple, setSwitchMultiple] = useState(
    !isAddVotingScreen ? votingDetails?.isMultipleSelect : false
  );

  const newAnsArray = votingDetails?.answerIds?.map((answer, i) => {
    return {
      id: answer,
      text: votingDetails?.answers[i]
    };
  });
  const [answerObject, setAnswerObject] = useState(
    !isAddVotingScreen ? newAnsArray : [{ text: '', id: 0 }]
  );
  const [titleVoting, setTitleVoting] = useState(
    !isAddVotingScreen ? votingDetails?.votingTitle : ''
  );

  const answersIds = answerObject?.map((answer) => {
    return answer?.id;
  });

  const answersText = answerObject?.map((answer) => {
    return answer?.text;
  });

  const [
    addVoting,
    { data, loading: addVotingLoading, error: addVotingError }
  ] = useMutation(UPDATE_VOTING, {
    refetchQueries: ['votingDetails'],
    onCompleted: (data) => {
      if (data) {
        console.log(data.addVotingQuestion.status);
        if (data.addVotingQuestion.status.statusCode == '200') {
          navigation.goBack();
        }
      }
    },
    onError: (data) => {
      console.log('addVoting error', data.message);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={isAddVotingScreen ? 'Add voting' : 'Edit voting'}
        rightIconName={IconName.Close}
        onRightPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.subContainer}>
        <Text style={styles.txtTitleAddVoting}>
          {isAddVotingScreen ? 'Add voting' : 'Edit voting'}
        </Text>
        <MeetingSubjectTypeComponent
          valueType={valueType}
          setValueType={setValueType}
          valueSubject={valueSubject}
          setValueSubject={setValueSubject}
          meetingDetails={meetingDetails}
        />
        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>TITLE VOTING</Text>
          <TextInput
            value={titleVoting}
            style={styles.textInput}
            onChangeText={(text) => {
              setTitleVoting(text);
            }}
          />
          <Divider style={styles.divider} />
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.txtTitleVoting}>ANSWERS</Text>

          {answerObject?.map((answer, index) => {
            return (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: SIZES[6]
                  }}
                >
                  <TextInput
                    value={answer?.text}
                    style={styles.textInput}
                    placeholder={`Answer ${index + 1}`}
                    onChangeText={(text) => {
                      setAnswerObject((prev) => {
                        prev[index].text = text;

                        return [...prev];
                      });

                      console.log('answer array on change text', answerObject);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let removedArray = answerObject?.splice(index, 1)[0];

                      // setAnswerArray(removedArray);
                      setAnswerObject([...answerObject]);
                    }}
                    style={{
                      height: SIZES[24],
                      width: SIZES[24],
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon
                      name={IconName.Close}
                      height={SIZES[12]}
                      width={SIZES[12]}
                    />
                  </TouchableOpacity>
                </View>
                <Divider style={styles.divider} />
              </View>
            );
          })}
        </View>
        <Button
          title={'Add answer'}
          layoutStyle={styles.cancelBtnLayout}
          textStyle={styles.txtCancelButton}
          onPress={() => {
            answerObject?.push({
              text: '',
              id: 0
            });
            setAnswerObject([...answerObject]);
          }}
        />
        <Divider style={styles.divider} />
        <View
          style={[
            styles.rowContainer,
            {
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              paddingVertical: SIZES[8]
            }
          ]}
        >
          <Text style={styles.txtLabel}>Private</Text>
          <Switch
            value={switchPrivate}
            onValueChange={() => {
              setSwitchPrivate(!switchPrivate);
            }}
            color={Colors.switch}
          />
        </View>
        <View
          style={[
            styles.rowContainer,
            {
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              paddingVertical: SIZES[8],
              marginBottom: SIZES[16]
            }
          ]}
        >
          <Text style={styles.txtLabel}>Select multiple</Text>
          <Switch
            value={switchMultiple}
            onValueChange={() => {
              setSwitchMultiple(!switchMultiple);
            }}
            color={Colors.switch}
          />
        </View>
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
              console.log('answer array on save', answerObject);
              console.log('add edit voting data', {
                answerIds: answersIds,
                answers: answersText,
                isMultipleSelect: switchMultiple,
                isPrivate: switchPrivate,
                meetingId:
                  valueType == 'Meeting' ? meetingDetails?.meetingId : 0,
                subjectId: valueSubject == null ? 0 : valueSubject,
                type: 1,
                votingId: 0,
                votingTitle: titleVoting
              });
              addVoting({
                variables: {
                  voting: {
                    answerIds: answersIds,
                    answers: answersText,
                    isMultipleSelect: switchMultiple,
                    isPrivate: switchPrivate,
                    meetingId: meetingDetails?.meetingId,
                    subjectId: valueSubject == null ? 0 : valueSubject,
                    type: valueType == 'Meeting' ? 1 : 2,
                    votingId: !isAddVotingScreen ? votingDetails?.votingId : 0,
                    votingTitle: titleVoting
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

export default AddVoting;
