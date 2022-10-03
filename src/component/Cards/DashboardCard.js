import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const DashboardCard = ({
  name,
  height,
  width,
  title,
  cardBackgroundColor,
  count,
  addBackgroundColor
}) => {
  return (
    <View style={[styles.container, { backgroundColor: cardBackgroundColor }]}>
      <View style={styles.leftView}>
        <Icon name={name} height={height} width={width} />
        <Text style={styles.txtTitle}>{title}</Text>
      </View>
      <View style={styles.rightView}>
        <Text style={styles.txtCount}>{count}</Text>
        <View style={[styles.addView, { backgroundColor: addBackgroundColor }]}>
          <Icon
            name={IconName.Add_White}
            height={SIZES[14]}
            width={SIZES[14]}
          />
        </View>
      </View>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  container: {
    paddingLeft: SIZES[26],
    borderRadius: SIZES[16],
    paddingRight: SIZES[16],
    paddingVertical: SIZES[26],
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES[16]
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[26]
  },
  rightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtCount: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold
  },
  addView: {
    padding: SIZES[15],
    borderRadius: SIZES[8],
    marginLeft: SIZES[24]
  }
});
