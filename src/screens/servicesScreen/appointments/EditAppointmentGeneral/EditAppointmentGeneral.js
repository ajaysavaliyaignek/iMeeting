import { View, Text, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { useState, useCallback, useEffect, useContext } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useLazyQuery, useQuery } from '@apollo/client';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { SIZES } from '../../../../themes/Sizes';
import { styles } from './styles';
import {
  GET_All_COMMITTEE,
  GET_APPOINTMENT_BY_ID,
  GET_COMMITTEES_BY_ROLE,
  GET_FILE
} from '../../../../graphql/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../../context';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';
import AttachFiles from '../../../../component/attachFiles/AttachFiles';

const EditAppointmentGeneral = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route?.params;
  const { appointmentsData, setAppointmentsData } = useContext(UserContext);
  const [token, setToken] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [title, setTitle] = useState(data?.appointmentTitle);
  const [discription, setDiscription] = useState(data?.appointmentDescription);
  const [valueCommitee, setValue] = useState(data?.committeeId);
  const [committee, setCommittee] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  let fileId = data?.attachFileIds;

  fileId?.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        if (data) {
          setFileResponse((prev) => {
            const pevDaa = prev.filter((ite) => {
              return ite.fileEnteryId !== data.fileEnteryId;
            });
            return [...pevDaa, data.uploadedFile];
          });
        }
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

  const GetAppointmentById = useQuery(GET_APPOINTMENT_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: data?.appointmentId
    },
    onCompleted: (data) => {
      if (data) {
        setAppointment(data.appointment);
      }
    },
    onError: (data) => console.log('error from get appointment by id', data)
  });

  useEffect(() => {
    getToken();
  }, [token]);

  const getToken = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );
    setToken(JSON.parse(user)?.dataToken);
  };

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

  // fetch commitees
  const { loading: CommitteeLoading, error: CommitteeError } = useQuery(
    GET_COMMITTEES_BY_ROLE,
    {
      fetchPolicy: 'cache-and-network',
      variables: { head: true, secretary: true, member: false ,type:4},
      onCompleted: (data) => {
        if (data) {
          setCommittee(data.committeesByRole.items);
        }
      }
    }
  );
  if (CommitteeError) {
    console.log('commitee error', CommitteeError);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit appointment'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.navigate('AppointmentsList')}
      />

      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.25}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 1/4</Text>
        </View>
        <Text style={styles.txtAddSubjectTitle}>General</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* dropdown committee */}
          <DropDownPicker
            data={committee?.map((item) => ({
              label: item.committeeTitle,
              value: item.organizationId
            }))}
            placeholder={appointment?.committeeName}
            setData={setValue}
            title={'CHOOSE COMMITTEE'}
            value={valueCommitee}
            disable={true}
          />

          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text)}
              value={title}
            />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.txtTitle}>DESCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={(text) => setDiscription(text)}
              value={discription}
            />
          </View>
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
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Next'}
            onPress={() => {
              setAppointmentsData({
                ...appointmentsData,
                attachFiles: filesId,
                committee: valueCommitee,
                title: title,
                discription: discription
              });
              navigation.navigate('EditAppointmentUsers', {
                attachFiles: filesId,
                committee: valueCommitee,
                title: title,
                discription: discription,
                item: data
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

export default EditAppointmentGeneral;
