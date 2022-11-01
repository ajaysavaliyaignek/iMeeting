import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';
import Avatar from '../Avatar/Avatar';
import EditDeleteModal from '../EditDeleteModal';
import CheckBox from '../checkBox/CheckBox';

const UsersCard = ({
  item,
  index,
  external,
  selectAllUser,
  selectAllExternal
}) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const [selectUser, setSelectUser] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

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
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          />
        ) : (
          <Text style={styles.discription}>{discription}</Text>
        )}
      </View>
    );
  };

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setEditModal(false)}>
      {index == 0 ? null : <Divider style={styles.divider} />}

      {/* committee details */}
      <TouchableOpacity style={styles.committeeDetailView} activeOpacity={0.5}>
        <View style={styles.userDetails}>
          <Avatar name={item.name} source={item.profile} size={SIZES[32]} />
          <Text style={styles.txtCommitteeTitle}>{item.name}</Text>
        </View>
        <View style={styles.userDetailsContainer}>
          <View>
            <RowData name={'ID'} discription={item.id} />
            <RowData name={'E-mail'} discription={item.email} />
            <RowData name={'Role'} discription={item.role} />
            {external ? (
              <RowData name={'Private'} switchView={true} />
            ) : (
              <RowData name={'Number'} discription={item.number} />
            )}
          </View>
          <CheckBox
            // value={selectAllUser || selectAllExternal ? true : selectUser}
            onPress={() => {
              setSelectUser(!selectUser);
            }}
            selected={selectUser}
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
          <EditDeleteModal onPressDelete={onDeleteHandler} />
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
    color: Colors.bold
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
