import { View, Text } from 'react-native';
import React from 'react';

import Avatar from '../../Avatar/Avatar';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';

const CommentCard = () => {
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          right: SIZES[6],
          top: SIZES[16]
        }}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[6]} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          name={'Darrell Steward'}
          source={'https://picsum.photos/200/300'}
          size={SIZES[32]}
        />
        <View style={{ marginLeft: SIZES[16], marginTop: SIZES[10] }}>
          <Text style={{ ...Fonts.PoppinsSemiBold[14], color: Colors.bold }}>
            Darrell Steward
          </Text>
          <Text
            style={{ ...Fonts.PoppinsRegular[14], color: Colors.secondary }}
          >
            17 August, 2022, 8:32 PM
          </Text>
        </View>
      </View>
      <Text
        style={{
          ...Fonts.PoppinsRegular[14],
          color: Colors.bold,
          marginTop: SIZES[16]
        }}
      >
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English.
      </Text>
    </View>
  );
};

export default CommentCard;
