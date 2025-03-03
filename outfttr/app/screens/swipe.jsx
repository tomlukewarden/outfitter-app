import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import Carousel from "./components/cardCarousel";

const data = [
    { id: "1", title: "Outfit 1" },
    { id: "2", title: "Outfit 2" },
    { id: "3", title: "Outfit 3" },
    { id: "4", title: "Outfit 4" },
];

export default function Swipe() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pick Today's Outfit</Text>
            <SafeAreaView>
                <Carousel data={data} />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});

