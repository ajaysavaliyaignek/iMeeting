import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import CheckBox from '../checkBox/CheckBox';

const TaskTypeCard = ({ type, index, onChecked }) => {
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
                ? '#C8ABCD'
                : type.name == 'Minutes of Meeting approval'
                ? '#E6C54F'
                : type.name == 'Meeting task'
                ? '#658EB4'
                : type.name == 'Confirm approval'
                ? '#DD7878'
                : type.name == 'Video conference'
                ? '#E79D73'
                : type.name == 'User task'
                ? '#81AB96'
                : '#E6C54F'
          }
        ]}
      />
      <Text style={styles.txtDiscription}>{type.name}</Text>
    </Pressable>
  );
};

export default TaskTypeCard;
