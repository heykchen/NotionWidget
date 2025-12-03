import { StyleSheet, Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';


export default function Modal() {
  const [NotionID, setNotionID] = useState('');
  const [Status, setStatus] = useState('');
  const [Date, setDate] = useState('');
  const [Title, setTitle] = useState('');

  // 2. The function that runs when you click Save
  const saveData = async () => {
    // "my-key" is the label we give this data so we can find it later
    await AsyncStorage.setItem('my-key', text);
    Alert.alert('Saved!');
  };
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginTop: 20, paddingHorizontal: 10 }}
            onChangeText={onChangeText}
            placeholder="Notion Database ID"
            value={NotionID}
        />
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginTop: 20, paddingHorizontal: 10 }}
            onChangeText={onChangeText}
            placeholder="Status name"
            value={Status}
        />
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginTop: 20, paddingHorizontal: 10 }}
            onChangeText={}
            placeholder="Date name"
            value={Date}
        />
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 200, marginTop: 20, paddingHorizontal: 10 }}
            onChangeText={onChangeText}
            placeholder="Title name"
            value={Title}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
