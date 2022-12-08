import { View, Text, SafeAreaView, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import Avatar from '../../../../component/Avatar/Avatar';
import { SIZES } from '../../../../themes/Sizes';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { useNavigation, useRoute } from '@react-navigation/native';

const SelectUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUsers } = route?.params;
  console.log('selected users from time line select user', selectedUsers);
  const [requiredSwitchOn, setRequiredSwitchOn] = useState(false);
  const [requiredCheckBox, setRequiredCheckBox] = useState(false);
  const [optionalSwitchOn, setOptionalSwitchOn] = useState(false);
  const [optionalCheckbox, setOptionalCheckBox] = useState(false);
  const [requiredUsers, setRequiredUsers] = useState([]);
  const [optionalUser, setOptionalUser] = useState([]);
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
  console.log('======required=======', requiredUsers);
  // useEffect(() => {
  //   optionalUser?.map((user) => {
  //     user?.isRequired == false;
  //   });
  //   setOptionalUser([...optionalUser]);
  // }, []);

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
              <View style={styles.userContainer} key={index}>
                <View style={styles.switchContainer}>
                  <Avatar
                    name={user.firstName}
                    source={user.profileImage}
                    size={SIZES[34]}
                  />
                  <Text
                    style={styles.txtUserName}
                  >{`${user.firstName} ${user.familyName}`}</Text>
                </View>
                <CheckBox
                  value={true}
                  onValueChange={() => setOptionalCheckBox(!optionalCheckbox)}
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
                value={false}
                onValueChange={() => setOptionalSwitchOn(!optionalSwitchOn)}
              />
            </View>
          </View>
          {optionalUser?.map((user, index) => {
            return (
              <View style={styles.userContainer} key={index}>
                <View style={styles.switchContainer}>
                  <Avatar
                    name={user.firstName}
                    source={user.profileImage}
                    size={SIZES[34]}
                  />
                  <Text
                    style={styles.txtUserName}
                  >{`${user.firstName} ${user.familyName}`}</Text>
                </View>
                <CheckBox
                  value={false}
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
