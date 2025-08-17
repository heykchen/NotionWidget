import { StyleSheet, Text, View } from "react-native";
import { WidgetPreview } from 'react-native-android-widget';

import  TaskWidget from './widget';

function HelloWidgetPreviewScreen() {
  return (
    <View style={styles.container}>
      <WidgetPreview
        renderWidget={() => <TaskWidget />}
        width={320}
        height={200}
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


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontFamily: "HelloHeadlineW00Regular"}}>Biscuits!</Text>
      <HelloWidgetPreviewScreen />
    </View>
  );
}
try {require('../services/api')} catch (e) {
  console.error("Error loading API service:", e);
}
