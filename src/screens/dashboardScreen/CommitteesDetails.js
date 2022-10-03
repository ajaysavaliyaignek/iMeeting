import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { Colors } from '../../themes/Colors';
import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import FilesCard from '../../component/Cards/FilesCard';
import UserCard from '../../component/Cards/UsersCard';

const CommitteesDetails = () => {
  const navigation = useNavigation();

  const generalDetails = (title, discription) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* header */}
      <Header
        name={'Committee details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.txtTitle}>General</Text>
        {generalDetails(
          'Committee title',
          'Advisory Committee on Financial Management'
        )}
        {generalDetails('Committee ID', '32 943')}
        {generalDetails('Committee category', 'AMC')}
        {generalDetails(
          'Discription ',
          'We need to discuss what should be the main page and we have morw question'
        )}
        <Text style={styles.txtTitle}>Date</Text>
        <View style={styles.subView}>
          <Text style={styles.txtSubDetails}>Setup date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtSubDiscription}>23 Feb,2022</Text>
            <Text style={[styles.txtSubDetails, { marginLeft: Normalize(32) }]}>
              Hijry{'  '} 30.06.1443
            </Text>
          </View>
        </View>
        <View style={styles.subView}>
          <Text style={styles.txtSubDetails}>Expiry date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtSubDiscription}>24 Feb,2022</Text>
            <Text style={[styles.txtSubDetails, { marginLeft: Normalize(32) }]}>
              Hijry{'  '} 30.06.1453
            </Text>
          </View>
        </View>
        <Text style={styles.txtAttachedTitle}>ATTACHED FILES</Text>
        <FilesCard filePath={'videoQuestion...mov'} fileSize={'837 KB'} />
        <FilesCard filePath={'archi...zip'} fileSize={'837 KB'} />
        <Text style={styles.txtTitle}>Users</Text>
        <UserCard
          userTitle={'Head'}
          userIdNumber={'894 432'}
          UserEmail={'marvin.mc@exam.com'}
          userMobile={'(423) 3424235'}
          userRole={'Head'}
        />
        <UserCard
          userTitle={'Secretary'}
          userIdNumber={'894 432'}
          UserEmail={'marvin.mc@exam.com'}
          userMobile={'(423) 3424235'}
          userRole={'Secretary'}
        />
        <UserCard
          userTitle={'Secretary'}
          userIdNumber={'894 432'}
          UserEmail={'marvin.mc@exam.com'}
          userMobile={'(423) 3424235'}
          userRole={'Secretary'}
        />
      </ScrollView>
    </View>
  );
};

export default CommitteesDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
    height: '100%',
    paddingHorizontal: Normalize(16)
  },
  txtTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginTop: Normalize(24)
  },

  subView: {
    marginTop: Normalize(24)
  },
  txtSubDetails: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtSubDiscription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: Normalize(4)
  },
  txtAttachedTitle: {
    ...Fonts.PoppinsRegular[12],
    fontWeight: '500',
    color: Colors.secondary,
    marginTop: Normalize(40),
    marginBottom: Normalize(22)
  }
});
