import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Avatar from '../../../../component/Avatar/Avatar';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';

const TimeLineSelectUserComponent = ({ user, index, onChecked }) => {
  const [optionalCheckbox, setOptionalCheckBox] = useState(false);
  return (
    <TouchableOpacity
      style={styles.userContainer}
      key={index}
      activeOpacity={0.7}
      onPress={() => {
        onChecked(user);
      }}
    >
      <View style={styles.switchContainer}>
        <Avatar
          name={user.firstName == undefined ? user.userName : user.firstName}
          source={user.profileImage}
          size={SIZES[34]}
        />
        <Text style={styles.txtUserName}>
          {user.firstName == undefined
            ? user.userName
            : `${user.firstName} ${user.familyName}`}
        </Text>
      </View>
      <CheckBox
        value={user.isSelectedForTimeline}
        onValueChange={() => onChecked(user)}
      />
    </TouchableOpacity>
  );
};

export default TimeLineSelectUserComponent;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES[16]
  },
  txtUserName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16]
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
