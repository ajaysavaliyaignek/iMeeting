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
import DropDownPicker from 'react-native-dropdown-picker';

import Normalize from '../../../themes/mixins';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import Input from '../../../component/Input/Input';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';

const CreateAccountStep2 = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'India', value: 'india' },
    { label: 'USA', value: 'USA' },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
    { label: 'F', value: 'F' },
    { label: 'G', value: 'G' },
    { label: 'H', value: 'H' },
    { label: 'I', value: 'I' },
    { label: 'J', value: 'J' },
    { label: 'K', value: 'K' }
  ]);

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
            Step <Text style={styles.txtStepCount}>2/3</Text>
          </Text>
        </View>

        {/* first name-input */}
        <Input
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          label={'First name'}
          right={
            firstName !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setFirstName('')}>
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

        {/* Last name input */}
        <Input
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          label={'Last Name'}
          right={
            lastName !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setLastName('')}>
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

        {/* Email input */}
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          label={'E-mail'}
          right={
            email !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setEmail('')}>
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

        {/* number input */}
        <Input
          onChangeText={(text) => setNumber(text)}
          value={number}
          label={'Number'}
          right={
            number !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setNumber('')}>
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
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          searchable={true}
          placeholder={'Country'}
          placeholderStyle={{
            ...Fonts.PoppinsRegular[12],
            color: Colors.secondary
          }}
          style={{
            borderWidth: 0,
            borderBottomColor: Colors.line,
            borderBottomWidth: Normalize(1),
            marginTop: Normalize(20),
            zIndex: 999
          }}
          containerStyle={{
            borderBottomColor: Colors.line,
            borderBottomWidth: Normalize(1)
          }}
          textStyle={{ ...Fonts.PoppinsRegular[14] }}
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
            title={'Next step'}
            onPress={() => navigation.navigate('Step3')}
            disable={
              firstName === '' ||
              lastName === '' ||
              email === '' ||
              number === ''
                ? true
                : false
            }
            layoutStyle={[
              {
                opacity:
                  firstName === '' ||
                  lastName === '' ||
                  email === '' ||
                  number === ''
                    ? 0.5
                    : null
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

export default CreateAccountStep2;

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
    backgroundColor: Colors.line,
    marginTop: Normalize(4)
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
