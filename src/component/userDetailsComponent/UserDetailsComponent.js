import { View, Text, FlatList } from 'react-native';
import React from 'react';
import UserDetailsCard from '../Cards/userDetailsCard/UserDetailsCard';

const UserDetailsComponent = ({ users }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item, index }) => {
          return <UserDetailsCard item={item} index={index} />;
        }}
      />
    </View>
  );
};

export default UserDetailsComponent;
