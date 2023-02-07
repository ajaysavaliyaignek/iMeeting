import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { GET_MEETING_STATUS } from '../../graphql/query';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { useMutation, useQuery } from '@apollo/client';
import { Dropdown } from 'react-native-element-dropdown';
import { UPDATE_MEETING_STATUS } from '../../graphql/mutation';
import { SelectList } from 'react-native-dropdown-select-list';

const MeetingStatusDropdown = ({ item, statusId }) => {
  const [meetingStatusOption, setmeetingStatusOption] = useState([]);
  const [valueStatus, setValueStatus] = useState(item.meetingStatusTitle);

  const [UpdateMeetingStatus, { loading, error, data }] = useMutation(
    UPDATE_MEETING_STATUS,
    {
      refetchQueries: ['meetings']
    }
  );

  const {} = useQuery(GET_MEETING_STATUS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data, error) => {
      if (error) {
        console.log(error);
      }
      if (data) {
        setmeetingStatusOption(
          data.meetingStatus.items.map((item) => {
            if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Cancelled';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusTitle === 'Cancelled' ||
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Deleted' ||
                  item.meetingStatusTitle === 'Live' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  item.meetingStatusTitle === 'Scheduled' ||
                  item.meetingStatusTitle === 'Soft-Closed' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Closed';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusTitle === 'Cancelled' ||
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Deleted' ||
                  item.meetingStatusTitle === 'Live' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  item.meetingStatusTitle === 'Scheduled' ||
                  item.meetingStatusTitle === 'Sof    t-Closed' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Deleted';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusId === statusId ||
                  item.meetingStatusTitle === 'Cancelled' ||
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Deleted' ||
                  item.meetingStatusTitle === 'Live' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  item.meetingStatusTitle === 'Scheduled' ||
                  item.meetingStatusTitle === 'Soft-Closed' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Pre-Scheduled';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Live' ||
                  item.meetingStatusTitle === 'Soft-Closed' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Scheduled';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusId === statusId ||
                  item.meetingStatusTitle === 'Soft-Closed' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Soft-Closed';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusId === statusId ||
                  item.meetingStatusTitle === 'Cancelled' ||
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Deleted' ||
                  item.meetingStatusTitle === 'Live' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  item.meetingStatusTitle === 'Scheduled' ||
                  item.meetingStatusTitle === 'Soft-Closed' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Tentative';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Live' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  item.meetingStatusTitle === 'Scheduled' ||
                  item.meetingStatusTitle === 'Soft-Closed' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else if (
              data.meetingStatus.items.filter((e) => {
                return e.meetingStatusTitle === 'Live';
              })[0].meetingStatusId === statusId
            ) {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable:
                  item.meetingStatusId === statusId ||
                  item.meetingStatusTitle === 'Cancelled' ||
                  item.meetingStatusTitle === 'Closed' ||
                  item.meetingStatusTitle === 'Deleted' ||
                  item.meetingStatusTitle === 'Pre-Scheduled' ||
                  item.meetingStatusTitle === 'Scheduled' ||
                  (item.meetingStatusTitle === 'Tentative' && true)
              };
            } else {
              return {
                value: item.meetingStatusId,
                label: item.meetingStatusTitle,
                isDisable: item.meetingStatusId === statusId
              };
            }
          })
        );
      }
    }
  });

  const renderItem = (items) => {
    return (
      <TouchableOpacity
        style={[styles.item, { opacity: items.isDisable ? 0.1 : 1 }]}
        disabled={items.isDisable}
        onPress={() => {
          if (items.isDisable) {
            console.log('isDisable');
            setValueStatus(item.meetingStatusTitle);
            return;
          } else {
            console.log('isNotDisable');
            // setValueStatusTitle(items.label);
            setValueStatus(items.label);
            UpdateMeetingStatus({
              variables: {
                meeting: {
                  meetingId: item.meetingId,
                  meetingStatusId: items.value
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
                  : items.label == 'Live'
                  ? '#008000'
                  : items.label == 'Tentative'
                  ? ' #89530d'
                  : items.label == 'Cancelled'
                  ? '#ff6347'
                  : items.label == 'Closed'
                  ? '#ff6347'
                  : items.label == 'Pre-Scheduled'
                  ? '#337ab7'
                  : items.label == 'Scheduled'
                  ? '#5f9ea0'
                  : items.label == 'Soft-Closed'
                  ? '#87ceeb'
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
        backgroundColor:
          item.meetingStatusTitle == 'Deleted'
            ? '#ffc8be'
            : item.meetingStatusTitle == 'Live'
            ? '#5fda5f80'
            : item.meetingStatusTitle == 'Tentative'
            ? '#deb887'
            : item.meetingStatusTitle == 'Cancelled'
            ? '#ffcac1'
            : item.meetingStatusTitle == 'Closed'
            ? '#ffc8be'
            : item.meetingStatusTitle == 'Pre-Scheduled'
            ? '#b4dcff'
            : item.meetingStatusTitle == 'Scheduled'
            ? '#bff5f7'
            : item.meetingStatusTitle == 'Soft-Closed'
            ? '#4f7585'
            : Colors.white,
        borderRadius: SIZES[4],
        paddingBottom: SIZES[6],
        borderBottomWidth: SIZES[1],
        borderBottomColor:
          item.meetingStatusTitle == 'Deleted'
            ? '#ff6347'
            : item.meetingStatusTitle == 'Live'
            ? '#008000'
            : item.meetingStatusTitle == 'Tentative'
            ? '#89530d'
            : item.meetingStatusTitle == 'Cancelled'
            ? '#ff6347'
            : item.meetingStatusTitle == 'Closed'
            ? '#ff6347'
            : item.meetingStatusTitle == 'Pre-Scheduled'
            ? '#337ab7'
            : item.meetingStatusTitle == 'Scheduled'
            ? '#5f9ea0'
            : item.meetingStatusTitle == 'Soft-Closed'
            ? '#87ceeb'
            : Colors.bold
      }}
    >
      {/* <SelectList
        setSelected={(val) => {
          updateSpeaker({
            variables: {
              userDetail: {
                userId: item.userId,
                meetingId: meetingData?.meetingId,
                duration: item.duration,
                status: val
              }
            }
          });
        }}
        inputStyles={{
          color:
            item.meetingStatusTitle == 'Deleted'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Live'
              ? '#008000'
              : item.meetingStatusTitle == 'Tentative'
              ? '#89530d'
              : item.meetingStatusTitle == 'Cancelled'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Closed'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Pre-Scheduled'
              ? '#337ab7'
              : item.meetingStatusTitle == 'Scheduled'
              ? '#5f9ea0'
              : item.meetingStatusTitle == 'Soft-Closed'
              ? '#87ceeb'
              : Colors.bold,
          ...Fonts.PoppinsRegular[14]
        }}
        data={meetingStatusOption}
        save="value"
        search={false}
        placeholder={item.status}
        boxStyles={{
          borderRadius: SIZES[8],
          borderColor:
            item.meetingStatusTitle == 'Deleted'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Live'
              ? '#008000'
              : item.meetingStatusTitle == 'Tentative'
              ? '#89530d'
              : item.meetingStatusTitle == 'Cancelled'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Closed'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Pre-Scheduled'
              ? '#337ab7'
              : item.meetingStatusTitle == 'Scheduled'
              ? '#5f9ea0'
              : item.meetingStatusTitle == 'Soft-Closed'
              ? '#87ceeb'
              : Colors.bold,
          alignItems: 'center',
          backgroundColor:
            item.meetingStatusTitle == 'Deleted'
              ? '#ffc8be'
              : item.meetingStatusTitle == 'Live'
              ? '#5fda5f80'
              : item.meetingStatusTitle == 'Tentative'
              ? '#deb887'
              : item.meetingStatusTitle == 'Cancelled'
              ? '#ffcac1'
              : item.meetingStatusTitle == 'Closed'
              ? '#ffc8be'
              : item.meetingStatusTitle == 'Pre-Scheduled'
              ? '#b4dcff'
              : item.meetingStatusTitle == 'Scheduled'
              ? '#bff5f7'
              : item.meetingStatusTitle == 'Soft-Closed'
              ? '#4f7585'
              : Colors.white
        }}
        dropdownTextStyles={{ ...Fonts.PoppinsRegular[14] }}
        disabledTextStyles={{ ...Fonts.PoppinsRegular[14] }}
      /> */}
      <Dropdown
        style={{
          flex: 1,
          paddingLeft: '30%'
        }}
        itemTextStyle={{
          ...Fonts.PoppinsRegular[14],
          color: Colors.bold
        }}
        placeholder={valueStatus}
        disable={item.yourRoleName !== 'Member' ? false : true}
        placeholderStyle={{
          color:
            item.meetingStatusTitle == 'Deleted'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Live'
              ? '#008000'
              : item.meetingStatusTitle == 'Tentative'
              ? '#89530d'
              : item.meetingStatusTitle == 'Cancelled'
              ? '#ff6347;'
              : item.meetingStatusTitle == 'Closed'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Pre-Scheduled'
              ? '#337ab7'
              : item.meetingStatusTitle == 'Scheduled'
              ? '#5f9ea0'
              : item.meetingStatusTitle == 'Soft-Closed'
              ? '#87ceeb'
              : Colors.bold,
          ...Fonts.PoppinsRegular[14]
        }}
        data={meetingStatusOption}
        valueField="value"
        labelField="label"
        value={valueStatus}
        iconColor={
          item.meetingStatusTitle == 'Deleted'
            ? '#ff6347'
            : item.meetingStatusTitle == 'Live'
            ? '#008000'
            : item.meetingStatusTitle == 'Tentative'
            ? '#89530d'
            : item.meetingStatusTitle == 'Cancelled'
            ? '#ff6347'
            : item.meetingStatusTitle == 'Closed'
            ? '#ff6347'
            : item.meetingStatusTitle == 'Pre-Scheduled'
            ? '#337ab7'
            : item.meetingStatusTitle == 'Scheduled'
            ? '#5f9ea0'
            : item.meetingStatusTitle == 'Soft-Closed'
            ? '#87ceeb'
            : Colors.bold
        }
        onChange={(items) => {
          console.log('on change', items);
          if (items.isDisable) {
            // console.log('isDisable');
            // setValueStatus(item.meetingStatusTitle);
            return;
          } else {
            console.log('isNotDisable');
            // setValueStatusTitle(items.label);
            setValueStatus(items.label);
            // UpdateMeetingStatus({
            //   variables: {
            //     meeting: {
            //       meetingId: item.meetingId,
            //       meetingStatusId: items.value
            //     }
            //   }
            // });
          }
        }}
        selectedTextStyle={{
          color:
            item.meetingStatusTitle == 'Deleted'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Live'
              ? '#008000'
              : item.meetingStatusTitle == 'Tentative'
              ? '#89530d'
              : item.meetingStatusTitle == 'Cancelled'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Closed'
              ? '#ff6347'
              : item.meetingStatusTitle == 'Pre-Scheduled'
              ? '#337ab7'
              : item.meetingStatusTitle == 'Scheduled'
              ? '#5f9ea0'
              : item.meetingStatusTitle == 'Soft-Closed'
              ? '#87ceeb'
              : Colors.bold,
          ...Fonts.PoppinsRegular[14]
        }}
        renderItem={(item) => renderItem(item)}
        // visibleSelectedItem={false}
      />
    </View>
  );
};

export default MeetingStatusDropdown;

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
