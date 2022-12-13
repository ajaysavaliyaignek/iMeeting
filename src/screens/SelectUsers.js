import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { useQuery } from '@apollo/client';
import Voice from '@react-native-community/voice';

import Header from '../component/header/Header';
import { Icon, IconName } from '../component';
import { SIZES } from '../themes/Sizes';
import { Colors } from '../themes/Colors';
import { Fonts } from '../themes';
import { Button } from '../component/button/Button';
import { GET_All_USERS } from '../graphql/query';
import Loader from '../component/Loader/Loader';
import UserDetailsComponent from '../component/userDetailsComponent/UserDetailsComponent';

const SelectUsers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { committee, previousUser, onUpdateSelection } = route?.params;
  //set all user to the list
  const [allUsers, setAllUsers] = useState();
  const [externalUser, setExternalUser] = useState();
  //set status of active tabs
  const [activeTab, setActiveTab] = useState('0');
  //used to search text
  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  var usersData = [];
  var externalUserData = [];
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('startHandler', e);
  };

  const onSpeechEndHandler = (e) => {
    console.log('onSpeechEndHandler', e);
  };

  const onSpeechResultsHandler = (e) => {
    console.log('onSpeechResultsHandler', e);
    let text = e.value[0];
    setSearchText(text);
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('voice error', error);
    }
  };

  const setOnAllUserClick = (item) => {
    allUsers.map((user) => {
      if (user.userId === item.userId) {
        user.isSelected = !user.isSelected;
      }
    });
    setAllUsers([...allUsers]);
  };

  const setOnExternalUserClick = (item) => {
    externalUser.map((user) => {
      if (user.userId === item.userId) {
        user.isSelected = !user.isSelected;
      }
    });
    setExternalUser([...externalUser]);
  };

  const setAllUserSelected = () => {
    allUsers.map((user) => {
      user.isSelected = true;
    });
    setAllUsers([...allUsers]);

    externalUser.map((user) => {
      user.isSelected = true;
    });
    setExternalUser([...externalUser]);
  };

  const setSelectedUserInSelectedList = () => {
    const selectedUserList = [];
    allUsers.map((user) => {
      if (user.isSelected) {
        selectedUserList.push(user);
      }
    });

    externalUser.map((user) => {
      if (user.isSelected) {
        selectedUserList.push(user);
      }
    });
    onUpdateSelection(selectedUserList);
    // setSelectedUsers(selectedUserList);

    navigation.goBack();
  };

  // get users data from the server
  const { loading: UsersLoading, error: UsersError } = useQuery(GET_All_USERS, {
    variables: {
      isDeleted: true,
      externalUser: false,
      searchValue: searchText,
      organizationId: committee
    },
    onCompleted: (data) => {
      usersData = data?.committeeMembersList.items.map((item, index) => {
        let previousUserIndex = previousUser?.findIndex(
          (user) => user.userId === item.userId
        );
        let isSelected = false;
        let isRequired = false;

        if (previousUserIndex >= 0) {
          isSelected = true;
        }
        return { ...item, isSelected, isRequired };
      });
      if (usersData) {
        //set all user to the user list
        setAllUsers(usersData);
      }
    }
  });

  // get external user
  const { loading: externalUsersLoading, error: externalUsersError } = useQuery(
    GET_All_USERS,
    {
      variables: {
        isDeleted: true,
        externalUser: true,
        searchValue: searchText
      },
      onCompleted: (data) => {
        console.log('externaluserdata', data.committeeMembersList.items);
        externalUserData = data?.committeeMembersList.items.map(
          (item, index) => {
            let previousUserIndex = previousUser?.findIndex(
              (user) => user.userId === item.userId
            );
            let isSelected = false;
            let isRequired = false;

            if (previousUserIndex >= 0) {
              isSelected = true;
            }

            return { ...item, isSelected, isRequired };
          }
        );
        if (externalUserData) {
          setExternalUser(externalUserData);
        }
        // if (data) {
        //   setExternalUser(data?.committeeMembersList.items);
        // }
      }
    }
  );

  if (externalUsersError) {
    console.log('externalUsersError error', externalUsersError);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Header
        name={'Select user'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            placeholderTextColor={Colors.secondary}
            onChangeText={
              (text) =>
                activeTab == '0'
                  ? setSearchText(text)
                  : activeTab == '1'
                  ? setSearchText(text)
                  : null
              // searchFilterUsers(text, user, setSearchText, setFilterData)
            }
          />
          <TouchableOpacity onPress={() => startRecording()}>
            <Icon
              name={IconName.Speaker}
              height={SIZES[15]}
              width={SIZES[10]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.btnContainer}>
          <Button
            title={'Users'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '0' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('0')}
          />

          {/* add external user button */}
          <Button
            title={'External users '}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '1' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('1')}
          />
        </View>

        {/* users */}
        {activeTab === '0' && (
          <View style={{ flex: 1 }}>
            <Divider style={styles.divider} />
            {UsersLoading ? (
              <Loader />
            ) : (
              <UserDetailsComponent
                users={allUsers}
                isGeneralUser={true}
                committee={committee}
                onChecked={setOnAllUserClick}
                isCheckboxView={true}
                visibleIndex={visibleIndex}
                setVisibleIndex={setVisibleIndex}
                openPopup={true}
                searchText={searchText}
              />
            )}
          </View>
        )}

        {/* extternal users */}
        {activeTab === '1' && (
          <View style={{ flex: 1 }}>
            <Button
              title={'Add external user'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              onPress={() => navigation.navigate('AddExternalUser')}
            />
            <Divider style={styles.divider} />
            {externalUsersLoading ? (
              <Loader />
            ) : (
              <UserDetailsComponent
                users={externalUser}
                isExternalUser={true}
                committee={committee}
                onChecked={setOnExternalUserClick}
                isCheckboxView={true}
                isSwichDisabled={true}
                visibleIndex={visibleIndex}
                setVisibleIndex={setVisibleIndex}
                openPopup={true}
                searchText={searchText}
              />
            )}
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
            title={'Select all users'}
            onPress={() => setAllUserSelected()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add user'}
            onPress={() => setSelectedUserInSelectedList()}
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

export default SelectUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  subContainer: {
    // paddingHorizontal: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[22],
    justifyContent: 'center',
    // height: SIZES[36],
    marginHorizontal: SIZES[16]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6],
    // height: SIZES[36],
    paddingVertical: 8
  },
  btnUsers: {
    paddingVertical: SIZES[8],
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    marginBottom: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-between',
    marginHorizontal: SIZES[16]
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnExternalUser: {
    backgroundColor: Colors.Blue_Light,
    marginBottom: SIZES[16]
  },
  txtBtnExternal: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  }
});
