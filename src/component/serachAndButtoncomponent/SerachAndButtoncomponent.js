import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import IconName from '../Icon/iconName';
import Icon from '../Icon';
import { SIZES } from '../../themes/Sizes';
import { Button } from '../button/Button';

const SerachAndButtoncomponent = ({
  onChangeText,
  role,
  buttonText,
  onPress,
  value,
  isButtonShow,
  containerStyle,
  isPublishButtonShow,
  onPressPublish
}) => {
  const [start, setStart] = useState(false);
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechError;

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
    onChangeText(text);
    setStart(false);
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setStart(true);
    } catch (error) {
      console.log('voice error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setStart(false);
    } catch (error) {
      console.log('voice error', error);
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log({
      error: JSON.stringify(e.error)
    });
  };

  return (
    <View>
      <View style={[styles.searchContainer, containerStyle]}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          value={value}
          style={styles.textInput}
          placeholder={'Search'}
          onChangeText={onChangeText}
        />
        {!start ? (
          <TouchableOpacity
            onPress={startRecording}
            style={{
              height: SIZES[20],
              width: SIZES[20],
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon
              name={IconName.Speaker}
              height={SIZES[15]}
              width={SIZES[10]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stopRecording}
            style={{
              height: SIZES[20],
              width: SIZES[20],
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name={IconName.Close} height={SIZES[15]} width={SIZES[10]} />
          </TouchableOpacity>
        )}
      </View>
      {(role !== 'Member' || isButtonShow) && (
        <View style={styles.btnContainer}>
          <Button
            title={buttonText}
            layoutStyle={[
              styles.cancelBtnLayout,
              { width: isPublishButtonShow ? '48%' : '100%' }
            ]}
            textStyle={styles.txtCancelButton}
            onPress={onPress}
          />
          {isPublishButtonShow && (
            <Button
              title={'Publish'}
              layoutStyle={[
                styles.publishBtnLayout,
                { width: isPublishButtonShow ? '48%' : '100%' }
              ]}
              textStyle={styles.txtPublishButton}
              onPress={onPressPublish}
            />
          )}
        </View>
      )}
      <Divider style={styles.divider} />
    </View>
  );
};

export default SerachAndButtoncomponent;
