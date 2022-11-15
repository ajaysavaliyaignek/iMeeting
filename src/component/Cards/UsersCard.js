import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { PreventRemoveContext, useNavigation } from '@react-navigation/native';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';
import Avatar from '../Avatar/Avatar';
import EditDeleteModal from '../EditDeleteModal';
import CheckBox from '../checkBox/CheckBox';
import { getHighlightedText } from '../highlitedText/HighlitedText';

const UsersCard = ({
  item,
  index,
  external,
  setSelectAll,
  selectAll,
  allUserButton,
  searchText,
  selectUser,
  setSelectUser
}) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  // const [selectUser, setSelectUser] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [user, setUser] = useState([]);
  let user_list = [];

  useEffect(() => {
    if (isCheckAll) {
      // setUser([...user, item]);
      user_list.push(item);
      setSelectUser((pre) => {
        return [...pre, user_list];
      });
    } else {
      // let user_list = [];
      selectUser.filter((ite) => {
        ite.userId != item.userId;
      });
      // setUser(user_list);
    }

    // if (!isCheckAll) {
    //   const removeUser = user.filter((list) => {
    //     return list.userId !== item.userId;
    //   });
    //   setUser([...user, removeUser]);
    // }
  }, [isCheckAll]);

  console.log('user', user);

  const onDeleteHandler = () => {
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () => console.log('delete Pressed'),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  // committee row view
  const RowData = ({ name, discription, switchView }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {switchView ? (
          <Switch
            color={Colors.switch}
            value={item.privateDetails}
            // onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          />
        ) : (
          <Text style={styles.discription} numberOfLines={1}>
            {discription}
          </Text>
        )}
      </View>
    );
  };

  const handleSelectAll = (e) => {
    setSelectAll(!selectAll);
    setIsCheck(item?.map((li) => li.userId));
    if (selectAll) {
      console.log('select all user', item);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setEditModal(false)}
      key={item.id}
    >
      {index == 0 ? null : <Divider style={styles.divider} />}

      {/* committee details */}
      <TouchableOpacity style={styles.committeeDetailView} activeOpacity={0.5}>
        <View style={styles.userDetails}>
          <Avatar name={item.firstName} size={SIZES[32]} />
          <Text style={{ marginLeft: SIZES[12] }}>
            {getHighlightedText(
              `${item.firstName} ${item.secondName}`,
              searchText
            )}
          </Text>
          {/* <Text style={styles.txtCommitteeTitle}>
            {item.firstName} {item.secondName}
          </Text> */}
        </View>
        <View style={styles.userDetailsContainer}>
          <View>
            <RowData name={'ID'} discription={item.userId} />
            <RowData name={'E-mail'} discription={item.emails} />
            <RowData name={'Role'} discription={item.roles} />
            {external ? (
              <RowData name={'Private'} switchView={true} />
            ) : (
              <RowData name={'Number'} discription={item.phoneNumber} />
            )}
          </View>
          <CheckBox
            // value={selectAllUser || selectAllExternal ? true : selectUser}
            onValueChange={() => {
              allUserButton
                ? setSelectAll(!selectAll)
                : setIsCheckAll(!isCheckAll);
              // if (isCheckAll) {
              //   user.push(item);
              // } else user.pop(item);
            }}
            value={allUserButton ? true : isCheckAll}
          />
        </View>
      </TouchableOpacity>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[4]} />
      </TouchableOpacity>
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal onPressDelete={onDeleteHandler} download />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UsersCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[12]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    width: '60%'
  },
  committeeDetailView: {
    paddingVertical: SIZES[24]
    // paddingHorizontal: SIZES[16],
    // width: "100%",
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginLeft: SIZES[12]
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[16],
    top: SIZES[32]
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  },
  userDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  Checkbox: {
    borderRadius: SIZES[4],
    height: SIZES[24],
    width: SIZES[24]
  }
});
