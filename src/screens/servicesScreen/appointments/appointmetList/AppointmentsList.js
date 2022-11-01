import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { styles } from './styles';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import { AppointmentsData } from '../../../../Constans/data';
import AppoinmentCard from '../../../../component/Cards/appointmentCard/AppointmentCard';

const AppointmentsList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [filterAppointmentsData, setFilterAppointmentsData] = useState([]);

  const searchFilterAppointment = (text) => {
    if (text) {
      const newData = appointmentsData.filter((item) => {
        const itemData = item.appointmentTitle ? item.appointmentTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });

      setSearchText(text);
      setFilterAppointmentsData(newData);
    } else {
      setSearchText(text);
      setFilterAppointmentsData(appointmentsData);
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
              navigation.navigate('AddAppointmentGeneral');
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
                  searchFilterAppointment(text);
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
          <View>
            {/* filter */}
            <TouchableOpacity style={styles.committeeView} activeOpacity={0.5}>
              <Text style={styles.txtCommittee}>Filter</Text>
              <View style={styles.btnCommittees}>
                <Icon
                  name={IconName.Arrow_Right}
                  height={SIZES[12]}
                  width={SIZES[6]}
                />
              </View>
            </TouchableOpacity>

            <Divider style={styles.divider} />

            {/* secretory permission */}
            <TouchableOpacity style={styles.committeeView} activeOpacity={0.5}>
              <Text style={styles.txtCommittee}>Secretary permission</Text>
              <View style={styles.btnCommittees}>
                <Icon
                  name={IconName.Arrow_Right}
                  height={SIZES[12]}
                  width={SIZES[6]}
                />
              </View>
            </TouchableOpacity>

            <Divider style={styles.divider} />
          </View>
        )}

        <FlatList
          data={AppointmentsData}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item, index }) => {
            return (
              <AppoinmentCard item={item} index={index} text={searchText} />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default AppointmentsList;
