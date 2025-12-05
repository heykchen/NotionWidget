import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Modal() {

  const [NotionKey, setNotionKey] = useState(process.env.EXPO_PUBLIC_NOTION_API_KEY || '');
  const [NotionId, setNotionId] = useState(process.env.EXPO_PUBLIC_NOTION_DATABASE_KEY || '');
  const [Status, setStatus] = useState('Status');
  const [Date, setDate] = useState('Date');
  const [Title, setTitle] = useState('Name');

  useEffect(() => {
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedData = await AsyncStorage.getItem('NDATA');
      if (storedData) {
        const {NotionKey, NotionId, Status, Date, Title } = JSON.parse(storedData);
        // Pre-fill the inputs
        setNotionId(NotionId || '');
        setNotionKey(NotionKey || '');
        setStatus(Status || '');
        setDate(Date || '');
        setTitle(Title || '');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load stored credentials.');
    }
  };


  const saveData = async () => {
    // 1. Validate
    console.log('Saving data:', {NotionKey, NotionId, Status, Date, Title });
    try {
      // 2. Package
      const NDATA = {
        NotionKey: NotionKey,
        NotionId: NotionId,
        Status: Status,
        Date: Date,
        Title: Title,
      };

      // 3. Save (The Writer)
      // We use 'my_app_credentials' as the specific filename
      await AsyncStorage.setItem('NDATA', JSON.stringify(NDATA));

      Alert.alert('Saved', 'Your credentials are secure.');
    } catch (e) {
      Alert.alert('Error', 'Could not save data.');
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Notion API Key</Text>
      <TextInput
        onChangeText={setNotionKey}
        placeholder="Notion API Key"
        value={NotionKey}
        style={styles.input}
      />
      <Text>NotionId</Text>
      <TextInput
        onChangeText={setNotionId}
        placeholder="Notion Database ID"
        value={NotionId}
        style={styles.input}
      />
      <Text>Status</Text>
      <TextInput
        onChangeText={setStatus}
        placeholder="Status name"
        value={Status}
        style={styles.input}
      />
      <Text>Date</Text>
      <TextInput
        onChangeText={setDate}
        placeholder="Date name"
        value={Date}
        style={styles.input}
      />
      <Text>Title</Text>
      <TextInput
        onChangeText={setTitle}
        placeholder="Title name"
        value={Title}
        style={styles.input}
      />


      <TouchableOpacity onPress={saveData} style={styles.button}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
});
