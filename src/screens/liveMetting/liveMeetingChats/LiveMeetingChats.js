import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { Icon, IconName } from '../../../component';
import { SIZES } from '../../../themes/Sizes';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import ChatBoxInput from '../../../component/chatBoxInput/ChatBoxInput';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  GET_ALL_CHATS,
  GET_LIVE_MEETING_USERS,
  GET_USER_PAYLOAD
} from '../../../graphql/query';
import { Fonts } from '../../../themes';
import Loader from '../../../component/Loader/Loader';
import ChatListComponent from '../../../component/chatListComponent/ChatListComponent';
import { UPDATE_CHAT } from '../../../graphql/mutation';
import AttachFiles from '../../../component/attachFiles/AttachFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../../context';
import { MentionInput } from '../../../component/mentionInput/MentionInput';
import { Divider } from 'react-native-paper';
import IMeetingChatTextInput from '../../../component/iMeetingChatTextInput/IMeetingChatTextInput';
import MentionInputText from '../../../component/MentionInputText/MentionInputText';

const LiveMeetingChats = ({ item: meetingData, socketEventUpdateMessage }) => {
  const { user, setUser, companyUrl } = useContext(UserContext);

  const [chatData, setChatData] = useState([]);

  const [liveMeetingUser, setLiveMettingUser] = useState([]);
  const [fileResponse, setFileResponse] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attchDocument, setAttachDocument] = useState(false);
  const [active, setActive] = useState(false);
  const [messageFromSocket, setMessageFromSocket] = useState('');
  const [tagUser, setTagUser] = useState('');
  const client = useApolloClient();
  const socketStatusTyping = useRef(null);
  const socketLastMessage = useRef(null);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : -120;
  const reqTimer = 0;

  // socketStatusTyping connected status
  useEffect(() => {
    let wsUrl = encodeURI(
      `wss://${companyUrl}/o/chat?meetingId=${meetingData?.meetingId}&userName=${user?.userName}`
    );
    socketStatusTyping.current = new WebSocket(wsUrl);
    console.log('socketStatusTyping url', socketStatusTyping.current.url);

    socketStatusTyping.current.onopen = () => {
      console.log('socketStatusTyping', 'Connected to the server');
    };
    socketStatusTyping.current.onclose = (e) => {
      console.log(
        'socketStatusTyping',
        'Disconnected. Check internet or server.'
      );
    };
    socketStatusTyping.onerror = (e) => {
      console.log('socketStatusTyping', e.message);
    };

    return () => {
      console.log('socketStatusTyping', 'close connection');
      socketStatusTyping.current.close();
    };
  }, []);

  // socketLastMessage connected status
  useEffect(() => {
    socketLastMessage.current = new WebSocket(
      `wss://${companyUrl}//o/live-meeting-chat?meetingId=${meetingData?.meetingId}`
    );

    socketLastMessage.current.onopen = () => {
      console.log('socketLastMessage Connected to the server');
    };
    socketLastMessage.current.onclose = (e) => {
      console.log('socketLastMessage Disconnected. Check internet or server.');
    };
    socketLastMessage.onerror = (e) => {
      console.log('socketLastMessage error', e.message);
    };

    return () => {
      console.log('socketLastMessage close connection');
      socketLastMessage.current.close();
    };
  }, []);

  useEffect(() => {
    const serverMessagesList = [];
    socketStatusTyping.current.onmessage = (e) => {
      serverMessagesList.push(e.data);
      setMessageFromSocket(e.data);
    };
  }, []);

  useEffect(() => {
    socketLastMessage.current.onmessage = (e) => {
      let newMessageObject = JSON.parse(e.data);
      console.log('socketLastMessage', newMessageObject);

      setChatData([...chatData, newMessageObject]);
      chatData.push(newMessageObject);
      // setChatData(chatData);
    };
  }, [chatData]);

  // get all chat for meeting
  const getAllChats = useQuery(GET_ALL_CHATS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: meetingData.meetingId
    },
    onCompleted: (data) => {
      if (data) {
        setChatData(data.meetingChat.items);
      }
    },
    onError: (data) => {
      console.log('error in get meeting chat ', data);
    }
  });

  const getLivemeetingUser = useQuery(GET_LIVE_MEETING_USERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: meetingData.meetingId,
      isSpeaker: false
    },
    onCompleted: (data) => {
      if (data) {
        setLiveMettingUser(data.liveMeetingUsers.userDetails);
      }
    },
    onError: (data) => {
      console.log('error in get meeting chat ', data);
    }
  });

  useEffect(() => {
    if (socketEventUpdateMessage == 'meetingChat') {
      client.refetchQueries({
        include: [GET_ALL_CHATS]
      });
    }
  }, [socketEventUpdateMessage]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={{ flex: 1 }}>
        {chatData?.length > 0 ? (
          <ChatListComponent chatData={chatData} />
        ) : getAllChats.error ? (
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
            <Text
              style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}
            >
              {getAllChats.error.message == 'Network request failed'
                ? 'No Internet connection'
                : getAllChats.error.message}
            </Text>
          </View>
        ) : getAllChats.loading ? (
          <Loader color={Colors.primary} size={'large'} />
        ) : (
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
            <Text
              style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}
            >
              There no chat yet!! Please start chating....
            </Text>
          </View>
        )}
      </View>
      <View style={{ justifyContent: 'flex-end' }}>
        {attchDocument && (
          <AttachFiles
            fileResponse={fileResponse}
            setFileResponse={setFileResponse}
            deleted={true}
            download={false}
            isShowAttchTitle={false}
          />
        )}

        {messageFromSocket && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: SIZES[16]
            }}
          >
            <Icon name={IconName.Edit} height={SIZES[12]} width={SIZES[12]} />
            <Text
              style={{
                ...Fonts.PoppinsRegular[14],
                color: Colors.secondary,
                marginLeft: SIZES[8]
              }}
            >
              {messageFromSocket}
            </Text>
          </View>
        )}
        {/* <View style={{ flex: 1, marginBottom: 50 }}>
          <MentionInputText />
        </View> */}
        <IMeetingChatTextInput
          users={liveMeetingUser}
          meetingId={meetingData?.meetingId}
          attchDocument={attchDocument}
          setAttachDocument={setAttachDocument}
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
          onFocus={() => {
            socketStatusTyping.current.send(`${user?.userName}||TYPING`);
          }}
          onBlur={() => {
            socketStatusTyping.current.send(`${user?.userName}||NOT_TYPING`);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LiveMeetingChats;
