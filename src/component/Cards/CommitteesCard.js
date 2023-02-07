import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../themes/Colors';
import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import { getHighlightedText } from '../highlitedText/HighlitedText';

const CommitteesCard = ({ item, index, searchText, isProfileCommittee }) => {
  const navigation = useNavigation();

  // committee row view
  const RowData = ({ name, discription }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <Text style={styles.discription}>{discription}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      // onPress={() => setEditModal(false)}
      key={index}
    >
      {/* committee details */}
      <TouchableOpacity
        style={styles.committeeDetailView}
        // onPress={() => navigation.navigate('CommitteeDetails')}
        activeOpacity={0.5}
      >
        {getHighlightedText(item?.committeeTitle, searchText)}
        {/* <Text style={styles.txtCommitteeTitle}>{item?.committeeTitle}</Text> */}

        <RowData name={'ID'} discription={item?.organizationId} />
        <RowData name={'Category'} discription={item.categoryTitle} />
        <RowData name={'Your role'} discription={item.yourRoleName} />
        {!isProfileCommittee && (
          <RowData name={'Date'} discription={item.setUpDate} />
        )}
      </TouchableOpacity>

      {/* dotsView */}
      {/* <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon
          name={IconName.Dots}
          height={Normalize(16)}
          width={Normalize(6)}
        />
      </TouchableOpacity> */}
      {/* {editModal && (
        <View
          style={{
            backgroundColor: '#f8f8f8',
            position: 'absolute',
            top: Normalize(48),
            right: Normalize(18),
            padding: Normalize(16)
          }}
        >
          <TouchableOpacity>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )} */}
      <Divider style={styles.divider} />
    </TouchableOpacity>
  );
};

export default CommitteesCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Normalize(12)
  },
  divider: {
    width: '100%',
    height: Normalize(1),
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
    paddingVertical: Normalize(24),
    paddingHorizontal: Normalize(16),
    width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: Normalize(16),
    top: Normalize(32)
  }
});
