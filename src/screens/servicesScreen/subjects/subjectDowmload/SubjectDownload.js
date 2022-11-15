import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider, Switch } from 'react-native-paper';
import { useLazyQuery } from '@apollo/client';
import RNFetchBlob from 'rn-fetch-blob';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { styles } from './styles';
import { GET_ZIP_PDF_DOWNLOAD } from '../../../../graphql/query';

const SubjectDownload = () => {
  const route = useRoute();
  const { item } = route?.params;

  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [valueType, setValueType] = useState(null);
  const [items, setItems] = useState([
    { label: 'PDF', value: '.PDF' },
    { label: 'ZIP', value: '.ZIP' }
  ]);
  const [isAttachFileSwitchOn, setIsAttachFileSwitchOn] = useState(false);
  const [isCommentsSwitchOn, setIsCommentsSwitchOn] = useState(false);
  const [base64, setBese64] = useState(null);
  const [fileName, setFileName] = useState(null);

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
    let file_ext = getFileExtention(fileName);

    file_ext = '.' + file_ext[0];
    console.log('file_ext', file_ext);

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DCIMDir;
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
    RNFetchBlob.config(options)
      .fetch('GET', FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log('res -> ', `${res.data}.pdf`);
        alert('File Downloaded Successfully.');
        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.openDocument(`${res.data}.pdf`);
        }
      });
  };

  const getFileExtention = (fileUrl) => {
    console.log('fileUrl', fileUrl);
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const [downloadFiles, { loading, data }] = useLazyQuery(
    GET_ZIP_PDF_DOWNLOAD,
    {
      onCompleted: (data, error) => {
        // console.log(
        //   'data filedowload',
        //   data.report,
        //   'error filedowload',
        //   error
        // );
        // const sampleArr = base64ToArrayBuffer(data.report.fileData.base64);
        // saveByteArray(data.report.fileData.fileName, sampleArr);
        // readFile(
        //   data.report.fileData.base64.toString(),
        //   data.report.fileData.fileName.toString()
        // );
        // checkPermission(data.report.fileData);
        setBese64(data?.report?.fileData.base64);
        setFileName(data?.report?.fileData.fileName);
        if (base64) {
          checkPermission(`data:application/pdf;base64,${base64}`);
        }
      },

      fetchPolicy: 'cache-and-network'
    }
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        name={'Download'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtDownloadTitle}>Download</Text>
        <View style={styles.exportContainer}>
          <Text style={styles.txtExportTitle}>EXPORT FORMAT</Text>
          <DropDownPicker
            open={open}
            value={valueType}
            items={items}
            setOpen={setOpen}
            setValue={setValueType}
            setItems={setItems}
            placeholder={'Format'}
            placeholderStyle={styles.txtExportTitle}
            style={{
              borderWidth: 0,

              zIndex: 999
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Attach files</Text>
          <Switch
            value={isAttachFileSwitchOn}
            onValueChange={() => setIsAttachFileSwitchOn(!isAttachFileSwitchOn)}
            color={Colors.switch}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Comments</Text>
          <Switch
            value={isCommentsSwitchOn}
            onValueChange={() => setIsCommentsSwitchOn(!isCommentsSwitchOn)}
            color={'#81AB96'}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            // onPress={onCancelHandler}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log('isAttachFileSwitchOn', isAttachFileSwitchOn);
              console.log('comments', isCommentsSwitchOn);
              console.log('format', valueType);
              console.log('id', item?.subjectId);
              downloadFiles({
                variables: {
                  attachFile: isAttachFileSwitchOn,
                  comments: isCommentsSwitchOn,
                  format: valueType,
                  id: item?.subjectId,
                  type: 2
                }
              });
            }}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubjectDownload;
