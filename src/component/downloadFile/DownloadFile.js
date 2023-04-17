import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';

export const checkPermission = async (file, setIsDownloaded) => {
  if (Platform.OS === 'ios') {
    downloadFile(file, setIsDownloaded);
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

        downloadFile(file, setIsDownloaded);
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
const downloadFile = async (fileUrl, setIsDownloaded) => {
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // File URL which we want to download
  let FILE_URL = fileUrl;
  // Function to get extention of the file url
  let file_ext = getFileExtention(FILE_URL);

  file_ext = '.' + file_ext[0].split('?')[0];

  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  const { config, fs } = RNFetchBlob;
  let RootDir = Platform.select({
    ios: RNFetchBlob.fs.dirs.DocumentDir,
    android: RNFetchBlob.fs.dirs.DownloadDir
  });
  RootDir = `${RootDir}/${Date.now()}.${file_ext}`;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: RootDir,
      description: 'Downloading file...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true
    }
  };
  const token = await AsyncStorage.getItem('@token');

  config(options)
    .fetch('GET', FILE_URL, {
      Authorization: `Bearer ${token}`
    })
    .then(async (res) => {
      // Alert after successful downloading

      setIsDownloaded(true);
      if (Platform.OS == 'ios') {
        if (Platform.OS === 'ios') {
          await RNFetchBlob.fs.createFile(
            RootDir,
            await res.base64(),
            'base64'
          );
          RNFetchBlob.ios.openDocument(RootDir);
        }
      } else {
        RNFetchBlob.android.actionViewIntent(RootDir);
        await FileViewer.open(RootDir, { showOpenWithDialog: true });
      }
    })
    .catch((e) => {
      setIsDownloaded(false);

      console.log('The file saved to ERROR', e.message);
    });
};

const getFileExtention = (fileUrl) => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};
