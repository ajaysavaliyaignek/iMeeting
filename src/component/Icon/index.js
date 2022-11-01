import React, { useMemo } from 'react';

import IconName from './iconName';
import * as SVGImage from '../../assets/Icons';
import { SIZES } from '../../themes/Sizes';

const Icon = ({ name, height = SIZES[24], width = SIZES[24], fill }) => {
  const svg = useMemo(() => {
    switch (name) {
      case IconName.Add:
        return <SVGImage.Add height={height} width={width} fill={fill} />;
      case IconName.Close:
        return <SVGImage.Close height={height} width={width} fill={fill} />;
      case IconName.Eye:
        return <SVGImage.Eye height={height} width={width} fill={fill} />;
      case IconName.Account:
        return <SVGImage.Account height={height} width={width} fill={fill} />;
      case IconName.Calendar:
        return <SVGImage.Calendar height={height} width={width} fill={fill} />;
      case IconName.Dashboard:
        return <SVGImage.Dashboard height={height} width={width} fill={fill} />;
      case IconName.Services:
        return <SVGImage.Services height={height} width={width} fill={fill} />;
      case IconName.Account_Focused:
        return (
          <SVGImage.Account_Focused height={height} width={width} fill={fill} />
        );
      case IconName.Calendar_Focused:
        return (
          <SVGImage.Calendar_Focused
            height={height}
            width={width}
            fill={fill}
          />
        );
      case IconName.Dashboard_Focused:
        return (
          <SVGImage.Dashboard_Focused
            height={height}
            width={width}
            fill={fill}
          />
        );
      case IconName.Services_Focused:
        return (
          <SVGImage.Services_Focused
            height={height}
            width={width}
            fill={fill}
          />
        );
      case IconName.Meetings:
        return <SVGImage.Meetings height={height} width={width} fill={fill} />;
      case IconName.Appointments:
        return (
          <SVGImage.Appointments height={height} width={width} fill={fill} />
        );
      case IconName.Tasks:
        return <SVGImage.Tasks height={height} width={width} fill={fill} />;
      case IconName.Video_Conferences:
        return (
          <SVGImage.Video_Conferences
            height={height}
            width={width}
            fill={fill}
          />
        );
      case IconName.Subjects:
        return <SVGImage.Subjects height={height} width={width} fill={fill} />;
      case IconName.Delegation:
        return (
          <SVGImage.Delegation height={height} width={width} fill={fill} />
        );
      case IconName.Statistics:
        return (
          <SVGImage.Statistics height={height} width={width} fill={fill} />
        );
      case IconName.Arrow_Right:
        return (
          <SVGImage.Arrow_Right height={height} width={width} fill={fill} />
        );
      case IconName.Meetings_Dashboard:
        return (
          <SVGImage.Meetings_Dashboard
            height={height}
            width={width}
            fill={fill}
          />
        );
      case IconName.Add_White:
        return <SVGImage.Add_White height={height} width={width} fill={fill} />;
      case IconName.Dots:
        return <SVGImage.Dots height={height} width={width} fill={fill} />;
      case IconName.Arrow_Left:
        return (
          <SVGImage.Arrow_Left height={height} width={width} fill={fill} />
        );
      case IconName.Download:
        return <SVGImage.Download height={height} width={width} fill={fill} />;
      case IconName.Plus:
        return <SVGImage.Plus height={height} width={width} fill={fill} />;
      case IconName.Minus:
        return <SVGImage.Minus height={height} width={width} fill={fill} />;
      case IconName.Search:
        return <SVGImage.Search height={height} width={width} fill={fill} />;
      case IconName.Arrow_Down:
        return (
          <SVGImage.Arrow_Down height={height} width={width} fill={fill} />
        );
      case IconName.Send:
        return <SVGImage.Send height={height} width={width} fill={fill} />;
      case IconName.Edit:
        return <SVGImage.Edit height={height} width={width} fill={fill} />;
      case IconName.Delete:
        return <SVGImage.Delete height={height} width={width} fill={fill} />;
      case IconName.Eye_Primary:
        return (
          <SVGImage.Eye_Primary height={height} width={width} fill={fill} />
        );
      case IconName.Speaker:
        return <SVGImage.Speaker height={height} width={width} fill={fill} />;
      case IconName.Download_Primary:
        return (
          <SVGImage.Download_Primary
            height={height}
            width={width}
            fill={fill}
          />
        );
      case IconName.CopyText:
        return <SVGImage.CopyText height={height} width={width} fill={fill} />;
      case IconName.Arrow_Right_Black:
        return (
          <SVGImage.Arrow_Right_Black
            height={height}
            width={width}
            fill={fill}
          />
        );

      default:
        return null;
    }
  }, [name, height, width, fill]);
  return svg;
};

export default Icon;
