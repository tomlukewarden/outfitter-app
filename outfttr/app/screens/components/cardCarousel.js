import React from "react";
import { View, FlatList, Text, StyleSheet, Dimensions } from "react-native";

const Carousel = ({ data }) => {
    return (
        <View style={styles.container}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.id}
                horizontal={true} // Enables horizontal scrolling
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        width: Dimensions.get('window').width * 0.7, // Make it responsive
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Carousel;
