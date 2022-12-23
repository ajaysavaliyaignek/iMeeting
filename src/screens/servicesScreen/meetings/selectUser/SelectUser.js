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

const SelectUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUsers, setTimelineUser } = route?.params;

  const [requiredSwitchOn, setRequiredSwitchOn] = useState(false);
  const [optionalSwitchOn, setOptionalSwitchOn] = useState(false);
  const [optionalCheckbox, setOptionalCheckBox] = useState(false);
  const [requiredUsers, setRequiredUsers] = useState([]);
  const [optionalUser, setOptionalUser] = useState([]);

  useEffect(() => {
    selectedUsers?.map((user) => {
      if (user.isRequired == true) {
        console.log('1');
        setRequiredUsers((prev) => {
          return [...prev, user];
        });
      }
      if (user.isRequired == false) {
        console.log('2');
        setOptionalUser((prev) => {
          return [...prev, user];
        });
      }
    });
    // setRequiredUsers([...requiredUsers]);
  }, [selectedUsers]);

  const onChecked = (item) => {
    selectedUsers.map((user) => {
      if (user.userId === item.userId) {
        user.isSelectedForTimeline = !user.isSelectedForTimeline;
      }
    });
    setTimelineUser([...selectedUsers]);
  };
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
    </SafeAreaView>
  );
};

export default SelectUser;
