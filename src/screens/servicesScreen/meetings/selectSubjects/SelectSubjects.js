import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React from 'react';
import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { subjectData } from '../../../../Constans/data';
import SelectSubjectCard from '../../../../component/Cards/selectSubjectcard/SelectSubjectCard';
import { Button } from '../../../../component/button/Button';
import { Colors } from '../../../../themes/Colors';

const SelectSubjects = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Select subject'}
        rightIconName={IconName.Add}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.navigate('AddSubject')}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            // onChangeText={(text) => searchFilterSubject(text)}
          />
          <TouchableOpacity>
            <Icon
              name={IconName.Speaker}
              height={SIZES[15]}
              width={SIZES[10]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.committeeView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Role')}
        >
          <Text style={styles.txtCommittee}>Role</Text>
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
        <FlatList
          data={subjectData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <SelectSubjectCard item={item} index={index} />
          )}
        />
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
            title={'Add subjects'}
            onPress={() => navigation.navigate('AddMeetingSubjects')}
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

export default SelectSubjects;
