import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { Colors } from '../../themes/Colors';
import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import FilesCard from '../../component/Cards/FilesCard';
import { SafeAreaView } from 'react-native';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_COMMITTEE_MEMBER_BY_ID, GET_FILE } from '../../graphql/query';
import { Divider } from 'react-native-paper';
import UserDetailsComponent from '../../component/userDetailsComponent/UserDetailsComponent';
import { SIZES } from '../../themes/Sizes';
import AttachFiles from '../../component/attachFiles/AttachFiles';

const CommitteesDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const [fileResponse, setFileResponse] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  console.log({ item });

  item?.attachDocumentIds?.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        if (data) {
          setFileResponse((prev) => {
            const pevDaa = prev?.filter((ite) => {
              return ite.fileEnteryId !== data.fileEnteryId;
            });
            return [...pevDaa, data.uploadedFile];
          });
        }
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

  item?.userIds?.map((id) => {
    const { loading, error } = useQuery(GET_COMMITTEE_MEMBER_BY_ID, {
      fetchPolicy: 'cache-and-network',
      variables: {
        userId: id
      },
      onCompleted: (data) => {
        if (data) {
          setUserDetails((prev) => {
            const pevDaa = prev?.filter((ite) => {
              return ite.userId !== data.committeeMemberById.userId;
            });
            return [...pevDaa, data.committeeMemberById];
          });
        }
      }
    });
    if (error) {
      console.log('get user error', error);
    }
  });

  const generalDetails = (title, discription) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* header */}
      <Header
        name={'Committee details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.txtTitle}>General</Text>
        {generalDetails('Committee title', item.committeeTitle)}
        {generalDetails('Committee ID', item.committeeId)}
        {generalDetails('Committee category', item.categoryTitle)}
        {generalDetails('Discription ', item.description)}
        <Text style={styles.txtTitle}>Date</Text>
        <View style={styles.subView}>
          <Text style={styles.txtSubDetails}>Setup date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtSubDiscription}>
              {moment(item.setUpDate, 'YYYY-MM-DD').format('DD MMM, YYYY')}
            </Text>
            {/* <Text style={[styles.txtSubDetails, { marginLeft: Normalize(32) }]}>
              Hijry{'  '} 30.06.1443
            </Text> */}
          </View>
        </View>
        <View style={styles.subView}>
          <Text style={styles.txtSubDetails}>Expiry date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtSubDiscription}>
              {moment(item.expirationDate, 'YYYY-MM-DD').format('DD MMM, YYYY')}
            </Text>
            {/* <Text style={[styles.txtSubDetails, { marginLeft: Normalize(32) }]}>
              Hijry{'  '} 30.06.1453
            </Text> */}
          </View>
        </View>
        {fileResponse?.length > 0 && (
          <AttachFiles
            fileResponse={fileResponse}
            setFileResponse={setFileResponse}
            showAttachButton={false}
            deleted={false}
            download={true}
            isShowAttchTitle={true}
          />
        )}
        <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
        <View style={{ marginHorizontal: SIZES[16] }}>
          <Text style={styles.txtTitle}>Users</Text>
        </View>
        <Divider style={[styles.divider, { marginTop: SIZES[24] }]} />
        <UserDetailsComponent
          users={userDetails}
          isGeneralUser={true}
          committee={item.committeeTitle}
          // onChecked={setOnAllUserClick}
          isCheckboxView={false}
          // visibleIndex={visibleIndex}
          // setVisibleIndex={setVisibleIndex}
          openPopup={false}
          searchText={''}
        />
        {/* <UserDetailsComponent
          users={userDetails}
          isUserRequired={true}
          isSwitchOnRow={true}
          isSwichDisabled={true}
          searchText={''}
          visibleIndex={-1}
          setVisibleIndex={() => {}}
        /> */}
      </ScrollView>
    </SafeAreaView>
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
  },
  divider: {
    width: '100%',
    color: Colors.line,
    height: 1
  }
});
