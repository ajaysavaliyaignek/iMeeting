import { useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Divider } from 'react-native-paper';

import { IconName } from '../../../../component';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import Loader from '../../../../component/Loader/Loader';
import TreeView from '../../../../component/treeView/TreeView';
import { GET_MAP_COMMITTEES } from '../../../../graphql/query';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

const CommitteeExpandedView = () => {
  const [data, setData] = useState([]);
  const route = useRoute();
  const {
    selectedCommittees,
    setSelectedCommittees,
    valueType,
    setSelectedUsers,
    selectedUsers
  } = route.params;
  const [committees, setCommittees] = useState(selectedCommittees);
  const [users, setUsers] = useState(selectedUsers);
  const ref = useRef();
  const navigation = useNavigation();
  const [expandedItems, setExpandedItems] = useState([]);

  const handleToggle = (title) => {
    if (expandedItems.includes(title)) {
      setExpandedItems(expandedItems.filter((item) => item !== title));
    } else {
      setExpandedItems([...expandedItems, title]);
    }
  };

  const { loading } = useQuery(GET_MAP_COMMITTEES, {
    fetchPolicy: 'cache-and-network',
    variables: { type: 15 },
    onCompleted: (data) => {
      setData(data.mapCommittees.items);
    },
    onError: (data) => {
      console.log('map committee error', data.message);
    }
  });

  useEffect(() => {}, [ref]);

  const togglecheck = (value, item) => {
    if (value) {
      setCommittees((prev) => {
        const pevDaa = prev?.filter((ite) => {
          return ite !== item.committeeId;
        });
        return [...pevDaa, item.committeeId];
      });
    } else {
      setCommittees((prev) => {
        const pevDaa = prev?.filter((ite) => {
          return ite !== item.committeeId;
        });
        return [...pevDaa];
      });
    }
  };

  const toggleUsersCheckBox = (value, item) => {
    if (value) {
      setUsers((prev) => {
        const pevDaa = prev?.filter((ite) => {
          return ite.userId !== item.userId;
        });
        return [...pevDaa, item];
      });
    } else {
      setUsers((prev) => {
        const pevDaa = prev?.filter((ite) => {
          return ite.userId !== item.userId;
        });
        return [...pevDaa];
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Committee'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtTitle}>Committee</Text>
        {loading ? (
          <Loader color={Colors.primary} size={'large'} />
        ) : data.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FlatList
              data={data}
              renderItem={({ item, index }) => {
                return (
                  <TreeView
                    selectedUsers={selectedUsers}
                    selectedCommittees={selectedCommittees}
                    key={item.committeeId}
                    item={item}
                    onToggle={(expanded) => handleToggle(item.committeeTitle)}
                    togglecheck={(value, item) => togglecheck(value, item)}
                    valueType={valueType}
                    toggleUsersCheckBox={(value, item) => {
                      toggleUsersCheckBox(value, item);
                    }}
                  />
                );
              }}
            />
          </ScrollView>
        ) : (
          <View>
            <Text>No committees found.</Text>
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
            onPress={() => {
              if (valueType == 'users') {
                setSelectedUsers(users);
              } else {
                setSelectedCommittees(committees);
              }
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommitteeExpandedView;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: { flex: 1, backgroundColor: Colors.white, padding: SIZES[16] },
  wrapItem: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginVertical: 8
  },
  icon: {
    marginHorizontal: 8
  },
  name: {
    color: Colors.bold,
    ...Fonts.PoppinsRegular[14],
    marginLeft: SIZES[16]
  },
  txtTitle: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginTop: SIZES[8]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  }
});
