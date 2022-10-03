import { View, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';

import Header from '../component/header/Header';
import { Icon, IconName } from '../component';
import { SIZES } from '../themes/Sizes';
import { Colors } from '../themes/Colors';
import { Fonts } from '../themes';
import { Button } from '../component/button/Button';
import { userDetails } from '../Constans/data';
import UsersCard from '../component/Cards/UsersCard';

const SelectUsers = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('0');
  const [selectUser, setSelectUser] = useState(false);
  const [selectExternal, setSelectExternal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Header
        name={'Select user'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            placeholderTextColor={Colors.secondary}
          />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <View style={styles.btnContainer}>
          <Button
            title={'Users'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '0' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('0')}
          />

          {/* add external user button */}
          <Button
            title={'External users '}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '1' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('1')}
          />
        </View>

        {/* users */}
        {activeTab === '0' && (
          <View style={{ flex: 1 }}>
            <Divider style={styles.divider} />
            <FlatList
              data={userDetails}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => (
                <UsersCard
                  item={item}
                  index={index}
                  selectAllUser={selectUser}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
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
                  title={'Select all users'}
                  onPress={() => setSelectUser(!selectUser)}
                  layoutStyle={styles.cancelBtnLayout}
                  textStyle={styles.txtCancelButton}
                />
                <Button
                  title={'Add user'}
                  // onPress={() => navigation.navigate("AddMeetingUser")}

                  layoutStyle={[
                    // {
                    //     opacity: title === "" || discription === "" ? 0.5 : null,
                    // },
                    styles.nextBtnLayout
                  ]}
                  textStyle={styles.txtNextBtn}
                />
              </View>
            </View>
          </View>
        )}

        {/* extternal users */}
        {activeTab === '1' && (
          <View style={{ flex: 1 }}>
            <Button
              title={'Add external user'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              onPress={() => navigation.navigate('AddExternalUser')}
            />
            <Divider style={styles.divider} />
            <FlatList
              data={userDetails}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => (
                <UsersCard
                  item={item}
                  index={index}
                  external={true}
                  selectAllExternal={selectExternal}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
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
                  title={'Select all users'}
                  onPress={() => setSelectExternal(!selectExternal)}
                  layoutStyle={styles.cancelBtnLayout}
                  textStyle={styles.txtCancelButton}
                />
                <Button
                  title={'Add user'}
                  // onPress={() => navigation.navigate("AddMeetingUser")}

                  layoutStyle={[
                    // {
                    //     opacity: title === "" || discription === "" ? 0.5 : null,
                    // },
                    styles.nextBtnLayout
                  ]}
                  textStyle={styles.txtNextBtn}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  subContainer: {
    paddingHorizontal: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES[16],
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[22]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6],
    marginVertical: SIZES[6]
  },
  btnUsers: {
    paddingVertical: SIZES[8],
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    marginBottom: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-between'
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnExternalUser: {
    backgroundColor: Colors.Blue_Light,
    marginBottom: SIZES[16]
  },
  txtBtnExternal: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
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
