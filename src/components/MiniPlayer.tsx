import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePlayerStore } from '../store/playerStore';

// Placeholder MiniPlayer — will be fully built in Phase 4
export default function MiniPlayer() {
    const currentSong = usePlayerStore((s) => s.currentSong);

    if (!currentSong) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.songName} numberOfLines={1}>
                {currentSong.name}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
                {currentSong.artist}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#282828',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#383838',
    },
    songName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    artist: {
        color: '#B3B3B3',
        fontSize: 12,
        marginTop: 2,
    },
});
