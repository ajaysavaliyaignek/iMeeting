import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
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
  const [state, setState] = useState({
    value: '',
    keyword: '',
    data: []
  });

  let reqTimer = 0;

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
  function renderSuggestionsRow({ item }, hidePanel) {
    return (
      <TouchableOpacity
        onPress={() => onSuggestionTap(item.userName, hidePanel)}
      >
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Text style={styles.usernameInitials}>
              {!!item.userName && item.userName.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.userName}</Text>
            <Text style={styles.usernameText}>@{item.userName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  function onSuggestionTap(username, hidePanel) {
    hidePanel();
    const comment = state.value.slice(0, state?.keyword?.length);
    setState({
      data: [],
      value: comment + username
    });
  }

  function callback(keyword) {
    if (reqTimer) {
      clearTimeout(reqTimer);
    }

    // reqTimer = setTimeout(() => {
    //   getUserSuggestions(keyword)
    //     .then((data) => {
    //       setState({
    //         keyword: keyword,
    //         data: [...data]
    //       });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }, 200);
  }
  const getUserSuggestions = (displayName = '') => {
    return fetch(`http://localhost:8080/?username=${displayName.slice(1)}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }).then((res) => {
      console.log(res);
      if (!res.ok) {
        throw new Error('Went wrong');
      }
      return res.json();
    });
  };

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

    // <MentionsTextInput
    //   textInputStyle={{
    //     borderColor: '#ebebeb',
    //     borderWidth: 1,
    //     padding: 5,
    //     fontSize: 15
    //   }}
    //   suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
    //   loadingComponent={() => (
    //     <View
    //       style={{
    //         flex: 1,
    //         width: '100%',
    //         justifyContent: 'center',
    //         alignItems: 'center'
    //       }}
    //     >
    //       <ActivityIndicator />
    //     </View>
    //   )}
    //   textInputMinHeight={30}
    //   textInputMaxHeight={80}
    //   trigger={'@'}
    //   triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
    //   value={state.value}
    //   onChangeText={(val) => {
    //     setState({ value: val });
    //   }}
    //   triggerCallback={callback}
    //   renderSuggestionsRow={renderSuggestionsRow}
    //   suggestionsData={users} // array of objects
    //   keyExtractor={(item, index) => item.userName}
    //   suggestionRowHeight={45}
    //   horizontal={false} // default is true, change the orientation of the list
    //   MaxVisibleRowCount={3} // this is required if horizontal={false}
    // />
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

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'flex-end',
    paddingTop: 100
  },
  suggestionsRowContainer: {
    flexDirection: 'row'
  },
  userAvatarBox: {
    width: 35,
    paddingTop: 2
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54c19c'
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500'
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)'
  }
});
