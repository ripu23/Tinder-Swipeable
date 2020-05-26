import React, { useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const Ball = () => {
    const position = new Animated.ValueXY(0, 0);

    useEffect(() => {
        Animated.spring(position, {
            toValue: { x: 200, y: 500 }
        }).start()
    })

    return (
        <Animated.View style={position.getLayout()}>
            <View style={styles.container} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'tomato'
    }
});

export default Ball;