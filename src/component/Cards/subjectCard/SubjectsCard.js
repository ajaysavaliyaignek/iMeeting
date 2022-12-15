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
import { ModalContext } from '../../../context';
import { getHighlightedText } from '../../highlitedText/HighlitedText';

const SubjectsCard = ({
  item,
  index,
  searchText,
  visibleIndex,
  setVisibleIndex,
  isSubjectStatus,
  download,
  deleted,
  editable
}) => {
  const navigation = useNavigation();

  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_All_SUBJECTS,
          variables: {
            searchValue: '',
            screen: 0,
            page: -1,
            pageSize: -1
          }
        }
      ]
    }
  );
  if (data) {
    console.log('delete data', data.deleteSubject.status);
  }
  if (error) {
    Alert.alert('Delete Subject Error', [
      {
        text: error,

        style: 'default'
      }
    ]);
  }

  const onDeleteHandler = (id) => {
    console.log(id);

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
      onPress={() => setVisibleIndex(-1)}
      style={{ flex: 1, overflow: 'visible' }}
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
        {getHighlightedText(item.subjectTitle, searchText)}
        {/* {getHighlightedText(item.subjectTitle)} */}

        {/* subject details */}
        <RowData name={'ID'} discription={item.subjectId} />
        <RowData name={'Category'} discription={item.subjectCategoryName} />
        <RowData name={'Creator'} discription={item.createrName} />
        {isSubjectStatus && (
          <RowData
            name={'Status'}
            discription={item.statusTitle}
            backgroundColor={
              item.statusTitle === 'Approved'
                ? Colors.BG_Approved
                : item.statusTitle === 'Verified'
                ? Colors.BG_Verified
                : item.statusTitle === 'Rejected'
                ? Colors.BG_Rejected
                : item.statusTitle === 'Deleted'
                ? Colors.BG_Rejected
                : item.statusTitle === 'Pending'
                ? Colors.BG_Pending
                : Colors.BG_Transferred
            }
            style={{
              color:
                item.statusTitle === 'Approved'
                  ? Colors.Approved
                  : item.statusTitle === 'Verified'
                  ? Colors.Verified
                  : item.statusTitle === 'Rejected'
                  ? Colors.Rejected
                  : item.statusTitle === 'Deleted'
                  ? Colors.Rejected
                  : item.statusTitle === 'Pending'
                  ? Colors.Pending
                  : Colors.Transfered
            }}
            marginLeft={24}
          />
        )}
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setVisibleIndex(!visibleIndex ? -1 : index)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
      </TouchableOpacity>
      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => {
              navigation.navigate('SubjectDownload', { item });
              setVisibleIndex(-1);
            }}
            subjectStatus={item.statusTitle}
            onPressDelete={() => {
              onDeleteHandler(item.subjectId);
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              navigation.navigate('EditSubject', { item });
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('SubjectDetails', { item });
              setVisibleIndex(-1);
            }}
            download={download}
            editable={editable}
            deleted={deleted}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectsCard;
