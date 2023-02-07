import { SafeAreaView, ScrollView, View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLazyQuery, useQuery } from '@apollo/client';

import { Button } from '../../component/button/Button';
import { Client } from '../../graphql/Client';
import { styles } from './styles';
import Avatar from '../../component/Avatar/Avatar';
import { Colors } from '../../themes/Colors';
import {
  GET_All_COMMITTEE,
  GET_COMMITTEE_MEMBER_BY_ID,
  GET_FILE,
  GET_USER_PAYLOAD
} from '../../graphql/query';
import { SIZES } from '../../themes/Sizes';
import SerachAndButtoncomponent from '../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import { Fonts } from '../../themes';
import AttachFiles from '../../component/attachFiles/AttachFiles';
import CommitteesCard from '../../component/Cards/CommitteesCard';

const ProfileScreen = ({ navigation }) => {
  const [fileResponse, setFileResponse] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Details');
  const [committees, setCommittees] = useState([]);
  const [searchText, setSearchText] = useState('');

  const Committes = useQuery(GET_All_COMMITTEE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      page: -1,
      pageSize: -1,
      searchValue: searchText,
      isDeleted: true
    },
    onCompleted: (data) => {
      console.log('all committes', data.committees.items);
      setCommittees(data.committees.items);
    },
    onError: (data) => {
      console.log('get all committees error', data.message);
    }
  });

  const Logout = async () => {
    try {
      await AsyncStorage.getAllKeys()
        .then(async (keys) => {
          await AsyncStorage.multiRemove(keys);
        })

        .then(async () => {
          await Client().cache.reset();
          Client().resetStore();
        })
        .then(
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          })
        );
      // .then(NativeModules.DevSettings.reload());
    } catch (error) {
      console.log(error);
    }
  };

  const [getUserBYId] = useLazyQuery(GET_COMMITTEE_MEMBER_BY_ID, {
    onCompleted: (data) => {
      setUser(data?.committeeMemberById);
    },
    onError: (data) => {
      console.log('getUserBYId error', data.message);
    }
  });

  // get user details
  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('user data', data.userPayload);
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
    <SafeAreaView style={styles.container}>
      {/* <Header name={'Profile'} /> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: SIZES[16],
          marginVertical: SIZES[10]
        }}
      >
        <Text
          style={{
            ...Fonts.PoppinsSemiBold[14],
            color: Colors.bold,
            marginLeft: '40%'
          }}
        >
          Profile
        </Text>
        <Button
          title={'Logout'}
          textStyle={{ color: Colors.primary }}
          layoutStyle={{
            backgroundColor: null,
            paddingVertical: 0,
            justifyContent: 'flex-end',
            borderBottomWidth: 1,
            borderBottomColor: Colors.primary
          }}
          onPress={() => {
            Logout();
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <View style={styles.btnContainer}>
          <Button
            title={'Details'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === 'Details' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => {
              setActiveTab('Details');
            }}
          />

          {/* add external user button */}
          <Button
            title={'Committees'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === 'Committees' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('Committees')}
          />
        </View>
        {/* avatar */}

        {/* details */}
        {/* FIRST NAME */}
        {activeTab == 'Details' && (
          <ScrollView
            style={{
              flex: 1,
              marginTop: SIZES[24],
              marginHorizontal: SIZES[16]
            }}
          >
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

            <Button
              title={'Google calendar'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              iconName={require('../../assets/Icons/GoogleCalendar.png')}
            />
            <Button
              title={'Outlook calendar'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              iconName={require('../../assets/Icons/OutlookCalendar.png')}
            />

            <AttachFiles
              fileResponse={fileResponse}
              setFileResponse={setFileResponse}
              showAttachButton={true}
              deleted={false}
              download={true}
              isShowAttchTitle={true}
            />
          </ScrollView>
        )}
        {activeTab == 'Committees' && (
          <View style={{ flex: 1 }}>
            <SerachAndButtoncomponent
              isButtonShow={false}
              onChangeText={setSearchText}
              value={searchText}
              role={'Member'}
            />
            <FlatList
              data={committees}
              keyExtractor={(item, index) => item.organizationId}
              renderItem={({ item, index }) => {
                return (
                  <CommitteesCard
                    item={item}
                    index={index}
                    searchText={searchText}
                    isProfileCommittee={true}
                  />
                );
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
