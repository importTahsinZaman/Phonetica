import { Text } from "react-native";

const CustomText = ({ style = {}, ...props }) => {
  const textStyles = {
    fontFamily: "SpaceGrotesk_400Regular",
  };
  return <Text {...props} style={[textStyles, style]} />;
};

export default CustomText;
