import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import React, { useContext, useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import { styles } from './styles';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import AppoinmentCard from '../../../../component/Cards/appointmentCard/AppointmentCard';
import { GET_All_APPOINTMENT } from '../../../../graphql/query';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import Loader from '../../../../component/Loader/Loader';
import { UserContext } from '../../../../context';

const AppointmentsList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appointmentsData, setAppointmentData] = useState([]);
  const { setSelectedUsers, setAppointmentsData } = useContext(UserContext);
  const [filterAppointmentsData, setFilterAppointmentsData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  // get ALL appointment
  const Appointment = useQuery(GET_All_APPOINTMENT, {
    fetchPolicy: 'cache-and-network',
    variables: {
      searchValue: searchText,
      page: -1,
      pageSize: -1
    },

    onCompleted: (data) => {
      setAppointmentData(data?.appointments.items);
    },
    onError: (data) => {
      console.log('all appointment error', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.txtHeader}>Appointments</Text>
        <View style={styles.headeRightView}>
          <TouchableOpacity
            style={styles.searchIconView}
            onPress={() => setSearch(!search)}
          >
            <Icon name={IconName.Search} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedUsers([]);
              setAppointmentsData([]);

              navigation.navigate('AddEditMeetingAppointmentVideoConference', {
                screenName: 'Add appointment',
                type: 'Appointment',
                screensArray: ['general', 'users', 'dateandtime', 'location'],
                isEdit: false,
                details: null
              });
            }}
            style={{
              height: SIZES[24],
              width: SIZES[24],
              alignItems: 'center',
              justifyContent: 'center'
            }}
            activeOpacity={0.8}
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
                  setSearchText(text);
                }}
                value={searchText}
                placeholder={'Search appointments'}
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');

                  setFilterAppointmentsData(appointmentsData);
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

        {appointmentsData.length > 0 ? (
          <FlatList
            data={appointmentsData}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            key={(item, index) => `${item.appointmentId}`}
            renderItem={({ item, index }) => {
              return (
                <AppoinmentCard
                  item={item}
                  index={index}
                  text={searchText}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                />
              );
            }}
          />
        ) : Appointment.error ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              {Appointment?.error?.message == 'Network request failed'
                ? 'No Internet connection'
                : 'Something went wrong.'}
            </Text>
          </View>
        ) : Appointment.loading ? (
          <Loader color={Colors.primary} size={'large'} />
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              No appointment found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppointmentsList;
