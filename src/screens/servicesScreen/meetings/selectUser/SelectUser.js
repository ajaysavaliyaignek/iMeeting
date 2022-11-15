import { View, Text, SafeAreaView, Switch } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import Avatar from '../../../../component/Avatar/Avatar';
import { SIZES } from '../../../../themes/Sizes';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { useNavigation } from '@react-navigation/native';

const SelectUser = () => {
  const navigation = useNavigation();
  const [requiredSwitchOn, setRequiredSwitchOn] = useState(false);
  const [requiredCheckBox, setRequiredCheckBox] = useState(false);
  const [optionalSwitchOn, setOptionalSwitchOn] = useState(false);
  const [optionalCheckbox, setOptionalCheckBox] = useState(false);
  const users = [
    {
      profileImage: 'https://picsum.photos/200/300',
      userName: 'Kristin Watson'
    },
    {
      profileImage: 'https://picsum.photos/200/310',
      userName: 'Eleanor Pena'
    },
    {
      profileImage: 'https://picsum.photos/200/320',
      userName: 'Ronald Richards'
    },
    {
      profileImage: 'https://picsum.photos/200/330',
      userName: 'Bessie Cooper'
    }
  ];
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
                value={requiredSwitchOn}
                onValueChange={() => setRequiredSwitchOn(!requiredSwitchOn)}
              />
            </View>
          </View>
          {users.map((user, index) => {
            return (
              <View style={styles.userContainer} key={index}>
                <View style={styles.switchContainer}>
                  <Avatar
                    name={user.userName}
                    source={user.profileImage}
                    size={SIZES[34]}
                  />
                  <Text style={styles.txtUserName}>{user.userName}</Text>
                </View>
                <CheckBox
                  value={requiredCheckBox}
                  onValueChange={() => setRequiredCheckBox(!requiredCheckBox)}
                  key={index}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.requiredContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.txtHeading}>Optional</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.txtAll}>All</Text>
              <Switch
                value={optionalSwitchOn}
                onValueChange={() => setOptionalSwitchOn(!optionalSwitchOn)}
              />
            </View>
          </View>
          {users.map((user, index) => {
            return (
              <View style={styles.userContainer} key={index}>
                <View style={styles.switchContainer}>
                  <Avatar
                    name={user.userName}
                    source={user.profileImage}
                    size={SIZES[34]}
                  />
                  <Text style={styles.txtUserName}>{user.userName}</Text>
                </View>
                <CheckBox
                  value={optionalCheckbox}
                  onValueChange={() => setOptionalCheckBox(!optionalCheckbox)}
                />
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectUser;
