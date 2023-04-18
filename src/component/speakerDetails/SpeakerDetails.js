import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useApolloClient, useLazyQuery } from '@apollo/client';

import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';
import { Fonts } from '../../themes';
import Avatar from '../Avatar/Avatar';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import { GET_LIVE_MEETING_USERS } from '../../graphql/query';

const SpeakerDetails = ({ speakerData, item }) => {
  const [duration, setDuration] = useState('');
  const client = useApolloClient();

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setDuration(liveSpeaker[0]?.speakingDuration);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }, []);
  // console.log({ duration });
  let liveSpeaker = speakerData?.filter((speaker) => {
    if (speaker.status == 'Speaking') {
      return speaker;
    } else {
      return;
    }
  });

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       client.refetchQueries({
  //         include: ['liveMeetingUsers']
  //       });
  //     }, 1000);
  //     // setDuration(liveSpeaker[0]?.speakingDuration);
  //     return () => clearInterval(interval);
  //   }, []);

  return (
    <>
      {liveSpeaker.length > 0 && (
        <View style={styles.activeSpeakerContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '40%'
            }}
          >
            <Avatar name={liveSpeaker[0]?.userName} size={SIZES[32]} />
            <View style={styles.nameContainer}>
              <Text style={styles.txtName} numberOfLines={1}>
                {liveSpeaker[0]?.userName}
              </Text>
              <Text style={styles.txtSpeaker}>Speaker</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtRunningTime}>
              {liveSpeaker[0]?.speakingDuration} /{' '}
              <Text
                style={styles.txtTimeDuration}
              >{`${liveSpeaker[0]?.duration}:00`}</Text>
            </Text>
            <View style={styles.iconView}>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default SpeakerDetails;

const styles = StyleSheet.create({
  activeSpeakerContainer: {
    backgroundColor: Colors.gray,
    padding: SIZES[14],
    marginHorizontal: SIZES[16],
    flexDirection: 'row',
    marginBottom: SIZES[8],
    borderRadius: SIZES[12],
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameContainer: {
    marginLeft: SIZES[8],
    marginTop: SIZES[10]
  },
  txtName: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold
  },
  txtSpeaker: {
    ...Fonts.PoppinsRegular[12],
    color: Colors.secondary
  },
  iconView: {
    marginLeft: SIZES[21],
    justifyContent: 'flex-end'
  },
  txtRunningTime: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.bold
  },
  txtTimeDuration: {
    ...Fonts.PoppinsSemiBold[20],
    color: Colors.secondary
  }
});
