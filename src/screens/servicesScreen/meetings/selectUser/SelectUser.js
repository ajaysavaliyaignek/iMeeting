import { View, Text, SafeAreaView, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import Avatar from '../../../../component/Avatar/Avatar';
import { SIZES } from '../../../../themes/Sizes';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { useNavigation, useRoute } from '@react-navigation/native';
import TimeLineSelectUserComponent from './TimeLineSelectUserComponent';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { Colors } from '../../../../themes/Colors';

const SelectUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUsers, setSelectuser } = route?.params;

  const [requiredSwitchOn, setRequiredSwitchOn] = useState(false);
  const [optionalSwitchOn, setOptionalSwitchOn] = useState(false);
  const [optionalCheckbox, setOptionalCheckBox] = useState(false);
  const [requiredUsers, setRequiredUsers] = useState([]);
  const [optionalUser, setOptionalUser] = useState([]);

  const setSelectedUser = () => {
    const selectedUserList = [];
    selectedUsers.map((user) => {
      if (user.isSelectedForTimeline) {
        selectedUserList.push(user);
      }
    });

    setSelectuser(selectedUserList);
    navigation.goBack();
  };

  const onChecked = (item) => {
    requiredUsers?.map((user) => {
      if (user.userId === item.userId) {
        user.isSelectedForTimeline = !user.isSelectedForTimeline;
      }
    });
    setRequiredUsers([...requiredUsers]);
    optionalUser?.map((user) => {
      if (user.userId === item.userId) {
        user.isSelectedForTimeline = !user.isSelectedForTimeline;
      }
    });
    setOptionalUser([...optionalUser]);
  };

  useEffect(() => {
    selectedUsers?.map((user) => {
      if (user.isRequired == true) {
        setRequiredUsers((prev) => {
          return [...prev, user];
        });
      }
      if (user.isRequired == false) {
        setOptionalUser((prev) => {
          return [...prev, user];
        });
      }
    });
  }, [selectedUsers]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Select users'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtTitle}>SelectUser</Text>
        <View style={styles.requiredContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.txtHeading}>Required</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.txtAll}>All</Text>
              <Switch
                value={true}
                onValueChange={() => setRequiredSwitchOn(!requiredSwitchOn)}
              />
            </View>
          </View>
          {requiredUsers?.map((user, index) => {
            return (
              <TimeLineSelectUserComponent
                user={user}
                index={index}
                onChecked={onChecked}
              />
            );
          })}
        </View>
        <View style={styles.requiredContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.txtHeading}>Optional</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.txtAll}>All</Text>
              <Switch
                value={false}
                onValueChange={() => setOptionalSwitchOn(!optionalSwitchOn)}
              />
            </View>
          </View>
          {optionalUser?.map((user, index) => {
            return (
              <TimeLineSelectUserComponent
                user={user}
                index={index}
                onChecked={onChecked}
              />
            );
          })}
        </View>
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
              setSelectedUser();
            }}
            layoutStyle={styles.nextBtnLayout}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectUser;
