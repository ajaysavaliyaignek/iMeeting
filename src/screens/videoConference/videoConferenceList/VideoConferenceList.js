import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Icon, IconName } from '../../../component';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { GET_ALL_VIDEO_CONFERENCES } from '../../../graphql/query';
import VideoConferenceCard from '../../../component/Cards/videoConferenceCard/VideoConferenceCard';
import Loader from '../../../component/Loader/Loader';

const VideoConferenceList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [videoConferences, setVideoConferences] = useState([]);

  const getAllVideoConferences = useQuery(GET_ALL_VIDEO_CONFERENCES, {
    variables: {
      date: '',
      page: -1,
      pageSize: -1,
      searchValue: searchText,
      sort: ''
    },
    onCompleted: (data) => {
      setVideoConferences(data.videoConferences.items);
    },
    onError: (data) => {
      console.log('getAllVideoConferences error', data.message);
    }
  });

  return (
    <SafeAreaView style={styles.conatiner}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: SIZES[24],
            width: SIZES[24],
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon
            name={IconName.Arrow_Left}
            height={SIZES[14]}
            width={SIZES[14]}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Video conference</Text>
        <View style={styles.headeRightView}>
          <TouchableOpacity
            style={styles.searchIconView}
            onPress={() => setSearch(!search)}
          >
            <Icon name={IconName.Search} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Add video conference',
                type: 'VideoConference',
                screensArray: [
                  'generalVideoConference',
                  'users',
                  'dateandtime'
                ],
                isEdit: false,
                details: null
              });
            }}
          >
            <Icon name={IconName.Plus} height={SIZES[14]} width={SIZES[14]} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.subContainer}>
        {search ? (
          <View>
            <View style={styles.searchRowContainer}>
              <Icon
                name={IconName.Search}
                height={SIZES[12]}
                width={SIZES[12]}
              />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: SIZES[6],
                  height: Platform.OS == 'android' ? null : SIZES[36]
                }}
                onChangeText={(text) => {
                  setSearchText(text);
                }}
                value={searchText}
                placeholder={'Search video conference'}
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                }}
              >
                <Icon
                  name={IconName.Close}
                  height={SIZES[8]}
                  width={SIZES[8]}
                />
              </TouchableOpacity>
            </View>
            <Divider style={styles.divider} />
          </View>
        ) : (
          <View></View>
        )}
        {getAllVideoConferences.loading ? (
          <Loader />
        ) : videoConferences.length > 0 ? (
          <FlatList
            data={videoConferences}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <VideoConferenceCard
                  item={item}
                  index={index}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                  searchText={searchText}
                />
              );
            }}
          />
        ) : videoConferences.length == 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              No video conferences found.
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.Rejected }}>
              Something went wrong.....
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VideoConferenceList;
