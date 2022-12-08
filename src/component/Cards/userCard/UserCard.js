import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
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
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { UserContext } from '../../../context';

const UserCard = ({
  item,
  index,
  text,
  isSwitchOnRow,
  userSelect,
  editable,
  deleted,
  committee,
  onChangeUser,
  onDeleteHandler,
  valueIndex,
  setValueIndex
}) => {
  const RowData = ({
    name,
    discription,
    style,
    styleText,
    switchView,
    value
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {switchView && (
          <Switch
            color={Colors.switch}
            value={value.isRequired}
            onValueChange={(isRequired) => {
              console.log('new changed value ', isRequired);

              onChangeUser(value, isRequired);
            }}
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
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        setValueIndex(-1);
      }}
      key={item.userId}
    >
      {index == 0 ? null : <Divider style={styles.divider} />}
      {/* committee details */}
      <View style={styles.committeeDetailView}>
        <View style={styles.userDetails}>
          <Avatar name={item.firstName} size={SIZES[32]} />
          {/* <Text
            style={styles.txtCommitteeTitle}
          >{`${item.firstName} ${item.secondName}`}</Text> */}
          <Text
            style={{
              marginLeft: SIZES[12],

              width: '80%'
            }}
            numberOfLines={1}
          >
            {getHighlightedText(
              item.firstName
                ? item.firstName + ' ' + item.secondName
                : `${item.userName}`,
              text
            )}
          </Text>
        </View>

        <RowData
          name={'E-mail'}
          discription={item.emails ? item.emails : item.email}
        />
        <RowData
          name={'Role'}
          discription={
            item.roles
              ? item.roles[item?.organizationIds?.indexOf(committee)]
              : item.yourRoleName
              ? item.yourRoleName
              : item.roleName
          }
        />
        <RowData
          name={'Available'}
          discription={item?.isAvailable || 'Unknown'}
          style={{
            height: SIZES[8],
            width: SIZES[8],
            backgroundColor:
              item?.isAvailable == 'Unknown'
                ? '#E6C54F'
                : item?.isAvailable == 'conflict'
                ? '#DD7878'
                : '#81AB96',
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
          discription={item.isRequired}
          switchView={isSwitchOnRow}
          value={item}
        />
      </View>

      {/* dotsView */}
      {userSelect && (
        <TouchableOpacity
          onPress={() => {
            setValueIndex(!valueIndex ? -1 : index);
          }}
          style={styles.dotsView}
        >
          <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[4]} />
        </TouchableOpacity>
      )}
      {valueIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDelete={onDeleteHandler(item)}
            subjectStatus={'NoDeleted'}
            deleted={deleted}
            editable={editable}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UserCard;
