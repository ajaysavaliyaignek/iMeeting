import { View, Text, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import Header from '../../../component/header/Header';
import { IconName } from '../../../component';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import { Button } from '../../../component/button/Button';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { DELETE_DELEGATION } from '../../../graphql/mutation';
import CheckBox from '../../../component/checkBox/CheckBox';
import { Fonts } from '../../../themes';
import { SIZES } from '../../../themes/Sizes';

const DelegationDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { delegationData } = route?.params;

  const [deleteDelegation] = useMutation(DELETE_DELEGATION, {
    refetchQueries: ['delegations'],
    onCompleted: (data) => {
      if (data.deleteDelegation.status.statusCode == 200) {
        navigation.navigate('Details', {
          title: 'Delegations',
          active: '2'
        });
      }
    },
    onError: (data) => {
      console.log('delete delegation error', data.message);
    }
  });

  const onDeleteHandler = (id) => {
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

  const [types, setTypes] = useState([
    {
      type: 1,
      title: 'Meeting',
      isCheked: delegationData?.types.split(',').includes('1') ? true : false
    },
    {
      type: 4,
      title: 'Appointment',
      isCheked: delegationData?.types.split(',').includes('4') ? true : false
    },
    {
      type: 3,
      title: 'Task',
      isCheked: delegationData?.types.split(',').includes('3') ? true : false
    },
    {
      type: 5,
      title: 'Video conference',
      isCheked: delegationData?.types.split(',').includes('5') ? true : false
    }
  ]);

  const GeneralDetails = ({ title, discription }) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Delegation details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtDelegationDetailsTitle}>Delegation details</Text>
        <GeneralDetails
          title={'Committee'}
          discription={delegationData.committeeName}
        />
        <GeneralDetails
          title={'Start date - End date'}
          discription={`${moment(
            delegationData.startDate,
            'YYYY-MM-DD hh:mm A'
          ).format('DD MMM YYYY')} - ${moment(
            delegationData.endDate,
            'YYYY-MM-DD hh:mm A'
          ).format('DD MMM YYYY')}`}
        />
        <GeneralDetails
          title={'Users'}
          discription={delegationData.transferredUserName}
        />
      </View>

      <View
        style={{
          backgroundColor: Colors.white,
          paddingHorizontal: SIZES[16],
          paddingBottom: SIZES[16]
        }}
      >
        {types.map((type, index) => {
          return (
            <View
              style={{
                marginTop: SIZES[24],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Text style={{ ...Fonts.PoppinsRegular[14], color: Colors.bold }}>
                {type.title}
              </Text>
              <CheckBox value={type.isCheked} disabled={true} />
            </View>
          );
        })}
      </View>

      {!delegationData.isDisable && (
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
              title={'Edit'}
              onPress={() =>
                navigation.navigate('AddEditDelegation', {
                  isEdit: true,
                  delegationData: delegationData
                })
              }
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Delete'}
              onPress={() => {
                onDeleteHandler(delegationData?.delegationId);
              }}
              layoutStyle={[styles.nextBtnLayout]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DelegationDetails;
