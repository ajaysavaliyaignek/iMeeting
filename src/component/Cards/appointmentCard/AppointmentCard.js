import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { Divider } from 'react-native-paper';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_APPOINTMENT,
  GET_APPOINTMENT_BY_ID
} from '../../../graphql/query';
import { DELETE_APPOINTMENT, DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import moment from 'moment';

const AppoinmentCard = ({ item, index, text, search }) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const [data, setData] = useState('');

  const LocationById = useQuery(GET_APPOINTMENT_BY_ID, {
    variables: {
      id: item.appointmentId
    },
    onCompleted: (data) => {
      console.log('appointment by id', data.appointment);
      if (data) {
        setData(data.appointment);
      }
    }
  });

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT
      }
    ],
    onCompleted: (data) => {
      console.log('delete appointment', data.deleteAppointment.status);
    }
  });

  // <View> {getHighlightedText(item.subjectTitle)} </View>;

  const onDeleteHandler = (id) => {
    console.log(id);
    setEditModal(false);
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
      onPress={() => setEditModal(false)}
      key={index}
    >
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View
        style={styles.committeeDetailView}
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
          discription={`${moment(item.setTime).format('DD MMM YYYY')},${
            data.setTime
          }`}
        />
        <RowData name={'Location'} discription={item.locationName} />
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => navigation.navigate('SubjectDownload')}
            subjectStatus={item.subjectStatus}
            onPressDelete={() => {
              onDeleteHandler(item.appointmentId);
              setEditModal(false);
            }}
            onPressEdit={() => {
              navigation.navigate('EditAppointmentGeneral', { data });
              setEditModal(false);
            }}
            onPressView={() => {
              navigation.navigate('AppointmentDetails', { item });
              setEditModal(false);
            }}
            editable={
              item.yourRoleName == 'Head' || item.yourRoleName == 'Secretory'
                ? true
                : false
            }
            deleted={
              item.yourRoleName == 'Head' || item.yourRoleName == 'Secretory'
                ? true
                : false
            }
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppoinmentCard;
