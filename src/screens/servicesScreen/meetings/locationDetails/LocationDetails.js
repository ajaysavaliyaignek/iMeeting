import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import { Colors } from '../../../../themes/Colors';

const LocationDetails = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Location details'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtLocationDetailsTitle}>Location details</Text>
        <View style={styles.generalContainer}>
          <Text style={styles.txtTitleGeneral}>General</Text>

          <Text style={styles.txtTitle}>Title</Text>
          <Text style={styles.discription}>Office 2</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>People capacity</Text>
          <Text style={styles.discription}>32</Text>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.txtTitleGeneral}>Address</Text>

          <Text style={styles.txtTitle}>City</Text>
          <Text style={styles.discription}>Toronto</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>Street</Text>
          <Text style={styles.discription}>8080 Railroad St.</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>Building / Floor / Room</Text>
          <Text style={styles.discription}>2, 5, 4</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>Google Map URL</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: SIZES[10]
            }}
          >
            <Text style={styles.txtUrl}>goo.gl/maps/zPNPu7pQnfgRopjc9</Text>
            <TouchableOpacity
              onPress={() =>
                Clipboard.setString('goo.gl/maps/zPNPu7pQnfgRopjc9')
              }
            >
              <Icon
                name={IconName.CopyText}
                height={SIZES[20]}
                width={SIZES[20]}
              />
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View
          style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
        >
          <Button
            title={'Close'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Edit'}
            onPress={() => navigation.navigate('AddMeetingLocation')}
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LocationDetails;
