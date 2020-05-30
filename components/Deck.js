import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    PanResponder,
    Animated,
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native';

import Screen from './Screen';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({ data, renderCard, onSwipeLeft, onSwipeRight, renderNoMoreCards }) => {

    // This is for slight animation of cards once
    // the top card is swiped
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();

    const position = new Animated.ValueXY();
    const [index, setIndex] = useState(0);
    const [newData, setNewData] = useState(data);
    useEffect(() => {
        if (newData !== data) {
            setNewData(data);
            setIndex(0);
        }
    }, [data])

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    const onSwipeComplete = (direction) => {
        const item = data[index];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        position.setValue({ x: 0, y: 0 });
        setIndex(index + 1);
    }

    const forceSwipe = (direction) => {
        const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
        // Linear feeling with Animated.timing()
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION // ms
        }).start(() => onSwipeComplete(direction));
    }

    const panResponder = new PanResponder.create({
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
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                forceSwipe('right');
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                forceSwipe('left');
            } else {
                resetPosition();
            }
        }
    })


    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-100deg', '0deg', '100deg']
        })
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    const renderCards = () => {
        if (index >= data.length) {
            return renderNoMoreCards();
        }

        return data.map((item, i) => {
            if (i < index) {
                return null;
            }
            if (i === index) {
                return (
                    <Animated.View
                        key={item.id}
                        style={[getCardStyle(), styles.cardStyle]}
                        {...panResponder.panHandlers}
                    >
                        {renderCard(item)}
                    </Animated.View>
                );
            }
            return (
                <Animated.View
                    key={item.id}
                    style={[styles.cardStyle, { top: 10 * (i - index) }]}
                >
                    {renderCard(item)}
                </Animated.View>
            )
        }).reverse();
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
    cardStyle: {
        position: 'absolute',
        width: '100%'
    }
});

Deck.defaultProps = {
    onSwipeLeft: () => { },
    onSwipeRight: () => { }
}

export default Deck;