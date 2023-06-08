import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import { Divider, Switch } from 'react-native-paper';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import Avatar from '../../Avatar/Avatar';
import EditDeleteModal from '../../EditDeleteModal';
import { styles } from './styles';
import { useMutation, useQuery } from '@apollo/client';
import { GET_LIVE_MEETING_USERS, GET_USER_BY_ID } from '../../../graphql/query';
import CheckBox from '../../checkBox/CheckBox';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { Dropdown } from 'react-native-element-dropdown';
import { UPDATE_SPEAKER } from '../../../graphql/mutation';
import DropDownPicker from 'react-native-dropdown-picker';
import { SelectList } from 'react-native-dropdown-select-list';

const UserDetailsCard = ({
  item,
  index,
  searchText,
  committee,
  openPopup,
  onChecked,
  isUserRequired,
  isGeneralUser,
  isSwitchOnRow,
  isExternalUser,
  isCheckboxView,
  isSwichDisabled,
  isSpeaker,
  onChangeUser,
  editable,
  onPressEdit,
  onPressDelete,
  visibleIndex,
  setVisibleIndex,
  isDeletable,
  meetingData,
  isAddPublishUser,
  onPressPublish
}) => {
  const [userDetails, setUserDetails] = useState(null);

  // get user by id

  const getUser = useQuery(GET_USER_BY_ID, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: item.userId
    },
    onCompleted: (data) => {
      setUserDetails(data.committeeMemberById);
    },
    onError: (data) => {
      console.log('get user by id error', data.message);
    }
  });

  // update speaker

  const [updateSpeaker] = useMutation(UPDATE_SPEAKER, {
    refetchQueries: ['liveMeetingUsers'],
    onCompleted: (data) => {
      console.log('update speaker', data);
    },
    onError: (data) => console.log('update speaker error', data)
  });

  // committee row view
  const RowData = ({
    name,
    discription,
    switchView,
    style,
    styleText,
    switchValue,
    descriptionContainer,
    value,
    isDropDown
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName} numberOfLines={1}>
          {name}
        </Text>
        {switchView ? (
          <Switch
            color={Colors.switch}
            value={switchValue}
            disabled={isSwichDisabled}
            onValueChange={(isRequired) => {
              onChangeUser(value, isRequired);
            }}
          />
        ) : isDropDown ? (
          <View
            style={{
              flex: 1
            }}
          >
            {meetingData?.yourRoleName !== 'Member' ? (
              <SelectList
                maxHeight={120}
                setSelected={(val) => {
                  updateSpeaker({
                    variables: {
                      userDetail: {
                        userId: item.userId,
                        meetingId: meetingData?.meetingId,
                        duration: item.duration,
                        status: val
                      }
                    }
                  });
                }}
                inputStyles={{
                  color:
                    item.status == 'Waiting'
                      ? 'rgba(230, 197, 79, 1)'
                      : item.status == 'Speaking'
                      ? 'rgba(129, 171, 150, 1)'
                      : item.status == 'Completed'
                      ? 'rgba(101, 142, 180, 1)'
                      : Colors.bold,
                  ...Fonts.PoppinsRegular[14]
                }}
                data={[
                  {
                    key: 'Waiting',
                    value: 'Waiting',
                    disabled:
                      item.status == 'Waiting' ||
                      item.status == 'Speaking' ||
                      item.status == 'Completed'
                        ? true
                        : false
                  },
                  {
                    key: 'Speaking',
                    value: 'Speaking',
                    disabled:
                      item.status === 'Speaking' || item.status === 'Completed'
                        ? true
                        : false
                  },
                  {
                    key: 'Completed',
                    value: 'Completed',
                    disabled: item.status === 'Completed' ? true : false
                  }
                ]}
                save="key"
                search={false}
                placeholder={item.status}
                boxStyles={{
                  borderRadius: SIZES[8],
                  borderColor:
                    item.status == 'Waiting'
                      ? 'rgba(230, 197, 79, 1)'
                      : item.status == 'Speaking'
                      ? 'rgba(129, 171, 150, 1)'
                      : item.status == 'Completed'
                      ? 'rgba(101, 142, 180, 1)'
                      : Colors.white,
                  alignItems: 'center',
                  backgroundColor:
                    item.status == 'Waiting'
                      ? 'rgba(230, 197, 79, 0.1)'
                      : item.status == 'Speaking'
                      ? 'rgba(129, 171, 150, 0.1)'
                      : item.status == 'Completed'
                      ? 'rgba(101, 142, 180, 0.1)'
                      : Colors.white
                }}
                dropdownTextStyles={{ ...Fonts.PoppinsRegular[14] }}
                disabledTextStyles={{ ...Fonts.PoppinsRegular[14] }}
              />
            ) : (
              <Text
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color:
                    item.status == 'Waiting'
                      ? 'rgba(230, 197, 79, 1)'
                      : item.status == 'Speaking'
                      ? 'rgba(129, 171, 150, 1)'
                      : item.status == 'Completed'
                      ? 'rgba(101, 142, 180, 1)'
                      : Colors.bold
                }}
              >
                {item.status}
              </Text>
            )}
          </View>
        ) : (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center'
                // marginLeft: SIZES[24]
              },
              descriptionContainer
            ]}
          >
            <View style={style} />
            <Text style={[styles.discription, styleText]} numberOfLines={1}>
              {discription}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      // activeOpacity={0.8}
      style={[
        Platform.OS !== 'android' ? { zIndex: 1 } : null,
        { elevation: 10, flex: 1 }
      ]}
      onPress={() => {
        setVisibleIndex(-1);
        if (isCheckboxView) {
          onChecked(item);
        }
      }}
    >
      {/* committee details */}
      <View style={styles.committeeDetailView} activeOpacity={0.5}>
        <View style={styles.userDetails}>
          <Avatar
            name={item.userName == undefined ? item.firstName : item.userName}
            source={userDetails?.profilePicture}
            size={SIZES[32]}
          />
          {getHighlightedText(
            item.userName == undefined
              ? item.firstName + ' ' + item.familyName
              : item.userName,
            searchText,
            (styleTitle = { marginLeft: SIZES[8] })
          )}
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}
        >
          <View style={styles.userDetailsContainer}>
            {isGeneralUser && (
              <View>
                <RowData name={'ID'} discription={item.userId} />
                <RowData
                  name={'E-mail'}
                  discription={
                    item.email == undefined ? item.emails : item.email
                  }
                />
                <RowData
                  name={'Number'}
                  discription={userDetails?.phoneNumber}
                />
                <RowData
                  name={'Role'}
                  discription={
                    item.roleName == undefined
                      ? (item?.roles !== null &&
                          item?.roles != undefined &&
                          committee !== null &&
                          item?.roles[
                            item?.organizationIds?.indexOf(committee)
                          ]) ||
                        (committee !== null &&
                          item?.roles[item?.organizations?.indexOf(committee)])
                      : item.roleName
                  }
                />
              </View>
            )}
            {isExternalUser && (
              <View style={{}}>
                <RowData name={'ID'} discription={item.userId} />
                <RowData
                  name={'E-mail'}
                  discription={
                    item.email == undefined ? item.emails : item.email
                  }
                />
                <RowData
                  name={'Role'}
                  discription={
                    item.roleName == undefined
                      ? item?.roles !== null &&
                        item.roles[item?.organizationIds?.indexOf(committee)]
                      : item.roleName
                  }
                />
                <RowData
                  name={'Private'}
                  switchView={true}
                  switchValue={userDetails?.privateDetails}
                />
              </View>
            )}
            {isUserRequired && (
              <View>
                <RowData
                  name={'E-mail'}
                  discription={item.emails ? item.emails : item.email}
                />
                <RowData
                  name={'Role'}
                  discription={
                    item.roles
                      ? item.roles[item?.organizationIds?.indexOf(committee)]
                      : item.yourRoleName
                      ? item.yourRoleName
                      : item.roleName
                  }
                />
                <RowData
                  name={'Available'}
                  discription={item?.isAvailable || 'Unknown'}
                  style={{
                    height: SIZES[8],
                    width: SIZES[8],
                    backgroundColor:
                      item?.isAvailable == 'Unknown'
                        ? '#E6C54F'
                        : item?.isAvailable == 'Conflict'
                        ? '#DD7878'
                        : '#81AB96',
                    borderRadius: SIZES[4],
                    marginRight: SIZES[8]
                  }}
                />
                <RowData
                  name={'Answer'}
                  discription={item.answer}
                  styleText={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.secondary
                  }}
                />
                <RowData
                  name={'Required'}
                  discription={item.isRequired}
                  switchView={isSwitchOnRow}
                  switchValue={item.isRequired}
                  value={item}
                />
              </View>
            )}
            {isSpeaker && (
              <View>
                <RowData name={'Role'} discription={item.roleName} />
                <RowData
                  name={'Duration'}
                  discription={`${item.duration} min`}
                  descriptionContainer={{
                    borderBottomWidth: 1,
                    paddingBottom: 6,
                    borderBottomColor: Colors.line,
                    marginTop: 6,
                    width: '70%'
                  }}
                />
                <RowData
                  name={'Status'}
                  discription={item.status}
                  isDropDown={true}
                />
              </View>
            )}
          </View>
          {isCheckboxView && (
            <CheckBox
              onValueChange={() => {
                onChecked(item);
              }}
              value={item.isSelected}
            />
          )}
        </View>
      </View>

      {/* dotsView */}
      {openPopup && (
        <TouchableOpacity
          onPress={() => {
            setVisibleIndex(!visibleIndex ? -1 : index);
          }}
          style={styles.dotsView}
          activeOpacity={0.6}
        >
          <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
        </TouchableOpacity>
      )}
      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDelete={() => {
              onPressDelete(item);
              setVisibleIndex(-1);
            }}
            isPublish={
              item.isPublished == true || !isAddPublishUser ? false : true
            }
            onPressPublish={() => onPressPublish(item)}
            download={false}
            deleted={isDeletable}
            editable={editable}
            onPressEdit={() => {
              onPressEdit(item);
              setVisibleIndex(-1);
            }}
            isViewable={false}
          />
        </View>
      )}
      <Divider style={styles.divider} />
    </View>
  );
};

export default UserDetailsCard;
