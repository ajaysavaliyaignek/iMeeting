import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';

const FilesCard = ({
  filePath,
  fileSize,
  onDownloadPress,
  onClosePress,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.rightView}>
        <Text style={styles.txtPath}>{filePath}</Text>
        <Text style={styles.txtSize}>{fileSize}</Text>
      </View>
      <View style={styles.leftView}>
        <TouchableOpacity onPress={onDownloadPress}>
          <Icon name={IconName.Download} height={SIZES[18]} width={SIZES[18]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClosePress}>
          <Icon name={IconName.Close} height={SIZES[12]} width={SIZES[12]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilesCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES[16],
    backgroundColor: Colors.gray,
    paddingVertical: SIZES[16],
    paddingLeft: SIZES[16],
    paddingRight: SIZES[22],
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: SIZES[8]
  },
  txtPath: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold
  },
  txtSize: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginLeft: SIZES[12]
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-between'
  }
});
