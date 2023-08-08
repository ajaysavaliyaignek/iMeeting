import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import DocumentPicker from 'react-native-document-picker';

import { styles } from './styles';
import FilesCard from '../Cards/FilesCard';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../button/Button';
import { Fonts } from '../../themes';
import Loader from '../Loader/Loader';

const AttachFiles = ({
  fileResponse,
  setFileResponse,
  showAttachButton,
  styleFileCard,
  download,
  deleted,
  isShowAttchTitle
}) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getToken();
  }, [token]);

  const getToken = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );
    setToken(JSON.parse(user)?.dataToken);
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles]
      });

      const url = await AsyncStorage.getItem('@url');
      response.map((res) => {
        if (res !== null) {
          const formData = new FormData();
          formData.append('file', res);

          setLoading(true);
          fetch(`https://${url}//o/imeeting-rest/v1.0/file-upload`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + `${token}`,
              'Content-Type': 'multipart/form-data'
            },
            body: formData
          })
            .then((response) => response.json())
            .then((responseData) => {
              if (responseData) {
                setFileResponse((prev) => {
                  const pevDaa = prev?.filter((ite) => {
                    return ite.fileEnteryId !== responseData.fileEnteryId;
                  });
                  return [...pevDaa, responseData];
                });
                setLoading(false);
              }
            })

            .catch((e) => {
              console.log('file upload error--', e.message);
              setError(e.message);
              setLoading(false);
            });
        }
      });
    } catch (err) {
      console.log('document picker error', err);
    }
  }, []);

  const removeFile = (file) => {
    setFileResponse((prev) => {
      const pevDaa = prev?.filter((ite) => {
        return ite.fileEnteryId !== file.fileEnteryId;
      });
      return [...pevDaa];
    });
  };

  return (
    <View style={{ marginTop: SIZES[24] }}>
      {isShowAttchTitle && (
        <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
      )}
      {fileResponse?.length == 0 && loading ? (
        <Loader color={Colors.primary} size={ "small"} />
      ) : fileResponse?.length == 0 && error ? (
        <Text style={styles.txtError}>{error}</Text>
      ) : (
        fileResponse?.map((file, index) => {
          return (
            <FilesCard
              download={download}
              deleted={deleted}
              key={index}
              filePath={file.name}
              fileSize={file.size}
              fileType={file.type}
              fileUrl={file.downloadUrl}
              onRemovePress={() => removeFile(file)}
              style={styleFileCard}
              loading={loading}
              error={error}
            />
          );
        })
      )}

      {showAttachButton && (
        <Button
          title={'Attach file'}
          layoutStyle={{
            backgroundColor: 'rgba(243, 246, 249,1)',
            marginBottom: SIZES[32]
          }}
          textStyle={{
            ...Fonts.PoppinsSemiBold[14],
            color: Colors.primary
          }}
          onPress={() => { handleDocumentSelection();setError('') }}
        />
      )}
    </View>
  );
};

export default AttachFiles;
