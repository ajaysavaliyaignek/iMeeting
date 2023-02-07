import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import validateMention from '../validateMention/ValidateMention';

/**
 * @props
 * style: React.StyleSheet
 *
 * placeholder: string | default: 'Type something ...'
 *
 * placeholderTextColor: hexColor | default: #8e8e8e
 */

const FormattedTextInput = (props) => {
  const {
    style,
    placeholder = 'Type something ...',
    placeholderTextColor = '#8e8e8e'
  } = props;
  const [testFormattedContent, setTestFormattedContent] = useState('');
  const refTextInput = useRef(null);

  const handleChangeText = (inputText) => {
    const retLines = inputText.split('\n');
    const formattedText = [];
    retLines.forEach((retLine, index) => {
      if (index !== 0) formattedText.push('\n');
      const words = retLine.split(' ');
      const contentLength = words.length;
      words.forEach((word, index) => {
        if (validateMention(word)) {
          const mention = (
            <Text key={index} style={{ color: 'red' }}>
              {word}
            </Text>
          );
          if (index !== contentLength - 1) formattedText.push(mention, ' ');
          else formattedText.push(mention);
        } else {
          if (index !== contentLength - 1) return formattedText.push(word, ' ');
          else return formattedText.push(word);
        }
      });
    });
    setTestFormattedContent(formattedText);
  };

  return (
    <View
      style={[styles.container, style]}
      onTouchStart={() => {
        refTextInput.current.focus();
      }}
    >
      <Text style={styles.text}>{testFormattedContent}</Text>
      <TextInput
        ref={refTextInput}
        style={styles.text_input}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        multiline={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 50,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  text_input: {
    color: 'transparent',
    position: 'absolute',
    width: '100%'
  },
  text: {
    position: 'absolute'
  }
});
export default FormattedTextInput;
