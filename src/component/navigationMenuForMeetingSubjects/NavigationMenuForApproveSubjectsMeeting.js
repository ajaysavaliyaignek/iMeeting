import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import { Fonts } from '../../themes';

const NavigationMenuForApproveSubjectsMeeting = ({
  activeTab,
  setActiveTab,
  isMeeting
}) => {
  const navigationMenu = isMeeting
    ? [
        { id: '0', name: 'Details' },
        { id: '1', name: 'Subjects' },
        { id: '2', name: 'Votings' },
        { id: '3', name: 'Tasks' },
        { id: '4', name: 'Decisions' }
      ]
    : [
        { id: '0', name: 'Details' },
        { id: '1', name: 'Votings' },
        { id: '2', name: 'Tasks' },
        { id: '3', name: 'Decisions' }
      ];
  return (
    <View style={styles.menuContainer}>
      {navigationMenu.map((menu) => {
        return (
          <TouchableOpacity
            key={menu.id}
            style={[
              styles.btnContainer,
              {
                backgroundColor:
                  activeTab == menu.name ? Colors.white : 'transparent',
                width: isMeeting ? '20%' : '25%'
              }
            ]}
            onPress={() => {
              setActiveTab(menu.name);
            }}
          >
            <Text style={styles.txtMenu} numberOfLines={1}>
              {menu.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavigationMenuForApproveSubjectsMeeting;

const styles = StyleSheet.create({
  btnContainer: {
    paddingVertical: SIZES[6],
    paddingHorizontal: SIZES[8],
    backgroundColor: Colors.white,
    borderRadius: SIZES[6],
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtMenu: {
    ...Fonts.PoppinsSemiBold[12],
    color: Colors.bold
  },
  menuContainer: {
    padding: SIZES[2],
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SIZES[16]
  }
});
