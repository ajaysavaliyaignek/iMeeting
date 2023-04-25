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
  horizontal,
  isDeadlineSuggetion
}) => {
  return (
    <View style={[styles.container,{flex:isDeadlineSuggetion?1:null}]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.dateText}>
            {moment(headerData).format('MMM, YYYY')}
          </Text>
          <TouchableOpacity style={{ marginLeft: SIZES[8] }}>
            <Icon
              name={IconName.Arrow_Right_Black}
              width={SIZES[10]}
              height={SIZES[18]}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={[
              styles.iconContainer,
              styles.leftIcon,
              { marginRight: SIZES[32] }
            ]}
            onPress={onPressArrowLeft}
          >
            <Icon
              name={IconName.Arrow_Right}
              width={SIZES[10]}
              height={SIZES[18]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onPressArrowRight}
          >
            <Icon
              name={IconName.Arrow_Right}
              width={SIZES[10]}
              height={SIZES[18]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CalendarHeader;
