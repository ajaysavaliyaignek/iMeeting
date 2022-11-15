import { View, Text, SafeAreaView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { styles } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { UPDATE_ANSWER } from '../../../../graphql/mutation';

const YourAnswer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log('item from your answer', item);
  const [open, setOpen] = useState(false);
  const [valueAnswer, setValue] = useState(null);
  const [suggestedTime, setSuggestedTime] = useState('');
  const [items, setItems] = useState([
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Unknown', value: 'Unknown' },
    { label: 'Suggest time', value: 'Suggest time' }
  ]);

  const [updateAnswer] = useMutation(UPDATE_ANSWER, {
    onCompleted: (data) => {
      console.log('answer', data.updateAnswer);
    },
    onError: (data) => {
      console.log('update answer error', data);
    }
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Your answer'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>YOUR ANSWER</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={open}
            value={valueAnswer}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={''}
            placeholderStyle={{
              ...Fonts.PoppinsRegular[12],
              color: Colors.secondary
            }}
            style={{
              borderWidth: 0,
              paddingLeft: 0,
              paddingRight: SIZES[16]
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
          {/* <TextInput style={styles.textInput} /> */}
        </View>
        {valueAnswer == 'Suggest time' ? (
          <View style={styles.inputContainer}>
            <Text style={styles.txtTitle}>YOUR SUGGESTION TIME</Text>
            <TextInput
              onChangeText={(text) => setSuggestedTime(text)}
              style={styles.input}
              // editable={suggestedTime == 'Suggest time' ? true : false}
            />
          </View>
        ) : null}
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Close'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
            onPress={() => {
              updateAnswer({
                variables: {
                  answer: {
                    answer: suggestedTime,
                    appointmentId: 901,
                    suggestionTime:
                      valueAnswer == 'Suggest time' ? suggestedTime : null,
                    meetingId: item.meetingId,
                    videoConferenceId: 0
                  }
                }
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default YourAnswer;
