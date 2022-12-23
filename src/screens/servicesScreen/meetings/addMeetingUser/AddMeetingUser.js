import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import UserDetailsComponent from '../../../../component/userDetailsComponent/UserDetailsComponent';

const AddMeetingUser = ({ previousUser, setPreviousUser, committee }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  let backUpUser = [];

  const onUpdateSelection = (items) => {
    let newUsers = [];
    console.log('Selected user from add appointment', items);

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
        const itemData = item.firstName ? item.firstName : '';
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
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      activeOpacity={1}
    >
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
              committee: committee,
              previousUser: previousUser,
              onUpdateSelection: onUpdateSelection
            })
          }
        >
          <Text style={styles.txtCommittee}>Users</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>
              Select {previousUser?.length > 0 ? previousUser?.length : ''}
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
          committee={committee}
          isSwitchOnRow={true}
          onChangeUser={onChangeUserState}
          openPopup={true}
          searchText={searchText}
          onPressDelete={onDeleteHandler}
          visibleIndex={visibleIndex}
          setVisibleIndex={setVisibleIndex}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AddMeetingUser;
