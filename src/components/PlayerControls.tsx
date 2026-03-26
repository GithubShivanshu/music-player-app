import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PlayerControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

export default function PlayerControls({
    isPlaying,
    onPlayPause,
    onNext,
    onPrevious,
    hasPrevious,
    hasNext,
}: PlayerControlsProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPrevious}
                disabled={!hasPrevious}
                style={[styles.sideButton, !hasPrevious && styles.disabled]}
            >
                <Text style={[styles.sideIcon, !hasPrevious && styles.disabledText]}>⏮</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onNext}
                disabled={!hasNext}
                style={[styles.sideButton, !hasNext && styles.disabled]}
            >
                <Text style={[styles.sideIcon, !hasNext && styles.disabledText]}>⏭</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    sideButton: {
        padding: 16,
    },
    sideIcon: {
        fontSize: 28,
        color: '#FFFFFF',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1DB954',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
    },
    playIcon: {
        fontSize: 28,
        color: '#FFFFFF',
    },
    disabled: {
        opacity: 0.3,
    },
    disabledText: {
        color: '#666',
    },
});
