import { View, Text, Switch, StyleSheet } from 'react-native';
import React from 'react';
import { SIZES } from '../../themes/Sizes';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { Divider } from 'react-native-paper';

const RoleListCard = ({ role, index, onChecked, secretaryPermission }) => {
  return (
    <View>
      <View
        key={index}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: SIZES[10]
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              height: SIZES[8],
              width: SIZES[8],
              borderRadius: 100,
              backgroundColor:
                role?.roleName == 'Subject Approval'
                  ? '#E6C54F'
                  : role?.roleName == 'Minutes of Meeting Approval'
                  ? '#C8ABCD'
                  : '#81AB96'
            }}
          />
          <Text
            style={{
              marginLeft: SIZES[8],
              ...Fonts.PoppinsRegular[14],
              color: Colors.bold,
              width: '75%'
            }}
          >
            {role?.roleName}
          </Text>
        </View>
        {secretaryPermission?.userRole == 'Head' ? (
          <Switch value={role?.isAccess} onChange={() => onChecked(role)} />
        ) : (
          <Text>
            {role?.name == 'SubjectApproval'
              ? secretaryPermission?.isSubjectApproval !== null
                ? secretaryPermission?.isSubjectApproval == true
                  ? 'Yes'
                  : ''
                : ''
              : role?.name == 'MeetingApproval'
              ? secretaryPermission?.isMinutesofMeetingApproval !== null
                ? secretaryPermission?.isMinutesofMeetingApproval == true
                  ? 'Yes'
                  : ''
                : ''
              : role?.name == 'TaskApproval'
              ? secretaryPermission?.allTaskTypesApproveByHead
                ? secretaryPermission?.allTaskTypesApproveByHead == true
                  ? 'Yes'
                  : ''
                : ''
              : ''}
          </Text>
        )}
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

export default RoleListCard;

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
