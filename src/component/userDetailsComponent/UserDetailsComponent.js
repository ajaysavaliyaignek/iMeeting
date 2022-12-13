import { View, Text, FlatList } from 'react-native';
import React from 'react';
import UserDetailsCard from '../Cards/userDetailsCard/UserDetailsCard';
import { styles } from './styles';

const UserDetailsComponent = ({
  users,
  isGeneralUser,
  isCheckboxView,
  isExternalUser,
  isSwitchOnRow,
  isUserRequired,
  committee,
  onChecked,
  openPopup,
  searchText,
  disabled,
  isSpeaker,
  onChangeUser,
  isSwichDisabled,
  visibleIndex,
  setVisibleIndex,
  isDeletable,
  onPressDelete
}) => {
  console.log('users', users);
  return (
    <View style={styles.container}>
      {users?.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item, index) => `${item.userId}`}
          renderItem={({ item, index }) => {
            return (
              <UserDetailsCard
                item={item}
                index={index}
                isGeneralUser={isGeneralUser}
                isCheckboxView={isCheckboxView}
                isExternalUser={isExternalUser}
                isSwitchOnRow={isSwitchOnRow}
                isUserRequired={isUserRequired}
                committee={committee}
                onChecked={onChecked}
                openPopup={openPopup}
                searchText={searchText}
                disabled={disabled}
                isSpeaker={isSpeaker}
                onChangeUser={onChangeUser}
                isSwichDisabled={isSwichDisabled}
                visibleIndex={visibleIndex}
                setVisibleIndex={setVisibleIndex}
                isDeletable={isDeletable}
                onPressDelete={onPressDelete}
              />
            );
          }}
        />
      ) : (
        <View style={styles.noSelectedContainer}>
          <Text style={styles.txtNoUsers}>No selected Users</Text>
        </View>
      )}
    </View>
  );
};

export default UserDetailsComponent;
