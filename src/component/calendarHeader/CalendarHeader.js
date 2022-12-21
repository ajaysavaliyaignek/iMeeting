import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';
import moment from 'moment';

const weekDaysNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarHeader = ({
  headerData,
  onPressArrowLeft,
  onPressArrowRight,
  horizontal
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {moment(headerData).format('DD MMM, YYYY')}
        </Text>
        <TouchableOpacity
          style={[styles.iconContainer, styles.leftIcon]}
          onPress={onPressArrowLeft}
        >
          <Icon
            name={IconName.Arrow_Right_Black}
            width={SIZES[10]}
            height={SIZES[18]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onPressArrowRight}
        >
          <Icon
            name={IconName.Arrow_Right_Black}
            width={SIZES[10]}
            height={SIZES[18]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CalendarHeader;
