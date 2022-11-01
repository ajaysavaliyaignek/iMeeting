import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import { Divider, Switch } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { styles } from './styles';
import { useLazyQuery } from '@apollo/client';
import { GET_ZIP_PDF_DOWNLOAD } from '../../../../graphql/query';
import RNFetchBlob from 'rn-fetch-blob';

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

  // const base64ToArrayBuffer = (base64) => {
  //   const binaryString = window.atob(base64);
  //   const binaryLen = binaryString.length;
  //   const bytes = new Uint8Array(binaryLen);
  //   for (let i = 0; i < binaryLen; i++) {
  //     const ascii = binaryString.charCodeAt(i);
  //     bytes[i] = ascii;
  //   }
  //   return bytes;
  // };

  async function getPdfBinary(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer'; // get the binary
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.onload = function (event) {
        var arrayBuffer = xhr.response;
        var byteArray = new Uint8Array(arrayBuffer);
        var len = byteArray.byteLength;
        var binary = '';
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(byteArray[i]);
        }
        resolve(binary);
      };
      xhr.send();
    });
  }

  function base64_encode(str) {
    var c1, c2, c3;
    var base64EncodeChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var i = 0,
      len = str.length,
      string = '';

    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
        string += '==';
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(
          ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
        );
        string += base64EncodeChars.charAt((c2 & 0xf) << 2);
        string += '=';
        break;
      }
      c3 = str.charCodeAt(i++);
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt(
        ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
      );
      string += base64EncodeChars.charAt(
        ((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)
      );
      string += base64EncodeChars.charAt(c3 & 0x3f);
    }
    return string;
  }

  const downloadForAos = async (pdfBase64Str) => {
    const folder =
      FileSystem.StorageAccessFramework.getUriForDirectoryInRoot('test');
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
        folder
      );
    if (!permissions.granted) return;

    let filePath = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      'test.pdf',
      'application/pdf'
    );
    // let filePath = "content://com.android.externalstorage.documents/tree/primary%3Atest/document/primary%3Atest%2Ftest.txt";
    console.log(pdfBase64Str, '====');
    try {
      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        filePath,
        pdfBase64Str,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      alert('download success!');
    } catch (err) {
      console.log(err);
    }
  };

  const downloadForIos = async () => {
    alert('try do it by yourself');
  };

  async function downloadPdf(url) {
    let binary = await getPdfBinary(url);
    console.log(binary, '=====');
    const base64Str = base64_encode(binary);
    if (Platform.OS === 'ios') {
      downloadForIos(base64Str);
    } else {
      downloadForAos(base64Str);
    }
  }

  const saveByteArray = (fileName, byte) => {
    const blob = new Blob([byte]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    NiceModal.remove('download-subject-Modal');
  };

  const [downloadFiles, { loading, data }] = useLazyQuery(
    GET_ZIP_PDF_DOWNLOAD,
    {
      onCompleted: (data, error) => {
        console.log('data filedowload', data, 'error filedowload', error);
        // const sampleArr = base64ToArrayBuffer(data.report.fileData.base64);
        // saveByteArray(data.report.fileData.fileName, sampleArr);
        downloadPdf(data.report.fileData.base64);
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
