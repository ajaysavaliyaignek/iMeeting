import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { Divider } from 'react-native-paper';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GET_All_SUBJECTS,
  GET_ALL_SUBJECTS_STATUS,
  GET_USER_PAYLOAD
} from '../../../graphql/query';
import { DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import SubjectDecisionDropDown from '../../subjectDecisionDropDown/SubjectDecisionDropDown';
import SubjectStatusDropdown from '../../subjectStatusDropdown/SubjectStatusDropdown';

const SubjectsCard = ({
  item,
  index,
  searchText,
  visibleIndex,
  setVisibleIndex,
  isSubjectStatus,
  download,
  onPressView,
  isDecisionSubject,
  meetingData,
  isLiveMeetingSubject,
  isApproveMeetingSubject
}) => {
  console.log('subject', item);
  const navigation = useNavigation();
  const [statusTitleOption, setstatusTitleOption] = useState([]);
  const [user, setUser] = useState({});
  const [decisionData, setDecisionData] = useState([]);

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

  useEffect(() => {
    getAllSubjectStatus({
      variables: {
        decision: false,
        subject: true,
        approveDecision: false,
        momDecision: false
      }
    });
  }, [user]);

  const [getAllSubjectStatus] = useLazyQuery(GET_ALL_SUBJECTS_STATUS, {
    // variables: {
    //   decision: false,
    //   subject: true,
    //   approveDecision: false,
    //   momDecision: false
    // },
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
              console.log('role name=====>', user[0]?.roleName);
              if (user[0]?.roleName == 'Head') {
                return {
                  key: status.statusId,
                  value: status.statusTitle,
                  disabled:
                    status.statusTitle === 'Tentative' ||
                    status.statusTitle === 'Pre-Proposed' ||
                    status.statusTitle === 'Proposed' ||
                    (status.statusTitle === 'Transferred' && true)
                };
              }
              return {
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
                key: status.statusId,
                value: status.statusTitle,
                disabled:
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
    marginLeft,
    isDropDown,
    isDecisionSubjectDropDown,

    isMomDecision
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {isDropDown ? (
          <SubjectStatusDropdown
            item={item}
            statusTitleOption={statusTitleOption}
          />
        ) : isDecisionSubjectDropDown ? (
          <SubjectDecisionDropDown
            subjectId={item.subjectId}
            decisionData={decisionData}
            setDecisionData={setDecisionData}
            isMomDecision={isMomDecision}
            item={item}
          />
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
      {!isDecisionSubject ? (
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
              isDecisionSubjectDropDown={false}
            />
          )}
        </View>
      ) : isApproveMeetingSubject ? (
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

          <RowData
            name={'Decision'}
            marginLeft={24}
            isDecisionSubjectDropDown={true}
            isMomDecision={true}
          />
        </View>
      ) : (
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
          <RowData name={'Category'} discription={item.subjectCategoryName} />
          <RowData name={'Creator'} discription={item.createrName} />

          <RowData
            name={'Decision'}
            discription={item.statusTitle}
            marginLeft={24}
            isDecisionSubjectDropDown={true}
            isMomDecision={false}
          />
        </View>
      )}

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setVisibleIndex(visibleIndex == -1 ? index : -1)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
      </TouchableOpacity>

      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => {
              navigation.navigate('SubjectDownload', {
                item,
                downloadType: 'Subject'
              });
              setVisibleIndex(-1);
            }}
            subjectStatus={isDecisionSubject ? 'NoDeleted' : item.statusTitle}
            onPressDelete={() => {
              onDeleteHandler(item.subjectId);
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              if (isDecisionSubject) {
                navigation.navigate('AddEditDecision', {
                  meetingDetails: meetingData,
                  isEdit: true,
                  decisionId: decisionData?.decisionId,
                  subjectId: item.subjectId
                });
              } else {
                navigation.navigate('AddSubject', {
                  committee: null,
                  isEdit: true,
                  subjectDetails: item,
                  screenName: 'Edit subject'
                });
              }

              setVisibleIndex(-1);
            }}
            onPressView={() => {
              onPressView(item);

              setVisibleIndex(-1);
            }}
            download={download}
            editable={
              isLiveMeetingSubject || isApproveMeetingSubject
                ? false
                : isDecisionSubject
                ? decisionData?.statusTitle == null ||
                  decisionData?.statusTitle == ''
                  ? false
                  : true
                : item.status.entitys.isDisable
            }
            deleted={
              isLiveMeetingSubject || isApproveMeetingSubject
                ? false
                : isDecisionSubject
                ? false
                : item.status.entitys.isDisable
            }
            isViewable={
              isDecisionSubject && isApproveMeetingSubject
                ? true
                : isDecisionSubject
                ? false
                : true
            }
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectsCard;
