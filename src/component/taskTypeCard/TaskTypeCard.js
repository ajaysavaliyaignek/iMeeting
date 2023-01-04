import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import CheckBox from '../checkBox/CheckBox';

const TaskTypeCard = ({ type, index, onChecked }) => {
  console.log(type);
  return (
    <Pressable
      key={index}
      style={styles.rowContainer}
      onPress={() => {
        onChecked(type);
      }}
    >
      <CheckBox
        value={type.isSelected}
        onValueChange={() => {
          onChecked(type);
        }}
      />
      <View
        style={[
          styles.round,
          {
            backgroundColor:
              type.name == 'Subject approval'
                ? '#E6C54F'
                : type.name == 'Minutes of Meeting approval'
                ? '#C8ABCD'
                : type.name == 'Meeting task'
                ? '#81AB96'
                : type.name == 'Confirm attendance'
                ? '#E79D73'
                : type.name == 'Video Conference meeting'
                ? '#E79D73'
                : type.name == 'Schedule an appointment response'
                ? '#658EB4'
                : '#E6C54F'
          }
        ]}
      />
      <Text style={styles.txtDiscription}>{type.name}</Text>
    </Pressable>
  );
};

export default TaskTypeCard;
