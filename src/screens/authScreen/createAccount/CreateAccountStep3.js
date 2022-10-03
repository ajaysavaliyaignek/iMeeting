import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import React, { useState } from 'react';
import { Divider, TextInput } from 'react-native-paper';

import Normalize from '../../../themes/mixins';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import Input from '../../../component/Input/Input';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';

const CreateAccountStep3 = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const onCancelHandler = () => {
    Alert.alert(
      'Cancel Account Creation',
      'Click yes if you want to cancel creation',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed')
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Login'),
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View style={styles.headerView}>
          <Text style={styles.txtHeader}>{`Create\nan account`} </Text>
          <Text style={styles.txtStep}>
            Step <Text style={styles.txtStepCount}>3/3</Text>
          </Text>
        </View>

        {/* password-input */}
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          label={'Password'}
          right={
            password !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setPassword('')}>
                    <Icon
                      name={IconName.Close}
                      height={Normalize(12)}
                      width={Normalize(12)}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null
          }
          style={styles.textInput}
        />

        {/* repeat password input */}
        <Input
          onChangeText={(text) => setRepeatPassword(text)}
          value={repeatPassword}
          label={'Repeat password'}
          right={
            repeatPassword !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setRepeatPassword('')}>
                    <Icon
                      name={IconName.Close}
                      height={Normalize(12)}
                      width={Normalize(12)}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null
          }
          style={[styles.textInput, { marginTop: Normalize(20) }]}
        />
      </ScrollView>

      <View
        style={{
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />

        {/* login button */}
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={onCancelHandler}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Create'}
            onPress={() => navigation.navigate('Mail Notification')}
            disable={password === '' || repeatPassword === '' ? true : false}
            layoutStyle={[
              {
                opacity: password === '' || repeatPassword === '' ? 0.5 : null
              },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateAccountStep3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  subContainer: {
    padding: Normalize(16)
  },
  txtHeader: {
    ...Fonts.PoppinsBold[32],
    color: Colors.bold
  },
  headerView: {
    flexDirection: 'row',
    marginVertical: Normalize(32),
    justifyContent: 'space-between'
  },
  txtStep: {
    ...Fonts.PoppinsRegular[14],
    marginTop: Normalize(10)
  },
  txtStepCount: {
    ...Fonts.PoppinsSemiBold[14]
  },
  textInput: {
    backgroundColor: Colors.white,
    height: Normalize(62),
    ...Fonts.PoppinsRegular[14]
  },
  divider: {
    width: '100%',
    height: Normalize(1),
    backgroundColor: Colors.line
  },
  buttonContainer: {
    paddingHorizontal: Normalize(16),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: Normalize(12),
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: '#144B8D'
  },
  nextBtnLayout: {
    marginVertical: Normalize(12),
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  }
});
