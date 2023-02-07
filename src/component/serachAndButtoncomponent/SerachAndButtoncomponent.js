import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import IconName from '../Icon/iconName';
import Icon from '../Icon';
import { SIZES } from '../../themes/Sizes';
import { Button } from '../button/Button';
import { Divider } from 'react-native-paper';

const SerachAndButtoncomponent = ({
  onChangeText,
  role,
  buttonText,
  onPress,
  value,
  isButtonShow,
  containerStyle
}) => {
  return (
    <View>
      <View style={[styles.searchContainer, containerStyle]}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          value={value}
          style={styles.textInput}
          placeholder={'Search'}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={() => {}}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      {(role !== 'Member' || isButtonShow) && (
        <Button
          title={buttonText}
          layoutStyle={styles.cancelBtnLayout}
          textStyle={styles.txtCancelButton}
          onPress={onPress}
        />
      )}
      <Divider style={styles.divider} />
    </View>
  );
};

export default SerachAndButtoncomponent;
