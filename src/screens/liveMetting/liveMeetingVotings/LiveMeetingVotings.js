import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch
} from 'react-native';
import React from 'react';

import { styles } from './styles';
import { Icon, IconName } from '../../../component';
import { SIZES } from '../../../themes/Sizes';
import { Button } from '../../../component/button/Button';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../themes/Colors';
import { useNavigation } from '@react-navigation/native';
import RNPoll from '../../../component/poll/RNPoll';
import { useQuery } from '@apollo/client';
import { GET_VOTING_DETAILS } from '../../../graphql/query';

const LiveMeetingVotings = ({ item }) => {
  const navigation = useNavigation();

  const choices = [
    { id: 1, choice: 'Nike', votes: 12 },
    { id: 2, choice: 'Adidas', votes: 1 },
    { id: 3, choice: 'Puma', votes: 3 }
  ];

  const getVotingDetails = useQuery(GET_VOTING_DETAILS, {
    variables: {
      meetingId: item.meetingId,
      type: 1,
      searchValue: ''
    },
    onCompleted: (data, error) => {
      if (data) {
        console.log('get voting details', data);
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
          // onChangeText={(text) => searchFilterSubject(text)}
        />
        <TouchableOpacity onPress={() => {}}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      <Button
        title={'Add voting'}
        layoutStyle={styles.cancelBtnLayout}
        textStyle={styles.txtCancelButton}
        onPress={() => {
          navigation.navigate('AddVoting', {
            meetingDetails: item,
            isAddVotingScreen: true
          });
        }}
      />
      <Divider style={styles.divider} />
      <ScrollView style={styles.subContainer}>
        <View style={styles.rowContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.txtTypeTitle}>Type</Text>
            <Text style={styles.txtType}>Subject</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              navigation.navigate('AddVoting', {
                meetingDetails: item,
                isAddVotingScreen: false
              });
            }}
          >
            <Text style={styles.txtEditBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[16]
          }}
        >
          <Text style={styles.txtTypeTitle}>Title subject</Text>
          <Text style={styles.txtType}>New subject</Text>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.txtQuestion}>Which page is better?</Text>
          <RNPoll choices={choices} totalVotes={30} isAddAnswer={true} />
          {/* <RNPoll
            totalVotes={30}
            choices={choices}
            onChoicePress={(selectedChoice) =>
              console.log('SelectedChoice: ', selectedChoice)
            }
            hasBeenVoted={false}
          /> */}
          <TouchableOpacity
            style={[
              styles.editBtn,
              { marginTop: SIZES[24], width: '25%', marginBottom: SIZES[20] }
            ]}
          >
            <Text style={styles.txtEditBtn}>Add answer</Text>
          </TouchableOpacity>
        </View>
        <Divider style={styles.divider} />
        <View
          style={[
            styles.rowContainer,
            {
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              paddingVertical: SIZES[8]
            }
          ]}
        >
          <Text style={styles.txtLabel}>Private</Text>
          <Switch
            value={false}
            // onValueChange={() => setIsAttachFileSwitchOn(!isAttachFileSwitchOn)}
            color={Colors.switch}
          />
        </View>
        <View
          style={[
            styles.rowContainer,
            {
              borderBottomWidth: SIZES[1],
              borderBottomColor: Colors.line,
              paddingVertical: SIZES[8],
              marginBottom: SIZES[16]
            }
          ]}
        >
          <Text style={styles.txtLabel}>Select multiple</Text>
          <Switch
            value={true}
            // onValueChange={() => setIsCommentsSwitchOn(!isCommentsSwitchOn)}
            color={Colors.switch}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LiveMeetingVotings;
