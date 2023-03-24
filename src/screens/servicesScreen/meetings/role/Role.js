import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { PreventRemoveContext, useNavigation } from '@react-navigation/native';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { SIZES } from '../../../../themes/Sizes';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { useQuery } from '@apollo/client';
import { GET_ROLES } from '../../../../graphql/query';

const Role = () => {
  const navigation = useNavigation();
  const [checkValue, setCheckValue] = useState(false);

  const [roles, setRoles] = useState([]);
  const [rolesId, setRolesId] = useState([]);

  if (checkValue) {
    console.log('checkvalue', checkValue);
  }

  onChangeValue = (item, index, newValue) => {
    const newData = roles.map((newItem) => {
      if (newItem.id == item.id) {
        setCheckValue(!checkValue);
        return {
          ...newItem,
          selected: newValue
        };
      }
      if (newItem.id !== item.id) {
        setCheckValue(false);
      }
      return newItem;
    });

    setRolesId(newData);
  };

  // get roles
  const {
    loading: rolesLoading,
    error: rolesError,
    data: rolesData
  } = useQuery(GET_ROLES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      taskRole: false
    },

    onCompleted: (data) => {
      setRoles(data?.roleList.roles);
    }
  });

  if (rolesError) {
    console.log('rolesError error---', rolesError);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Role'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>Role</Text>
        {roles?.map((role, index) => {
          return (
            <View style={styles.rowContainer} key={index}>
              <CheckBox
                value={checkValue[role.id]}
                // setCheckValue(!checkValue)
                onValueChange={(newValue) =>
                  setCheckValue({
                    ...checkValue,
                    [role.id]: newValue,
                    [role.name]: role
                  })
                }
              />
              <Text style={styles.txtRole}>{role?.name}</Text>
            </View>
          );
        })}
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
            title={'Save'}
            onPress={() => navigation.navigate('SelectSubjects')}
            layoutStyle={{ marginVertical: SIZES[12] }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Role;
