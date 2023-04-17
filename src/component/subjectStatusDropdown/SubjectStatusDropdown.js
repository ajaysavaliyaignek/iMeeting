import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { Dropdown } from 'react-native-element-dropdown';
import { UPDATE_SUBJECT_STATUS } from '../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { GET_All_SUBJECTS, GET_ALL_SUBJECTS_STATUS } from '../../graphql/query';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { Path, Svg } from 'react-native-svg';

const SubjectStatusDropdown = ({
  statusTitleOption,
  item,
  setValueStatus,
  meetingId,
  setSubjectStatus,
  setSubjectData,
  subjectData
}) => {
  // function SelectIcon({ stroke }) {
  //   return (
  //     <Svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="14"
  //       height="8"
  //       viewBox="0 0 14 8"
  //       fill="none"
  //     >
  //       <Path
  //         d="M1 1L7 7L13 1"
  //         stroke={stroke}
  //         strokeWidth="1.5"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       />
  //     </Svg>
  //   );
  // }

  return (
    <View
      style={{
        flex: 1,
        paddingLeft: SIZES[4],

        borderRadius: SIZES[4],
        paddingBottom: SIZES[6]
      }}
    >
      {item.status.entitys.isDisable == 'true' ? (
        <SelectList
          // arrowicon={
          //   <SelectIcon
          //     stroke={
          //       item.statusTitle == 'Deleted'
          //         ? '#ff6347'
          //         : item.statusTitle == 'Pre-Proposed'
          //         ? '#337ab7'
          //         : item.statusTitle == 'Tentative'
          //         ? '#89530d'
          //         : item.statusTitle == 'Approved'
          //         ? 'rgba(129, 171, 150, 1)'
          //         : item.statusTitle == 'Transferred'
          //         ? 'rgba(231, 157, 115, 1)'
          //         : item.statusTitle == 'Proposed'
          //         ? 'rgb(101, 142, 180, 1)'
          //         : item.statusTitle == 'Unassigned'
          //         ? 'rgb(101, 142, 180, 1)'
          //         : Colors.bold
          //     }
          //   />
          // }
          maxHeight={200}
          setSelected={(val) => {
            setSubjectStatus(val);
            if (val == 'Pre-Proposed') {
              setSubjectData({ ...subjectData, valueMeeting: null });
            }

            // updateSubjectStatus({
            //   variables: {
            //     subject: {
            //       subjectId: item.subjectId,
            //       statusId: val,
            //       meetingId: meetingId
            //     }
            //   }
            // });
          }}
          inputStyles={{
            color:
              item.statusTitle == 'Deleted'
                ? '#ff6347'
                : item.statusTitle == 'Pre-Proposed'
                ? '#337ab7'
                : item.statusTitle == 'Tentative'
                ? '#89530d'
                : item.statusTitle == 'Approved'
                ? 'rgba(129, 171, 150, 1)'
                : item.statusTitle == 'Transferred'
                ? 'rgba(231, 157, 115, 1)'
                : item.statusTitle == 'Proposed'
                ? 'rgb(101, 142, 180, 1)'
                : item.statusTitle == 'Unassigned'
                ? 'rgb(101, 142, 180, 1)'
                : Colors.bold,
            ...Fonts.PoppinsRegular[14]
          }}
          data={statusTitleOption}
          save="value"
          search={false}
          placeholder={item.statusTitle}
          boxStyles={{
            borderRadius: SIZES[8],
            borderColor:
              item.statusTitle == 'Deleted'
                ? '#ff6347'
                : item.statusTitle == 'Pre-Proposed'
                ? '#337ab7'
                : item.statusTitle == 'Tentative'
                ? '#89530d'
                : item.statusTitle == 'Approved'
                ? 'rgba(129, 171, 150, 1)'
                : item.statusTitle == 'Transferred'
                ? 'rgba(231, 157, 115, 1)'
                : item.statusTitle == 'Proposed'
                ? 'rgb(101, 142, 180, 1)'
                : item.statusTitle == 'Unassigned'
                ? 'rgb(101, 142, 180, 1)'
                : Colors.bold,
            alignItems: 'center',
            backgroundColor:
              item.statusTitle == 'Deleted'
                ? '#ffc8be'
                : item.statusTitle == 'Pre-Proposed'
                ? '#b4dcff'
                : item.statusTitle == 'Tentative'
                ? '#deb887'
                : item.statusTitle == 'Approved'
                ? 'rgba(129, 171, 150, 0.1)'
                : item.statusTitle == 'Transferred'
                ? 'rgba(231, 157, 115, 0.1)'
                : item.statusTitle == 'Proposed'
                ? 'rgb(101, 142, 180, 0.1)'
                : item.statusTitle == 'Unassigned'
                ? 'rgb(101, 142, 180, 0.1)'
                : Colors.white
          }}
          dropdownTextStyles={{
            ...Fonts.PoppinsRegular[14],
            color: Colors.bold
          }}
          disabledTextStyles={{ ...Fonts.PoppinsRegular[14] }}
        />
      ) : (
        <Text
          style={{
            color:
              item.statusTitle == 'Deleted'
                ? '#ff6347'
                : item.statusTitle == 'Pre-Proposed'
                ? '#337ab7'
                : item.statusTitle == 'Tentative'
                ? '#89530d'
                : item.statusTitle == 'Approved'
                ? 'rgba(129, 171, 150, 1)'
                : item.statusTitle == 'Transferred'
                ? 'rgba(231, 157, 115, 1)'
                : item.statusTitle == 'Proposed'
                ? 'rgb(101, 142, 180, 1)'
                : item.statusTitle == 'Unassigned'
                ? 'rgb(101, 142, 180, 1)'
                : Colors.bold,
            ...Fonts.PoppinsRegular[14],
            marginLeft: SIZES[18]
          }}
        >
          {item.statusTitle}
        </Text>
      )}
      {/* <Dropdown
        style={{
          flex: 1,
          paddingLeft: '30%'
        }}
        itemTextStyle={{
          ...Fonts.PoppinsRegular[14],
          color: Colors.bold
        }}
        placeholder={item.statusTitle}
        disable={!item.status.entitys.isDisable}
        placeholderStyle={{
          color:
            item.statusTitle == 'Deleted'
              ? '#ff6347'
              : item.statusTitle == 'Pre-Proposed'
              ? '#337ab7'
              : item.statusTitle == 'Tentative'
              ? ' #89530d;'
              : item.statusTitle == 'Approved'
              ? 'rgba(129, 171, 150, 1)'
              : item.statusTitle == 'Transferred'
              ? 'rgba(231, 157, 115, 1)'
              : item.statusTitle == 'Proposed'
              ? 'rgb(101, 142, 180, 1)'
              : item.statusTitle == 'Unassigned'
              ? 'rgb(101, 142, 180, 1)'
              : Colors.bold
        }}
        data={statusTitleOption}
        valueField="value"
        labelField="label"
        value={item.statusTitle}
        iconColor={
          item.statusTitle == 'Deleted'
            ? '#ff6347'
            : item.statusTitle == 'Pre-Proposed'
            ? '#337ab7'
            : item.statusTitle == 'Tentative'
            ? ' #89530d;'
            : item.statusTitle == 'Approved'
            ? 'rgba(129, 171, 150, 1)'
            : item.statusTitle == 'Transferred'
            ? 'rgba(231, 157, 115, 1)'
            : item.statusTitle == 'Proposed'
            ? 'rgb(101, 142, 180, 1)'
            : item.statusTitle == 'Unassigned'
            ? 'rgb(101, 142, 180, 1)'
            : Colors.bold
        }
        onChange={(items) => {
          console.log('on change', items);
        }}
        selectedTextStyle={{
          color:
            item.statusTitle == 'Deleted'
              ? '#ff6347'
              : item.statusTitle == 'Pre-Proposed'
              ? '#337ab7'
              : item.statusTitle == 'Tentative'
              ? ' #89530d;'
              : item.statusTitle == 'Approved'
              ? 'rgba(129, 171, 150, 1)'
              : item.statusTitle == 'Transferred'
              ? 'rgba(231, 157, 115, 1)'
              : item.statusTitle == 'Proposed'
              ? 'rgb(101, 142, 180, 1)'
              : item.statusTitle == 'Unassigned'
              ? 'rgb(101, 142, 180, 1)'
              : Colors.bold
        }}
        renderItem={(item) => renderItem(item)}
        // visibleSelectedItem={false}
      /> */}
    </View>
  );
};

export default SubjectStatusDropdown;

const styles = StyleSheet.create({
  item: {
    padding: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textItem: {
    flex: 1,
    fontSize: SIZES[16]
  }
});
