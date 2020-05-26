import React from 'react';
import { StyleSheet, View } from 'react-native';

import Screen from './Screen';

const Deck = ({ data, renderCard }) => {
    const renderCards = () => {
        return data.map((item) => {
            return renderCard(item);
        })
    }

    return (
        <Screen style={styles.container}>
            <View>
                {renderCards()}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
});

export default Deck;