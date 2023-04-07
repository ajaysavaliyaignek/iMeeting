import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { SIZES } from '../../../../themes/Sizes';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import UserDetailsComponent from '../../../../component/userDetailsComponent/UserDetailsComponent';
import SerachAndButtoncomponent from '../../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const AddEditUser = ({ generaldData, setGeneralData, type }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  let backUpUser = [];

  const onUpdateSelection = (items) => {
    let newUsers = [];

    items?.map((user) => {
      let indexPreviousUser =
        generaldData?.previousUser?.length > 0
          ? generaldData?.previousUser?.findIndex(
              (obj) => obj.userId === user?.userId
            )
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
          JSON.parse(
            JSON.stringify(generaldData?.previousUser[indexPreviousUser])
          )
        );

        // newUsers.push(previousUser[indexPreviousUser]);
      }
    });

    setGeneralData({ ...generaldData, previousUser: newUsers });
    setFilterData(newUsers);
  };

  const onChangeUserState = (item, isRequired) => {
    generaldData?.previousUser.map((user) => {
      if (user.userId === item.userId) {
        user.isRequired = isRequired;
      }
    });
    setGeneralData({
      ...generaldData,
      previousUser: [...generaldData?.previousUser]
    });
    // setPreviousUser([...previousUser]);
  };

  const searchFilterUsers = (text) => {
    if (text) {
      const newData = filterData?.filter((item) => {
        const itemData = item.firstName ? item.firstName : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setGeneralData({ ...generaldData, previousUser: newData });
    } else {
      setSearchText(text);
      setGeneralData({ ...generaldData, previousUser: filterData });
    }
  };

  const onDeleteHandler = (item) => {
    setVisibleIndex(-1);
    Alert.alert('Remove User', 'Are you sure you want to remove this?', [
      {
        text: 'Delete',
        onPress: () => {
          const filterData = generaldData?.previousUser.filter(
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
      <Text style={styles.txtAddSubjectTitle}>Users</Text>
      <SerachAndButtoncomponent
        isButtonShow={false}
        role={'Member'}
        onChangeText={(text) => {
          searchFilterUsers(text);
        }}
        value={searchText}
      />

      <TouchableOpacity
        style={styles.committeeView}
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate('Timeline', {
            selectedUsers: generaldData?.previousUser
          })
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
            committee: generaldData?.valueCommitee,
            previousUser: generaldData?.previousUser,
            onUpdateSelection: onUpdateSelection,
            type
          })
        }
      >
        <Text style={styles.txtCommittee}>Users</Text>
        <View style={styles.btnCommittees}>
          <Text style={styles.txtBtnCommittees}>
            Select{' '}
            {generaldData?.previousUser?.length > 0
              ? generaldData?.previousUser?.length
              : ''}
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
        users={generaldData?.previousUser}
        isUserRequired={true}
        isDeletable={true}
        committee={generaldData?.valueCommitee}
        isSwitchOnRow={true}
        onChangeUser={onChangeUserState}
        openPopup={true}
        searchText={searchText}
        onPressDelete={onDeleteHandler}
        visibleIndex={visibleIndex}
        setVisibleIndex={setVisibleIndex}
      />
    </TouchableOpacity>
  );
};

export default AddEditUser;
