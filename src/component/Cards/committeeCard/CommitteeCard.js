import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import CheckBox from '../../checkBox/CheckBox';
import { UserContext } from '../../../context';

const CommitteeCard = ({
  item,
  index,
  setCommittee,
  committees,
  checked,
  committee,

  setIsChecked,
  checkToggle
}) => {
  const [isChecked, setChecked] = useState(false);
  console.log('item from cimmittecard', item);

  // useEffect(() => {
  //   committee?.map((user) => {
  //     if (user.organizationId == item.organizationId) {
  //       item.isSelected = true;
  //     }
  //   });
  // }, [committee]);

  return (
    <TouchableOpacity
      style={styles.rowDataContainer}
      key={index}
      onPress={() => {
        checkToggle(item);
      }}
    >
      <CheckBox
        color={Colors.primary}
        value={item.isSelected}
        onValueChange={() => {
          checkToggle(item);
        }}
      />
      <Text style={styles.txtCheckboxTitle}>{item.committeeTitle}</Text>
    </TouchableOpacity>
  );
};

export default CommitteeCard;
