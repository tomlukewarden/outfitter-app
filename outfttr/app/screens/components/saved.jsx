import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "expo-router";
import {
  View, Text, StyleSheet, Alert, Image, Modal, Pressable, ScrollView
} from "react-native";
import { Calendar } from "react-native-calendars";
import { getSavedOutfits } from "../utility/storage";
import { ThemeContext } from "../utility/themeContext";


const Saved = () => {
  const router = useRouter();
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { themeColors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchSavedOutfits = async () => {
      try {
        const storedOutfits = await getSavedOutfits();
        setSavedOutfits(storedOutfits || []);
      } catch (error) {
        console.error("Error fetching saved outfits:", error);
      }
    };
    fetchSavedOutfits();
  }, []);

  const getMarkedDates = () => {
    const markedDates = {};
    savedOutfits.forEach(outfit => {
      const date = outfit.date.split("T")[0];
      markedDates[date] = {
        marked: true,
        dotColor: themeColors.primary,
        activeOpacity: 0.8,
      };
    });
    return markedDates;
  };

  const handleDayPress = (day) => {
    const date = day.dateString;
    const outfitsForDate = savedOutfits.filter(outfit => outfit.date.startsWith(date));

    if (outfitsForDate.length === 0) {
      Alert.alert("No Outfit Found", `No outfit was saved on ${date}`);
      setSelectedOutfit(null);
      setModalVisible(false);
    } else {
      setSelectedOutfit(outfitsForDate[0]);
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Image source={require('../assets/back.png')} style={styles.icon} />
      </Pressable>

      <View style={styles.calContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>Saved Outfits Calendar</Text>
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
          style={styles.calendar}
          theme={{
            todayTextColor: themeColors.primary,
            arrowColor: themeColors.primary,
            textDayFontFamily: "Arial",
            textMonthFontFamily: "Arial",
            textDayHeaderFontFamily: "Arial",
            textMonthFontWeight: "bold",
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
            textDayFontSize: 16,
            textDayFontWeight: "bold",
          }}
        />
      </View>

      {/* Modal for Showing Outfit */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>Outfit for Selected Date</Text>

            {selectedOutfit && (
              <ScrollView contentContainerStyle={styles.outfitContainer}>
                {renderOutfitItem("", selectedOutfit.headwear)}
                {renderOutfitItem("", selectedOutfit.top)}
                {renderOutfitItem("", selectedOutfit.bottom)}
                {renderOutfitItem("", selectedOutfit.shoes)}
              </ScrollView>
            )}

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const renderOutfitItem = (label, item) => {
  if (!item) return null;
  return (
    <View style={styles.outfitItem}>
      <Text style={styles.outfitLabel}>{label}</Text>
      <Image source={{ uri: item.imageUri }} style={styles.outfitImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: "80%", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  outfitContainer: { alignItems: "center" },
  outfitItem: { alignItems: "center", marginBottom: 15 },
  outfitLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  outfitImage: { width: 100, height: 100, borderRadius: 10 },
  closeButton: { marginTop: 20, backgroundColor: "#ff5c5c", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
calContainer: {
  width: "100%",
  padding: 15,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: "#d1d1d1",
  backgroundColor: "#f9f9f9",
  marginVertical: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
  calendar: { width: "100%" },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  icon: { width: 24, height: 24 },
});

export default Saved;
