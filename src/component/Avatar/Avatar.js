import React, { useMemo } from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../../themes/Colors';

import Normalize from '../../themes/mixins';
import style from './styles';

const Avatar = (props) => {
  const {
    name,
    source,
    rounded = true,
    size = 32,
    fontSize,
    textColor,
    backgroundColor,
    borderWidth,
    onPress
  } = props;

  const styles = useMemo(
    () => style(Normalize(size), rounded),
    [size, rounded]
  );

  const getInitials = (name) => {
    const userName = name?.substring(0, 1) ?? '';
    return name?.substring(0, 1) ?? '';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        backgroundColor
          ? { backgroundColor: 'backgroundColor' }
          : { backgroundColor: Colors.line },
        borderWidth && { borderWidth: Normalize(borderWidth) }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {source ? (
        <Image style={styles.imageStyle} source={{ uri: source }} />
      ) : name ? (
        <Text
          style={[
            styles.initialsText,
            fontSize ? { fontSize: fontSize } : null,
            textColor ? { color: textColor } : { color: 'white' }
          ]}
        >
          {getInitials(name)}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default Avatar;
