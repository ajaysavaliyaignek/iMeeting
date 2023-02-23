import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import DelegationCard from '../../../component/Cards/delegationCard/DelegationCard';

const DelegationList = ({ visibleIndex, setVisibleIndex, searchText }) => {
  const navigation = useNavigation();
  const data = [
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    },
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    },
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    },
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    },
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    },
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    },
    {
      title: 'Advisory Committee on Fi...',
      startDate: '13 Aug 2021',
      executor: 'Marvin McKinney'
    }
  ];
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => {
          index.toString();
        }}
        renderItem={({ item, index }) => {
          return (
            <DelegationCard
              item={item}
              index={index}
              visibleIndex={visibleIndex}
              setVisibleIndex={setVisibleIndex}
              searchText={searchText}
              onPressEdit={() => {
                navigation.navigate('AddEditDelegation', {
                  isEdit: true,
                  delegationData: item
                });
                setVisibleIndex(-1);
              }}
              onPressView={() => {
                navigation.navigate('DelegationDetails', {
                  delegationData: item
                });
                setVisibleIndex(-1);
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default DelegationList;
