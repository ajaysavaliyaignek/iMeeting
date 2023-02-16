import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert
} from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';

import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import EditDeleteModal from '../../EditDeleteModal';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { useNavigation } from '@react-navigation/native';

const VideoConferenceCard = ({
  item,
  index,
  visibleIndex,
  setVisibleIndex,
  searchText
}) => {
  const navigation = useNavigation();

  const onDeleteHandler = (id) => {
    console.log(id);

    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteAppointment({
            variables: {
              id: id
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
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
    isLink
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View
          style={[
            styles.discriptionView,
            {
              backgroundColor: backgroundColor,
              marginLeft: marginLeft,
              flexDirection: isLink ? 'row' : null
            }
          ]}
        >
          <Text style={[styles.discription, style]}>{discription}</Text>
          {isLink && (
            <TouchableOpacity
              style={{ marginLeft: SIZES[12] }}
              onPress={() => {
                Clipboard.setString(discription);
                if (discription !== '' || discription !== null) {
                  if (Platform.OS == 'android') {
                    ToastAndroid.show(
                      `Copied Text :-  ${discription}`,
                      ToastAndroid.SHORT
                    );
                  } else {
                    Alert.alert(`Copied Text :-  ${discription}`);
                  }
                }
              }}
            >
              <Icon
                name={IconName.CopyText}
                height={SIZES[20]}
                width={SIZES[20]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
      key={item.appointmentId}
      // style={{ opacity: item.isDisable && 0.5 }}
    >
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View
        style={[
          styles.committeeDetailView,
          { opacity: item.isDisable ? 0.5 : 1 }
        ]}
        activeOpacity={0.5}
      >
        {getHighlightedText(
          item.title,
          searchText,
          (styleTitle = { width: '100%' })
        )}

        {/* subject details */}
        <RowData name={'Committee'} discription={item.committee} />
        <RowData name={'Your role'} discription={item.yourRoleName} />
        <RowData name={'Date & Time'} discription={item.dateAndTime} />
        <RowData name={'Platform'} discription={item.platform} />
        <RowData
          name={'Link'}
          discription={item.link}
          isLink={true}
          style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.primary }}
        />
      </View>

      {/* dotsView */}

      <TouchableOpacity
        onPress={() => setVisibleIndex(visibleIndex == -1 ? index : -1)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>

      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => navigation.navigate('SubjectDownload')}
            subjectStatus={item.isDisable && 'Deleted'}
            onPressDelete={() => {
              onDeleteHandler(item.appointmentId);
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Edit video conference',
                type: 'VideoConference',
                screensArray: [
                  'generalVideoConference',
                  'users',
                  'dateandtime'
                ],
                isEdit: true,
                details: item
              });
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('VideoConferenceDetails', {
                item: item
              });
              setVisibleIndex(-1);
            }}
            editable={
              item.yourRoleName == 'Member' || item.isDisable ? false : true
            }
            deleted={
              item.yourRoleName == 'Member' || item.isDisable ? false : true
            }
            isViewable={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default VideoConferenceCard;
