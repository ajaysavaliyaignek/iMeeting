import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Platform,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

import DropDownPicker from '../../../component/DropDownPicker/DropDownPicker';
import { styles } from './styles';
import { Icon, IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';
import { GET_COMMITTEES_BY_ROLE } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const AddGeneralVideoConference = ({
  generaldData,
  setGeneralData,
  details
}) => {
  const [committee, setCommittee] = useState(null);

  // fetch commitees
  const {
    loading: CommitteeLoading,
    error: CommitteeError,
    data: CommitteeData
  } = useQuery(GET_COMMITTEES_BY_ROLE, {
    fetchPolicy: 'cache-and-network',
    variables: { head: true, secretary: true, member: false, type: 5 },
    onCompleted: (data) => {
      if (data) {
        setCommittee(data?.committeesByRole?.items);
      }
    },
    onError: (data) => {
      console.log('commitee error', data);
    }
  });
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.txtAddSubjectTitle}>General</Text>
      {/* choose committe */}
      <DropDownPicker
        data={committee?.map((comm) => ({
          label: comm.committeeTitle,
          value: comm.organizationId
        }))}
        // disable={details == null ? false : true}
        placeholder={''}
        setData={(item) => {
          setGeneralData((prev) => {
            return { ...prev, valueCommitee: item };
          });
        }}
        title={'CHOOSE COMMITTEE'}
        value={generaldData?.valueCommitee}
      />
      {/* dropdown video conference */}
      <DropDownPicker
        data={[
          {
            value: 1,
            label: 'Google Meet'
          },
          {
            value: 2,
            label: 'Microsoft Teams'
          }
        ]}
        disable={generaldData.valueVideoConference !== null ? true : false}
        placeholder={''}
        setData={(item) =>
          setGeneralData({ ...generaldData, valueVideoConference: item })
        }
        title={'VIDEO CONFERENCING PLATFORM'}
        value={generaldData?.valueVideoConference}
      />

      {/* platformlink */}
      {generaldData.platformlink !== null && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[16]
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.gray,
              padding: SIZES[14],
              borderTopLeftRadius: SIZES[8],
              borderBottomLeftRadius: SIZES[8]
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary
              }}
            >
              <Text style={styles.txtLink} numberOfLines={1}>
                {generaldData.platformlink}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#E7EDF4',
              padding: SIZES[14],
              borderTopRightRadius: SIZES[8],
              borderBottomRightRadius: SIZES[8]
            }}
            onPress={() => {
              Clipboard.setString(generaldData.platformlink);
              // if (
              //   location?.googleMapURL !== '' ||
              //   location?.googleMapURL !== null
              // ) {
              if (Platform.OS == 'android') {
                ToastAndroid.show(
                  `Copied Text :-  ${generaldData.platformlink}`,
                  ToastAndroid.SHORT
                );
              } else {
                Alert.alert(`Copied Text :-  ${generaldData.platformlink}`);
              }
              // }
            }}
          >
            <Icon
              name={IconName.CopyText}
              height={SIZES[20]}
              width={SIZES[20]}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* title */}
      <View style={styles.discriptionContainer}>
        <Text style={styles.txtTitle}>TITLE</Text>
        <TextInput
          value={generaldData?.title}
          style={styles.textInput}
          onChangeText={(text) => {
            setGeneralData((prev) => {
              return { ...prev, title: text };
            });
            // setTitle(text);
          }}
        />
      </View>

      {/* description */}
      <View style={styles.categoryContainer}>
        <Text style={styles.txtTitle}>DESCRIPTION</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          onChangeText={(text) => {
            setGeneralData((prev) => {
              return { ...prev, discription: text };
            });
          }}
          value={generaldData?.discription}
        />
      </View>
    </ScrollView>
  );
};

export default AddGeneralVideoConference;
