import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { Fonts } from '../../../../themes';

const MeetingDetails = () => {
  const navigation = useNavigation();
  const [fileResponse, setFileResponse] = useState([
    { name: 'kbujgug', size: 11111, type: 'jpeg' },
    { name: 'kbujgug', size: 11111, type: 'jpeg' },
    { name: 'kbujgug', size: 11111, type: 'jpeg' }
  ]);

  const details = (title, discription) => {
    return (
      <View style={{ marginTop: SIZES[24] }}>
        <Text style={styles.txtDetailTitle}>{title}</Text>
        <Text style={styles.txtDetailDiscription}>{discription}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Meeting details'}
        rightIconName={IconName.Search}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.subContainer}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>General</Text>
          {details('Committee', 'Meeting for main design page')}
          {details('Your role', 'Head')}
          {details('Title', 'Meeting for main design page')}
          {details(
            'Discription',
            'We need to discuss what should be the main page and we have more question'
          )}
          {details('Creator', 'Esther Howard')}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details('Start date', '17 Feb,2022, 08:00 PM')}
            <View>
              <Text style={styles.txtDuration}>(Duration 2 hours)</Text>
            </View>
          </View>
          {details('Timezone', 'GMT-8 (USA)')}
          {details('Repeat', `Doesn't repeat`)}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Location</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {details('Location Title', 'Office 2')}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary
              }}
            >
              <Text style={styles.txtLink}>meet.goo/fjdf-fsgl-fds</Text>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {details('Vi-nce platform', 'Google Meet')}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={styles.txtLink}>meet.goo/fjdf-fsgl-fds</Text>
              <TouchableOpacity style={{ marginTop: 32, marginLeft: 14 }}>
                <Icon
                  name={IconName.CopyText}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: SIZES[24], marginBottom: SIZES[24] }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            {fileResponse?.map((file, index) => {
              console.log('from retuen', file);
              return (
                <FilesCard
                  key={index}
                  download={true}
                  filePath={file.name}
                  fileSize={file.size}
                  onDownloadPress={() => navigation.navigate('SubjectDownload')}
                  fileType={file.type}
                  style={{
                    borderBottomWidth: SIZES[1],
                    borderBottomColor: Colors.Approved
                  }}
                />
              );
            })}
          </View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.committeeView}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Users')}
          >
            <Text style={styles.txtCommittee}>Users</Text>
            <View style={styles.btnCommittees}>
              <Text style={styles.txtBtnCommittees}>24</Text>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.committeeView}
            activeOpacity={0.5}
            // onPress={() => navigation.navigate('SelectUsers')}
          >
            <Text style={styles.txtCommittee}>Subjects</Text>
            <View style={styles.btnCommittees}>
              <Text style={styles.txtBtnCommittees}>32</Text>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Divider style={styles.divider} />
        <View style={styles.btnContainer}>
          <Button
            title={'Edit'}
            layoutStyle={[styles.btnLayout, { backgroundColor: '#F3F6F9' }]}
            textStyle={{ ...Fonts.PoppinsSemiBold[14], color: Colors.primary }}
          />
          <Button
            title={'Delete'}
            layoutStyle={[styles.btnLayout, { backgroundColor: '#DD7878' }]}
          />
          <Button title={'Start'} layoutStyle={[styles.btnLayout]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MeetingDetails;
