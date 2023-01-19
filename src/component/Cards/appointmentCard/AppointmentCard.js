import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { Divider } from 'react-native-paper';

import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import {
  GET_All_APPOINTMENT,
  GET_APPOINTMENT_BY_ID
} from '../../../graphql/query';
import { DELETE_APPOINTMENT, DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { UserContext } from '../../../context';

const AppoinmentCard = ({
  item,
  index,
  text,
  visibleIndex,
  setVisibleIndex
}) => {
  const navigation = useNavigation();
  const {
    setSelectedUsers,

    setAppointmentsData
  } = useContext(UserContext);

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT,
        variables: { searchValue: '', page: -1, pageSize: -1 }
      }
    ],
    onCompleted: (data) => {
      console.log('delete appointment', data.deleteAppointment.status);
    }
  });

  const onDeleteHandler = (id) => {
    console.log(id);

    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteAppointment({
            variables: {
              id: id
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => {
        //   deleteSubject({
        //     variables: {
        //       subjectId: id
        //     }
        //   });
        // },
        style: 'cancel'
      }
    ]);
  };

  const RowData = ({
    name,
    discription,
    backgroundColor,
    style,
    marginLeft
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View
          style={[
            styles.discriptionView,
            { backgroundColor: backgroundColor, marginLeft: marginLeft }
          ]}
        >
          <Text style={[styles.discription, style]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
      key={item.appointmentId}
      // style={{ opacity: item.isDisable && 0.5 }}
    >
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View
        style={[
          styles.committeeDetailView,
          { opacity: item.isDisable ? 0.5 : 1 }
        ]}
        onPress={() => {
          // navigation.navigate("SubjectDetails");
          setEditModal(false);
        }}
        activeOpacity={0.5}
      >
        {getHighlightedText(item.appointmentTitle, text)}

        {/* subject details */}
        <RowData name={'Committee'} discription={item.committeeName} />
        <RowData name={'Your role'} discription={item.yourRoleName} />
        <RowData
          name={'Date & Time'}
          discription={`${moment(item.setDate).format('DD MMM YYYY')},${
            item.setTime
          }`}
        />
        <RowData name={'Location'} discription={item.locationName} />
      </View>

      {/* dotsView */}

      <TouchableOpacity
        onPress={() => setVisibleIndex(visibleIndex == -1 ? index : -1)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>

      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => navigation.navigate('SubjectDownload')}
            subjectStatus={item.isDisable && 'Deleted'}
            onPressDelete={() => {
              onDeleteHandler(item.appointmentId);
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              setSelectedUsers([]);

              setAppointmentsData([]);
              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Edit appointment',
                type: 'Appointment',
                screensArray: ['general', 'users', 'dateandtime', 'location'],
                isEdit: true,
                details: item
              });

              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('AppointmentDetails', {
                item: item,
                isDisable: item.isDisable
              });
              setVisibleIndex(-1);
            }}
            editable={
              item.yourRoleName == 'Member' || item.isDisable ? false : true
            }
            deleted={
              item.yourRoleName == 'Member' || item.isDisable ? false : true
            }
            isViewable={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppoinmentCard;
