import React, { useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { seekTo } from '../services/audioService';
import PlayerControls from '../components/PlayerControls';

export default function PlayerScreen() {
    const navigation = useNavigation();

    const currentSong = usePlayerStore((s) => s.currentSong);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const position = usePlayerStore((s) => s.position);
    const duration = usePlayerStore((s) => s.duration);
    const currentIndex = usePlayerStore((s) => s.currentIndex);
    const queueLength = usePlayerStore((s) => s.queue.length);
    const pause = usePlayerStore((s) => s.pause);
    const resume = usePlayerStore((s) => s.resume);
    const next = usePlayerStore((s) => s.next);
    const previous = usePlayerStore((s) => s.previous);

    const handlePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }, [isPlaying, pause, resume]);

    const handleSeek = useCallback((value: number) => {
        seekTo(value);
    }, []);

    if (!currentSong) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No song selected</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backLink}>← Go back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>↓</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Now Playing
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Artwork */}
            <View style={styles.artworkContainer}>
                <Image
                    source={{ uri: currentSong.imageUrl }}
                    style={styles.artwork}
                    defaultSource={require('../../assets/icon.png')}
                />
            </View>

            {/* Song Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.songName} numberOfLines={1}>
                    {currentSong.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {currentSong.artist}
                </Text>
                <Text style={styles.album} numberOfLines={1}>
                    {currentSong.album}
                </Text>
            </View>

            {/* Seek Bar */}
            <View style={styles.seekContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration || 1}
                    value={position}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#1DB954"
                    maximumTrackTintColor="#555"
                    thumbTintColor="#1DB954"
                />
                <View style={styles.timeRow}>
                    <Text style={styles.time}>{formatTime(position)}</Text>
                    <Text style={styles.time}>{formatTime(duration)}</Text>
                </View>
            </View>

            {/* Controls */}
            <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={next}
                onPrevious={previous}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < queueLength - 1}
            />

            {/* Queue info */}
            <Text style={styles.queueInfo}>
                {currentIndex + 1} / {queueLength} in queue
            </Text>
        </SafeAreaView>
    );
}

function formatTime(ms: number): string {
    if (!ms || ms < 0) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#B3B3B3',
        fontSize: 16,
        marginBottom: 16,
    },
    backLink: {
        color: '#1DB954',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        color: '#FFFFFF',
        fontSize: 24,
        padding: 4,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    headerSpacer: {
        width: 32,
    },
    artworkContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 20,
    },
    artwork: {
        width: 280,
        height: 280,
        borderRadius: 12,
        backgroundColor: '#282828',
    },
    infoContainer: {
        paddingHorizontal: 32,
        paddingTop: 28,
        alignItems: 'center',
    },
    songName: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    artist: {
        color: '#B3B3B3',
        fontSize: 16,
        marginTop: 6,
        textAlign: 'center',
    },
    album: {
        color: '#888',
        fontSize: 13,
        marginTop: 4,
        textAlign: 'center',
    },
    seekContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginTop: -4,
    },
    time: {
        color: '#B3B3B3',
        fontSize: 12,
    },
    queueInfo: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 12,
    },
});
