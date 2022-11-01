import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { SIZES } from '../../../../themes/Sizes';
import CheckBox from '../../../../component/checkBox/CheckBox';

const Role = () => {
  const navigation = useNavigation();
  const [checkValueHead, setCheckValueHead] = useState(false);
  const [checkValueSecretary, setCheckValueSecretary] = useState(false);
  const [checkValueMember, setCheckValueMember] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Role'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>Role</Text>
        <View style={styles.rowContainer}>
          <CheckBox
            value={checkValueHead}
            onValueChange={() => setCheckValueHead(!checkValueHead)}
          />
          <Text style={styles.txtRole}>Head</Text>
        </View>
        <View style={styles.rowContainer}>
          <CheckBox
            value={checkValueSecretary}
            onValueChange={() => setCheckValueSecretary(!checkValueSecretary)}
          />
          <Text style={styles.txtRole}>Secretary</Text>
        </View>
        <View style={styles.rowContainer}>
          <CheckBox
            value={checkValueMember}
            onValueChange={() => setCheckValueMember(!checkValueMember)}
          />
          <Text style={styles.txtRole}>Member</Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Save'}
            onPress={() => navigation.navigate('AddMeetingDateAndTime')}
            layoutStyle={{ marginVertical: SIZES[12] }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Role;
