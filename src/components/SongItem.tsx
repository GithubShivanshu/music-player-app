import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { NormalizedSong } from '../types';

interface SongItemProps {
    song: NormalizedSong;
    onPress: (song: NormalizedSong) => void;
    onAddToQueue?: (song: NormalizedSong) => void;
    isPlaying?: boolean;
}

export default function SongItem({
    song,
    onPress,
    onAddToQueue,
    isPlaying,
}: SongItemProps) {
    return (
        <TouchableOpacity
            style={[styles.container, isPlaying && styles.activeContainer]}
            onPress={() => onPress(song)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: song.imageUrl }}
                style={styles.artwork}
                defaultSource={require('../../assets/icon.png')}
            />
            <View style={styles.info}>
                <Text
                    style={[styles.name, isPlaying && styles.activeName]}
                    numberOfLines={1}
                >
                    {song.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {song.artist}
                </Text>
            </View>
            {onAddToQueue && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => onAddToQueue(song)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
        </TouchableOpacity>
    );
}

function formatDuration(seconds: number): string {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    activeContainer: {
        backgroundColor: 'rgba(29, 185, 84, 0.1)',
    },
    artwork: {
        width: 50,
        height: 50,
        borderRadius: 6,
        backgroundColor: '#282828',
    },
    info: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    activeName: {
        color: '#1DB954',
    },
    artist: {
        color: '#B3B3B3',
        fontSize: 13,
        marginTop: 2,
    },
    addButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#B3B3B3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    addButtonText: {
        color: '#B3B3B3',
        fontSize: 18,
        fontWeight: '300',
        lineHeight: 20,
    },
    duration: {
        color: '#B3B3B3',
        fontSize: 12,
        minWidth: 36,
        textAlign: 'right',
    },
});
