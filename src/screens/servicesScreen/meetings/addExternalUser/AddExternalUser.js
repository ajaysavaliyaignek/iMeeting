import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import Avatar from '../../../../component/Avatar/Avatar';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { useMutation } from '@apollo/client';
import { UPDATE_COMMITTEE_USER } from '../../../../graphql/mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_All_USERS } from '../../../../graphql/query';
import RNFetchBlob from 'rn-fetch-blob';
import { Fonts } from '../../../../themes';

const AddExternalUser = () => {
  const route = useRoute();
  const { type } = route?.params;
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [sensSMS, setSendSMS] = useState(false);
  const [savaDatabase, setSaveDatabase] = useState(false);
  const [privateDetails, setPrivateDetails] = useState(false);
  const [profileImage, setprofileImage] = useState('');
  const [user, setUser] = useState(null);
  const [base64Url, setBase64Url] = useState(null);
  const [error, setError] = useState('');

  const [
    addExternalUser,
    {
      data: addExternalUserData,
      loading: addExternalUserLoading,
      error: addExternalUserError
    }
  ] = useMutation(UPDATE_COMMITTEE_USER, {
    refetchQueries: [
      'committeeMembersList'
      // {
      //   query: GET_All_USERS,
      //   variables: { isDeleted: false, externalUser: true, searchValue: '' }
      // }
    ],
    onCompleted: (data) => {
      console.log({ data: data.updateCommitteeMember });
      if (data.updateCommitteeMember.status.statusCode == '200') {
        navigation.goBack();
        setEmail('');
        setFirstName('');
        setSecondName('');
        setLastName('');
        setNumber('');
        setOrganization('');
      }
    },
    onError: (data) => {
      console.log('addExternalUserError', data.message);
      setError('Add External User Error.');
    }
  });

  useEffect(() => {
    getUser();
  }, [user]);

  const getUser = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );

    setUser(JSON.parse(user));
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.images]
      });

      const result = await RNFetchBlob.fs
        .readFile(
          Platform.OS === 'android'
            ? response.uri
            : response.uri.replace('file://', ''),
          'base64'
        )
        .then((basedata) => {
          setBase64Url(`'data:${response.type};base64,${basedata}'`);
        });
      setprofileImage(response?.uri);
      // const base64 = await result.onData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  function emailValidation() {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email || regex.test(email) === false) {
      setError('Email is not valid');

      return false;
    }
    return true;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add external user'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* avatar */}
        <TouchableOpacity
          style={styles.profilePicContainer}
          onPress={() => handleDocumentSelection()}
        >
          <Avatar
            name={firstName}
            size={120}
            backgroundColor={'#E79D73'}
            source={profileImage}
          />
        </TouchableOpacity>

        {/* details */}
        {/* FIRST NAME */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>FIRST NAME</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>

        {/* SECOND NAME */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>SECOND NAME</Text>
          <TextInput
            style={styles.textInput}
            value={secondName}
            onChangeText={(text) => setSecondName(text)}
          />
        </View>

        {/* LAST NAME */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>LAST NAME</Text>
          <TextInput
            style={styles.textInput}
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        {/* ORGANIZATION */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>ORGANIZATION</Text>
          <TextInput
            style={styles.textInput}
            value={organization}
            onChangeText={(text) => setOrganization(text)}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>E-MAIL</Text>
          <TextInput
            onEndEditing={() => {
              if (emailValidation()) {
                setError('');
              }
            }}
            keyboardType="email-address"
            style={styles.textInput}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          {error == 'Email is not valid' && (
            <Text
              style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.Rejected }}
            >
              {error == 'Email is not valid' && error}
            </Text>
          )}
        </View>

        {/* NUMBER */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>NUMBER</Text>
          <TextInput
            keyboardType="name-phone-pad"
            style={styles.textInput}
            value={number}
            onChangeText={(text) => setNumber(text)}
          />
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Send SMS</Text>
          <Switch
            value={sensSMS}
            onValueChange={() => setSendSMS(!sensSMS)}
            color={Colors.switch}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Save to database</Text>
          <Switch
            value={savaDatabase}
            onValueChange={() => setSaveDatabase(!savaDatabase)}
            color={Colors.switch}
          />
        </View>
        <View style={[styles.rowContainer, { marginBottom: 24 }]}>
          <Text style={styles.txtLabel}>Private details</Text>
          <Switch
            value={privateDetails}
            onValueChange={() => setPrivateDetails(!privateDetails)}
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
        {error !== '' && (
          <View style={{ alignItems: 'center', paddingBottom: 30 }}>
            <Text
              style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.Rejected }}
            >
              {error == 'Add External User Error.' && error}
            </Text>
          </View>
        )}
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
            title={'Save'}
            isLoading={addExternalUserLoading}
            onPress={() => {
              if (emailValidation()) {
                addExternalUser({
                  variables: {
                    committeeMember: {
                      attachFiles: [],
                      emails: [email],
                      externalUser: true,
                      externalUserOrganization: organization,
                      familyName: lastName,
                      firstName: firstName,
                      googleCalendarSync: false,
                      organizationIds: [],
                      organizations: [],
                      outlookCalendarSync: false,
                      phoneNumber: number,
                      privateDetails: privateDetails,
                      profilePicture: base64Url,
                      roles: [],
                      secondName: secondName,
                      sendSMS: sensSMS,
                      thirdName: '',
                      title: '',
                      userId: 0
                    }
                  }
                });
              }

              // navigation.navigate('AddMeetingUser')
            }}
            layoutStyle={[
              styles.nextBtnLayout,
              {
                opacity:
                  firstName !== '' ||
                  secondName !== '' ||
                  lastName !== '' ||
                  email !== '' ||
                  number !== ''
                    ? 1
                    : 0.5
              }
            ]}
            textStyle={styles.txtNextBtn}
            disable={
              firstName !== '' ||
              secondName !== '' ||
              lastName !== '' ||
              email !== '' ||
              number !== ''
                ? false
                : true
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddExternalUser;
