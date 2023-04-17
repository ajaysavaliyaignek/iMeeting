import { View, Text, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import { Button } from '../../../component/button/Button';
import AttachFiles from '../../../component/attachFiles/AttachFiles';
import { styles } from './styles';
import {
  GET_COMMITTEE_MEMBER_BY_ID,
  GET_FILE,
  GET_USER_PAYLOAD
} from '../../../graphql/query';
import Avatar from '../../../component/Avatar/Avatar';
import CheckBox from '../../../component/checkBox/CheckBox';
import Loader from '../../../component/Loader/Loader';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';

const ProfileDetails = () => {
  const [fileResponse, setFileResponse] = useState([]);
  const [user, setUser] = useState(null);

  const [getUserBYId, { loading, error }] = useLazyQuery(
    GET_COMMITTEE_MEMBER_BY_ID,
    {
      fetchPolicy: 'cache-and-network',
      onCompleted: (data) => {
        console.log('getUserBYId', data?.committeeMemberById);
        setUser(data?.committeeMemberById);
      },
      onError: (data) => {
        console.log('getUserBYId error', data.message);
      }
    }
  );

  //Get meeting attachments
  user?.attachFiles?.map((id) => {
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

  // get user details
  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      // setCommittees(data.userPayload.userCommitteesDetail);

      getUserBYId({
        variables: {
          userId: data.userPayload.userId
        }
      });
    },
    onError: (data) => {
      console.log('getUserDetails', data.message);
    }
  });

  //Get meeting attachments
  user?.attachFileIds?.map((id) => {
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

  return (
    <View style={{ flex: 1 }}>
      {loading || getUserDetails.loading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Loader color={Colors.primary} size={'large'} />
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            {error.message == 'Network request failed'
              ? 'No Internet connection'
              : 'Something went wrong.'}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.profilePicContainer}>
            <Avatar
              name={user?.firstName}
              size={120}
              backgroundColor={'#E79D73'}
              source={user?.profilePicture}
            />
          </View>
          <View style={styles.rowContainer}>
            <View style={[styles.titleContainer, { width: '48%' }]}>
              <Text style={styles.txtTitle}>TITLE</Text>
              <Text style={styles.textInput}>
                {user?.title == null ? '-' : user?.title}
              </Text>
            </View>
            <View style={[styles.titleContainer, { width: '48%' }]}>
              <Text style={styles.txtTitle}>FIRST NAME</Text>
              <Text style={styles.textInput}>
                {user?.firstName == null ? '-' : user?.firstName}
              </Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            {/* SECOND NAME */}
            <View style={[styles.titleContainer, { width: '48%' }]}>
              <Text style={styles.txtTitle}>SECOND NAME</Text>
              <Text style={styles.textInput}>
                {user?.secondName == null ? '-' : user?.secondName}
              </Text>
            </View>

            {/* thirdName */}
            <View style={[styles.titleContainer, { width: '48%' }]}>
              <Text style={styles.txtTitle}>THIRD NAME</Text>
              <Text style={styles.textInput}>
                {user?.thirdName == null ? '-' : user?.thirdName}
              </Text>
            </View>
          </View>

          {/* LAST NAME */}
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>FAMILY NAME</Text>
            <Text style={styles.textInput}>
              {user?.familyName == null ? '-' : user?.familyName}
            </Text>
          </View>

          <Text style={styles.txtContacts}>Contacts</Text>
          {/* EMAIL */}
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>E-MAIL</Text>
            <Text style={styles.textInput}>
              {user?.emails == null ? '-' : user?.emails}
            </Text>
          </View>

          {/* NUMBER */}
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>NUMBER</Text>
            <Text style={styles.textInput}>
              {user?.phoneNumber == null ? '-' : user?.phoneNumber}
            </Text>
          </View>

          <Text style={styles.txtContacts}>Calendar sync</Text>
          <View style={styles.rowCalendarContainer}>
            <Button
              title={'Google calendar'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              iconName={require('../../../assets/Icons/GoogleCalendar.png')}
              disable={true}
            />
            <Switch
              disabled
              value={
                user?.googleCalendarSync == null
                  ? false
                  : user?.googleCalendarSync == true
                  ? true
                  : false
              }
            />
          </View>

          <View style={styles.rowCalendarContainer}>
            <Button
              title={'Outlook calendar'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              iconName={require('../../../assets/Icons/OutlookCalendar.png')}
              disable={true}
            />
            <Switch
              disabled
              value={
                user?.outlookCalendarSync == null
                  ? false
                  : user?.outlookCalendarSync == true
                  ? true
                  : false
              }
            />
          </View>

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
        </ScrollView>
      )}
    </View>
  );
};

export default ProfileDetails;
