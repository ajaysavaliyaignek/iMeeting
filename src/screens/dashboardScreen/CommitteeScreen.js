import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';

import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';
import { GET_All_COMMITTEE } from '../../graphql/query';
import Loader from '../../component/Loader/Loader';
import { Button } from '../../component/button/Button';
import CommitteeCard from '../../component/Cards/committeeCard/CommitteeCard';
import CheckBox from '../../component/checkBox/CheckBox';
import { UserContext } from '../../context';

const CommitteeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { Data, activeTab, setCommittee, committee } = route?.params;
  // const { setCommittee } = useContext(UserContext);
  const [committees, setCommittees] = useState([]);
  const [selectCommittee, setSelectCommittee] = useState(null);
  const [isChecked, setChecked] = useState(false);
  // const [checked, setIsChecked] = useState(false);
  let filterCommittee = [];

  const checkToggle = (ite, value) => {
    committees?.map((com) => {
      if (com.organizationId == ite.organizationId) {
        ite.isSelected = !ite.isSelected;
      }
    });
    setCommittees([...committees]);
  };

  console.log('COMMITTE FROM COMMITTE SCRREN', selectCommittee);

  const { loading: CommitteeLoading, error: CommitteeError } = useQuery(
    GET_All_COMMITTEE,
    {
      variables: { isDeleted: true },
      onCompleted: (data) => {
        if (data) {
          console.log('committees', data?.committees.items);

          filterCommittee = data?.committees?.items.map((item, index) => {
            let previousUserIndex = committees?.findIndex(
              (user) => user.organizationId === item.organizationId
            );
            let isSelected = false;
            if (previousUserIndex >= 0) {
              isSelected = true;
            }
            return { ...item, isSelected };
          });
          console.log('filter commitee', filterCommittee);
          if (filterCommittee) {
            setCommittees(filterCommittee);
          }
        }
      }
    }
  );
  if (CommitteeError) {
    console.log('commitee error', CommitteeError);
  }

  const setSelectedCommitee = () => {
    console.log('committes==>', committees);
    const selectedUserList = [];
    committees.map((committee) => {
      console.log('user', committee.isSelected);
      if (committee.isSelected) {
        selectedUserList.push(committee);
        // console.log('selectCommittee', selectCommittee);
      }
    });
    console.log('selectCommittee', selectedUserList);
    setCommittee(selectedUserList);
    navigation.goBack();
  };

  const setAllCommittee = () => {
    committees?.map((committee) => {
      console.log('all committee=======>', committee);
      committee.isSelected == true;
    });
    setCommittees([...committees]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        name={'Committees'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text
          style={{
            ...Fonts.PoppinsBold[24],
            color: Colors.bold,
            marginTop: SIZES[16]
          }}
        >
          Committees
        </Text>
        {CommitteeLoading ? (
          <Loader />
        ) : CommitteeError ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              {CommitteeError.message}
            </Text>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.rowDataContainer}
              onPress={() => {
                setAllCommittee();
              }}
            >
              <CheckBox
                color={Colors.primary}
                value={isChecked}
                onValueChange={() => {
                  setAllCommittee();
                }}
              />
              <Text style={styles.txtCheckboxTitle}>All</Text>
            </TouchableOpacity>
            <FlatList
              data={committees}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <CommitteeCard
                    item={item}
                    index={index}
                    setCommittee={setCommittee}
                    committee={committees}
                    checkToggle={checkToggle}
                  />
                );
              }}
            />
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
            onPress={() => {
              setSelectedCommitee();
            }}
            layoutStyle={styles.nextBtnLayout}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommitteeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: SIZES[16],
    height: '100%',
    flex: 1
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: SIZES[8]
  },
  name: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  rowDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[24]
  },
  txtCheckboxTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16],
    marginRight: SIZES[16]
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
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  rowDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[24]
  },
  txtCheckboxTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16],
    marginRight: SIZES[16]
  }
});
