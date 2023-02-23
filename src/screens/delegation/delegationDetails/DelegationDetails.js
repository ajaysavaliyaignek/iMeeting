import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import Header from '../../../component/header/Header';
import { IconName } from '../../../component';
import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import { Button } from '../../../component/button/Button';

const DelegationDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { delegationData } = route?.params;

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
          discription={'Advisory Committee on Financial Management'}
        />
        <GeneralDetails
          title={'Start date - End date'}
          discription={'8 Nov 2021 - 21 Nov 2021'}
        />
        <GeneralDetails title={'Users'} discription={'Floyd Miles'} />
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
              //   onDeleteHandler(item?.taskId);
            }}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DelegationDetails;
