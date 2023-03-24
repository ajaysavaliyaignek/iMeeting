import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { SIZES } from '../../../themes/Sizes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { checkPermission } from '../../downloadFile/DownloadFile';
import { Colors } from '../../../themes/Colors';

const ImagePreview = ({ file, index, isOwner }) => {
  const [uri, setUri] = useState('');
  const [token, setToken] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const getToken = () => {
      AsyncStorage.getItem('@token')
        .then((result) => {
          setToken(result);
        })
        .catch((e) => console.log(e));

      // setToken(JSON.parse(user)?.dataToken);
    };
    getToken();
  }, []);

  const fs = RNFetchBlob.fs;

  RNFetchBlob.config({
    fileCache: true
  })
    .fetch('GET', encodeURI(file.contentUrl), {
      Authorization: `Bearer ${token}`
    })
    .then(async (res) => {
      // Alert after successful downloading
      let base64 = await res.base64();

      setUri(`data:image/${file.type};base64,${base64}`);
    });

  return (
    <View
      style={{
        height: 100,
        width: 100,
        borderRadius: 8,
        borderColor: Colors.line,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {uri !== '' && (
        <Image
          resizeMode="cover"
          source={{
            uri: encodeURI(uri)
          }}
          style={{
            height: 100,
            width: 100,
            marginTop: SIZES[4],
            borderRadius: SIZES[8],
            opacity: isDownloaded || isOwner ? 1 : 0.5
          }}
          key={index}
          onError={(e) => {
            console.log('image preview error', e.nativeEvent.error);
          }}
        />
      )}
      {isDownloaded == false && (
        <TouchableOpacity
          style={{ position: 'absolute', top: '40%', left: '40%' }}
          onPress={() => {
            checkPermission(file.downloadUrl, setIsDownloaded);
          }}
        >
          <Icon name={IconName.Download} height={SIZES[22]} width={SIZES[22]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImagePreview;
