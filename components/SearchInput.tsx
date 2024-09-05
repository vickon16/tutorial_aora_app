import { colors, icons } from "@/constants";
import { router, usePathname } from "expo-router";
import React from "react";
import {
  Alert,
  GestureResponderEvent,
  Image,
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  initialQuery?: string;
};

const SearchInput = ({ initialQuery }: Props) => {
  const pathname = usePathname();
  const [query, setQuery] = React.useState(initialQuery ?? "");

  return (
    <View className="border-2 border-black-200 w-full h-14 px-4 bg-black-100 rounded-xl focus:border-secondary flex-row items-center space-x-4">
      <TextInput
        value={query}
        className="text-base text-white flex-1 font-pregular"
        onChangeText={(e) => setQuery(e)}
        placeholder="Search for video topics"
        placeholderTextColor={colors.gray.placeholder}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (!query) {
            return Alert.alert("Error", "Please enter a search query");
          }
          if (!pathname.startsWith("/search")) {
            router.push(`/search/${query}`);
          }

          router.setParams({ query });
          setQuery("");
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
