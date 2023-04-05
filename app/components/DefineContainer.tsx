import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type ItemData = {
  id: string;
  word: string;
};

const DATA: ItemData[] = [
  {
    id: "0",
    word: "First Item",
  },
  {
    id: "1",
    word: "Second Item",
  },
  {
    id: "2",
    word: "pneumonoultramicroscopicsilicovolcanoconiosis",
  },
  {
    id: "3",
    word: "Forth Item",
  },
  {
    id: "4",
    word: "Fifth Item",
  },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[{ backgroundColor }]}
    className="p-1 my-1 mx-2"
  >
    <Text style={[{ color: textColor }]} className="text-base">
      {item.word}
    </Text>
  </TouchableOpacity>
);

const DefineContainer = () => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaView
      className="border-black border-2"
      style={styles.wordsContainer}
    >
      <FlatList
        data={DATA}
        numColumns={4}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wordsContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    flexWrap: "wrap",
  },
});

export default DefineContainer;
