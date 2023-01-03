import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RenderHTML from 'react-native-render-html';
import RNFetchBlob from 'rn-fetch-blob';
import Avatar from '../Avatar/Avatar';
import { SIZES } from '../../themes/Sizes';
import moment from 'moment';
import { styles } from './styles';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import ConvertBytes from '../convertBytes/ConvertBytes';
import ImagePreview from './imagePreview/ImagePreview';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { checkPermission } from '../downloadFile/DownloadFile';

const ChatListComponent = ({ chatData }) => {
  const { width } = useWindowDimensions();
  let setIsDownloaded = () => {};

  const scrollViewRef = useRef();

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    >
      {chatData?.map((chat, index) => {
        let message = chat?.message;
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: chat?.isOwner ? 'flex-end' : 'flex-start',
              marginVertical: SIZES[16],
              marginHorizontal: SIZES[8]
            }}
          >
            <Avatar
              name={chat?.userName}
              source={chat?.profilePicture}
              size={SIZES[32]}
            />
            <View style={styles.rightContainer}>
              <View style={styles.nameTimeContainer}>
                <Text style={styles.txtUserName} numberOfLines={1}>
                  {chat?.userName == '' ? 'Unknown User' : chat?.userName}
                </Text>
                <Text style={styles.txtTime}>
                  {moment(chat?.createDate, 'YYYY-MM-DD hh:mm a').format(
                    'hh:mm A'
                  )}
                </Text>
              </View>
              {message !== '' && chat.fileUploads == null ? (
                <RenderHTML
                  source={{ html: message }}
                  contentWidth={width}
                  tagsStyles={styles.tagsStyles}
                />
              ) : chat.fileUploads != null && message == '' ? (
                chat.fileUploads.map((file, index) => {
                  if (
                    file.type === 'image/png' ||
                    file.type === 'image/jpg' ||
                    file.type === 'image/jpeg' ||
                    file.type === 'png' ||
                    file.type === 'jpg' ||
                    file.type === 'jpeg'
                  ) {
                    return (
                      <ImagePreview
                        file={file}
                        index={index}
                        isOwner={chat?.isOwner}
                      />
                    );
                  } else {
                    return (
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: Colors.line,
                          borderRadius: SIZES[4],
                          padding: SIZES[8],
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        key={index}
                      >
                        <View style={{ width: '80%' }}>
                          <Text style={styles.txtUserName} numberOfLines={1}>
                            {file?.name}
                          </Text>
                          <Text>{ConvertBytes(file?.size)}</Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            checkPermission(file.downloadUrl, setIsDownloaded);
                          }}
                        >
                          <Icon
                            name={IconName.Download}
                            height={SIZES[22]}
                            width={SIZES[22]}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }
                })
              ) : message !== '' && chat.fileUploads != null ? (
                <View>
                  {chat.fileUploads.map((file, index) => {
                    if (
                      file.type === 'image/png' ||
                      file.type === 'image/jpg' ||
                      file.type === 'image/jpeg' ||
                      file.type === 'png' ||
                      file.type === 'jpg' ||
                      file.type === 'jpeg'
                    ) {
                      return (
                        <ImagePreview
                          file={file}
                          index={index}
                          isOwner={chat?.isOwner}
                        />
                      );
                    } else {
                      return (
                        <View
                          style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: Colors.line,
                            borderRadius: SIZES[4],
                            padding: SIZES[8],
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          key={index}
                        >
                          <View style={{ width: '80%' }}>
                            <Text style={styles.txtUserName} numberOfLines={1}>
                              {file?.name}
                            </Text>
                            <Text>{ConvertBytes(file?.size)}</Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              checkPermission(
                                file.downloadUrl,
                                setIsDownloaded
                              );
                            }}
                          >
                            <Icon
                              name={IconName.Download}
                              height={SIZES[22]}
                              width={SIZES[22]}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })}
                  <RenderHTML
                    source={{ html: message }}
                    contentWidth={width}
                    tagsStyles={styles.tagsStyles}
                  />
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ChatListComponent;
