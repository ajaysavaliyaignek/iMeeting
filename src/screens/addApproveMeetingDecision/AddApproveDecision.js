import { View, Text, SafeAreaView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import DropDownPicker from '../../component/DropDownPicker/DropDownPicker';
import moment from 'moment';
import { SIZES } from '../../themes/Sizes';
import { GET_ALL_SUBJECTS_STATUS } from '../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { Colors } from '../../themes/Colors';
import { Button } from '../../component/button/Button';
import { Divider } from 'react-native-paper';
import { UPDATE_DECISION } from '../../graphql/mutation';
import { Fonts } from '../../themes';

const AddApproveDecision = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subjectsData, isEdit, item } = route?.params;
  const [decisionItems, setDecisionItems] = useState([]);
  const [valueApproveDecision, setApporoveDecision] = useState(
    isEdit ? item?.statusId : null
  );
  const [statusName, setStatusName] = useState('');
  const [comment, setComment] = useState(isEdit ? item?.description : '');

  console.log('item', item);

  // get decision status for dropdown
  const {
    loading: decisionStatusLoading,
    error: decisionStatusLoadingError,
    data: decisionStatusLoadingData
  } = useQuery(GET_ALL_SUBJECTS_STATUS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      subject: false,
      decision: false,
      approveDecision: true,
      momDecision: false
    },

    onCompleted: (data) => {
      console.log('decision status', data.subjectStatus.items);
      // setSubjectList(data?.subjects.items);
      setDecisionItems(data.subjectStatus.items);

      // setSubjectData(data?.subjects.items);
    },
    onError: (data) => {
      console.log('decision error---', data.message);
    }
  });

  const [
    updateDecision,
    { data, loading: addDecisionLoading, error: addDecisionError }
  ] = useMutation(UPDATE_DECISION, {
    refetchQueries: ['decisions', 'subjects'],
    onCompleted: (data) => {
      if (data) {
        console.log('update Decision', data?.updateDecision?.status);
        if (data.updateDecision.status[0].statusCode == '200') {
          navigation.goBack();
        }
      }
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Approve decision'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <DropDownPicker
          disable={true}
          value={subjectsData?.committeeName}
          title={'committee title'.toUpperCase()}
          placeholder={subjectsData?.committeeName}
        />
        <DropDownPicker
          disable={true}
          title={'date of approval'.toUpperCase()}
          value={moment(new Date()).format('DD.MM.YYYY')}
          placeholder={moment(new Date()).format('DD.MM.YYYY')}
        />
        <DropDownPicker
          data={decisionItems?.map((item) => ({
            label: item.statusTitle,
            value: item.statusId
          }))}
          placeholder={''}
          setData={setApporoveDecision}
          value={valueApproveDecision}
          title={'STATUS'}
          setValueDecisionName={setStatusName}
        />
        {statusName === 'Approve with comment' && (
          <View style={{ marginTop: SIZES[24] }}>
            <Text
              style={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
            >
              COMMENTS
            </Text>
            <TextInput
              style={{ paddingVertical: 10, maxHeight: 200 }}
              multiline={true}
              onChangeText={(text) => setComment(text)}
              value={comment}
            />
            <Divider style={styles.divider} />
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
            isLoading={addDecisionLoading}
            disable={
              subjectsData?.committeeName === '' ||
              valueApproveDecision === null
                ? true
                : false
            }
            // isLoading={addVotingLoading}
            onPress={() => {
              console.log('update decision data ', {
                decisionId: isEdit ? decisionId : 0,
                subjectId: subjectsData?.subjectId,
                committeeId: subjectsData?.committeeId,
                committeeName: subjectsData?.committeeName,
                statusId: valueApproveDecision,
                description: comment,
                attachFileIds: [],
                meetingId: 0,
                dateOfCreation: moment(new Date()).format('DD/MM/YYYY'),
                statusTitle: '',
                id: 1
              });
              updateDecision({
                variables: {
                  decision: {
                    decisionId: isEdit ? item?.decisionId : 0,
                    subjectId: subjectsData?.subjectId,
                    committeeId: subjectsData?.committeeId,
                    committeeName: subjectsData?.committeeName,
                    statusId: valueApproveDecision,
                    description: comment,
                    attachFileIds: [],
                    meetingId: 0,
                    dateOfCreation: moment(new Date()).format('DD/MM/YYYY'),
                    statusTitle: '',
                    id: 1
                  }
                }
              });
            }}
            layoutStyle={[
              {
                opacity:
                  subjectsData?.committeeName === '' ||
                  valueApproveDecision === null
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

export default AddApproveDecision;
