import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';
import React from 'react';
import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { usersData } from '../../../../Constans/data';
import UserCard from '../../../../component/Cards/userCard/UserCard';
import { Divider } from 'react-native-paper';

const Users = () => {
  const navigation = useNavigation();
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
          <TextInput style={styles.textInput} placeholder={'Search'} />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <Divider style={styles.divider} />

        <FlatList
          data={usersData}
          keyExtractor={({ item, index }) => `user-${index}`}
          renderItem={({ item, index }) => (
            <UserCard item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Users;
