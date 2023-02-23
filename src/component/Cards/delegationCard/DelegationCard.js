import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
import moment from 'moment';

import { styles } from './styles';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import EditDeleteModal from '../../EditDeleteModal';
import { getHighlightedText } from '../../highlitedText/HighlitedText';

const DelegationCard = ({
  item,
  index,
  visibleIndex,
  setVisibleIndex,
  searchText,
  onPressEdit,
  onPressView,
  onPressDelete
}) => {
  const RowData = ({
    name,
    discription,
    backgroundColor,
    style,
    marginLeft
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View
          style={[
            styles.discriptionView,
            { backgroundColor: backgroundColor, marginLeft: marginLeft }
          ]}
        >
          <Text style={[styles.discription, style]}>{discription}</Text>
        </View>
      </View>
    );
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
      //   key={item.appointmentId}
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

        <RowData
          name={'Start date'}
          discription={`${moment(item.startDate).format('DD MMM YYYY')},${
            item.startDate
          }`}
        />
        <RowData name={'Executor'} discription={item.executor} />
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
            editable={true}
            deleted={true}
            isViewable={true}
            onPressView={onPressView}
            onPressEdit={onPressEdit}
            onPressDelete={onPressDelete}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DelegationCard;
