import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import VotingDetailsComponent from '../../../component/votingDetailsComponent/VotingDetailsComponent';
import { Fonts } from '../../../themes';
import Loader from '../../../component/Loader/Loader';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import { GET_VOTING_DETAILS } from '../../../graphql/query';
import { useApolloClient, useQuery } from '@apollo/client';

const LiveMeetingVotings = ({
  item: meetingData,
  socketEventUpdateMessage
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [votingDetails, setVotingDetails] = useState([]);
  const client = useApolloClient();

  // get all votings details
  const getVotingDetails = useQuery(GET_VOTING_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: meetingData?.meetingId,

      searchValue: searchText
    },
    onCompleted: (data, error) => {
      console.log('voting details', data?.votingDetails?.items);
      if (data) {
        setVotingDetails(data?.votingDetails?.items);
      }
      if (error) {
        console.log('get voting details error', error);
      }
    }
  });

  useEffect(() => {
    console.log(
      'socketEventUpdateMessage from voting details',
      socketEventUpdateMessage
    );
    if (socketEventUpdateMessage == 'votingDetails') {
      client.refetchQueries({
        include: [GET_VOTING_DETAILS]
      });
    }
  }, [socketEventUpdateMessage]);

  return (
    <View style={styles.container}>
      <SerachAndButtoncomponent
        role={meetingData?.yourRoleName}
        isButtonShow={meetingData?.yourRoleName != 'Member' ? true : false}
        buttonText={'Add voting'}
        onPress={() => {
          navigation.navigate('AddVoting', {
            meetingDetails: meetingData,
            isAddVotingScreen: true,
            votingDetails: null
          });
        }}
        onChangeText={(text) => {
          setSearchText(text);
        }}
      />
      {votingDetails?.length > 0 ? (
        <FlatList
          data={votingDetails}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <VotingDetailsComponent
                item={item}
                index={index}
                meetingData={meetingData}
                searchText={searchText}
                key={index.toString()}
              />
            );
          }}
        />
      ) : getVotingDetails?.error ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ ...Fonts.PoppinsSemiBold[20], color: Colors.primary }}>
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
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
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
  );
};

export default LiveMeetingVotings;
