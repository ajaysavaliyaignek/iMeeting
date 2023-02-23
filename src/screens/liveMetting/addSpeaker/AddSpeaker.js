import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

// import DropDownPicker from '../../../component/DropDownPicker/DropDownPicker';
import { GET_LIVE_MEETING_USERS } from '../../../graphql/query';
import Header from '../../../component/header/Header';
import { IconName } from '../../../component';
import { styles } from './styles';
import { Button } from '../../../component/button/Button';
import { Colors } from '../../../themes/Colors';
import { UPDATE_SPEAKER } from '../../../graphql/mutation';
import Avatar from '../../../component/Avatar/Avatar';
import { SIZES } from '../../../themes/Sizes';
import { Fonts } from '../../../themes';

const AddSpeaker = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { meetingId, activeScreen, speaker } = route?.params;
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [valueUser, setValueUser] = useState(
    activeScreen == 'AddSpeaker' ? null : speaker?.userId
  );
  const [time, setTime] = useState(
    activeScreen == 'AddSpeaker' ? '' : speaker?.duration
  );

  // get live meeting users
  const getMeetingUser = useQuery(GET_LIVE_MEETING_USERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: meetingId,
      isSpeaker: false
    },
    onCompleted: (data) => {
      console.log(
        'is live meeting users data',
        data.liveMeetingUsers.userDetails
      );
      setUsers(data.liveMeetingUsers.userDetails);
    },
    onError: (data) => {
      console.log('GET_LIVE_MEETING_USERS error', data.message);
    }
  });

  const [updateSpeaker] = useMutation(UPDATE_SPEAKER, {
    refetchQueries: [
      {
        query: GET_LIVE_MEETING_USERS,
        variables: {
          meetingId: meetingId,
          isSpeaker: true
        }
      }
    ],
    onCompleted: (data) => {
      console.log('update speaker', data);
      if (data.updateSpeaker.status == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => console.log('update speaker error', data)
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={activeScreen == 'AddSpeaker' ? 'Add speaker' : 'Speaker'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      {activeScreen == 'AddSpeaker' ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.subContainer}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setOpen(false);
            }}
          >
            <Text style={styles.txtTitle}>SELECT USER</Text>
            <DropDownPicker
              disabled={activeScreen == 'AddSpeaker' ? false : true}
              items={users?.map((item) => ({
                label: item.userName,
                value: item.userId
                // disabled: activeScreen == 'AddSpeaker' ? item.isSpeaker : false
              }))}
              value={valueUser}
              setValue={setValueUser}
              open={open}
              setOpen={setOpen}
              style={{ borderWidth: 0, paddingLeft: 0 }}
              placeholder={''}
              disabledItemLabelStyle={{ color: Colors.line }}
            />
            <Divider style={styles.divider} />

            <View style={styles.timeContainer}>
              <Text style={styles.txtTitle}>TIME - IN - MINUTES</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setTime(text);
                }}
                value={time.toString()}
              />
              <Divider style={styles.divider} />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
            paddingHorizontal: SIZES[16],
            paddingTop: SIZES[24]
          }}
        >
          <Avatar
            name={speaker?.userName}
            source={speaker?.profilePicture}
            size={SIZES[80]}
          />
          <Text style={styles.txtUsername}>{speaker?.userName}</Text>
          <Text style={styles.txtRole}>{speaker?.roleName}</Text>

          <Text style={[styles.txtUsername, { marginTop: SIZES[80] }]}>
            Time
          </Text>
          <Text style={styles.txtRunningTime}>
            {`${speaker?.speakingDuration} min`} /{'   '}
            <Text style={styles.txtTimeDuration}>{`${time}:00 min`}</Text>
          </Text>
          <Divider
            style={[
              styles.divider,
              { marginTop: SIZES[8], width: '80%', alignSelf: 'center' }
            ]}
          />
          {speaker?.status !== 'Completed' && (
            <Button
              disable={speaker?.status == 'Completed' ? true : false}
              title={'+5 min'}
              layoutStyle={{
                marginTop: 10,
                backgroundColor: '#F3F6F9',
                marginVertical: SIZES[34]
              }}
              textStyle={{
                ...Fonts.PoppinsSemiBold[14],
                color: Colors.primary
              }}
              onPress={() => setTime(time + 5)}
            />
          )}
        </View>
      )}
      {activeScreen == 'AddSpeaker' ? (
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
              onPress={() => {
                navigation.goBack();
              }}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Add speaker'}
              onPress={() => {
                updateSpeaker({
                  variables: {
                    userDetail: {
                      userId: valueUser,
                      meetingId: meetingId,
                      duration: time,
                      status: 'Waiting'
                    }
                  }
                });
              }}
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
      ) : (
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
              title={speaker?.status}
              onPress={() => {
                updateSpeaker({
                  variables: {
                    userDetail: {
                      userId: valueUser,
                      meetingId: meetingId,
                      duration: time,
                      status: speaker?.status
                    }
                  }
                });
              }}
              layoutStyle={[
                // {
                //     opacity: title === "" || discription === "" ? 0.5 : null,
                // },
                styles.nextBtnLayout,
                { width: '100%' }
              ]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddSpeaker;
