import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { SIZES } from '../../themes/Sizes';

const EditDeleteModal = ({
  onPressView,
  onPressEdit,
  onPressDelete,
  subjectStatus,
  onPressDownload,
  download,
  editable,
  deleted,
  isViewable,
  onPressPublish,
  isPublish
}) => {
  return (
    <View style={styles.container}>
      {isViewable && (
        <TouchableOpacity
          style={styles.btnView}
          onPress={onPressView}
          activeOpacity={0.6}
        >
          <Text style={styles.txtEditBtn}>View</Text>
          <Icon
            name={IconName.Eye_Primary}
            height={SIZES[20]}
            width={SIZES[18]}
          />
        </TouchableOpacity>
      )}
      {editable && subjectStatus !== 'Deleted' && (
        <View>
          {isViewable && <Divider style={styles.divider} />}
          <TouchableOpacity
            style={styles.btnView}
            onPress={onPressEdit}
            activeOpacity={0.6}
          >
            <Text style={styles.txtEditBtn}>Edit</Text>
            <Icon name={IconName.Edit} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
        </View>
      )}
      {download && (
        <View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.btnView}
            onPress={onPressDownload}
            activeOpacity={0.6}
          >
            <Text style={styles.txtEditBtn}>Download</Text>
            <Icon
              name={IconName.Download_Primary}
              height={SIZES[18]}
              width={SIZES[16]}
            />
          </TouchableOpacity>
        </View>
      )}
      {subjectStatus !== 'Deleted' && deleted && (
        <View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.btnView}
            onPress={onPressDelete}
            activeOpacity={0.6}
          >
            <Text style={styles.txtDeleteBtn}>Delete</Text>
            <Icon name={IconName.Delete} height={SIZES[20]} width={SIZES[18]} />
          </TouchableOpacity>
        </View>
      )}
      {subjectStatus !== 'Deleted' && isPublish && (
        <View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.btnView}
            onPress={onPressPublish}
            activeOpacity={0.6}
          >
            <Text style={styles.txtEditBtn}>Publish</Text>
            
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EditDeleteModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray,
    borderRadius: SIZES[6],
    width: SIZES[130]
  },
  btnView: {
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtEditBtn: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.primary
  },
  txtDeleteBtn: {
    ...Fonts.PoppinsRegular[14],
    color: '#DD7878'
  },
  divider: { width: '100%', height: SIZES[1], backgroundColor: Colors.line }
});
