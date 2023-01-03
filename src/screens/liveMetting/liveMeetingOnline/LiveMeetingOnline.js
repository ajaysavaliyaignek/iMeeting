import { View, Text, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { Divider } from 'react-native-paper';

const LiveMeetingOnline = ({ item: meetingData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.txtMeetingName}>{meetingData?.meetingTitle}</Text>
      <View style={styles.subContainer}>
        <Text style={styles.txtPlatfomLink}>-: Platform link :-</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(meetingData?.platformlink);
          }}
        >
          <Text style={styles.txtLink}>{meetingData?.platformlink}</Text>
        </TouchableOpacity>
        <Divider style={styles.divider} />
      </View>
    </View>
  );
};

export default LiveMeetingOnline;
