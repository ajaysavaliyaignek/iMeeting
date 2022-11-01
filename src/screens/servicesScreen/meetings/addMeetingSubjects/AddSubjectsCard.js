import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import { styles } from './styles';
import EditDeleteModal from '../../../../component/EditDeleteModal';
import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import { Icon, IconName } from '../../../../component';
import { Divider } from 'react-native-paper';

const AddSubjectsCard = ({ item, searchText, index }) => {
  const [editModal, setEditModal] = useState(false);
  const [valueStatus, setValueStatus] = useState('Created');
  const [openStatus, setOpenStatus] = useState(false);
  const [items, setItems] = useState([
    { label: 'Approved', value: 'Approved' },
    { label: 'Verified', value: 'Verified' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Deleted', value: 'Deleted' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Transfered', value: 'Transfered' }
  ]);

  const getHighlightedText = (txt) => {
    const parts = txt.split(new RegExp(`(${searchText})`, 'gi'));
    return (
      <Text>
        {parts.map((part) =>
          part === searchText ? (
            <Text
              style={[
                styles.txtCommitteeTitle,
                {
                  backgroundColor: '#E6C54F'
                }
              ]}
              numberOfLines={1}
            >
              {part}
            </Text>
          ) : (
            <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
              {part}
            </Text>
          )
        )}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      key={index}
      style={{ flex: 1 }}
      onPress={() => {
        setEditModal(false);
      }}
    >
      {/* committee details */}
      <View
        style={styles.committeeDetailView}
        onPress={() => {
          // navigation.navigate("SubjectDetails");
          setEditModal(false);
        }}
        activeOpacity={0.5}
      >
        {getHighlightedText(item.subjectTitle)}

        {/* subject details */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[12]
          }}
        >
          <Text style={styles.txtSubjectsTitle}>Category</Text>
          <Text style={styles.txtDiscription}>{item.subjectCategoryName}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[12]
          }}
        >
          <Text style={styles.txtSubjectsTitle}>Creator</Text>
          <Text style={styles.txtDiscription}>{item.createrName} </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[12],
            width: '90%',
            zIndex: 1
          }}
        >
          <Text style={styles.txtSubjectsTitle}>Status</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openStatus}
            value={valueStatus}
            items={items}
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            setOpen={() => {
              setOpenStatus(!openStatus);
            }}
            setValue={setValueStatus}
            setItems={setItems}
            placeholder={'Created'}
            placeholderStyle={styles.txtDiscription}
            style={{
              borderWidth: 0,
              paddingHorizontal: SIZES[24],

              backgroundColor:
                valueStatus === 'Approved'
                  ? Colors.BG_Approved
                  : valueStatus === 'Verified'
                  ? Colors.BG_Verified
                  : valueStatus === 'Rejected'
                  ? Colors.BG_Rejected
                  : valueStatus === 'Deleted'
                  ? Colors.BG_Rejected
                  : valueStatus === 'Pending'
                  ? Colors.BG_Pending
                  : Colors.BG_Transferred
            }}
            containerStyle={{
              width: '52%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            textStyle={[
              styles.txtDiscription,
              {
                color:
                  valueStatus === 'Approved'
                    ? Colors.Approved
                    : valueStatus === 'Verified'
                    ? Colors.Verified
                    : valueStatus === 'Rejected'
                    ? Colors.Rejected
                    : valueStatus === 'Deleted'
                    ? Colors.Rejected
                    : valueStatus === 'Pending'
                    ? Colors.Pending
                    : Colors.Transfered
              }
            ]}
          />
        </View>
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => navigation.navigate('SubjectDownload')}
            subjectStatus={item.subjectStatus}
            onPressDelete={() => {
              onDeleteHandler(item.subjectId);
              setEditModal(false);
            }}
            onPressEdit={() => {
              navigation.navigate('EditSubject', { item });
              setEditModal(false);
            }}
            onPressView={() => {
              navigation.navigate('SubjectDetails', { item });
              setEditModal(false);
            }}
          />
        </View>
      )}

      <Divider style={styles.divider} />
    </TouchableOpacity>
  );
};

export default AddSubjectsCard;
