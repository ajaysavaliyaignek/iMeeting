import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SIZES } from '../../../themes/Sizes';
import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import { styles } from './styles';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../themes/Colors';
import UserDetailsComponent from '../../../component/userDetailsComponent/UserDetailsComponent';

const LiveMeetingUsers = ({ item }) => {
  console.log('item from LM Users', item);
  const [searchText, setSearchText] = useState('');
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('0');
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      activeOpacity={1}
    >
      <View style={styles.searchContainer}>
        <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
        <TextInput
          style={styles.textInput}
          placeholder={'Search users'}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={() => startRecording()}>
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <Button
          title={'All'}
          layoutStyle={[
            styles.btnServices,
            {
              backgroundColor: activeTab === '0' ? Colors.white : 'transparent'
            }
          ]}
          textStyle={styles.txtBtnServices}
          onPress={() => {
            setActiveTab('0');
          }}
        />

        <Button
          title={'Speaker'}
          layoutStyle={[
            styles.btnServices,
            {
              backgroundColor: activeTab === '1' ? Colors.white : 'transparent'
            }
          ]}
          textStyle={styles.txtBtnServices}
          onPress={() => {
            setActiveTab('1');
          }}
        />
      </View>
      <Divider style={styles.divider} />
      <UserDetailsComponent users={item.userDetails} />
    </TouchableOpacity>
  );
};

export default LiveMeetingUsers;
