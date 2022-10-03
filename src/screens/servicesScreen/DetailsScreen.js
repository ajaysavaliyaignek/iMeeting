import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import SubjectsCard from '../../component/Cards/SubjectsCard';
import { SIZES } from '../../themes/Sizes';
import { meetingsData, subjectData } from '../../Constans/data';
import MeetingsCard from '../../component/Cards/MeetingdCard';
import { Button } from '../../component/button/Button';
import { GET_All_SUBJECTS } from '../../graphql/query';
import { Icon, IconName } from '../../component';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';

const DetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { title, active } = route?.params;

  const [activeTab, setActiveTab] = useState(active);
  const [headerTitle, setHeaderTitle] = useState(title);
  const [search, setSearch] = useState(false);
  const [onlyMyMeetings, setOnlyMyMeetings] = useState(false);

  const { loading, error, data } = useQuery(GET_All_SUBJECTS);
  // if(data){
  //     console.log("subjects---",data.subjects.items)
  // }
  // if(error){
  //     console.log("error---",error)
  // }

  // if(loading){
  //     <Loader/>
  //     }

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
        </View>

        {/* meetings list */}

        {activeTab === '0' && (
          <View>
            <Divider style={styles.divider} />
            <View style={styles.switchContainer}>
              <Text style={styles.txtSwitchLabel}>Only my meetings</Text>
              <Switch
                color={Colors.switch}
                value={onlyMyMeetings}
                onChange={() => setOnlyMyMeetings(!onlyMyMeetings)}
              />
            </View>
            <FlatList
              data={meetingsData}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => <MeetingsCard item={item} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* subjects list */}

        {activeTab === '1' && (
          <FlatList
            data={subjectData}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => <SubjectsCard item={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16],
    paddingVertical: SIZES[10]
  },
  txtHeader: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    marginLeft: SIZES[24]
  },
  headeRightView: { flexDirection: 'row', alignItems: 'center' },
  searchIconView: { marginRight: SIZES[24] },
  subContainer: { flex: 1, backgroundColor: Colors.white },
  searchView: {
    backgroundColor: Colors.gray,
    padding: SIZES[16],
    height: SIZES[36]
  },
  searchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  subSearchView: {
    padding: SIZES[12]
  },
  committeeView: {
    marginVertical: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    margin: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-evenly'
  },
  btnServices: {
    paddingVertical: SIZES[8],
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' },
  txtBtnCommittees: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[21]
  },
  subjectCard: { ...Fonts.PoppinsSemiBold[14] },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16]
  },
  txtSwitchLabel: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  }
});
