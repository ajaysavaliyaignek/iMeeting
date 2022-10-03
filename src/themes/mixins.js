import { Dimensions, PixelRatio, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth_iOS = 375;
const guidelineBaseWidth_Android = 360;

const shortDimension = width < height ? width : height;

const maxScaleFactor = DeviceInfo.isTablet()
  ? 1.6
  : Platform.OS === "ios"
  ? 1.3
  : 1.05;
let scaleFactor =
  Platform.OS === "ios"
    ? shortDimension / guidelineBaseWidth_iOS
    : shortDimension / guidelineBaseWidth_Android;
scaleFactor = scaleFactor > maxScaleFactor ? maxScaleFactor : scaleFactor;

export default function Normalize(size) {
  return PixelRatio.roundToNearestPixel(size * scaleFactor);
}
