import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import React, { useState } from 'react';
import { GET_LIVE_MEETING_USERS } from '../../graphql/query';
import { useQuery } from '@apollo/client';
// import { MentionInput } from '../../messageTextInput/MessageTextInput';
import { MentionInput } from 'react-native-controlled-mentions';

const users = [
  { id: '1', name: 'David Tabaka' },
  { id: '2', name: 'Mary' },
  { id: '3', name: 'Tony' },
  { id: '4', name: 'Mike' },
  { id: '5', name: 'Grey' }
];

const hashtags = [
  { id: 'todo', name: 'todo' },
  { id: 'help', name: 'help' },
  { id: 'loveyou', name: 'loveyou' }
];

const renderSuggestions =
  (suggestions) =>
  ({ keyword, onSuggestionPress }) => {
    if (keyword == null) {
      return null;
    }

    return (
      <View>
        {suggestions
          .filter((one) =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          )
          .map((one) => (
            <Pressable
              key={one.id}
              onPress={() => onSuggestionPress(one)}
              style={{ padding: 12 }}
            >
              <Text>{one.name}</Text>
            </Pressable>
          ))}
      </View>
    );
  };

const renderMentionSuggestions = renderSuggestions(users);

const renderHashtagSuggestions = renderSuggestions(hashtags);

const ChatBoxInput = ({ meetingData, message, setMessage }) => {
  const [LiveMeetingUser, setLiveMeetingUser] = useState([]);
  const [value, setValue] = useState('');
  const { data: LiveMeetingUserData } = useQuery(GET_LIVE_MEETING_USERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: meetingData.meetingId,
      isSpeaker: false
    },
    onCompleted: (data) => {
      setLiveMeetingUser(
        data.liveMeetingUsers.userDetails.map((user) => {
          return {
            id: user.userId,
            display: user.userName
          };
        })
      );
    }
  });

  return (
    <View>
      <MentionInput
        value={message}
        onChange={(value) => {
          setMessage(value);
        }}
        partTypes={[
          {
            trigger: '@', // Should be a single character like '@' or '#'
            renderSuggestions: renderMentionSuggestions,
            textStyle: { fontWeight: 'bold', color: 'blue' } // The mention style in the input
          }
        ]}
        placeholder="Type here..."
      />
    </View>
  );
};

export default ChatBoxInput;
