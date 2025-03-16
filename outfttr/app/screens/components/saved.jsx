import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars"; 
import { getWardrobe } from "../utility/storage";
import { ThemeContext } from "../utility/themeContext"; 
const Saved = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const { themeColors } = useContext(ThemeContext); 

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const storedWardrobe = await getWardrobe();
        setWardrobe(storedWardrobe || []);
      } catch (error) {
        console.error("Error fetching wardrobe:", error);
      }
    };
    fetchWardrobe();
  }, []);

  const getMarkedDates = () => {
    const markedDates = {};
    wardrobe.forEach(item => {
      const date = item.date;
      markedDates[date] = {
        marked: true,
        dotColor: themeColors.primary, 
        activeOpacity: 0.8,
      };
    });
    return markedDates;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Saved Outfits Calendar</Text>

      {/* Calendar Component */}
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        markedDates={getMarkedDates()}
        onDayPress={(day) => {
          Alert.alert(`You clicked on ${day.dateString}`); 
        }}
        theme={{
          todayTextColor: themeColors.primary,
          arrowColor: themeColors.primary,
          textDayFontFamily: "Arial",
          textMonthFontFamily: "Arial",
          textDayHeaderFontFamily: "Arial",
          textMonthFontWeight: "bold",
          textMonthFontSize: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default Saved;
