import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { IconName } from '../../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useQuery } from '@apollo/client';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import FilesCard from '../../../component/Cards/FilesCard';
import { Button } from '../../../component/button/Button';
import Header from '../../../component/header/Header';
import { SIZES } from '../../../themes/Sizes';
import { GET_All_SUBJECTS_CATEGORY } from '../../../graphql/query';
import Loader from '../../../component/Loader/Loader';

const EditSubjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const { loading, error, data } = useQuery(GET_All_SUBJECTS_CATEGORY);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState(item.subjectTitle);
  const [discription, setDescription] = useState(item.description);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  if (data) {
    console.log('categories', data);
  }
  const [items, setItems] = useState([{ label: 'test1', value: 'test1' }]);

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

  if (error) {
    console.log('error---', error);
  }

  if (loading) {
    <Loader />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.subContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <Text style={styles.txtEditSubject}>Edit subject</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </View>
          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>DISCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              value={item.description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
          <View
            style={{
              marginTop: SIZES[24],
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              zIndex: 20
            }}
          >
            <Text style={styles.txtTitle}>SUBJECT CATEGORY</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              // placeholder={data?.subjectCategories.items.categoryTitle}
              placeholderStyle={styles.txtTitles}
              style={{
                borderWidth: 0,

                zIndex: 999
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
          </View>
          <View style={{ marginTop: SIZES[24] }}>
            <Text
              style={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary,
                marginBottom: SIZES[22]
              }}
            >
              ATTACH FILE
            </Text>
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

export default EditSubjectScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subContainer: {
    paddingHorizontal: SIZES[16],
    paddingTop: SIZES[24],
    backgroundColor: Colors.white
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
  txtEditSubject: {
    ...Fonts.PoppinsBold[24],
    color: Colors.bold,
    marginBottom: SIZES[16]
  },
  titleContainer: {
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
  }
});
