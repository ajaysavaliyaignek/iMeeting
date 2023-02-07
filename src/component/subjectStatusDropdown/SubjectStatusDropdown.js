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

const SubjectStatusDropdown = ({ statusTitleOption, item, setValueStatus }) => {
  console.log('item of subject', item);
  const [updateSubjectStatus] = useMutation(UPDATE_SUBJECT_STATUS, {
    refetchQueries: [
      {
        query: GET_All_SUBJECTS,
        variables: {
          committeeIds: '',
          searchValue: '',
          screen: 0,
          page: -1,
          pageSize: -1
        }
      },
      {
        query: GET_ALL_SUBJECTS_STATUS,
        variables: {
          decision: false,
          subject: true,
          approveDecision: false,
          momDecision: false
        }
      },
      'subjects'
    ],
    onCompleted: (data) => {
      console.log('update subject status', data.updateSubjectStatus.status);
    },
    onError: (data) => console.log('update subject status error', data)
  });
  const renderItem = (items) => {
    return (
      <TouchableOpacity
        style={[styles.item, { opacity: items.isDisable ? 0.1 : 1 }]}
        disabled={items.isDisable}
        onPress={() => {
          if (items.isDisable) {
            // setValueStatus(item.statusId);
          } else {
            // setValueStatusTitle(items.label);
            // setValueStatus(items.value);
            updateSubjectStatus({
              variables: {
                subject: {
                  subjectId: item.subjectId,
                  statusId: items.value
                }
              }
            });
          }
        }}
      >
        <Text
          style={[
            styles.textItem,
            {
              color:
                items.label == 'Deleted'
                  ? '#ff6347'
                  : items.label == 'Pre-Proposed'
                  ? '#337ab7'
                  : items.label == 'Tentative'
                  ? ' #89530d;'
                  : items.label == 'Approved'
                  ? 'rgba(129, 171, 150, 1)'
                  : items.label == 'Transferred'
                  ? 'rgba(231, 157, 115, 1)'
                  : items.label == 'Proposed'
                  ? 'rgb(101, 142, 180, 1)'
                  : items.label == 'Unassigned'
                  ? 'rgb(101, 142, 180, 1)'
                  : Colors.bold
            }
          ]}
        >
          {items.label}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: SIZES[4],

        borderRadius: SIZES[4],
        paddingBottom: SIZES[6]
      }}
    >
      {item.status.isDisable ? (
        <SelectList
          // arrowicon={() => {
          //   return <Icon name={IconName.Arrow_Down} />;
          // }}
          maxHeight={100}
          setSelected={(val) => {
            console.log('val', val);
            updateSubjectStatus({
              variables: {
                subject: {
                  subjectId: item.subjectId,
                  statusId: val
                }
              }
            });
          }}
          inputStyles={{
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
                : Colors.bold,
            ...Fonts.PoppinsRegular[14]
          }}
          data={statusTitleOption}
          save="key"
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
                ? ' #89530d;'
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
                ? ' #89530d;'
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
        disable={!item.status.isDisable}
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
