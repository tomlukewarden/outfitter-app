
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native";
import CardCarousel from "./components/carousel";



export default function Swipe() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick Today's Outfit</Text>
      <SafeAreaView style={{ flex: 1 }}>
    <CardCarousel />
  </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20, 
  },
  item: {
    width: 250,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

