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
import { useMutation } from '@apollo/client';
import { GET_All_SUBJECTS } from '../../../graphql/query';
import { DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';

const AppoinmentCard = ({ item, index, text, search }) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);

  const getHighlightedText = (txt) => {
    const { value } = text;
    const parts = txt.split(new RegExp(`(${text})`, 'gi'));
    return (
      <Text numberOfLines={1}>
        {parts.map((part) =>
          part === text ? (
            <Text
              style={[
                styles.txtCommitteeTitle,
                {
                  backgroundColor: '#E6C54F'
                }
              ]}
              numberOfLines={1}
            >
              {part}
            </Text>
          ) : (
            <Text
              style={styles.txtCommitteeTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {part}
            </Text>
          )
        )}
      </Text>
    );
  };
  // <View> {getHighlightedText(item.subjectTitle)} </View>;

  const onDeleteHandler = (id) => {
    console.log(id);
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteSubject({
            variables: {
              subjectId: id
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
        {getHighlightedText(item.title)}

        {/* subject details */}
        <RowData name={'Committee'} discription={item.committee} />
        <RowData name={'Your role'} discription={item.YourRole} />
        <RowData name={'Date & Time'} discription={item.DateTime} />
        <RowData name={'Location'} discription={item.Location} />
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
              onDeleteHandler(item.subjectId);
              setEditModal(false);
            }}
            onPressEdit={() => {
              navigation.navigate('EditSubject', { item });
              setEditModal(false);
            }}
            onPressView={() => {
              navigation.navigate('SubjectDetails', { item });
              setEditModal(false);
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppoinmentCard;
