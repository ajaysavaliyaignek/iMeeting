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
  parseValue,
  replaceMentionValues
} from './utils';

const MentionInput = ({
  value,
  onChange,
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
  const [messageValue, setValue] = useState('');
  const [userName, setUserName] = useState([]);
  const [userId, setUserId] = useState([]);

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const { plainText, parts } = useMemo(
    () => parseValue(message, partTypes),
    [message, partTypes]
  );

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

    userName.push(`@${suggestion.name}`);
    userId.push(`@[${suggestion.name}](${suggestion.id})`);
    // setUserName(suggestion.name);
    // setUserId(suggestion.id);
    setMessage(newValue);
    // setValue(newValue);
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
    setMessage(changedText);
    // setValue(changedText);
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
          value={replaceMentionValues(message, ({ name }) => `@${name}`)}
          multiline
          // {...textInputProps}
          ref={handleTextInputRef}
          onChangeText={onChangeInput}
          onSelectionChange={handleSelectionChange}
          placeholder={'Text your message'}
          style={[styles.textInput]}
          onBlur={onBlur}
          onFocus={onFocus}
        ></TextInput>
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
              setAttachDocument(false);

              var string = '';

              for (var i = userName.length - 1; i >= 0; i--) {
                var finalAns = message.replaceAll(userName[i], userId[i]);

                string = finalAns;
              }

              updateChat({
                variables: {
                  meetingChat: {
                    chatId: 0,
                    meetingId: meetingId,
                    message: string !== '' ? string : message,
                    attachDocumentId: fileIds
                  }
                }
              });
              setMessage('');
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
