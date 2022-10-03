import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Divider, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

import FilesCard from '../../../component/Cards/FilesCard';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import { Button } from '../../../component/button/Button';
import CommentCard from '../../../component/Cards/commentCard/CommentCard';
import { Icon, IconName } from '../../../component';
import Header from '../../../component/header/Header';
import { SIZES } from '../../../themes/Sizes';

const SubjectDetails = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{ label: 'Date', value: 'date' }]);
  const [openReply, setOpenReply] = useState(false);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? -350 : -600;

  const onDeleteHandler = () => {
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () => console.log('delete Pressed'),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const generalDetails = (title, discription) => {
    return (
      <View style={styles.subView}>
        <Text style={styles.txtSubDetails}>{title}</Text>
        <Text style={styles.txtSubDiscription}>{discription}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Subject details'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <Text style={styles.txtTitle}>General</Text>
          {generalDetails('Title', 'Meeting for new design page')}
          {generalDetails(
            'Discription',
            'We need to discuss what should be the main page and wehave more question'
          )}
          {generalDetails('Subject category', 'Design')}
          {generalDetails(
            'Committeee ',
            'Advisory committee on Financial management'
          )}
          {generalDetails('Creator', 'Financial Management')}
          {generalDetails('Date of creation', 'May 6,2021')}

          {/* attach file */}
          <Text style={styles.txtAttachedTitle}>ATTACHED FILES</Text>
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

          {/* comments     */}
          <Text style={styles.txtcommentsTitle}>Comments</Text>
          <View style={styles.commentsContainer}>
            <Text
              style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}
            >
              Sort by
            </Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder={'Date'}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                borderWidth: 0,
                width: SIZES[90],
                height: SIZES[30],
                zIndex: 999
              }}
              containerStyle={{ width: SIZES[100], borderColor: Colors.line }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
          </View>
          <View style={{ marginTop: SIZES[24] }}>
            <CommentCard />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: SIZES[16]
              }}
            >
              <TouchableOpacity onPress={() => setOpenReply(!openReply)}>
                <Icon
                  name={openReply ? IconName.Arrow_Down : IconName.Arrow_Right}
                  height={SIZES[10]}
                  width={SIZES[10]}
                />
              </TouchableOpacity>
              <Text
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color: Colors.primary,
                  marginLeft: SIZES[8]
                }}
              >
                Show 2 replies
              </Text>
            </View>
          </View>

          {openReply && (
            <View style={{ marginLeft: SIZES[24], marginTop: SIZES[24] }}>
              <CommentCard />
              <Text
                style={{
                  ...Fonts.PoppinsRegular[14],
                  color: '#144B8D',
                  marginTop: SIZES[16]
                }}
              >
                Reply
              </Text>
            </View>
          )}
          <View
            style={{
              paddingVertical: SIZES[14],
              paddingHorizontal: SIZES[16],
              borderWidth: SIZES[1],
              borderColor: Colors.line,
              borderRadius: SIZES[8],
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: SIZES[32],
              marginBottom: SIZES[24]
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: SIZES[30],
                backgroundColor: Colors.white
              }}
              underlineColor={Colors.white}
              activeUnderlineColor={Colors.white}
              placeholder={'Your comment'}
            />
            <TouchableOpacity>
              <Icon name={IconName.Send} height={SIZES[22]} width={SIZES[20]} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
            title={'Edit'}
            onPress={() => navigation.navigate('EditSubject')}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Delete'}
            onPress={onDeleteHandler}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubjectDetails;

const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    backgroundColor: Colors.white,

    paddingHorizontal: SIZES[16]
  },
  txtTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginTop: SIZES[24]
  },

  subView: {
    marginTop: SIZES[24]
  },
  txtSubDetails: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtSubDiscription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginTop: SIZES[4]
  },
  txtAttachedTitle: {
    ...Fonts.PoppinsRegular[12],
    fontWeight: '500',
    color: Colors.secondary,
    marginTop: SIZES[40],
    marginBottom: SIZES[22]
  },
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
    backgroundColor: '#DD7878',
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
  txtcommentsTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginTop: SIZES[26]
  },
  commentsContainer: {
    flexDirection: 'row',
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16],
    borderWidth: SIZES[1],
    borderColor: Colors.line,
    borderRadius: SIZES[8],
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES[16],
    zIndex: 20
  }
});
