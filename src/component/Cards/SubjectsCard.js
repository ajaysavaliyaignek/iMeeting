import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { Divider } from 'react-native-paper';
import EditDeleteModal from '../EditDeleteModal';
import { SIZES } from '../../themes/Sizes';

const SubjectsCard = ({ item }) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);

  const onDeleteHandler = () => {
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () => console.log('delete Pressed'),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const RowData = ({
    name,
    discription,
    backgroundColor,
    style,
    marginLeft
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View
          style={[
            styles.discriptionView,
            { backgroundColor: backgroundColor, marginLeft: marginLeft }
          ]}
        >
          <Text style={[styles.discription, style]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setEditModal(false)}>
      <Divider style={styles.divider} />

      {/* committee details */}
      <View
        style={styles.committeeDetailView}
        onPress={() => {
          // navigation.navigate("SubjectDetails");
          setEditModal(false);
        }}
        activeOpacity={0.5}
      >
        <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
          {item.subjectTitle}
        </Text>

        <RowData name={'ID'} discription={item.subjectId} />
        <RowData name={'Category'} discription={item.subjectCategoryName} />
        <RowData name={'Creator'} discription={item.createrName} />
        <RowData
          name={'Status'}
          discription={item.subjectStatus}
          backgroundColor={
            item.subjectStatus === 'Approved'
              ? Colors.BG_Approved
              : item.subjectStatus === 'Verified'
              ? Colors.BG_Verified
              : item.subjectStatus === 'Rejected'
              ? Colors.BG_Rejected
              : item.subjectStatus === 'Pending'
              ? Colors.BG_Pending
              : Colors.BG_Transferred
          }
          style={{
            color:
              item.subjectStatus === 'Approved'
                ? Colors.Approved
                : item.subjectStatus === 'Verified'
                ? Colors.Verified
                : item.subjectStatus === 'Rejected'
                ? Colors.Rejected
                : item.subjectStatus === 'Pending'
                ? Colors.Pending
                : Colors.Transfered
          }}
          marginLeft={24}
        />
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDelete={onDeleteHandler}
            onPressEdit={() => navigation.navigate('EditSubject', { item })}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[12]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  committeeDetailView: {
    paddingVertical: SIZES[24],
    paddingHorizontal: SIZES[16],
    width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[16],
    top: SIZES[32]
  },
  discriptionView: {
    paddingVertical: SIZES[6],
    paddingHorizontal: SIZES[24],
    borderRadius: SIZES[8]
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  }
});
