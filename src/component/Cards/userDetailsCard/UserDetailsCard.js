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

const UserDetailsCard = ({
  item,
  index,
  external,
  searchText,
  committee,
  openPopup = true,
  onChecked
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

  const onDeleteHandler = () => {
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        // onPress: () => console.log('delete Pressed'),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  // committee row view
  const RowData = ({ name, discription, switchView }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {switchView ? (
          <Switch
            color={Colors.switch}
            value={item.privateDetails}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          />
        ) : (
          <Text style={styles.discription} numberOfLines={1}>
            {discription}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Pressable
      // activeOpacity={0.8}

      onPress={() => {
        console.log('user pressed');
        setEditModal(false);
        // onChecked(item);
        // checkToggle(item.userId);
      }}
    >
      {/* committee details */}
      <View style={styles.committeeDetailView} activeOpacity={0.5}>
        <View style={styles.userDetails}>
          <Avatar name={item.userName} size={SIZES[32]} />
          <Text
            style={{
              marginLeft: SIZES[12],
              ...Fonts.PoppinsBold[20],
              color: Colors.bold
            }}
          >
            {item.userName}
          </Text>
          {/* <Text style={styles.txtCommitteeTitle}>
            {item.firstName} {item.secondName}
          </Text> */}
        </View>
        <View style={styles.userDetailsContainer}>
          <View>
            <RowData name={'ID'} discription={item.userId} />
            <RowData name={'E-mail'} discription={item.email} />
            <RowData name={'Number'} discription={userDetails?.phoneNumber} />
            <RowData name={'Role'} discription={item.roleName} />
          </View>
        </View>
      </View>

      {/* dotsView */}
      {openPopup && (
        <TouchableOpacity
          onPress={() => setEditModal(!editModal)}
          style={styles.dotsView}
        >
          <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[4]} />
        </TouchableOpacity>
      )}
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal onPressDelete={onDeleteHandler} download={false} />
        </View>
      )}
      <Divider style={styles.divider} />
    </Pressable>
  );
};

export default UserDetailsCard;
