import { View, Text, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import DelegationCard from '../../../component/Cards/delegationCard/DelegationCard';
import { GET_ALL_DELEGATIONS } from '../../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import { DELETE_DELEGATION } from '../../../graphql/mutation';

const DelegationList = ({ visibleIndex, setVisibleIndex, searchText }) => {
  const navigation = useNavigation();
  const [delegations, setDelegations] = useState([]);

  const getAllDelegations = useQuery(GET_ALL_DELEGATIONS, {
    variables: {
      date: '',
      page: -1,
      pageSize: -1,
      searchValue: searchText,
      sort: ''
    },
    onCompleted: (data) => {
      console.log('get all delegations', data.delegations.items);
      setDelegations(data.delegations.items);
    },
    onError: (data) => {
      console.log('get all delegations error', data.message);
    }
  });

  const [deleteDelegation] = useMutation(DELETE_DELEGATION, {
    refetchQueries: ['delegations'],
    onCompleted: (data) => {
      console.log('delete delegation', data.deleteDelegation.status);
    },
    onError: (data) => {
      console.log('delete delegation error', data.message);
    }
  });

  const onDeleteHandler = (id) => {
    console.log(id);

    Alert.alert('Delete delegation', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteDelegation({
            variables: {
              id: id
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        style: 'cancel'
      }
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {getAllDelegations.loading ? (
        <Loader />
      ) : delegations.length > 0 ? (
        <FlatList
          data={delegations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <DelegationCard
                item={item}
                index={index}
                onPressDelete={(ite) => {
                  onDeleteHandler(ite.delegationId);
                  setVisibleIndex(-1);
                }}
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
      ) : delegations.length == 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
            No delegations found.
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
          <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.Rejected }}>
            Something went wrong.....
          </Text>
        </View>
      )}
      {/* <FlatList
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
      /> */}
    </View>
  );
};

export default DelegationList;
