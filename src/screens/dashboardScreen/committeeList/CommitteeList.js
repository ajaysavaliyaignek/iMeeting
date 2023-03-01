import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import CommitteesCard from '../../../component/Cards/CommitteesCard';
import { GET_COMMITTEES_BY_ROLE } from '../../../graphql/query';
import Loader from '../../../component/Loader/Loader';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';

const CommitteeList = ({ isProfileCommittee }) => {
  const [committees, setCommittees] = useState([]);
  const [filterCommittees, setFilterCommittees] = useState([]);
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
        setFilterCommittees(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('Committee Data error', data.message);
    }
  });
  // filter subjects
  const searchFilterSubject = (text) => {
    if (text) {
      const newData = filterCommittees.filter((item) => {
        const itemData = item.committeeTitle ? item.committeeTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setCommittees(newData);
    } else {
      setSearchText(text);
      setCommittees(filterCommittees);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {isProfileCommittee && (
        <SerachAndButtoncomponent
          isButtonShow={false}
          onChangeText={searchFilterSubject}
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
      ) : CommitteeError ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            Something went wrong...
          </Text>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            No committees found
          </Text>
        </View>
      )}
    </View>
  );
};

export default CommitteeList;
