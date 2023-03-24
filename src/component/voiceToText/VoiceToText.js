import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';

const VoiceToText = () => {
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('startHandler', e);
  };

  const onSpeechEndHandler = (e) => {
    console.log('onSpeechEndHandler', e);
  };

  const onSpeechResultsHandler = (e) => {
    console.log('onSpeechResultsHandler', e);
    let text = e.value[0];
    setSearchText(text);
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('voice error', error);
    }
  };
  return searchText;
};

export default VoiceToText;
