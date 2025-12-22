import { StyleSheet, Text, View, TouchableHighlight} from "react-native";
import { Link } from 'expo-router';


const styles = StyleSheet.create({
  container: {
      backgroundColor: '#fff',
          borderRadius: 20,
          padding: 20,
          margin: 10,
        
          alignItems: 'center',
  },
});


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#cacaf9',
      }}
    >
      <View style={styles.container}>
      <Text style={{fontFamily: "HelloHeadlineW00Regular", fontSize: 25, textAlign: 'center',color: '#453c71ff' }}>Notion widget for Android</Text>
      <Text style={{ textAlign: 'center',color: '#453c71ff' }}>A simple app that contains a widget for you to display custom Notion databases straight on your homescreen! Add items, change status, and stay organized with ease.</Text>
      </View>
      <Link href="/configure" asChild>
      <TouchableHighlight style={{backgroundColor: '#4a3a99', borderRadius: 20, padding: 10}} onPress={() => { }} >  
        <Text style={{fontFamily: "HelloHeadlineW00Regular", color: '#fff'}}>Configure!</Text>
      </TouchableHighlight>
      </Link>
      

    </View>
  );
}
try {require('../services/api')} catch (e) {
  console.error("Error loading API service:", e);
}
