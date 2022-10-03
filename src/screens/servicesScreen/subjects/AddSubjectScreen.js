import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import { IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import FilesCard from '../../../component/Cards/FilesCard';
import { Button } from '../../../component/button/Button';
import Header from '../../../component/header/Header';
import { SIZES } from '../../../themes/Sizes';

const AddSubjectScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [discription, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);

  const [fileResponse, setFileResponse] = useState([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles]
      });
      setFileResponse(response);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <ScrollView style={styles.subContainer}>
          <Text style={styles.txtAddSubjectTitle}>Add subject</Text>
          {/* title */}
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput style={styles.textInput} />
          </View>
          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>DISCRIPTION</Text>
            <TextInput style={styles.textInput} multiline={true} />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.txtTitle}>SUBJECT CATEGORY</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={'Subject Category'}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                borderWidth: 0,

                zIndex: 999
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            <FilesCard
              filePath={'videoQuestion...mov'}
              fileSize={'837 KB'}
              onDownloadPress={() => navigation.navigate('SubjectDownload')}
            />
            <FilesCard
              filePath={'archi...zip'}
              fileSize={'837 KB'}
              onDownloadPress={() => navigation.navigate('SubjectDownload')}
            />
            <Button
              title={'Attach file'}
              layoutStyle={{ backgroundColor: 'rgba(243, 246, 249,1)' }}
              textStyle={{
                ...Fonts.PoppinsSemiBold[14],
                color: Colors.primary
              }}
              onPress={() => handleDocumentSelection()}
            />
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'flex-end'
          }}
        >
          {/* Divider */}
          <Divider style={styles.divider} />
          <View style={styles.buttonContainer}>
            <Button
              title={'Cancel'}
              onPress={() => navigation.goBack()}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Save'}
              // onPress={() => navigation.navigate("Step2")}
              disable={title === '' || discription === '' ? true : false}
              layoutStyle={[
                {
                  opacity: title === '' || discription === '' ? 0.5 : null
                },
                styles.nextBtnLayout
              ]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddSubjectScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingHorizontal: SIZES[16],
    paddingTop: SIZES[24],
    backgroundColor: Colors.white
  },
  txtAddSubjectTitle: { ...Fonts.PoppinsBold[24], color: Colors.bold },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  titleContainer: {
    marginTop: SIZES[16],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },

  discriptionContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  textInput: {
    paddingVertical: SIZES[10],
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  categoryContainer: {
    marginTop: SIZES[24],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line,
    zIndex: 20
  },
  txtAttachFile: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary,
    marginBottom: SIZES[22]
  }
});
