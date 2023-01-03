import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import FileViewer from 'react-native-file-viewer';
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
import moment from 'moment';
import DropDownPicker from '../../../../component/DropDownPicker/DropDownPicker';

const SubjectDownload = () => {
  const route = useRoute();
  const { item } = route?.params;
  console.log('subject from subject download', item);

  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [valueType, setValueType] = useState(null);
  const [items, setItems] = useState([
    { label: 'PDF', value: 'pdf' },
    { label: 'ZIP', value: 'zip' }
  ]);
  const [isAttachFileSwitchOn, setIsAttachFileSwitchOn] = useState(false);
  const [isCommentsSwitchOn, setIsCommentsSwitchOn] = useState(false);
  const [base64, setBese64] = useState(null);
  const [fileName, setFileName] = useState(null);

  const checkPermission = async () => {
    console.log('download params', {
      attachFile: isAttachFileSwitchOn,
      comments: isCommentsSwitchOn,
      format: valueType,
      id: +item?.subjectId,
      type: 2
    });
    console.log('check permission');
    if (Platform.OS === 'ios') {
      downloadFiles({
        variables: {
          attachFile: isAttachFileSwitchOn,
          comments: isCommentsSwitchOn,
          format: valueType,
          id: +item?.subjectId,
          type: 2
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
          console.log('Storage Permission Granted.');
          downloadFiles({
            variables: {
              attachFile: isAttachFileSwitchOn,
              comments: isCommentsSwitchOn,
              format: valueType,
              id: +item?.subjectId,
              type: 2
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

  const [downloadFiles, { loading, data }] = useLazyQuery(
    GET_ZIP_PDF_DOWNLOAD,
    {
      onCompleted: async (data, error) => {
        console.log('subject download data', data);
        let base64Str = data?.report?.fileData.base64;

        let fPath = Platform.select({
          ios: RNFetchBlob.fs.dirs.DocumentDir,
          android: RNFetchBlob.fs.dirs.DownloadDir
        });

        fPath = `${fPath}/${Date.now()}.${valueType}`;

        console.log('file path', fPath);

        if (Platform.OS == 'ios') {
          await RNFetchBlob.fs.createFile(fPath, base64Str, 'base64');
        } else {
          let options = {
            fileCache: true,
            addAndroidDownloads: {
              path: fPath,
              description: 'downloading file...',
              notification: true,
              // useDownloadManager works with Android only
              useDownloadManager: true
            }
          };
          RNFetchBlob.config(options);

          await RNFetchBlob.fs.writeFile(fPath, base64Str, 'base64');
        }

        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.openDocument(fPath);
        } else {
          console.log('file path2', fPath);

          RNFetchBlob.android.actionViewIntent(fPath);
          await FileViewer.open(fPath, { showOpenWithDialog: true });
        }
      },

      fetchPolicy: 'cache-and-network'
    }
  );
  // if (base64) {
  //   checkPermission(`data:application/${valueType};base64,${base64}`);
  // }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        name={'Download'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
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
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              checkPermission();
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
