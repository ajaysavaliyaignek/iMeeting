import { View, Text, Pressable, TextInput } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import { MentionInput } from '../mentionInput/MentionInput';
import { Divider } from 'react-native-paper';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import { Fonts } from '../../themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UPDATE_CHAT } from '../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { GET_ALL_CHATS } from '../../graphql/query';

const IMeetingChatTextInput = ({
  users,
  meetingId,
  attchDocument,
  setAttachDocument,
  fileResponse,
  setFileResponse,
  onBlur,
  onFocus
}) => {
  const [fileIds, setFileIds] = useState([]);
  const [token, setToken] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    getToken();
  }, [token]);

  const getToken = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );
    setToken(JSON.parse(user)?.dataToken);
  };

  const [updateChat] = useMutation(UPDATE_CHAT, {
    refetchQueries: [
      {
        query: GET_ALL_CHATS,
        variables: {
          meetingId: meetingId
        }
      }
    ],
    onCompleted: (data) => {
      console.log('update chat', data);
      setFileIds([]);
    },
    onError: (data) => console.log('update chat error', data)
  });

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
                setAttachDocument(true);
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
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const fileId = fileResponse?.map((file) => file?.fileEnteryId);

    setFileIds(fileId);
  }, [fileResponse]);

  // suggestion for the mention users
  const renderSuggestions =
    (suggestion) =>
    ({ keyword, onSuggestionPress }) => {
      if (keyword == null) {
        return null;
      }

      return (
        <View
          style={{
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderTopWidth: 1,
            borderRadius: SIZES[8],
            borderRightColor: Colors.line,
            borderLeftColor: Colors.line,
            borderTopColor: Colors.line
          }}
        >
          {suggestion
            .filter((one) =>
              one.userName
                .toLocaleLowerCase()
                .includes(keyword.toLocaleLowerCase())
            )
            .map((one) => (
              <Pressable
                key={one.userId}
                onPress={() => {
                  console.log('one', one);
                  onSuggestionPress({ id: one.userId, name: one.userName });
                }}
                style={{ padding: 12 }}
              >
                <Text
                  style={{ ...Fonts.PoppinsRegular[14], color: Colors.primary }}
                >
                  {one.userName}
                </Text>
                <Divider
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: Colors.line
                  }}
                />
              </Pressable>
            ))}
        </View>
      );
    };
  let delimiter = /\s+/;

  //split string
  let _text = value;
  let tokens,
    index,
    parts = [];
  while (_text) {
    delimiter.lastIndex = 0;
    tokens = delimiter.exec(_text);
    if (tokens === null) {
      break;
    }
    index = tokens.index;
    if (tokens[0].length === 0) {
      index = 1;
    }
    parts.push(_text.substr(0, index));
    parts.push(tokens[0]);
    index = index + tokens[0].length;
    _text = _text.slice(index);
  }
  parts.push(_text);

  //highlight hashtags
  parts = parts.map((text) => {
    if (/^#/.test(text)) {
      return (
        <Text key={text} style={styles.hashtag}>
          {text}
        </Text>
      );
    } else {
      return text;
    }
  });

  return (
    <MentionInput
      partTypes={[
        {
          trigger: '@', // Should be a single character like '@' or '#'
          renderSuggestions: renderSuggestions(users),
          textStyle: { fontWeight: 'bold', color: Colors.primary },
          isInsertSpaceAfterMention: true
          // The mention style in the input
        }
      ]}
      fileIds={fileIds}
      updateChat={updateChat}
      handleDocumentSelection={handleDocumentSelection}
      meetingId={meetingId}
      setAttachDocument={setAttachDocument}
      onBlur={onBlur}
      onFocus={onFocus}
    />
    // <TextInput
    //   multiline={true}
    //   // style={styles.multiline}
    //   onChangeText={(text) => {
    //     setValue(value);
    //   }}
    // >
    //   <Text>{parts}</Text>
    // </TextInput>
  );
};

export default IMeetingChatTextInput;
