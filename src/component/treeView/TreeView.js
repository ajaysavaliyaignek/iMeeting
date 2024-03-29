import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SIZES } from '../../themes/Sizes';
import CheckBox from '../checkBox/CheckBox';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import UserCommittee from '../userCommittee/UserCommittee';
import { styles } from './styles';

const TreeView = ({
  item,
  onToggle,
  togglecheck,
  valueType,
  toggleUsersCheckBox,
  selectedCommittees,
  selectedUsers
}) => {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle && onToggle(!expanded);
  };

  useEffect(() => {
    selectedCommittees?.map((committee) => {
      if (committee == item.committeeId) {
        setChecked(true);
      }
    });
  }, []);

  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={handleToggle} style={styles.iconContainer}>
          <Icon
            name={expanded ? IconName.Minus : IconName.Add}
            height={SIZES[14]}
            width={SIZES[14]}
          />
        </TouchableOpacity>

        {valueType !== 'users' && (
          <CheckBox
            value={checked}
            onValueChange={(value) => {
              setChecked(value);
              togglecheck(value, item);
            }}
          />
        )}
        <Text style={styles.name}>{item.committeeTitle}</Text>
      </View>

      {item?.children && expanded && (
        <View style={{ marginLeft: SIZES[16] }}>
          {item?.children?.map((child) => (
            <TreeView
              key={child.committeeTitle}
              item={child}
              onToggle={onToggle}
              togglecheck={togglecheck}
              valueType={valueType}
              toggleUsersCheckBox={toggleUsersCheckBox}
              selectedCommittees={selectedCommittees}
              selectedUsers={selectedUsers}
            />
          ))}
          {item?.userNames?.length > 0 &&
            valueType == 'users' &&
            expanded &&
            item?.userNames?.map((user, index) => {
              return (
                <UserCommittee
                  user={user}
                  index={index}
                  toggleUsersCheckBox={toggleUsersCheckBox}
                  item={item}
                  selectedUsers={selectedUsers}
                />
              );
            })}
        </View>
      )}
    </View>
  );
};

export default TreeView;
