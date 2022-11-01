import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import CheckBox from '../../checkBox/CheckBox';

const SelectSubjectCard = ({ item, index }) => {
  const [editModal, setEditModal] = useState(false);
  const [selectUser, setSelectUser] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const RowData = ({ name, discription }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <Text style={styles.discription}>{discription}</Text>
      </View>
    );
  };
  return (
    <TouchableOpacity
      key={index}
      activeOpacity={1}
      onPress={() => setEditModal(false)}
    >
      {/* committee details */}
      <Text style={styles.txtCommitteeTitle}>{item.subjectTitle}</Text>
      <View style={styles.userDetailsContainer}>
        <View>
          <RowData name={'ID'} discription={item.subjectId} />
          <RowData name={'Category'} discription={item.subjectCategoryName} />
          <RowData name={'Creator'} discription={item.createrName} />
        </View>
        <CheckBox value={true} />
      </View>
      <Divider style={styles.divider} />

      {/* dotsView */}
      <TouchableOpacity
        // onPress={() => setEditModal(!editModal)}
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

export default SelectSubjectCard;
