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
      type: 2,
      subjectId: 0
    };
  } else {
    queryParams = {
      meetingId: meetingData?.meetingId,
      type: 2,
      searchValue: searchText,
      subjectId: SubjectData?.subjectId
    };
  }

  const getVotingDetails = useQuery(GET_VOTING_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: queryParams,
    onCompleted: (data, error) => {
      if (data) {
        console.log('get voting details', data?.votingDetails?.items);
        setVotingDetails(data?.votingDetails?.items);
      }
      if (error) {
        console.log('get voting details error', error);
      }
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          style={styles.textInput}
          placeholder={'Search'}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={() => {}}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      <Divider style={styles.divider} />
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
            <Loader color={Colors.primary} />
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
