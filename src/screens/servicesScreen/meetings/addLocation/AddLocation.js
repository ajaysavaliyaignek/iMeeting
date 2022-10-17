import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import React from 'react';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { SIZES } from '../../../../themes/Sizes';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button } from '../../../../component/button/Button';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';

const AddLocation = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add location'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtLocationDetailsTitle}>Add location</Text>
        <View style={styles.generalContainer}>
          <Text style={styles.txtTitleGeneral}>General</Text>

          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput style={styles.textInput} />
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>PEOPLE CAPACITY</Text>
          <TextInput style={styles.textInput} />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.txtTitleGeneral}>Address</Text>

          <Text style={styles.txtTitle}>CITY</Text>
          <TextInput style={styles.textInput} />
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>STREET</Text>
          <TextInput style={styles.textInput} />
          <Divider style={styles.divider} />

          <View style={styles.buildingContainer}>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>BUILDING</Text>
              <TextInput style={styles.textInput} />
              <Divider style={styles.divider} />
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>FLOOR</Text>
              <TextInput style={styles.textInput} />
              <Divider style={styles.divider} />
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>ROOM</Text>
              <TextInput style={styles.textInput} />
              <Divider style={styles.divider} />
            </View>
          </View>

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
      </View>
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
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
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

export default AddLocation;
