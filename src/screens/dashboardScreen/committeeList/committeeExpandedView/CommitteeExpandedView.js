import { useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CheckboxTree from 'react-native-checkbox-tree';
import { Divider } from 'react-native-paper';
// import TreeView from 'react-native-final-tree-view';

import { Icon, IconName } from '../../../../component';
import { Button } from '../../../../component/button/Button';
import CheckBox from '../../../../component/checkBox/CheckBox';
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
  const { setSelectedCommittees, valueType, setSelectedUsers } = route.params;
  const [committees, setCommittees] = useState([]);
  const [users, setUsers] = useState([]);
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
    variables: { type: 15 },
    onCompleted: (data) => {
      console.log('get map committee', data.mapCommittees.items);
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
          return ite !== item;
        });
        return [...pevDaa, item];
      });
    } else {
      setUsers((prev) => {
        const pevDaa = prev?.filter((ite) => {
          return ite !== item;
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
          <Loader color={Colors.primary} />
        ) : data.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <FlatList
              data={data}
              renderItem={({ item, index }) => {
                return (
                  <TreeView
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
