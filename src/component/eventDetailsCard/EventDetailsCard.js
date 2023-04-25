import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { SIZES } from '../../themes/Sizes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import moment from 'moment';
import { Colors } from '../../themes/Colors';

const EventDetailsCard = ({ item, index }) => {
  const dummyImageUrls = [
    'https://picsum.photos/200/300?grayscale',
    'https://picsum.photos/seed/picsum/200/300',
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/200/300'
  ];
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.container,
        { backgroundColor: item?.lightColor, borderLeftColor: item?.darkColor }
      ]}
    >
      <Text style={styles.txtEventTitle}>{item?.title}</Text>
      <View style={styles.timeLocationContainer}>
        <Text style={styles.txtTimeLocation}>
          {`${moment(item?.startTime, 'YYYY-MM-DD HH:mm A').format(
            'HH:mm'
          )} - ${moment(item?.endTime, 'YYYY-MM-DD HH:mm A').format('HH:mm')}`}
        </Text>
        <View style={styles.dotView} />
        <Text style={styles.txtTimeLocation}>{item?.location}</Text>
      </View>
      <View style={styles.usersContainer}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: item.total_users > 4 ? null : SIZES[36]
          }}
        >
          {item?.user_images?.length > 0 &&
            item?.user_images?.map((item, index) => {
              // const data = users.find((i) => i.user_id === item);

              return (
                <View
                  key={index}
                  style={[
                    styles.userImageView,
                    {
                      marginLeft: parseInt(index) * 20,

                      zIndex: index
                    }
                  ]}
                >
                  <Image
                    source={{ uri: item }}
                    resizeMode="cover"
                    style={{
                      width: SIZES[34],
                      height: SIZES[34],
                      borderRadius: SIZES[100]
                    }}
                  />
                </View>
              );
            })}

          {item?.total_users > 4 && (
            <View
              activeOpacity={0.5}
              style={{
                borderRadius: SIZES[100],
                borderStyle: 'solid',
                borderColor: Colors.white,
                borderWidth: 1,
                width: SIZES[34],
                height: SIZES[34],
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: item.total_users * 16,
                zIndex: item.total_users + 1,
                backgroundColor: item?.darkColor
              }}
            >
              <Text>+{item?.total_users - 5}</Text>
            </View>
          )}
        </View>
        <View style={styles.userCountContainer}>
          <Icon name={item?.tickIcon} height={SIZES[8]} width={SIZES[12]} />
          <Text style={styles.txtAttendance}>
            {item?.attendance_count} /{' '}
            <Text style={styles.txtTotalCount}>{item?.total_users}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventDetailsCard;
