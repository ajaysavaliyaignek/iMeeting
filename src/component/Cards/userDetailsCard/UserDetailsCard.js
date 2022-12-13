import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable
} from 'react-native';
import React, { useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import Avatar from '../../Avatar/Avatar';
import EditDeleteModal from '../../EditDeleteModal';
import { styles } from './styles';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../../graphql/query';
import CheckBox from '../../checkBox/CheckBox';
import { getHighlightedText } from '../../highlitedText/HighlitedText';

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

  onPressDelete,
  visibleIndex,
  setVisibleIndex,
  isDeletable
}) => {
  const [editModal, setEditModal] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

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

  // committee row view
  const RowData = ({
    name,
    discription,
    switchView,
    style,
    styleText,
    switchValue,
    descriptionContainer,
    value
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
        setEditModal(false);
        // onChecked(item);
        // checkToggle(item.userId);
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
            searchText
          )}
          {/* <Text
            style={{
              marginLeft: SIZES[12],
              ...Fonts.PoppinsBold[20],
              color: Colors.bold,
              width: '80%'
            }}
            numberOfLines={1}
          >
            {item.userName == undefined
              ? item.firstName + ' ' + item.familyName
              : item.userName}
          </Text> */}
          {/* <Text style={styles.txtCommitteeTitle}>
            {item.firstName} {item.secondName}
          </Text> */}
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
                  name={'Duration'}
                  discription={'5 min'}
                  descriptionContainer={{
                    borderBottomWidth: 1,
                    paddingBottom: 6,
                    borderBottomColor: Colors.line,
                    marginTop: 6
                  }}
                />
                <RowData name={'Status'} discription={'Completed'} />
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
            onPressDelete={() => onPressDelete(item)}
            download={false}
            deleted={isDeletable}
          />
        </View>
      )}
      <Divider style={styles.divider} />
    </Pressable>
  );
};

export default UserDetailsCard;
