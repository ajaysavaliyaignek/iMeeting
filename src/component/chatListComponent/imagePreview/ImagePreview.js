import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { SIZES } from '../../../themes/Sizes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { checkPermission } from '../../downloadFile/DownloadFile';

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

  //   const fs = RNFetchBlob.fs;

  //   RNFetchBlob.config({
  //     fileCache: true
  //   })
  //     .fetch('GET', file.contentUrl)
  //     // the image is now dowloaded to device's storage
  //     .then((resp) => {
  //       // the image path you can use it directly with Image component
  //       console.log('resp', resp);
  //       imagePath = resp.path();
  //       return resp.readFile('base64');
  //     })
  //     .then((base64Data) => {
  //       // here's base64 encoded image
  //       console.log(
  //         'base64Data-----',
  //         `data:image/${file.type};base64,${base64Data}`
  //       );
  //       setUri(`data:image/${file.type};base64,${base64Data}`);
  //       // remove the file from storage
  //       return fs.unlink(imagePath);
  //     });
  return (
    <View>
      <Image
        resizeMode="cover"
        source={{
          uri: file.contentUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }}
        style={{
          height: 100,
          width: 100,
          marginTop: SIZES[4],
          borderRadius: SIZES[8],
          opacity: isDownloaded || isOwner ? 1 : 0.5
        }}
        key={index}
        onError={(e) => console.log('image preview error', e.nativeEvent.error)}
      />
      {isDownloaded == false && !isOwner && (
        <TouchableOpacity
          style={{ position: 'absolute', top: '40%', left: '20%' }}
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
