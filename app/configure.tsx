import { StyleSheet, Text, TextInput, Alert, KeyboardAvoidingView, TouchableHighlight } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleCheck } from '@/services/api';

export default function Configure() {

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
      let NDATA = {
        NotionKey: NotionKey,
        NotionId: NotionId,
        Status: Status,
        Date: Date,
        Title: Title,
        Options: [] as string[],
      };
      NDATA.Options = await handleCheck(NDATA);

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
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <TouchableHighlight onPress={() => Alert.alert('Help', 'NOTION API Key from your integration, Notion database ID from your databasse link, Status/Date/Title name from property name')} style={[styles.button, {margin:30, alignSelf: 'flex-end'}]}>
        <Text style={[styles.text, {color: '#fff'}]}>?</Text>
      </TouchableHighlight>


      <Text style={styles.text}>Notion API Key</Text>
      <TextInput
        onChangeText={setNotionKey}
        placeholder="Notion API Key"
        value={NotionKey}
        style={styles.input}
      />
      <Text style={styles.text}>NotionId</Text>
      <TextInput
        onChangeText={setNotionId}
        placeholder="Notion Database ID"
        value={NotionId}
        style={styles.input}
      />
      <Text style={styles.text}>Status</Text>
      <TextInput
        onChangeText={setStatus}
        placeholder="Status name"
        value={Status}
        style={styles.input}
      />
      <Text style={styles.text}>Date</Text>
      <TextInput
        onChangeText={setDate}
        placeholder="Date name"
        value={Date}
        style={styles.input}
      />
      <Text style={styles.text}>Title</Text>
      <TextInput
        onChangeText={setTitle}
        placeholder="Title name"
        value={Title}
        style={styles.input}
      />


      <TouchableHighlight onPress={saveData} style={styles.button}>
        <Text style={[styles.text, {color: '#fff'}]}>Save</Text>
      </TouchableHighlight>
    </KeyboardAvoidingView>
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
    backgroundColor: '#4a3a99',
    borderRadius: 20  
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
    borderRadius:10
    
  },
  text: {
    fontFamily: 'HelloHeadlineW00Regular',
  }
});
