import React, { FC, MutableRefObject, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { styles } from './styles';

import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue
} from './utils';

const MentionInput = ({
  value,
  onChange,
  // message,
  fileIds,
  tagUser,

  partTypes,
  meetingId,
  setAttachDocument,

  inputRef: propInputRef,
  onFocus,
  containerStyle,
  onBlur,
  onSelectionChange,
  placeholder,
  styleTextInput,
  updateChat,
  handleDocumentSelection,

  ...textInputProps
}) => {
  const textInput = useRef(null);
  const [message, setMessage] = useState('');

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const { plainText, parts } = useMemo(
    () => parseValue(message, partTypes),
    [message, partTypes]
  );

  console.log('parts', parts);

  const handleSelectionChange = (event) => {
    setSelection(event.nativeEvent.selection);

    onSelectionChange && onSelectionChange(event);
  };

  /**
   * We memoize the keyword to know should we show mention suggestions or not
   */
  const keywordByTrigger = useMemo(() => {
    return getMentionPartSuggestionKeywords(
      parts,
      plainText,
      selection,
      partTypes
    );
  }, [parts, plainText, selection, partTypes]);

  /**
   * Callback on mention suggestion press. We should:
   * - Get updated value
   * - Trigger onChange callback with new value
   */
  const onSuggestionPress = (mentionType) => (suggestion) => {
    const newValue = generateValueWithAddedSuggestion(
      parts,
      mentionType,
      plainText,
      selection,
      suggestion
    );

    if (!newValue) {
      return;
    }
    console.log('new value', newValue);
    setMessage(newValue);
  };

  const handleTextInputRef = (ref) => {
    textInput.current = ref;

    if (propInputRef) {
      if (typeof propInputRef === 'function') {
        propInputRef(ref);
      } else {
        propInputRefcurrent = ref;
      }
    }
  };

  const renderMentionSuggestions = (mentionType) => (
    <React.Fragment key={mentionType.trigger}>
      {mentionType.renderSuggestions &&
        mentionType.renderSuggestions({
          keyword: keywordByTrigger[mentionType.trigger],
          onSuggestionPress: onSuggestionPress(mentionType)
        })}
    </React.Fragment>
  );

  /**
   * Callback that trigger on TextInput text change
   *
   * @param changedText
   */
  const onChangeInput = (changedText) => {
    console.log('changedText====', changedText);
    setMessage(changedText);
  };

  return (
    <View>
      {partTypes
        .filter(
          (one) =>
            isMentionPartType(one) &&
            one.renderSuggestions != null &&
            !one.isBottomMentionSuggestionsRender
        )
        .map(renderMentionSuggestions)}

      <View style={styles.containerStyle}>
        <TextInput
          value={message}
          multiline
          {...textInputProps}
          ref={handleTextInputRef}
          onChangeText={(text) => setMessage(text)}
          onSelectionChange={handleSelectionChange}
          placeholder={'Text you message'}
          style={styles.textInput}
          onBlur={onBlur}
          onFocus={onFocus}
        >
          {/* <Text>
            {console.log('parts=========', parts)}
            {parts.map(({ text, partType, data }, index) =>
              partType ? (
                <Text
                  key={`${index}-${data?.trigger ?? 'pattern'}`}
                  style={partType.textStyle ?? defaultMentionTextStyle}
                >
                  {text}
                </Text>
              ) : (
                <Text key={index}>{text}</Text>
              )
            )}
          </Text> */}
        </TextInput>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.attachIconView}
            onPress={() => {
              handleDocumentSelection();
            }}
          >
            <Icon
              name={IconName.AttachFile}
              height={SIZES[20]}
              width={SIZES[20]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={message == '' && fileIds?.length == 0 ? true : false}
            onPress={() => {
              setMessage('');
              setAttachDocument(false);
              console.log('meeting chat', {
                chatId: 0,
                meetingId: meetingId,
                message: message,
                attachDocumentId: fileIds
              });
              updateChat({
                variables: {
                  meetingChat: {
                    chatId: 0,
                    meetingId: meetingId,
                    message: message,
                    attachDocumentId: fileIds
                  }
                }
              });
            }}
          >
            <Icon
              name={
                message == '' && fileIds?.length == 0
                  ? IconName.Send_Gray
                  : IconName.Send
              }
              height={SIZES[22]}
              width={SIZES[20]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export { MentionInput };
