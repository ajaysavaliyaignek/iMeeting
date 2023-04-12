import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import CheckBox from '../checkBox/CheckBox';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';

const UserCommittee = ({
  item,
  index,
  toggleUsersCheckBox,
  user,
  selectedUsers
}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    selectedUsers?.map((user) => {
      if (user.userId == item?.userIds[index]) {
        setChecked(true);
      }
    });
  }, []);
  return (
    <View style={[styles.rowContainer, { marginLeft: 30 }]}>
      <CheckBox
        value={checked}
        onValueChange={(value) => {
          setChecked(value);
          toggleUsersCheckBox(value, {
            userId: item?.userIds[index],
            userName: user
          });
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
