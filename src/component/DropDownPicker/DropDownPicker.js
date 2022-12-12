import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from './styles';

const DropDownPicker = ({
  data,
  setData,
  value,
  title,
  placeholder,
  disable
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.txtTitle}>{title}</Text>
      <Dropdown
        disable={disable}
        placeholderStyle={styles.txtDropdown}
        textStyle={styles.txtDropdown}
        arrowIconStyle={styles.arrowIcon}
        data={data}
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
        }}
      />
    </View>
  );
};

export default DropDownPicker;
