import { View, Text, SafeAreaView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { GET_All_SUBJECTS_CATEGORY } from '../../../../graphql/query';
import { useMutation } from '@apollo/client';
import { UPDATE_SUBJECT_CATEGORY } from '../../../../graphql/mutation';

const AddSubjectCategory = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [addSubjectCategory, { data, loading, error }] = useMutation(
    UPDATE_SUBJECT_CATEGORY,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [{ query: GET_All_SUBJECTS_CATEGORY }],
      onCompleted: (data) => {
        if (data.updateSubjectCategory.status.statusCode == '200') {
          navigation.goBack();
          setTitle('');
          setDescription('');
        }
      }
    }
  );
  
  if (error) {
    console.log('addSubjectCategory error--', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add subject category'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <Text style={styles.txtAddSubjectTitle}>Add subject category</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>Description</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setDescription(text)}
            multiline={true}
          />
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
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              addSubjectCategory({
                variables: {
                  subjectCategory: {
                    id: 0,
                    description: description,
                    categoryTitle: title
                  }
                }
              });
            }}
            disable={title === '' || description === '' ? true : false}
            layoutStyle={[
              {
                opacity: title === '' || description === '' ? 0.5 : null
              },
              styles.nextBtnLayout
            ]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddSubjectCategory;
