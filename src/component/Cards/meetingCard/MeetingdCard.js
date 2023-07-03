import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import {
  GET_ALL_LOCATION_BY_ID,
  GET_All_MEETING
} from '../../../graphql/query';
import { DELETE_MEETING } from '../../../graphql/mutation';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { styles } from './styles';
import { UserContext } from '../../../context';
import MeetingStatusDropdown from '../../meetingStatusDropdown/MeetingStatusDropdown';

const MeetingsCard = ({
  item,
  text,
  index,
  visibleIndex,
  setVisibleIndex,
  onPressDownload
}) => {
  const navigation = useNavigation();
  const { setSelectedUsers, setSelectedSubjects, setMeetingsData } =
    useContext(UserContext);

  const [openIndex, setOpenIndex] = useState(-1);
  const [role, setRole] = useState(item.yourRoleName);
  const [showModal, setShowModal] = useState(false);

  const [deleteMeeting, { data, loading, error }] = useMutation(
    DELETE_MEETING,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        'meetings'
        // {
        //   query: GET_All_MEETING,
        //   variables: {
        //     onlyMyMeeting: false,
        //     committeeIds: '',
        //     screen: 0,
        //     searchValue: '',
        //     page: -1,
        //     pageSize: -1
        //   }
        // }
      ],
      onCompleted: (data) => {
        console.log('delete meeting', data.deleteMeeting.status);
      },
      onError: (data) => {
        console.log('delete meering error', data);
      }
    }
  );

  const onDeleteHandler = () => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteMeeting({
            variables: {
              meetingId: item.meetingId
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const RowData = ({ name, discription, style, btnStyle, isDropDown }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {isDropDown ? (
          <MeetingStatusDropdown
            item={item}
            statusId={item.meetingStatusId}
            openIndex={openIndex}
            index={index}
          />
        ) : (
          <View style={[styles.discriptionView, btnStyle]}>
            <Text style={[styles.discription, style]}>{discription}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
      key={index.toString()}
      style={{ flex: 1 }}
    >
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View style={styles.committeeDetailView}>
        {getHighlightedText(
          item.meetingTitle,
          text,
          (styleTitle = { width: '100%' })
        )}
        {/* <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
          {item.title}
        </Text> */}

        <RowData
          name={'Date & Time'}
          discription={`${moment(item.setDate).format('D MMM YYYY')}, ${
            item.setTime
          }`}
        />
        <RowData name={'Location'} discription={item.locationName} />
        <RowData
          name={'Status'}
          discription={item.meetingStatusTitle}
          isDropDown={true}
          style={{
            color: Colors.bold,
            ...Fonts.PoppinsSemiBold[14]
          }}
          marginLeft={SIZES[24]}
          btnStyle={{
            backgroundColor: Colors.white,
            marginLeft: SIZES[24],
            borderColor: Colors.line,
            borderWidth: SIZES[1],
            borderRadius: SIZES[8]
          }}
        />
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => {
          setVisibleIndex(visibleIndex == -1 ? index : -1);
          setShowModal(!showModal);
        }}
        style={styles.dotsView}
        activeOpacity={0.6}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
      </TouchableOpacity>
      {visibleIndex === index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDelete={() => {
              onDeleteHandler();
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('MeetingDetails', { item });
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              setMeetingsData([]);
              setSelectedUsers([]);
              setSelectedSubjects([]);

              setVisibleIndex(-1);

              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Edit meeting',
                type: 'Meeting',
                screensArray: [
                  'general',
                  'users',
                  'dateandtime',
                  'location',
                  'subjects'
                ],
                isEdit: true,
                details: item
              });
            }}
            subjectStatus={item.meetingStatusTitle}
            editable={
              (role == 'Head' || role == 'Secretary') &&
              item.meetingStatusTitle !== 'Closed' &&
              item.meetingStatusTitle !== 'Cancelled'
                ? true
                : false
            }
            deleted={
              (role == 'Head' || role == 'Secretary') &&
              item.meetingStatusTitle !== 'Cancelled'
                ? true
                : false
            }
            download={true}
            isViewable={true}
            onPressDownload={onPressDownload}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MeetingsCard;
