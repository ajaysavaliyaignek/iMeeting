import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { Divider } from 'react-native-paper';

import { Colors } from '../../../themes/Colors';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import EditDeleteModal from '../../EditDeleteModal';
import { GET_All_SUBJECTS } from '../../../graphql/query';
import { DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { SIZES } from '../../../themes/Sizes';

const SubjectCard = ({
  item,
  index,
  searchText,

  role,
  valueIndex,
  setValueIndex,
  showdots
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
            screen: 1
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
    <TouchableOpacity activeOpacity={1} onPress={() => setValueIndex(-1)}>
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View style={[styles.committeeDetailView, { paddingHorizontal: 0 }]}>
        {getHighlightedText(item.subjectTitle, searchText)}
        {/* {getHighlightedText(item.subjectTitle)} */}

        {/* subject details */}
        <RowData name={'Category'} discription={item.subjectCategoryName} />
        <RowData name={'Creator'} discription={item.createrName} />
        {role == 'Head' || role == 'Secretary' ? (
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
        ) : null}
      </View>

      {/* dotsView */}
      {showdots && (
        <TouchableOpacity
          onPress={() => setValueIndex(valueIndex == -1 ? index : -1)}
          style={styles.dotsView}
        >
          <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
        </TouchableOpacity>
      )}
      {valueIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => {
              navigation.navigate('SubjectDownload', { item });
              setValueIndex(-1);
            }}
            subjectStatus={item.statusTitle}
            onPressDelete={() => {
              onDeleteHandler(item.subjectId);
              setValueIndex(-1);
            }}
            onPressEdit={() => {
              navigation.navigate('EditSubject', { item });
              setValueIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('SubjectDetails', { item });
              setValueIndex(-1);
            }}
            download={true}
            editable={
              role == 'Head' || role == 'Secretary'
                ? true
                : false || (item.statusTitle == 'Deleted' && false)
            }
            deleted={role == 'Head' || role == 'Secretary' ? true : false}
            isViewable={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectCard;
