import {
  View,
  Text,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  BackHandler
} from 'react-native';
import React, { useContext, useEffect } from 'react';

import Header from '../../component/header/Header';
import { Colors } from '../../themes/Colors';
import DashboardCard from '../../component/Cards/ServicesCard';
import { IconName } from '../../component';
import { SIZES } from '../../themes/Sizes';
import { styles } from './styles';
import { GET_USER_PAYLOAD } from '../../graphql/query';
import { useQuery } from '@apollo/client';
import { UserContext } from '../../context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServicesScreen = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const { companyUrl, setCompanyUrl, setUser } = useContext(UserContext);

  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    onCompleted: (data) => {
      setUser(data.userPayload);
    }
  });

  useEffect(() => {
    const getUrl = () => {
      AsyncStorage.getItem('@url').then((data) => {
        console.log('url', data);

        setCompanyUrl(data);
      });
    };

    getUrl();
  }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel'
  //       },
  //       { text: 'YES', onPress: () => BackHandler.exitApp() }
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Header name={'Services'} leftIconName={null} rightIconName={null} />

      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* general title */}
        <Text style={styles.txtHeading}>GENERAL</Text>

        {/* general feature */}
        <View style={styles.generalView}>
          <DashboardCard
            backgroundColor={Colors.BG_Meeting}
            name={IconName.Meetings}
            height={SIZES[20]}
            width={SIZES[18]}
            style={{ marginBottom: SIZES[16] }}
            title={'Meetings'}
            textStyle={{ marginTop: SIZES[24] }}
            onPress={() =>
              navigation.navigate('Details', {
                title: 'Meetings',
                active: '0'
              })
            }
          />
          <DashboardCard
            backgroundColor={Colors.BG_Appointment}
            name={IconName.Appointments}
            height={SIZES[20]}
            width={SIZES[20]}
            title={'Appointments'}
            textStyle={{ marginTop: SIZES[23] }}
            onPress={() => navigation.navigate('AppointmentsList')}
          />
          <DashboardCard
            backgroundColor={Colors.BG_Video}
            name={IconName.Video_Conferences}
            height={SIZES[14]}
            width={SIZES[22]}
            title={`      Video\nconferences`}
            textStyle={{ marginTop: SIZES[18] }}
          />
          <DashboardCard
            backgroundColor={Colors.BG_Tasks}
            name={IconName.Tasks}
            height={SIZES[20]}
            width={SIZES[18]}
            textStyle={{ marginTop: SIZES[24] }}
            title={'Tasks'}
            onPress={() => navigation.navigate('TasksList')}
          />
        </View>

        {/* sub title */}
        <Text style={styles.txtHeading}>SUB</Text>

        {/* sub feature */}
        <View style={styles.generalView}>
          <DashboardCard
            backgroundColor={Colors.gray}
            name={IconName.Add}
            height={SIZES[14]}
            width={SIZES[14]}
            style={{ marginBottom: SIZES[16] }}
            textStyle={{ marginTop: SIZES[27] }}
            title={'Add event'}
          />
          <DashboardCard
            backgroundColor={Colors.gray}
            name={IconName.Subjects}
            height={SIZES[18]}
            width={SIZES[18]}
            textStyle={{ marginTop: SIZES[25] }}
            title={'Subjects'}
            onPress={() =>
              navigation.navigate('Details', {
                title: 'Subjects',
                active: '1'
              })
            }
          />
          <DashboardCard
            backgroundColor={Colors.gray}
            name={IconName.Delegation}
            height={SIZES[18]}
            width={SIZES[18]}
            textStyle={{ marginTop: SIZES[25] }}
            title={'Delegation'}
          />
          <DashboardCard
            backgroundColor={Colors.gray}
            name={IconName.Statistics}
            height={SIZES[20]}
            width={SIZES[20]}
            textStyle={{ marginTop: SIZES[25] }}
            title={'Statistics'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesScreen;
