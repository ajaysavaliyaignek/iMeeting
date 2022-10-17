import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import React, { useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Divider, TextInput } from 'react-native-paper';
import { useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import Input from '../../../component/Input/Input';
import { GET_AUTH } from '../../../graphql/query';
import { SIZES } from '../../../themes/Sizes';
import { styles } from './styles';

const LoginScreen = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  const [getAuth, { loading, data }] = useLazyQuery(GET_AUTH, {
    onCompleted: (data) => {
      console.log(data);
      setClientId(data.oAuth2Application.clientId);
      setClientSecret(data.oAuth2Application.clientSecret);
      setError(data.error);
    }
  });

  const storeToken = async (user) => {
    console.log('store data called-----');
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  const Login = () => {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'password');
    formData.append('username', userName);
    formData.append('password', password);
    console.log('client_id', clientId.toString());
    console.log('client_secret', clientSecret.toString());
    console.log('grant_type', 'password');
    console.log('username', userName);
    console.log('password', password);

    if (clientId !== '' && clientSecret !== '') {
      fetch(`http://128.199.26.43:9080/o/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log('responseData-----', responseData);
          if (responseData.error) {
            setError(responseData.error);
            console.log(responseData.error);
          } else {
            const dataToken = responseData.access_token;
            let user = {
              userName: userName,
              url: url,
              clientId: clientId,
              clientSecret: clientSecret,
              dataToken: dataToken
            };
            console.log(user);
            storeToken(user);

            const interval = setInterval(() => {
              refreshToken();
            }, responseData.expires_in);
            navigation.navigate('MainBottomTab');
            return () => clearInterval(interval);
          }
        });
    }
  };

  const refreshToken = () => {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'password');
    formData.append('username', userName);
    formData.append('password', password);
    console.log('client_id', clientId.toString());
    console.log('client_secret', clientSecret.toString());
    console.log('grant_type', 'password');
    console.log('username', userName);
    console.log('password', password);

    if (clientId !== '' && clientSecret !== '') {
      fetch(`http://128.199.26.43:9080/o/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log('responseData-----', responseData);
          if (responseData.error) {
            setError(responseData.error);
            console.log(responseData.error);
          } else {
            const dataToken = responseData.access_token;
            console.log('dataToken', dataToken.access_token);
            let user = {
              userName: userName,
              url: url,
              clientId: clientId,
              clientSecret: clientSecret,
              dataToken: dataToken
            };
            console.log(user);
            storeToken(user);
          }
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <Text style={styles.txtHeader}>Log in</Text>
        {error && (
          <View style={styles.errorView}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        )}

        {/* url-input */}
        <Input
          onChangeText={(text) => setUrl(text)}
          // onPressOut={()=>{
          //   console.log("i am called from press out", url)
          //   getAuth({variables:{domainName:url}})}}
          onChange={() => {
            console.log('i am called', url);
            getAuth({ variables: { domainName: url } });
          }}
          value={url}
          label={'URL- address company'}
          right={
            url !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setUrl('')}>
                    <Icon
                      name={IconName.Close}
                      height={SIZES[12]}
                      width={SIZES[12]}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null
          }
          style={styles.textInput}
        />

        {/* username input */}
        <Input
          onChangeText={(text) => setUserName(text)}
          value={userName}
          label={'Username'}
          right={
            userName !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setUserName('')}>
                    <Icon
                      name={IconName.Close}
                      height={SIZES[12]}
                      width={SIZES[12]}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null
          }
          style={[styles.textInput, { marginVertical: SIZES[20] }]}
        />

        {/* password input */}
        <Input
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={secureTextEntry}
          label={'Password'}
          right={
            <TextInput.Icon
              name={() => (
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon
                    name={IconName.Eye}
                    height={22}
                    width={DeviceInfo.isTablet() ? SIZES[12] : SIZES[18]}
                  />
                </TouchableOpacity>
              )}
            />
          }
          style={styles.textInput}
        />
      </ScrollView>

      {/* create account button */}
      {/* <TouchableOpacity
        onPress={() => navigation.push("CreateAccount")}
        activeOpacity={0.5}
        style={styles.createButtonContainer}
      >
        <Text style={styles.txtCreateAccount}>Create an account</Text>
      </TouchableOpacity> */}

      <View
        style={{
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />

        {/* login button */}
        <View style={styles.btnView}>
          <Button
            onPress={Login}
            title={'Log in'}
            disable={
              url === '' || userName === '' || password === '' ? true : false
            }
            layoutStyle={[
              {
                opacity:
                  url === '' || userName === '' || password === '' ? 0.5 : null
              },
              styles.loginButton
            ]}
            textStyle={styles.txtButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
