import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React from 'react';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';
import ConvertBytes from '../convertBytes/ConvertBytes';
import RNFetchBlob from 'rn-fetch-blob';
// import { checkPermission } from '../downloadFile/DownloadFile';

const FilesCard = ({
  filePath,
  fileSize,
  onRemovePress,
  style,
  download,
  deleted,
  fileUrl
}) => {
  const checkPermission = async (file) => {
    console.log('check permission');
    if (Platform.OS === 'ios') {
      downloadFile(file);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(file);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = (file) => {
    console.log('downloadfile');
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = file;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DocumentDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true
      }
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log('res -> ', res.respInfo.redirects[0]);
        alert('File Downloaded Successfully.');
        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.previewDocument(res.respInfo.redirects[0]);
        }
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.rightView}>
        <Text style={styles.txtPath} numberOfLines={1}>
          {filePath}
        </Text>
        <Text style={styles.txtSize}>{ConvertBytes(fileSize)}</Text>
      </View>

      <View style={styles.leftView}>
        {download && (
          <TouchableOpacity onPress={() => checkPermission(fileUrl)}>
            <Icon
              name={IconName.Download}
              height={SIZES[18]}
              width={SIZES[18]}
            />
          </TouchableOpacity>
        )}
        {deleted && (
          <TouchableOpacity onPress={onRemovePress}>
            <Icon name={IconName.Close} height={SIZES[12]} width={SIZES[12]} />
          </TouchableOpacity>
        )}
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
  }
});
