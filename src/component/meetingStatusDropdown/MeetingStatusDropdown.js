import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Dropdown } from 'react-native-element-dropdown';
import { SelectList } from 'react-native-dropdown-select-list';

import { GET_MEETING_STATUS } from '../../graphql/query';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { UPDATE_MEETING_STATUS } from '../../graphql/mutation';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { Path, Svg } from 'react-native-svg';

const MeetingStatusDropdown = ({ item, statusId }) => {
  const [meetingStatusOption, setmeetingStatusOption] = useState([]);
  const [valueStatus, setValueStatus] = useState(item.meetingStatusTitle);

  // function SelectIcon({ stroke }) {
  //   return (
  //     <Svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="10"
  //       height="8"
  //       viewBox="0 0 14 8"
  //       fill="none"
  //       // style={{ marginTop: 4 }}
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
  // con
  const [UpdateMeetingStatus, { loading, error, data }] = useMutation(
    UPDATE_MEETING_STATUS,
    {
      refetchQueries: ['meetings'],
      onCompleted: (data) => {
        console.log(
          'update meeting status',
          data.updateMeetingStatus.status.statusCode
        );
      }
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                return e.meetingStatusTitle === 'Deleted';
              })[0].meetingStatusId === statusId
            ) {
              return {
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled:
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
                key: item.meetingStatusId,
                value: item.meetingStatusTitle,
                disabled: item.meetingStatusId === statusId
              };
            }
          })
        );
      }
    }
  });

  return (
    <View
      style={{
        paddingLeft: SIZES[16]
      }}
    >
      <SelectList
        maxHeight={120}
        setSelected={(val) => {
          UpdateMeetingStatus({
            variables: {
              meeting: {
                meetingId: item.meetingId,
                meetingStatusId: val
              }
            }
          });
        }}
        // arrowicon={
        //   <SelectIcon
        //     stroke={
        //       item.meetingStatusTitle == 'Deleted'
        //         ? '#ff6347'
        //         : item.meetingStatusTitle == 'Live'
        //         ? '#008000'
        //         : item.meetingStatusTitle == 'Tentative'
        //         ? '#89530d'
        //         : item.meetingStatusTitle == 'Cancelled'
        //         ? '#ff6347'
        //         : item.meetingStatusTitle == 'Closed'
        //         ? '#ff6347'
        //         : item.meetingStatusTitle == 'Pre-Scheduled'
        //         ? '#337ab7'
        //         : item.meetingStatusTitle == 'Scheduled'
        //         ? '#5f9ea0'
        //         : item.meetingStatusTitle == 'Soft-Closed'
        //         ? '#87ceeb'
        //         : Colors.bold
        //     }
        //   />
        // }
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
        save="key"
        search={false}
        placeholder={valueStatus}
        boxStyles={{
          display: 'flex',
          // alignSelf: 'center',
          width: 200,
          borderRadius: SIZES[8],
          borderColor: Colors.white,
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
