import { View, Text, Pressable } from 'react-native';
import React from 'react';
import CheckBox from '../checkBox/CheckBox';
import { styles } from './styles';

const TaskStatusCard = ({ status, index, onChecked }) => {
  return (
    <Pressable
      key={index}
      style={styles.rowContainer}
      onPress={() => onChecked(status)}
    >
      <CheckBox
        value={status.isSelected}
        onValueChange={() => {
          onChecked(status);
        }}
      />
      <View
        style={[
          styles.round,
          {
            backgroundColor:
              status.name == 'Open'
                ? '#658EB4'
                : status.name == 'In progress'
                ? '#658EB4'
                : status.name == 'Completed'
                ? '#81AB96'
                : status.name == 'Closed'
                ? '#DD7878'
                : status.name == 'Deleted'
                ? '#DD7878'
                : '#658EB4'
          }
        ]}
      />
      <Text style={styles.txtDiscription}>{status.name}</Text>
    </Pressable>
  );
};

export default TaskStatusCard;
