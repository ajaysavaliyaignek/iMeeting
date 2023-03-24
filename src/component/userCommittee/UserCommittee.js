import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import CheckBox from '../checkBox/CheckBox';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';

const UserCommittee = ({ item, index, toggleUsersCheckBox, user }) => {
  const [checked, setChecked] = useState(false);
  return (
    <View style={[styles.rowContainer, { marginLeft: 30 }]}>
      {/* <TouchableOpacity
      onPress={handleToggle}
      style={styles.iconContainer}
    >
      <Icon
        name={expanded ? IconName.Minus : IconName.Add}
        height={SIZES[14]}
        width={SIZES[14]}
      />
    </TouchableOpacity> */}

      <CheckBox
        value={checked}
        onValueChange={(value) => {
          setChecked(value);
          toggleUsersCheckBox(value, item?.userIds[index]);
          console.log('value', value);
        }}
      />
      <Text style={styles.name}>{`${index + 1}.${user}`}</Text>
    </View>
  );
};

export default UserCommittee;

const styles = StyleSheet.create({
  name: {
    color: Colors.bold,
    ...Fonts.PoppinsRegular[14],
    marginLeft: SIZES[16]
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES[16]
  },
  iconContainer: {
    marginRight: SIZES[16]
  }
});
