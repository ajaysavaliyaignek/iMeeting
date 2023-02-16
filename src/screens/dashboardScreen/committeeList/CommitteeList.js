import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import CommitteesCard from '../../../component/Cards/CommitteesCard';
import { GET_COMMITTEES_BY_ROLE } from '../../../graphql/query';
import Loader from '../../../component/Loader/Loader';
import { Colors } from '../../../themes/Colors';

const CommitteeList = ({ isProfileCommittee }) => {
  const [committees, setCommittees] = useState([]);
  const [searchText, setSearchText] = useState('');

  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
    fetchPolicy: 'cache-and-network',
    variables: { head: true, secretary: true, member: true },
    onCompleted: (data) => {
      console.log('Committee Data', data?.committeesByRole?.items);
      if (data) {
        setCommittees(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('Committee Data error', data.message);
    }
  });
  return (
    <View style={{ flex: 1 }}>
      {isProfileCommittee && (
        <SerachAndButtoncomponent
          isButtonShow={false}
          onChangeText={setSearchText}
          value={searchText}
          role={'Member'}
        />
      )}
      {CommitteeLoading ? (
        <Loader color={Colors.primary} />
      ) : committees.length > 0 ? (
        <FlatList
          data={committees}
          keyExtractor={(item, index) => item.organizationId}
          renderItem={({ item, index }) => {
            return (
              <CommitteesCard
                item={item}
                index={index}
                searchText={searchText}
                isProfileCommittee={isProfileCommittee}
              />
            );
          }}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>No committees found</Text>
        </View>
      )}
    </View>
  );
};

export default CommitteeList;
