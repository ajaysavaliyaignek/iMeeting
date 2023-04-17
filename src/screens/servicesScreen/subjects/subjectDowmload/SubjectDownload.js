import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import FileViewer from 'react-native-file-viewer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider, Switch } from 'react-native-paper';
import { useLazyQuery } from '@apollo/client';
import RNFetchBlob from 'rn-fetch-blob';
import { showToast, GToastContainer } from 'react-native-gtoast';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { styles } from './styles';
import { GET_ZIP_PDF_DOWNLOAD } from '../../../../graphql/query';
import moment from 'moment';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const SubjectDownload = () => {
  const route = useRoute();
  const { item, downloadType } = route?.params;

  const navigation = useNavigation();
  const [valueType, setValueType] = useState(null);
  const [downloadError, setDownloadError] = useState('');
  const [items, setItems] = useState([
    { label: 'PDF', value: 'PDF' },
    { label: 'ZIP', value: 'ZIP' }
  ]);
  const [isAttachFileSwitchOn, setIsAttachFileSwitchOn] = useState(false);
  const [isCommentsSwitchOn, setIsCommentsSwitchOn] = useState(false);

  const checkPermission = async () => {
    console.log({
      attachFile: isAttachFileSwitchOn,
      comments: isCommentsSwitchOn,
      format: valueType,
      id:
        downloadType == 'Subject'
          ? +item?.subjectId
          : downloadType == 'Task'
          ? item?.taskId
          : 0,
      type: downloadType == 'Subject' ? 2 : downloadType == 'Task' ? 3 : 0
    });
    if (Platform.OS === 'ios') {
      downloadFiles({
        variables: {
          attachFile: isAttachFileSwitchOn,
          comments: isCommentsSwitchOn,
          format: valueType,
          id:
            downloadType == 'Subject'
              ? +item?.subjectId
              : downloadType == 'Task'
              ? item?.taskId
              : 0,
          type: downloadType == 'Subject' ? 2 : downloadType == 'Task' ? 3 : 0
        }
      });
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File'
          }
        );

        const readGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFiles({
            variables: {
              attachFile: isAttachFileSwitchOn,
              comments: isCommentsSwitchOn,
              format: valueType,
              id:
                downloadType == 'Subject'
                  ? +item?.subjectId
                  : downloadType == 'Task'
                  ? item?.taskId
                  : 0,
              type:
                downloadType == 'Subject' ? 2 : downloadType == 'Task' ? 3 : 0
            }
          });
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

  const [downloadFiles, { loading, data, error }] = useLazyQuery(
    GET_ZIP_PDF_DOWNLOAD,
    {
      fetchPolicy: 'cache-and-network',
      onCompleted: async (data, error) => {
        showToast('Downloading file...', {
          duration: 10
        });
        let base64Str = data?.report?.fileData?.base64;

        let fPath = Platform.select({
          ios: RNFetchBlob.fs.dirs.DocumentDir,
          android: RNFetchBlob.fs.dirs.DownloadDir
        });
        fPath = `${fPath}/${Date.now()}.${valueType}`;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            path: fPath,
            description: 'Downloading file...',
            notification: true,
            // useDownloadManager works with Android only
            useDownloadManager: true
          }
        };
        RNFetchBlob.config(options);

        if (Platform.OS == 'ios') {
          await RNFetchBlob.fs.createFile(fPath, base64Str, 'base64');
        } else {
          await RNFetchBlob.fs.writeFile(fPath, base64Str, 'base64');
        }

        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.openDocument(fPath);
        } else {
          RNFetchBlob.android.actionViewIntent(fPath);
          await FileViewer.open(fPath, { showOpenWithDialog: true });
        }
      },
      onError: (data) => {
        console.log('download file error', data.message);
        setDownloadError(data.message);
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
      <TouchableOpacity
        style={styles.subContainer}
        activeOpacity={1}
        onPress={() => {
          setDownloadError('');
        }}
      >
        <Text style={styles.txtDownloadTitle}>Download</Text>

        <DropDownPicker
          data={items}
          disable={false}
          placeholder={''}
          setData={setValueType}
          title={'EXPORT FORMAT'}
          value={valueType}
        />
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Attach files</Text>
          <Switch
            value={isAttachFileSwitchOn}
            onValueChange={() => {
              setIsAttachFileSwitchOn(!isAttachFileSwitchOn);
              setDownloadError('');
            }}
            color={Colors.switch}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Comments</Text>
          <Switch
            value={isCommentsSwitchOn}
            onValueChange={() => {
              setIsCommentsSwitchOn(!isCommentsSwitchOn);
              setDownloadError('');
            }}
            color={'#81AB96'}
          />
        </View>
        <GToastContainer paddingBottom={30} />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {downloadError !== '' && (
          <View style={{ alignItems: 'center', paddingBottom: 30 }}>
            <Text
              style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.Rejected }}
            >
              Download failed.
            </Text>
          </View>
        )}
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            // onPress={onCancelHandler}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            disable={valueType ? false : true}
            title={'Save'}
            onPress={() => {
              checkPermission();
            }}
            layoutStyle={[
              styles.nextBtnLayout,
              { opacity: valueType ? 1 : 0.5 }
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubjectDownload;
