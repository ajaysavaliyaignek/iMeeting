import {
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Voice from '@react-native-community/voice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import { UserContext } from '../../../../context';
import UserDetailsComponent from '../../../../component/userDetailsComponent/UserDetailsComponent';

const Users = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userDetails } = route?.params;
  console.log('userdetails from users', userDetails);
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(userDetails);
  const [valueIndex, setValueIndex] = useState(-1);
  const { required, setRequired } = useContext(UserContext);

  const searchFilterUsers = (text) => {
    if (text) {
      const newData = userDetails?.filter((item) => {
        const itemData = item.userName ? item.userName : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setFilterData(newData);
    } else {
      setSearchText(text);
      setFilterData(userDetails);
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e) => {
    console.log('startHandler', e);
  };

  const onSpeechEndHandler = (e) => {
    console.log('onSpeechEndHandler', e);
  };

  const onSpeechResultsHandler = (e) => {
    console.log('onSpeechResultsHandler', e);
    let text = e.value[0];
    setSearchText(text);
  };
  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.log('voice error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Users'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => searchFilterUsers(text)}
          />
          <TouchableOpacity onPress={() => startRecording()}>
            <Icon
              name={IconName.Speaker}
              height={SIZES[15]}
              width={SIZES[10]}
            />
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
        <UserDetailsComponent
          users={filterData}
          isUserRequired={true}
          isSwitchOnRow={true}
          isSwichDisabled={true}
          searchText={searchText}
          isCheckboxView={false}
          visibleIndex={-1}
          setVisibleIndex={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default Users;
