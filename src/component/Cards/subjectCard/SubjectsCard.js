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
  GET_All_SUBJECTS,
  GET_ALL_SUBJECTS_STATUS,
  GET_USER_PAYLOAD
} from '../../../graphql/query';
import {
  DELETE_SUBJECTS,
  UPDATE_SUBJECT_STATUS
} from '../../../graphql/mutation';
import { styles } from './styles';
import { ModalContext } from '../../../context';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { Dropdown } from 'react-native-element-dropdown';

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
  const [statusTitleOption, setstatusTitleOption] = useState([]);
  const [valueStatus, setValueStatus] = useState(item.statusId);
  const [valueStatusTitle, setValueStatusTitle] = useState(item.statusTitle);
  const [user, setUser] = useState([]);

  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    onCompleted: (data) => {
      let users = data.userPayload?.userCommitteesDetail?.filter((user) => {
        if (user.organizationId == item.committeeId) {
          return user;
        }
      });

      setUser(users);
    }
  });

  const {} = useQuery(GET_ALL_SUBJECTS_STATUS, {
    variables: {
      decision: false,
      subject: true
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data, error) => {
      if (error) {
        toast.error(error.message);
      }
      if (data) {
        setstatusTitleOption(
          data.subjectStatus.items.map((status) => {
            if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Pre-Proposed';
              })[0].statusId === item.statusId
            ) {
              if (user[0]?.roleName == 'Head') {
                return {
                  value: status.statusId,
                  label: status.statusTitle,
                  isDisable:
                    status.statusTitle === 'Tentative' ||
                    status.statusTitle === 'Pre-Proposed' ||
                    status.statusTitle === 'Proposed' ||
                    (status.statusTitle === 'Transferred' && true)
                };
              }
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Tentative';
              })[0].statusId === item.statusId
            ) {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Unassigned';
              })[0].statusId === item.statusId
            ) {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Proposed';
              })[0].statusId === item.statusId
            ) {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  (status.statusTitle === 'Approved' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Transferred';
              })[0].statusId === item.statusId
            ) {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Unassigned' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  status.statusTitle === 'Approved' ||
                  (status.statusTitle === 'Deleted' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Approved';
              })[0].statusId === item.statusId
            ) {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  status.statusTitle === 'Approved' ||
                  (status.statusTitle === 'Deleted' && true)
              };
            } else if (
              data.subjectStatus.items.filter((e) => {
                return e.statusTitle === 'Deleted';
              })[0].statusId === item.statusId
            ) {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusTitle === 'Unassigned' ||
                  status.statusTitle === 'Pre-Proposed' ||
                  status.statusTitle === 'Proposed' ||
                  status.statusTitle === 'Transferred' ||
                  status.statusTitle === 'Approved' ||
                  (status.statusTitle === 'Deleted' && true)
              };
            } else {
              return {
                value: status.statusId,
                label: status.statusTitle,
                isDisable:
                  status.statusTitle === 'Tentative' ||
                  status.statusId === item.statusId
              };
            }
          })
        );
      }
    }
  });

  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
      // export const GET_All_SUBJECTS = gql`
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
        }
      ],
      onCompleted: (data, error) => {
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
      }
    }
  );

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
        variables: { decision: false, subject: true }
      },
      'subjects'
    ],
    onCompleted: (data) => {
      console.log('update subject status', data.updateSubjectStatus.status);
    },
    onError: (data) => console.log('update subject status error', data)
  });

  const renderItem = (items) => {
    console.log('render item', items);
    return (
      <TouchableOpacity
        style={[styles.item, { opacity: items.isDisable ? 0.1 : 1 }]}
        disabled={items.isDisable}
        onPress={() => {
          console.log('items.disabled', items.isDisable);

          if (items.isDisable) {
            setValueStatus(item.statusId);
          } else {
            setValueStatusTitle(items.label);
            setValueStatus(items.value);
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

  const RowData = ({
    name,
    discription,
    backgroundColor,
    style,
    marginLeft,
    isDropDown
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {isDropDown ? (
          <View
            style={{
              flex: 1,
              paddingLeft: SIZES[4],
              backgroundColor:
                valueStatusTitle == 'Deleted'
                  ? '#ffc8be'
                  : valueStatusTitle == 'Pre-Proposed'
                  ? '#b4dcff'
                  : valueStatusTitle == 'Tentative'
                  ? '#deb887'
                  : valueStatusTitle == 'Approved'
                  ? 'rgba(129, 171, 150, 0.1)'
                  : valueStatusTitle == 'Transferred'
                  ? 'rgba(231, 157, 115, 0.1)'
                  : valueStatusTitle == 'Proposed'
                  ? 'rgb(101, 142, 180, 0.1)'
                  : valueStatusTitle == 'Unassigned'
                  ? 'rgb(101, 142, 180, 0.1)'
                  : Colors.white,
              borderRadius: SIZES[4],
              paddingBottom: SIZES[6],
              borderBottomWidth: SIZES[1],
              borderBottomColor:
                valueStatusTitle == 'Deleted'
                  ? '#ff6347'
                  : valueStatusTitle == 'Pre-Proposed'
                  ? '#337ab7'
                  : valueStatusTitle == 'Tentative'
                  ? ' #89530d;'
                  : valueStatusTitle == 'Approved'
                  ? 'rgba(129, 171, 150, 1)'
                  : valueStatusTitle == 'Transferred'
                  ? 'rgba(231, 157, 115, 1)'
                  : valueStatusTitle == 'Proposed'
                  ? 'rgb(101, 142, 180, 1)'
                  : valueStatusTitle == 'Unassigned'
                  ? 'rgb(101, 142, 180, 1)'
                  : Colors.bold
            }}
          >
            <Dropdown
              style={{
                flex: 1,
                paddingLeft: '30%'
              }}
              itemTextStyle={{
                ...Fonts.PoppinsRegular[14],
                color: Colors.bold
              }}
              placeholder={item.statusTitle}
              // disable={
              //   item.roleName == 'Head' || item.roleName == 'Secretary'
              //     ? false
              //     : true
              // }
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
                valueStatusTitle == 'Deleted'
                  ? '#ff6347'
                  : valueStatusTitle == 'Pre-Proposed'
                  ? '#337ab7'
                  : valueStatusTitle == 'Tentative'
                  ? ' #89530d;'
                  : valueStatusTitle == 'Approved'
                  ? 'rgba(129, 171, 150, 1)'
                  : valueStatusTitle == 'Transferred'
                  ? 'rgba(231, 157, 115, 1)'
                  : valueStatusTitle == 'Proposed'
                  ? 'rgb(101, 142, 180, 1)'
                  : valueStatusTitle == 'Unassigned'
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
            />
          </View>
        ) : (
          <View
            style={[
              styles.discriptionView,
              { backgroundColor: backgroundColor, marginLeft: marginLeft }
            ]}
          >
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
            isDropDown={true}
            discription={item.statusTitle}
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
              navigation.navigate('AddSubject', {
                committee: null,
                isEdit: true,
                subjectDetails: item,
                screenName: 'Edit subject'
              });
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('SubjectDetails', { item });
              setVisibleIndex(-1);
            }}
            download={download}
            editable={editable}
            deleted={deleted}
            isViewable={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectsCard;
