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
import SerachAndButtoncomponent from '../../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const Users = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userDetails } = route?.params;
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(userDetails);

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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Users'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <SerachAndButtoncomponent
          isButtonShow={false}
          role={'Member'}
          onChangeText={(text) => searchFilterUsers(text)}
          value={searchText}
        />

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
