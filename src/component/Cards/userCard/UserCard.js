import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
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
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { UserContext } from '../../../context';

const UserCard = ({
  item,
  index,
  text,
  isSwitchOnRow,
  required,
  setRequired
}) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  // const { required, setRequired } = useContext(UserContext);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    let newData = [];
    if (isSwitchOn) {
      newData = newData.push(isSwitchOn == '1' ? true : false);
      setRequired(newData);
    } else {
      newData = newData.pop(true);
      setRequired(newData);
    }
  }, [isSwitchOn]);

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

  // useEffect(() => {
  //   let newRequired;
  //   if (isSwitchOn) {
  //     newRequired = required.push(true);
  //   } else {
  //     newRequired = required.pop(true);
  //   }
  //   setRequired(newRequired);
  // }, [isSwitchOn]);

  // const getHighlightedText = (txt) => {
  //   const parts = txt.split(new RegExp(`(${text})`, 'gi'));
  //   return (
  //     <Text style={{ marginLeft: 12 }}>
  //       {parts.map((part) =>
  //         part === text ? (
  //           <Text
  //             style={[
  //               styles.txtCommitteeTitle,
  //               {
  //                 backgroundColor: '#E6C54F'
  //               }
  //             ]}
  //             numberOfLines={1}
  //           >
  //             {part}
  //           </Text>
  //         ) : (
  //           <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
  //             {part}
  //           </Text>
  //         )
  //       )}
  //     </Text>
  //   );
  // };

  const RowData = ({ name, discription, style, styleText, switchView }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {switchView && (
          <Switch
            color={Colors.switch}
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={style} />
          <Text style={[styles.discription, styleText]}>{discription}</Text>
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
      {index == 0 ? null : <Divider style={styles.divider} />}
      {/* committee details */}
      <View style={styles.committeeDetailView}>
        <View style={styles.userDetails}>
          <Avatar name={item.firstName} size={SIZES[32]} />
          {/* <Text
            style={styles.txtCommitteeTitle}
          >{`${item.firstName} ${item.secondName}`}</Text> */}
          <Text style={{ marginLeft: SIZES[12] }}>
            {getHighlightedText(`${item.firstName} ${item.secondName}`, text)}
          </Text>
        </View>

        <RowData name={'E-mail'} discription={item.emails} />
        <RowData name={'Role'} discription={item.roles} />
        <RowData
          name={'Available'}
          discription={item?.userDetails?.isAvailable || 'Unknown'}
          style={{
            height: SIZES[8],
            width: SIZES[8],
            backgroundColor: item?.userDetails?.isAvailable
              ? '#81AB96'
              : 'Unknown'
              ? '#E6C54F'
              : '#DD7878',
            borderRadius: SIZES[4],
            marginRight: SIZES[8]
          }}
        />
        <RowData
          name={'Answer'}
          discription={item.answer}
          styleText={{ ...Fonts.PoppinsSemiBold[14], color: Colors.secondary }}
        />
        <RowData
          name={'Required'}
          discription={item.required}
          switchView={isSwitchOnRow}
        />
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[4]} />
      </TouchableOpacity>
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal onPressDelete={onDeleteHandler} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UserCard;
