import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';
import React, { useState, useCallback } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
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

const AddMeetingGeneralScreen = () => {
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
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.2}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 1/5</Text>
        </View>
        <Text style={styles.txtAddSubjectTitle}>General</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* title */}
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>CHOOSE COMMITTEE</Text>
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
            {/* <TextInput style={styles.textInput} /> */}
          </View>
          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput style={styles.textInput} />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.txtTitle}>DISCRIPTION</Text>
            <TextInput style={styles.textInput} multiline={true} />
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            <FilesCard
              filePath={'videoQuestion...mov'}
              fileSize={'837 KB'}
              onDownloadPress={() => navigation.navigate('SubjectDownload')}
              style={{
                borderBottomColor: Colors.switch,
                borderBottomWidth: SIZES[2]
              }}
            />
            <FilesCard
              filePath={'archi...zip'}
              fileSize={'837 KB'}
              onDownloadPress={() => navigation.navigate('SubjectDownload')}
              style={{
                borderBottomColor: Colors.switch,
                borderBottomWidth: SIZES[2]
              }}
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
      </View>

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
            title={'Next'}
            onPress={() => navigation.navigate('AddMeetingUser')}
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMeetingGeneralScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingHorizontal: SIZES[16],
    paddingTop: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  txtAddSubjectTitle: { ...Fonts.PoppinsBold[24], color: Colors.bold },
  buttonContainer: {
    paddingHorizontal: SIZES[16]
  },

  nextBtnLayout: {
    marginVertical: SIZES[12]
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
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES[16]
  },
  txtProgress: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  }
});
