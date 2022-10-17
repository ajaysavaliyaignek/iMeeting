import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import React, { useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import SubjectsCard from '../../../component/Cards/subjectCard/SubjectsCard';
import { SIZES } from '../../../themes/Sizes';
import { meetingsData } from '../../../Constans/data';
import MeetingsCard from '../../../component/Cards/MeetingdCard';
import { Button } from '../../../component/button/Button';
import { GET_All_SUBJECTS } from '../../../graphql/query';
import { Icon, IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import { styles } from './styles';

const DetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { title, active } = route?.params;

  const [activeTab, setActiveTab] = useState(active);
  const [headerTitle, setHeaderTitle] = useState(title);
  const [search, setSearch] = useState(false);
  const [onlyMyMeetings, setOnlyMyMeetings] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [meetingData, setMeetingData] = useState(meetingsData);
  const [filterMeetingData, setFilterMeetingData] = useState(meetingsData);

  // get ALL SUBJECTS
  const { loading, error, data } = useQuery(GET_All_SUBJECTS, {
    onCompleted: (data) => {
      setFilterData(data?.subjects.items);

      setSubjectData(data?.subjects.items);
    }
  });

  if (data) {
    console.log('subjects---', data.subjects.items);
  }
  if (error) {
    console.log('subjects error---', error);
  }

  // const handleChangeText = (param) => {
  //   const regEx = '\\s*(' + param + ')\\s*';
  //   const validator = new RegExp(regEx, 'i');
  //   let filterData = [];
  //   //here is categorylist is the data supplied to flatlist.
  //   data.subjects.items.forEach((item) => {
  //     let flag = validator.test(item.teamtype);
  //     if (flag) {
  //       //here set the highlighting color
  //     }
  //   });
  // };

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = subjectData.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      // const newMeetingData = meetingData.filter((item) => {
      //   const itemMeetingData = item.title ? item.title : '';
      //   const textMeetingData = text;
      //   return itemMeetingData.indexOf(textMeetingData) > -1;
      // });
      setSearchText(text);
      setFilterData(newData);
      // setFilterMeetingData(newMeetingData);
    } else {
      setSearchText(text);
      setFilterData(subjectData);
      // setFilterMeetingData(meetingData);
    }
  };

  const searchFilterMeeting = (text) => {
    if (text) {
      const newData = meetingData.filter((item) => {
        const itemData = item.title ? item.title : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      // const newMeetingData = meetingData.filter((item) => {
      //   const itemMeetingData = item.title ? item.title : '';
      //   const textMeetingData = text;
      //   return itemMeetingData.indexOf(textMeetingData) > -1;
      // });
      setSearchText(text);
      setFilterMeetingData(newData);
      // setFilterMeetingData(newMeetingData);
    } else {
      setSearchText(text);
      setFilterMeetingData(meetingData);
      // setFilterMeetingData(meetingData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name={IconName.Arrow_Left}
            height={SIZES[14]}
            width={SIZES[14]}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>{headerTitle}</Text>
        <View style={styles.headeRightView}>
          <TouchableOpacity
            style={styles.searchIconView}
            onPress={() => setSearch(!search)}
          >
            <Icon name={IconName.Search} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (activeTab === '0') {
                navigation.navigate('AddMeetingGeneral');
              } else if (activeTab === '1') {
                navigation.navigate('AddSubject');
              }
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
                style={{ flex: 1, marginLeft: SIZES[6] }}
                onChangeText={(text) => {
                  activeTab === '0'
                    ? searchFilterMeeting(text)
                    : activeTab === '1'
                    ? searchFilterSubject(text)
                    : null;
                }}
                value={searchText}
                placeholder={
                  activeTab === '0'
                    ? 'Search meeting'
                    : activeTab === '1'
                    ? 'Search subject'
                    : ''
                }
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                  setFilterData(subjectData);
                  setFilterMeetingData(meetingData);
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
          <View>
            {/* committes */}
            <TouchableOpacity
              style={styles.committeeView}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('Committee')}
            >
              <Text style={styles.txtCommittee}>Committee</Text>
              <View style={styles.btnCommittees}>
                <Text style={styles.txtBtnCommittees}>All</Text>
                <Icon
                  name={IconName.Arrow_Right}
                  height={SIZES[12]}
                  width={SIZES[6]}
                />
              </View>
            </TouchableOpacity>

            <Divider style={styles.divider} />
            <View style={styles.btnContainer}>
              <Button
                title={'Meetings'}
                layoutStyle={[
                  styles.btnServices,
                  {
                    backgroundColor:
                      activeTab === '0' ? Colors.white : 'transparent'
                  }
                ]}
                textStyle={styles.txtBtnServices}
                onPress={() => {
                  setActiveTab('0');
                  setHeaderTitle('Meetings');
                }}
              />

              <Button
                title={'Subjects'}
                layoutStyle={[
                  styles.btnServices,
                  {
                    backgroundColor:
                      activeTab === '1' ? Colors.white : 'transparent'
                  }
                ]}
                textStyle={styles.txtBtnServices}
                onPress={() => {
                  setActiveTab('1');
                  setHeaderTitle('Subjects');
                }}
              />
              <Button
                title={'Delegations'}
                layoutStyle={[
                  styles.btnServices,
                  {
                    backgroundColor:
                      activeTab === '2' ? Colors.white : 'transparent'
                  }
                ]}
                textStyle={styles.txtBtnServices}
                onPress={() => {
                  setActiveTab('2');
                  setHeaderTitle('Delegations');
                }}
              />
            </View>
            <Divider style={styles.divider} />
          </View>
        )}

        {/* meetings list */}

        {activeTab === '0' && (
          <View style={{ flex: 1 }}>
            <View style={styles.switchContainer}>
              <Text style={styles.txtSwitchLabel}>Only my meetings</Text>
              <Switch
                color={Colors.switch}
                value={onlyMyMeetings}
                onChange={() => setOnlyMyMeetings(!onlyMyMeetings)}
              />
            </View>
            <Divider style={styles.divider} />
            <FlatList
              data={filterMeetingData}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => (
                <MeetingsCard item={item} index={index} text={searchText} />
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* subjects list */}

        {activeTab === '1' && (
          <View style={{ flex: 1 }}>
            {loading ? (
              <Loader />
            ) : error ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>{error}</Text>
              </View>
            ) : (
              <FlatList
                data={filterData}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => (
                  <SubjectsCard
                    item={item}
                    index={index}
                    text={searchText}
                    search={search}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DetailsScreen;
