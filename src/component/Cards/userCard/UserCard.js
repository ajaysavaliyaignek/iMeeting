import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import Avatar from '../../Avatar/Avatar';
import EditDeleteModal from '../../EditDeleteModal';
import { styles } from './styles';

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
        <RowData
          name={'Available'}
          discription={item.available}
          style={{
            height: SIZES[8],
            width: SIZES[8],
            backgroundColor: '#81AB96',
            borderRadius: SIZES[4],
            marginRight: SIZES[8]
          }}
        />
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
