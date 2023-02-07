import { View, Text, SafeAreaView, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import Header from '../../../component/header/Header';
import { IconName } from '../../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_VOTING_HISTORY } from '../../../graphql/query';
import { Colors } from '../../../themes/Colors';
import SerachAndButtoncomponent from '../../../component/serachAndButtoncomponent/SerachAndButtoncomponent';
import { Divider } from 'react-native-paper';
import moment from 'moment';

const ViewVotingHistory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { votingId } = route?.params;
  const [votingHistoryList, setVotingHistoryList] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);
  const [searchText, setSearchText] = useState('');

  const getVotingHistory = useQuery(GET_VOTING_HISTORY, {
    fetchPolicy: 'cache-and-network',
    variables: {
      votingId: votingId
    },
    onCompleted: (data) => {
      if (data) {
        setVotingHistoryList(data.votingHistory.items);
        setFilterHistory(data.votingHistory.items);
      }
      console.log('getVotingHistory', data.votingHistory.items);
    },
    onError: (data) => {
      console.log('getVotingHistory error', data.message);
    }
  });

  const RowData = ({ name, discription, style, styleText, layoutStyle }) => {
    return (
      <View style={styles.rowContainer}>
        <Text style={styles.txtCommitteeName}>{name}</Text>

        <View
          style={[{ flexDirection: 'row', alignItems: 'center' }, layoutStyle]}
        >
          <View style={style} />
          <Text style={[styles.discription, styleText]}>{discription}</Text>
        </View>
      </View>
    );
  };

  // filter voting history
  const searchFilterUsers = (text) => {
    if (text) {
      const newData = filterHistory?.filter((item) => {
        const itemData = item?.userName ? item?.userName : '';
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchText(text);
      setVotingHistoryList(newData);
    } else {
      setSearchText(text);
      setVotingHistoryList(filterHistory);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Voting History'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <SerachAndButtoncomponent
          isButtonShow={false}
          role={'Member'}
          onChangeText={(text) => searchFilterUsers(text)}
          value={searchText}
        />
        <FlatList
          data={votingHistoryList}
          keyExtractor={(index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => {
            {
              var dateOfCreation = Date(item?.createDate);
              var date = moment(dateOfCreation).format('DD MMM, YYYY, HH:MM:A');
            }
            return (
              <View>
                <View style={styles.renderContainer}>
                  <RowData name={'Name'} discription={item?.userName} />
                  <RowData name={'Date & Time'} discription={date} />

                  <RowData name={'Answer'} discription={item?.answers} />
                </View>
                <Divider style={styles.divider} />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewVotingHistory;
