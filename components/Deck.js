import React, { useRef } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';

import Screen from './Screen';

const Deck = ({ data, renderCard }) => {

    const position = new Animated.ValueXY();

    const panResponder = useRef(
        PanResponder.create({
            // when user press on the screen. If
            // we want panresponder to be respon
            // -sible for the gesture, if not false
            // in short, when user clicks
            onStartShouldSetPanResponder: (event, gesture) => true,
            // when user drags with the finger
            // in short, when the user moves the card
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            // when touch ends
            onPanResponderRelease: (event, gesture) => { }
        })
    ).current

    const renderCards = () => {
        return data.map((item) => {
            return renderCard(item);
        })
    }

    return (
        <Screen style={styles.container}>
            <Animated.View
                style={position.getLayout()}
                {...panResponder.panHandlers}
            >
                {renderCards()}
            </Animated.View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
});

export default Deck;