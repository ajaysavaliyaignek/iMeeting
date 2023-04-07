import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';

import { Colors } from '../../themes/Colors';
import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import { getHighlightedText } from '../highlitedText/HighlitedText';
import moment from 'moment';
import EditDeleteModal from '../EditDeleteModal';
import IconName from '../Icon/iconName';
import { useNavigation } from '@react-navigation/native';
import Icon from '../Icon';
import { SIZES } from '../../themes/Sizes';

const CommitteesCard = ({
  item,
  index,
  searchText,
  isProfileCommittee,
  activeIndex,
  setActiveIndex
}) => {
  const navigation = useNavigation();
  // committee row view
  const RowData = ({ name, discription }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <Text style={styles.discription} numberOfLines={1}>
          {discription}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      // activeOpacity={1}
      onPress={() => setActiveIndex(-1)}
      key={index}
      activeOpacity={1}
    >
      {!isProfileCommittee && <Divider style={styles.divider} />}
      {/* committee details */}
      <View
        style={[
          styles.committeeDetailView,
          { opacity: item.isDisable ? 0.5 : 1 }
        ]}
        // onPress={() => navigation.navigate('CommitteeDetails')}
        // activeOpacity={0.5}
      >
        {getHighlightedText(
          item?.committeeTitle,
          searchText,
          (styleTitle = { width: '92%' })
        )}
        {/* <Text style={styles.txtCommitteeTitle}>{item?.committeeTitle}</Text> */}

        <RowData name={'ID'} discription={item?.organizationId} />
        <RowData name={'Category'} discription={item.categoryTitle} />
        <RowData
          name={'Your role'}
          discription={item.status.entitys.yourRoleName}
        />
        {!isProfileCommittee && (
          <RowData
            name={'Date'}
            discription={moment(item.setUpDate, 'YYYY-MM-DD').format(
              'DD MMM YYYY'
            )}
          />
        )}
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setActiveIndex(activeIndex == -1 ? index : -1)}
        style={styles.dotsView}
      >
        <Icon
          name={IconName.Dots}
          height={Normalize(16)}
          width={Normalize(6)}
        />
      </TouchableOpacity>
      {activeIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            editable={false}
            deleted={false}
            isViewable={true}
            onPressView={() => {
              navigation.navigate('CommitteeDetails', { item });
              setActiveIndex(-1);
            }}
          />
        </View>
      )}
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
    paddingHorizontal: Normalize(16)
    // width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[12],
    top: SIZES[24],
    height: SIZES[26],
    width: SIZES[26],
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8],
    zIndex: 20
  }
});
