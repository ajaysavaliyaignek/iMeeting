import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from './styles';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';

const DropDownPicker = ({
  data,
  setData,
  value,
  title,
  placeholder,
  disable,
  styleContainer,
  setValueDecisionName
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[styles.container, styleContainer]}>
      <Text style={styles.txtTitle}>{title}</Text>
      <Dropdown
        disable={disable}
        selectedTextStyle={styles.txtDropdown}
        placeholderStyle={styles.txtDropdown}
        textStyle={styles.txtDropdown}
        arrowIconStyle={styles.arrowIcon}
        data={data}
        itemTextStyle={styles.txtDropdown}
        style={styles.dropDown}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setData(item.value);
          setIsFocus(false);
          if (setValueDecisionName !== undefined) {
            setValueDecisionName(item?.label);
          }
        }}
      />
    </View>
  );
};

export default DropDownPicker;
