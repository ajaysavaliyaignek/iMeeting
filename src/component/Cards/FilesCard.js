import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';
import ConvertBytes from '../convertBytes/ConvertBytes';
import RNFetchBlob from 'rn-fetch-blob';
import Loader from '../Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkPermission } from '../downloadFile/DownloadFile';
// import { checkPermission } from '../downloadFile/DownloadFile';

const FilesCard = ({
  filePath,
  fileSize,
  onRemovePress,
  style,
  download,
  deleted,
  fileUrl,
  loading,
  error
}) => {
  let setIsDownloaded = () => {};
  return (
    <View>
      <View style={[styles.container, style]}>
        <View style={styles.rightView}>
          <Text style={styles.txtPath} numberOfLines={1}>
            {filePath}
          </Text>
          <Text style={styles.txtSize}>{ConvertBytes(fileSize)}</Text>
        </View>

        <View style={styles.leftView}>
          {download && (
            <TouchableOpacity
              onPress={() => checkPermission(fileUrl, setIsDownloaded)}
            >
              <Icon
                name={IconName.Download}
                height={SIZES[18]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
          )}
          {deleted && (
            <TouchableOpacity onPress={onRemovePress}>
              <Icon
                name={IconName.Close}
                height={SIZES[12]}
                width={SIZES[12]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {loading && <Loader color={Colors.primary} size={ "large"} />}
      {error && <Text style={styles.txtError}>{error}</Text>}
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
    color: Colors.bold,
    width: '50%'
  },
  txtSize: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginLeft: SIZES[12],
    alignSelf: 'center'
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
  },
  txtError: {
    alignSelf: 'center',
    ...Fonts.PoppinsRegular[14],
    color: Colors.Rejected
  }
});
