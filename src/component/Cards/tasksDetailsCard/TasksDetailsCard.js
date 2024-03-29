import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { Divider } from 'react-native-paper';

import { getHighlightedText } from '../../highlitedText/HighlitedText';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import moment from 'moment';

const TasksDetailsCard = ({
  item,
  index,
  visibleIndex,
  setVisibleIndex,
  text,
  editable,
  onPressEdit,
  isDeleteable,
  onPressDelete,
  isSubjectTask,
  onPressView,
  download,
  onPressDownload
}) => {
  const RowData = ({ name, discription, style, styleText, layoutStyle }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>

        <View
          style={[{ flexDirection: 'row', alignItems: 'center' }, layoutStyle]}
        >
          <View style={style} />
          <Text style={[styles.discription, styleText]} numberOfLines={1}>
            {discription}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
      key={index}
    >
      {index == 0 ? null : <Divider style={styles.divider} />}
      {/* committee details */}
      {!isSubjectTask ? (
        <View style={styles.committeeDetailView}>
          {getHighlightedText(item.title, text)}

          <RowData
            name={'Type'}
            discription={item.taskType}
            style={{
              height: SIZES[8],
              width: SIZES[8],
              borderRadius: SIZES[4],
              backgroundColor:
                item.taskType == 'Subject approval'
                  ? '#C8ABCD'
                  : item.taskType == 'Minutes of Meeting approval'
                  ? '#E6C54F'
                  : item.taskType == 'Meeting task'
                  ? '#658EB4'
                  : item.taskType == 'Confirm approval'
                  ? '#DD7878'
                  : item.taskType == 'Video conference'
                  ? '#E79D73'
                  : item.taskType == 'User task'
                  ? '#81AB96'
                  : '#E6C54F',
              marginRight: SIZES[8]
            }}
          />
          <RowData
            name={'Executor'}
            discription={item.executorName}
            layoutStyle={{ width: '70%' }}
          />
          <RowData
            name={'Deadline'}
            discription={moment(item.deadlineDate).format('DD MMM YYYY')}
          />
          <RowData name={'Priority'} discription={item.priority} />
          <RowData
            name={'Status'}
            discription={item.taskStatus}
            layoutStyle={{
              backgroundColor:
                item.taskStatus == 'Open'
                  ? 'rgba(101, 142, 180,0.1)'
                  : item.taskStatus == 'In progress'
                  ? 'rgba(101, 142, 180,0.1)'
                  : item.taskStatus == 'Completed'
                  ? 'rgba(129, 171, 150,0.1)'
                  : item.taskStatus == 'Closed'
                  ? 'rgba(221, 120, 120,0.1)'
                  : item.taskStatus == 'Deleted'
                  ? 'rgba(221, 120, 120,0.1)'
                  : 'rgba(101, 142, 180,0.1)',
              paddingVertical: SIZES[6],
              paddingHorizontal: SIZES[40],
              borderRadius: SIZES[8]
            }}
            styleText={{
              color:
                item.taskStatus == 'Open'
                  ? '#658EB4'
                  : item.taskStatus == 'In progress'
                  ? '#658EB4'
                  : item.taskStatus == 'Completed'
                  ? '#81AB96'
                  : item.taskStatus == 'Closed'
                  ? '#DD7878'
                  : item.taskStatus == 'Deleted'
                  ? '#DD7878'
                  : '#658EB4'
            }}
          />
        </View>
      ) : (
        <View style={styles.committeeDetailView}>
          {getHighlightedText(item.title, text)}
          <RowData name={'Executor'} discription={item.executorName} />
          <RowData
            name={'Deadline'}
            discription={moment(item.deadlineDate).format('DD MMM YYYY')}
          />
          <RowData
            name={'Status'}
            discription={item.taskStatus}
            layoutStyle={{
              backgroundColor:
                item.taskStatus == 'Open'
                  ? 'rgba(101, 142, 180,0.1)'
                  : item.taskStatus == 'In progress'
                  ? 'rgba(101, 142, 180,0.1)'
                  : item.taskStatus == 'Completed'
                  ? 'rgba(129, 171, 150,0.1)'
                  : item.taskStatus == 'Closed'
                  ? 'rgba(221, 120, 120,0.1)'
                  : item.taskStatus == 'Deleted'
                  ? 'rgba(221, 120, 120,0.1)'
                  : 'rgba(101, 142, 180,0.1)',
              paddingVertical: SIZES[6],
              paddingHorizontal: SIZES[40],
              borderRadius: SIZES[8]
            }}
            styleText={{
              color:
                item.taskStatus == 'Open'
                  ? '#658EB4'
                  : item.taskStatus == 'In progress'
                  ? '#658EB4'
                  : item.taskStatus == 'Completed'
                  ? '#81AB96'
                  : item.taskStatus == 'Closed'
                  ? '#DD7878'
                  : item.taskStatus == 'Deleted'
                  ? '#DD7878'
                  : '#658EB4'
            }}
          />
        </View>
      )}

      {/* dotsView */}

      <TouchableOpacity
        onPress={() => setVisibleIndex(visibleIndex == -1 ? index : -1)}
        style={styles.dotsView}
        activeOpacity={0.6}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
      </TouchableOpacity>

      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            download={download}
            onPressDownload={onPressDownload}
            onPressDelete={() => {
              onPressDelete(item);
              setVisibleIndex(-1);
            }}
            onPressView={onPressView}
            subjectStatus={'NoDeleted'}
            deleted={isDeleteable}
            editable={editable}
            isViewable={true}
            onPressEdit={() => onPressEdit(item)}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TasksDetailsCard;
