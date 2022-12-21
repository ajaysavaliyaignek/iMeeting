import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import Voice from '@react-native-community/voice';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import { Icon, IconName } from '../../../../component';
import Header from '../../../../component/header/Header';
import { Button } from '../../../../component/button/Button';
import { styles } from './styles';
import { UserContext } from '../../../../context';
import UserDetailsComponent from '../../../../component/userDetailsComponent/UserDetailsComponent';

const EditMeetingUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const [searchText, setSearchText] = useState('');
  const { selectedUsers, meetingsData, setMeetingsData, setSelectedUsers } =
    useContext(UserContext);
  console.log('meeting data from edit user', meetingsData);
  const [required, setRequired] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [previousUser, setPreviousUser] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  let users = [];
  let requiredUsers = [];

  let backUpUser = [];

  useEffect(() => {
    let userData = [];
    item?.userDetails?.map((user) => {
      backUpUser.push(JSON.parse(JSON.stringify(user)));
      userData.push(JSON.parse(JSON.stringify(user)));
    });
    setPreviousUser(
      meetingsData?.userDetails ? meetingsData?.userDetails : userData
    );
    setFilterData(userData);
  }, []);

  // useEffect(() => {
  //   Voice.onSpeechStart = onSpeechStartHandler;
  //   Voice.onSpeechEnd = onSpeechEndHandler;
  //   Voice.onSpeechResults = onSpeechResultsHandler;

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);

  // const onSpeechStartHandler = (e) => {
  //   console.log('startHandler', e);
  // };

  // const onSpeechEndHandler = (e) => {
  //   console.log('onSpeechEndHandler', e);
  // };

  // const onSpeechResultsHandler = (e) => {
  //   console.log('onSpeechResultsHandler', e);
  //   let text = e.value[0];
  //   setSearchText(text);
  // };
  // const startRecording = async () => {
  //   try {
  //     await Voice.start('en-US');
  //   } catch (error) {
  //     console.log('voice error', error);
  //   }
  // };

  users = previousUser?.map((item) => item.userId);
  console.log('userId', users);
  requiredUsers = previousUser?.map((item) => item.isRequired);
  console.log('userRequired', requiredUsers);

  const onUpdateSelection = (items) => {
    let newUsers = [];

    items?.map((user) => {
      let indexPreviousUser =
        previousUser?.length > 0
          ? previousUser?.findIndex((obj) => obj.userId === user?.userId)
          : -1;
      if (indexPreviousUser === -1) {
        let index =
          backUpUser?.length > 0
            ? backUpUser?.findIndex((obj) => obj.userId === user.userId)
            : -1;
        if (index == -1) {
          newUsers.push(JSON.parse(JSON.stringify(user)));
        } else {
          newUsers.push(JSON.parse(JSON.stringify(backUpUser[index])));
        }
      } else {
        newUsers.push(
          JSON.parse(JSON.stringify(previousUser[indexPreviousUser]))
        );

        // newUsers.push(previousUser[indexPreviousUser]);
      }
    });

    setPreviousUser(newUsers);
    setFilterData(newUsers);
  };

  const onChangeUserState = (item, isRequired) => {
    console.log('required item NAme', item.userName);
    console.log('required item', isRequired);

    previousUser.map((user) => {
      if (user.userId === item.userId) {
        console.log('required item NAme', user.userName);
        console.log('required item', user.isRequired);
        user.isRequired = isRequired;
        console.log('required item', user.isRequired);
      }
    });
    setPreviousUser([...previousUser]);
  };

  const searchFilterUsers = (text) => {
    if (text) {
      const newData = filterData?.filter((item) => {
        const itemData = item.userName ? item.userName : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setPreviousUser(newData);
    } else {
      setSearchText(text);
      setPreviousUser(filterData);
    }
  };

  const onDeleteHandler = (item) => {
    setVisibleIndex(-1);
    Alert.alert('Remove User', 'Are you sure you want to remove this?', [
      {
        text: 'Delete',
        onPress: () => {
          const filterData = previousUser.filter(
            (user) => user.userId !== item.userId
          );
          setPreviousUser(filterData);
        },
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          setVisibleIndex(-1);
        }}
        activeOpacity={1}
      >
        <Header
          name={'Edit meeting'}
          rightIconName={IconName.Close}
          onRightPress={() => {
            navigation.navigate('Details', {
              title: 'Meetings',
              active: '0'
            });
          }}
        />

        <View style={styles.subContainer}>
          <View style={styles.progressContainer}>
            <Progress.Bar
              color={Colors.switch}
              progress={0.4}
              borderColor={Colors.white}
              unfilledColor={'#e6e7e9'}
              width={DeviceInfo.isTablet() ? 800 : 264}
            />
            <Text style={styles.txtProgress}>Step 2/5</Text>
          </View>
          <Text style={styles.txtAddSubjectTitle}>Users</Text>
          <View style={styles.searchContainer}>
            <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
            <TextInput
              style={styles.textInput}
              placeholder={'Search'}
              onChangeText={(text) => {
                searchFilterUsers(text);
              }}
            />

            <TouchableOpacity onPress={() => startRecording()}>
              <Icon
                name={IconName.Speaker}
                height={SIZES[15]}
                width={SIZES[10]}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.committeeView}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('Timeline', { selectedUsers: previousUser })
            }
          >
            <Text style={styles.txtCommittee}>Timeline</Text>
            <View style={styles.btnCommittees}>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.committeeView}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('SelectUsers', {
                committee: meetingsData.committee,
                previousUser: previousUser,
                onUpdateSelection: onUpdateSelection
              })
            }
          >
            <Text style={styles.txtCommittee}>Users</Text>
            <View style={styles.btnCommittees}>
              <Text style={styles.txtBtnCommittees}>
                Select {previousUser?.length}
              </Text>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <UserDetailsComponent
            users={previousUser}
            isUserRequired={true}
            isDeletable={true}
            committee={meetingsData.committee}
            isSwitchOnRow={true}
            onChangeUser={onChangeUserState}
            openPopup={true}
            searchText={searchText}
            onPressDelete={onDeleteHandler}
            visibleIndex={visibleIndex}
            setVisibleIndex={setVisibleIndex}
          />
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
              title={'Back'}
              onPress={() => {
                navigation.goBack();
                setMeetingsData({
                  ...meetingsData,
                  users: users,
                  userRequired: requiredUsers,
                  userDetails: previousUser
                });
              }}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Next'}
              onPress={() => {
                setMeetingsData({
                  ...meetingsData,
                  users: users,
                  userRequired: requiredUsers,
                  userDetails: previousUser
                });
                navigation.navigate('EditMeetingDateAndTime', { item: item });
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
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditMeetingUser;
