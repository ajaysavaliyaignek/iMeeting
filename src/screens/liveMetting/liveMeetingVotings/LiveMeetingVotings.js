import { View, Text, FlatList, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { Colors } from '../../../themes/Colors';
import VotingDetailsComponent from '../../../component/votingDetailsComponent/VotingDetailsComponent';
import { Fonts } from '../../../themes';
import Loader from '../../../component/Loader/Loader';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import { GET_VOTING_DETAILS } from '../../../graphql/query';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Button } from '../../../component/button/Button';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { PUBLISH_EVENTS } from '../../../graphql/mutation';
import { SIZES } from '../../../themes/Sizes';

const LiveMeetingVotings = ({
  item: meetingData,
  socketEventUpdateMessage
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [votingDetails, setVotingDetails] = useState([]);
  const [dropdownList, setDropdownList] = useState([]);
  const [selectedVotings, setSelectedVotings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const client = useApolloClient();

  // get all votings details
  const getVotingDetails = useQuery(GET_VOTING_DETAILS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      meetingId: meetingData?.meetingId,
      subjectId: 0,
      type: 1,
      searchValue: searchText
    },
    onCompleted: (data, error) => {
      if (data) {
        setVotingDetails(data?.votingDetails?.items);
        let newData = data?.votingDetails?.items.map((item) => {
          return { value: item.votingTitle, key: item.votingId };
        });
        console.log({ data: newData });
        setDropdownList(newData);
      }
      if (error) {
        console.log('get voting details error', error);
      }
    }
  });

  useEffect(() => {
    if (socketEventUpdateMessage == 'votingDetails') {
      client.refetchQueries({
        include: [GET_VOTING_DETAILS]
      });
    }
  }, [socketEventUpdateMessage]);

  const [publishEvent, { loading }] = useMutation(PUBLISH_EVENTS, {
    refetchQueries: ['liveMeetingUsers'],
    onCompleted: (data) => {
      console.log({ data: data.publishEvent.status });
      if (data.publishEvent.status.statusCode == '200') {
        setOpenModal(false);
       
        alert('Publish successfully.');
      }
    },
    onError: (data) => {
      console.log('publish event error', data.message);
      alert('Something went wrong.');
    }
  });

  return (
    <View style={styles.container}>
      <SerachAndButtoncomponent
      isPublishButtonShow={true}
      onPressPublish={()=>setOpenModal(true)}
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
              : 'Something went wrong.'}
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
       <Modal
        animationType="fade"
        transparent={true}
        visible={openModal}
        onRequestClose={() => {
          setOpenModal(!openModal);
        }}
      >
        <View style={styles.modal}>
          <View style={[styles.mainBoxView]}>
            <Text style={styles.txtTitle}>Publish Voting</Text>
            <MultipleSelectList
              maxHeight={200}
              search={false}
              checkBoxStyles={{ height: 20, width: 20 }}
              setSelected={(val) => {
                setSelectedVotings(val);
              }}
              data={dropdownList}
              save="key"
              onSelect={() => {}}
              label="Votings"
              dropdownTextStyles={{
                ...Fonts.PoppinsRegular[14],
                color: Colors.bold
              }}
            />

            <View style={styles.buttonContainer}>
              <Button
                title={'Cancel'}
                onPress={() => {
                  setOpenModal(false);
                  setSelectedVotings([]);
                }}
                layoutStyle={[
                  styles.cancelBtnLayout,
                  { marginVertical: SIZES[12], width: '48%' }
                ]}
                textStyle={styles.txtCancelButton}
              />
              <Button
                title={'Save'}
                isLoading={loading}
                onPress={() => {
                  console.log({ selectedVotings });
                  publishEvent({
                    variables: {
                      meeting: {
                        availableId: selectedVotings,
                        type: 21,
                        meetingId: meetingData.meetingId,
                        subjectIds: []
                      }
                    }
                  });
                }}
                layoutStyle={[styles.nextBtnLayout]}
                textStyle={styles.txtNextBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LiveMeetingVotings;
