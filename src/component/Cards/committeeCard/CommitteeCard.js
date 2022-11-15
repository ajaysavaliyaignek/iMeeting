import { View, Text } from 'react-native';
import React, { useContext, useState } from 'react';

import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import CheckBox from '../../checkBox/CheckBox';
import { UserContext } from '../../../context';

const CommitteeCard = ({ item, index }) => {
  const [isChecked, setChecked] = useState(false);
  const { setCommittee } = useContext(UserContext);
  if (isChecked) {
    setCommittee(item);
  }
  return (
    <View style={styles.rowDataContainer} key={index}>
      <CheckBox
        color={Colors.primary}
        value={isChecked}
        onValueChange={() => {
          setChecked(!isChecked);
        }}
      />
      <Text style={styles.txtCheckboxTitle}>{item.committeeTitle}</Text>
    </View>
  );
};

export default CommitteeCard;
