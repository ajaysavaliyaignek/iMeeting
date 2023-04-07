import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import { Icon, IconName } from '../../../component';
import { SIZES } from '../../../themes/Sizes';
import { GET_VOTING_DETAILS } from '../../../graphql/query';
import VotingQueAnsComponent from '../../../component/votingQueAnsComponent/VotingQueAnsComponent';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import { Fonts } from '../../../themes';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';

const LiveApproveMeetingSubjectVotingsDetails = ({
  meetingData,
  item: SubjectData,
  isMeeting
}) => {
  const [searchText, setSearchText] = useState('');
  const [votingDetails, setVotingDetails] = useState([]);
  let queryParams;

  if (isMeeting) {
    queryParams = {
      meetingId: meetingData?.meetingId,

      searchValue: searchText,
      type: 1,
      subjectId: 0
    };
  } else {
    queryParams = {
      meetingId:
        meetingData !== null
          ? meetingData?.meetingId
          : SubjectData.meetingId !== null
          ? SubjectData.meetingId
          : 0,
      type: 1,
      searchValue: searchText,
      subjectId: SubjectData?.subjectId
    };
  }

  const getVotingDetails = useQuery(GET_VOTING_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: queryParams,
    onCompleted: (data, error) => {
      if (data) {
        console.log('getVotingDetails data', data?.votingDetails?.items);
        setVotingDetails(data?.votingDetails?.items);
      }
      if (error) {
        console.log('get voting details error', error);
      }
    }
  });

  return (
    <View style={styles.container}>
      <SerachAndButtoncomponent
        isButtonShow={false}
        role={'Member'}
        onChangeText={setSearchText}
        value={searchText}
      />

      <View style={{ paddingHorizontal: SIZES[16], flex: 1 }}>
        {votingDetails?.length > 0 ? (
          <FlatList
            data={votingDetails}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <VotingQueAnsComponent
                  disable={true}
                  index={index}
                  meetingData={meetingData}
                  item={item}
                  searchText={searchText}
                  setDisable={() => {}}
                  isVotingDetails={true}
                />
              );
            }}
          />
        ) : getVotingDetails?.error ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}
            >
              {getVotingDetails?.error?.message == 'Network request failed'
                ? 'No Internet connection'
                : getVotingDetails?.error?.message}
            </Text>
          </View>
        ) : getVotingDetails?.loading ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Loader color={Colors.primary} size={'large'} />
          </View>
        ) : (
          votingDetails?.length <= 0 && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text
                style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}
              >
                No voting found
              </Text>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default LiveApproveMeetingSubjectVotingsDetails;
