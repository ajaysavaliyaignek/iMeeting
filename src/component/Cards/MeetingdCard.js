import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import EditDeleteModal from '../EditDeleteModal';
import { SIZES } from '../../themes/Sizes';

const MeetingsCard = ({ item, text, index }) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);

  const getHighlightedText = (txt) => {
    const parts = txt.split(new RegExp(`(${text})`, 'gi'));
    return (
      <Text>
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
            <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
              {part}
            </Text>
          )
        )}
      </Text>
    );
  };

  const onDeleteHandler = () => {
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () => console.log('delete Pressed'),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const RowData = ({ name, discription, style, btnStyle }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View style={[styles.discriptionView, btnStyle]}>
          <Text style={[styles.discription, style]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setEditModal(false)}>
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
        {/* <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
          {item.title}
        </Text> */}

        <RowData name={'Date & Time'} discription={item.DateTime} />
        <RowData name={'Location'} discription={item.Location} />
        <RowData
          name={'Status'}
          discription={item.Status}
          style={{
            color: item.Status === 'Scheduled' ? Colors.bold : Colors.bold,
            ...Fonts.PoppinsSemiBold[14]
          }}
          marginLeft={24}
          btnStyle={{
            backgroundColor:
              item.Status === 'Scheduled' ? Colors.white : Colors.white,
            marginLeft: SIZES[24],
            borderColor: Colors.line,
            borderWidth: SIZES[1],
            borderRadius: SIZES[8]
          }}
        />
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
          <EditDeleteModal onPressDelete={onDeleteHandler} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MeetingsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[12]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  committeeDetailView: {
    paddingVertical: SIZES[24],
    paddingHorizontal: SIZES[16],
    width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[16],
    top: SIZES[32]
  },
  discriptionView: {
    paddingVertical: SIZES[6],
    paddingHorizontal: SIZES[24],
    borderRadius: SIZES[8]
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  }
});
