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

const UserCard = ({ item, index }) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

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

  const RowData = ({ name, discription, style, styleText, switchView }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {switchView && (
          <Switch
            color={Colors.switch}
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={style} />
          <Text style={[styles.discription, styleText]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setEditModal(false)}>
      {index == 0 ? null : <Divider style={styles.divider} />}
      {/* committee details */}
      <View style={styles.committeeDetailView}>
        <View style={styles.userDetails}>
          <Avatar name={item.name} source={item.profile} size={SIZES[32]} />
          <Text style={styles.txtCommitteeTitle}>{item.name}</Text>
        </View>

        <RowData name={'E-mail'} discription={item.email} />
        <RowData name={'Role'} discription={item.role} />
        <RowData name={'Available'} discription={item.available} />
        <RowData
          name={'Answer'}
          discription={item.answer}
          styleText={{ ...Fonts.PoppinsSemiBold[14], color: Colors.secondary }}
        />
        <RowData
          name={'Required'}
          discription={item.required}
          switchView={true}
        />
      </View>

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

export default UserCard;

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
    paddingVertical: SIZES[24],

    width: '90%'
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
  availableView: {
    height: SIZES[8],
    width: SIZES[8],
    borderRadius: 100,
    backgroundColor: Colors.switch
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  }
});
