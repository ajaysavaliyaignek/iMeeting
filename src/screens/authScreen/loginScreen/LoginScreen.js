import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  DeviceEventEmitter
} from 'react-native';
import React, { useContext, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Divider, TextInput } from 'react-native-paper';
import { useLazyQuery, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import Input from '../../../component/Input/Input';
import { GET_AUTH } from '../../../graphql/query';
import { SIZES } from '../../../themes/Sizes';
import { styles } from './styles';
import { UserContext } from '../../../context';

const LoginScreen = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loadingLogin, setLoading] = useState(false);
  const { companyUrl, setCompanyUrl } = useContext(UserContext);

  // Query for get client id and client secret
  // For this query need company url
  const [getAuth, { loading, data }] = useLazyQuery(GET_AUTH, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      // set client id
      setClientId(data.oAuth2Application.clientId);

      // set Client secret
      setClientSecret(data.oAuth2Application.clientSecret);
      setError(data.error);
      setError('');
      if (
        data.oAuth2Application.clientId == '' &&
        data.oAuth2Application.clientId == ''
      ) {
        setError('Please enter valid company url');
        setLoading(false);
      }
    },
    onError: (data) => {
      console.log('get aoth error', data);
      setError(data.message);
      setLoading(false);
    }
  });

  // For store user data in async storage
  const storeToken = async (user) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };

  // For store company url in async storage
  const storeUrl = async (url) => {
    if (!url) return;
    try {
      const savedToken = await AsyncStorage.setItem('@url', url);
      DeviceEventEmitter.emit('urlChanged');
    } catch (error) {
      console.log(error);
    }
  };

  // For store token in async storage
  const storeUserToken = (token) => {
    try {
      AsyncStorage.setItem('@token', token);
    } catch (error) {
      console.log(error);
    }
  };

  // For user login
  // for login required  clientId,clientSecret,userName,password
  // In this function we get user token
  const Login = async () => {
    setLoading(true);
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'password');
    formData.append('username', userName);
    formData.append('password', password);

    // get company url from asyncstorage
    const Companyurl = await AsyncStorage.getItem('@url');

    if (clientId !== '' && clientSecret !== '') {
      try {
        fetch(`https://${Companyurl}//o/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.error) {
              setError(responseData.error);
              setLoading(false);
            } else {
              const dataToken = responseData.access_token;
              let user = {
                userName: userName,
                url: url,
                clientId: clientId,
                clientSecret: clientSecret,
                dataToken: dataToken
              };
              storeToken(user);
              storeUserToken(dataToken);
              setError('');

              // after login success it redirect to the services screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainBottomTab' }]
              });
              setUrl('');
              setUserName('');
              setPassword('');
              setLoading(false);

              const interval = setInterval(() => {
                refreshToken();
              }, responseData.expires_in);

              return () => clearInterval(interval);
            }
          });
      } catch (error) {
        console.log('login error', error);
        setLoading(false);
      }
    }
  };

  // this function is used for refresh token when it expired
  const refreshToken = async () => {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'password');
    formData.append('username', userName);
    formData.append('password', password);

    const Companyurl = await AsyncStorage.getItem('@url');

    if (clientId !== '' && clientSecret !== '') {
      try {
        fetch(`https://${Companyurl}//o/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.error) {
              setError(responseData.error);
            } else {
              const dataToken = responseData.access_token;
              let user = {
                userName: userName,
                url: url,
                clientId: clientId,
                clientSecret: clientSecret,
                dataToken: dataToken
              };
              storeToken(user);

              storeUserToken(dataToken);
            }
          });
      } catch (e) {
        console.log('login error', e);
      }
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

        {/* show error during login */}
        {error && (
          <View style={styles.errorView}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        )}

        {/* company url-input */}
        <Input
          onChangeText={(text) => {
            setUrl(text);
          }}
          keyboardType={'email-address'}
          onChange={() => {
            setCompanyUrl(url);
            getAuth({ variables: { domainName: url } });
            storeUrl(url);
          }}
          value={url}
          label={'URL- address company'}
          right={
            url !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity
                    onPress={() => setUrl('')}
                    style={{
                      height: SIZES[24],
                      width: SIZES[24],
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
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
          onChangeText={(text) => {
            setUserName(text);
            if (error !== '') {
              setError('');
            }
          }}
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
          onChangeText={(text) => {
            setPassword(text);
            if (error !== '') {
              setError('');
            }
          }}
          secureTextEntry={secureTextEntry}
          label={'Password'}
          value={password}
          right={
            <TextInput.Icon
              name={() => (
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon
                    name={IconName.Eye}
                    height={SIZES[22]}
                    width={DeviceInfo.isTablet() ? SIZES[12] : SIZES[22]}
                  />
                </TouchableOpacity>
              )}
            />
          }
          style={styles.textInput}
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
        <View style={styles.btnView}>
          <Button
            isLoading={loadingLogin}
            onPress={Login}
            title={'Log in'}
            disable={
              url === '' || userName === '' || password === '' || error !== ''
                ? true
                : false
            }
            layoutStyle={[
              {
                opacity:
                  url === '' ||
                  userName === '' ||
                  password === '' ||
                  error !== ''
                    ? 0.5
                    : null
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
