import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  TextInput
} from 'react-native';
import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

import DropDownPicker from '../../../component/DropDownPicker/DropDownPicker';
import { styles } from './styles';
import { Icon, IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

const AddGeneralVideoConference = ({ generaldData, setGeneralData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.txtAddSubjectTitle}>General</Text>
      {/* dropdown video conference */}
      <DropDownPicker
        data={[
          {
            value: 1,
            label: 'Google Meet'
          },
          {
            value: 2,
            label: 'Microsoft Teams'
          }
        ]}
        disable={false}
        placeholder={''}
        setData={(item) =>
          setGeneralData({ ...generaldData, valueVideoConference: item })
        }
        title={'VIDEO CONFERENCING PLATFORM'}
        value={generaldData?.valueVideoConference}
      />

      {/* platformlink */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES[16]
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.gray,
            padding: SIZES[14],
            borderTopLeftRadius: SIZES[8],
            borderBottomLeftRadius: SIZES[8]
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.primary
            }}
          >
            <Text style={styles.txtLink}>meet.goo/fjdf-fsgl-fds</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#E7EDF4',
            padding: SIZES[14],
            borderTopRightRadius: SIZES[8],
            borderBottomRightRadius: SIZES[8]
          }}
          onPress={() => {
            Clipboard.setString('meet.goo/fjdf-fsgl-fds');
            // if (
            //   location?.googleMapURL !== '' ||
            //   location?.googleMapURL !== null
            // ) {
            if (Platform.OS == 'android') {
              ToastAndroid.show(
                `Copied Text :-  ${'meet.goo/fjdf-fsgl-fds'}`,
                ToastAndroid.SHORT
              );
            } else {
              Alert.alert(`Copied Text :-  ${'meet.goo/fjdf-fsgl-fds'}`);
            }
            // }
          }}
        >
          <Icon name={IconName.CopyText} height={SIZES[20]} width={SIZES[20]} />
        </TouchableOpacity>
      </View>

      {/* title */}
      <View style={styles.discriptionContainer}>
        <Text style={styles.txtTitle}>TITLE</Text>
        <TextInput
          value={generaldData?.title}
          style={styles.textInput}
          onChangeText={(text) => {
            setGeneralData((prev) => {
              return { ...prev, title: text };
            });
            // setTitle(text);
          }}
        />
      </View>

      {/* description */}
      <View style={styles.categoryContainer}>
        <Text style={styles.txtTitle}>DESCRIPTION</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          onChangeText={(text) => {
            setGeneralData((prev) => {
              return { ...prev, discription: text };
            });
          }}
          value={generaldData?.discription}
        />
      </View>
    </View>
  );
};

export default AddGeneralVideoConference;
