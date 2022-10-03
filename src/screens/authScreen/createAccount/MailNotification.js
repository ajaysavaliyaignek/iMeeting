import { View, Text } from 'react-native';
import React from 'react';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';

const MailNotification = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text
        style={{ ...Fonts.PoppinsBold[32], color: Colors.bold }}
      >{`Please check\n       the box`}</Text>
      <Text style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}>
        We have sent the letter to the mail
      </Text>
    </View>
  );
};

export default MailNotification;
