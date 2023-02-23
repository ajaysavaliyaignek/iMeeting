import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { SIZES } from '../../../../themes/Sizes';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button } from '../../../../component/button/Button';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { useMutation } from '@apollo/client';
import { UPDATE_LOCATION } from '../../../../graphql/mutation';
import {
  GET_ALL_LOCATION,
  GET_ALL_LOCATION_BY_ID
} from '../../../../graphql/query';

const EditLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { meetingLocation, locationType } = route?.params;
  console.log('location from edit location', meetingLocation);
  console.log('location type', locationType);
  const [linkText, setLinkText] = useState(meetingLocation?.googleMapURL);
  const [title, setTitle] = useState(meetingLocation?.title);
  const [capacity, setCapacity] = useState(
    meetingLocation?.peopleCapacity.toString()
  );
  const [city, setCity] = useState(meetingLocation?.city);
  const [building, setBuilding] = useState(
    meetingLocation?.building.toString()
  );
  const [floor, setFloor] = useState(meetingLocation?.floor.toString());
  const [street, setStreet] = useState(meetingLocation?.street);
  const [room, setRoom] = useState(meetingLocation?.room.toString());

  const [editLocation, { data, loading, error: editLocationError }] =
    useMutation(UPDATE_LOCATION, {
      refetchQueries: [
        { query: GET_ALL_LOCATION, variables: { locationType: locationType } },
        {
          query: GET_ALL_LOCATION_BY_ID,
          variables: { locationId: meetingLocation.locationId }
        }
      ],
      onCompleted: (data) => {
        if (data) {
          console.log(data.updateLocation.status);
          if (data.updateLocation.status.statusCode == '200') {
            navigation.goBack();
          }
          // navigation.goBack();
        }
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit location'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      {editLocationError && (
        <Text style={{ alignSelf: 'center', color: Colors.Rejected }}>
          Please enter valid field
        </Text>
      )}
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtLocationDetailsTitle}>Edit location</Text>
        <View style={styles.generalContainer}>
          <Text style={styles.txtTitleGeneral}>General</Text>

          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>PEOPLE CAPACITY</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setCapacity(text)}
            value={capacity}
            keyboardType="numeric"
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.txtTitleGeneral}>Address</Text>

          <Text style={styles.txtTitle}>CITY</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setCity(text)}
            value={city}
          />
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>STREET</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setStreet(text)}
            value={street}
          />
          <Divider style={styles.divider} />

          <View style={styles.buildingContainer}>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>BUILDING</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setBuilding(text)}
                value={building}
                keyboardType="numeric"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>FLOOR</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setFloor(text)}
                value={floor}
                keyboardType="numeric"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>ROOM</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setRoom(text)}
                value={room}
                keyboardType="numeric"
              />
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
            <TextInput
              onChangeText={(text) => setLinkText(text)}
              style={{ flex: 1 }}
              value={linkText}
            />
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(linkText);
                if (linkText !== '' || linkText !== null) {
                  if (Platform.OS == 'android') {
                    ToastAndroid.show(
                      `Copied Text :-  ${linkText}`,
                      ToastAndroid.SHORT
                    );
                  } else {
                    Alert.alert(`Copied Text :-  ${linkText}`);
                  }
                }
              }}
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
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log(
                'building',
                parseInt(building),
                'city',
                city,
                'floor',
                parseInt(floor),
                'googleMapURL',
                linkText,
                'locationId',
                0,
                'peopleCapacity',
                parseInt(capacity),
                'room',
                parseInt(room),
                'street',
                street,
                'title',
                title,
                'locationType',
                2
              );
              editLocation({
                variables: {
                  location: {
                    building: parseInt(building),
                    city: city,
                    floor: parseInt(floor),
                    googleMapURL: linkText,
                    locationId: meetingLocation.locationId,
                    peopleCapacity: parseInt(capacity),
                    room: parseInt(room),
                    street: street,
                    title: title,
                    locationType: locationType
                  }
                }
              });
            }}
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

export default EditLocation;
