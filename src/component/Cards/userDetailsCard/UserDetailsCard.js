import { View, Text, TouchableOpacity, Pressable } from 'react-native';
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
  meetingId
}) => {
  const [userDetails, setUserDetails] = useState(null);
  const [valueStatus, setValueStatus] = useState(item.status);
  const [statusItems, setStatusItems] = useState([
    {
      label: 'Waiting',
      value: 'Waiting',
      disabled:
        item.status == 'Waiting' ||
        item.status == 'Speaking' ||
        item.status == 'Completed'
          ? true
          : false
    },
    {
      label: 'Speaking',
      value: 'Speaking',
      disabled:
        item.status == 'Speaking' || item.status == 'Completed' ? true : false
    },
    {
      label: 'Completed',
      value: 'Completed',
      disabled: item.status == 'Completed' ? true : false
    }
  ]);

  console.log('value status', valueStatus);

  const getUser = useQuery(GET_USER_BY_ID, {
    variables: {
      userId: item.userId
    },
    onCompleted: (data) => {
      console.log('user details', data);
      setUserDetails(data.committeeMemberById);
    },
    onError: (data) => {
      console.log('get user by id error', data.message);
    }
  });

  console.log('item from user details', item);

  const [updateSpeaker] = useMutation(UPDATE_SPEAKER, {
    refetchQueries: [
      {
        query: GET_LIVE_MEETING_USERS,
        variables: {
          meetingId: meetingId,
          isSpeaker: true
        }
      }
    ],
    onCompleted: (data) => {
      console.log('update speaker', data);
      // if (data.updateSpeaker.status == '200') {
      //   navigation.goBack();
      // }
    },
    onError: (data) => console.log('update speaker error', data)
  });

  const renderItem = (items) => {
    console.log('render item', items);
    return (
      <TouchableOpacity
        style={[styles.item, { opacity: items.disabled ? 0.1 : 1 }]}
        disabled={items.disabled}
        onPress={() => {
          console.log('items.disabled', items.disabled);
          if (items.disabled) {
            setValueStatus(item.status);
          } else {
            setValueStatus(items.value);
            updateSpeaker({
              variables: {
                userDetail: {
                  userId: item.userId,
                  meetingId: meetingId,
                  duration: item.duration,
                  status: items.value
                }
              }
            });
          }
        }}
      >
        <Text style={styles.textItem}>{items.label}</Text>
      </TouchableOpacity>
    );
  };

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
              console.log('new changed value ', isRequired);

              onChangeUser(value, isRequired);
            }}
          />
        ) : isDropDown ? (
          <View
            style={{
              flex: 1,
              paddingLeft: SIZES[4],
              backgroundColor:
                valueStatus == 'Waiting'
                  ? 'rgba(230, 197, 79, 0.1)'
                  : valueStatus == 'Speaking'
                  ? 'rgba(129, 171, 150, 0.1)'
                  : valueStatus == 'Completed'
                  ? 'rgba(101, 142, 180, 0.1)'
                  : Colors.white,
              borderRadius: SIZES[4],
              paddingBottom: SIZES[6],
              borderBottomWidth: SIZES[1],
              borderBottomColor:
                valueStatus == 'Waiting'
                  ? 'rgba(230, 197, 79, 1)'
                  : valueStatus == 'Speaking'
                  ? 'rgba(129, 171, 150, 1)'
                  : valueStatus == 'Completed'
                  ? 'rgba(101, 142, 180, 1)'
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
              placeholder={item.status}
              disable={
                item.roleName == 'Head' || item.roleName == 'Secretary'
                  ? false
                  : true
              }
              data={statusItems}
              valueField="value"
              labelField="label"
              value={item.status}
              iconColor={
                valueStatus == 'Waiting'
                  ? 'rgba(230, 197, 79, 1)'
                  : valueStatus == 'Speaking'
                  ? 'rgba(129, 171, 150, 1)'
                  : valueStatus == 'Completed'
                  ? 'rgba(101, 142, 180, 1)'
                  : Colors.bold
              }
              onChange={(items) => {
                console.log('on change', items);
              }}
              selectedTextStyle={{
                color:
                  valueStatus == 'Waiting'
                    ? 'rgba(230, 197, 79, 1)'
                    : valueStatus == 'Speaking'
                    ? 'rgba(129, 171, 150, 1)'
                    : valueStatus == 'Completed'
                    ? 'rgba(101, 142, 180, 1)'
                    : Colors.bold
              }}
              renderItem={(item) => renderItem(item)}
              // visibleSelectedItem={false}
            />
            {/* <DropDownPicker
              zIndex={9999}
              items={statusItems}
              value={valueStatus}
              setValue={setValueStatus}
              open={open}
              setOpen={setOpen}
              style={{ borderWidth: 0, paddingLeft: 0 }}
              placeholder={''}
              disabledItemLabelStyle={{ color: Colors.line }}
            /> */}
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
    <Pressable
      // activeOpacity={0.8}

      onPress={() => {
        setVisibleIndex(-1);
        if (isCheckboxView) {
          onChecked(item);
          console.log('pressed');
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
                      ? item?.roles !== null &&
                        item?.roles != undefined &&
                        item?.roles[item?.organizationIds?.indexOf(committee)]
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
    </Pressable>
  );
};

export default UserDetailsCard;
