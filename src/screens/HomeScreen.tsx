import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { searchSongs, getTrendingSongs } from '../services/api';
import { usePlayerStore } from '../store/playerStore';
import { NormalizedSong, RootStackParamList } from '../types';
import SongItem from '../components/SongItem';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeNav>();

    const [songs, setSongs] = useState<NormalizedSong[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentSong = usePlayerStore((s) => s.currentSong);
    const playSong = usePlayerStore((s) => s.playSong);
    const addToQueue = usePlayerStore((s) => s.addToQueue);
    const setQueue = usePlayerStore((s) => s.setQueue);

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load initial trending songs
    useEffect(() => {
        loadSongs('trending', 1, false);
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            const query = searchQuery.trim() || 'trending';
            setSongs([]);
            setPage(1);
            setHasMore(true);
            loadSongs(query, 1, false);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const loadSongs = async (
        query: string,
        pageNum: number,
        append: boolean
    ) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const result = await searchSongs(query, pageNum, 20);
            setSongs((prev) => (append ? [...prev, ...result.songs] : result.songs));
            setHasMore(result.hasMore);
            setPage(pageNum);
        } catch (err) {
            setError('Failed to load songs. Please try again.');
            console.error('Load songs error:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingMore || loading) return;
        const query = searchQuery.trim() || 'trending';
        loadSongs(query, page + 1, true);
    }, [hasMore, loadingMore, loading, searchQuery, page]);

    const handleSongPress = useCallback(
        (song: NormalizedSong) => {
            // Set the entire current list as queue, starting from tapped song
            const index = songs.findIndex((s) => s.id === song.id);
            setQueue(songs, index >= 0 ? index : 0);
            navigation.navigate('Player');
        },
        [songs, navigation, setQueue]
    );

    const handleAddToQueue = useCallback(
        (song: NormalizedSong) => {
            addToQueue(song);
        },
        [addToQueue]
    );

    const renderSongItem = useCallback(
        ({ item }: { item: NormalizedSong }) => (
            <SongItem
                song={item}
                onPress={handleSongPress}
                onAddToQueue={handleAddToQueue}
                isPlaying={currentSong?.id === item.id}
            />
        ),
        [handleSongPress, handleAddToQueue, currentSong?.id]
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#1DB954" />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {error || 'No songs found. Try a different search.'}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🎵 Music Player</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search songs..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <Text
                        style={styles.clearButton}
                        onPress={() => setSearchQuery('')}
                    >
                        ✕
                    </Text>
                )}
            </View>

            {/* Song List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1DB954" />
                    <Text style={styles.loadingText}>Loading songs...</Text>
                </View>
            ) : (
                <FlatList
                    data={songs}
                    keyExtractor={(item, index) => item.id + "_" + index}
                    renderItem={renderSongItem}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={songs.length === 0 ? styles.emptyList : undefined}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#282828',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        height: 42,
        color: '#FFFFFF',
        fontSize: 15,
    },
    clearButton: {
        color: '#888',
        fontSize: 16,
        paddingLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#B3B3B3',
        fontSize: 14,
        marginTop: 12,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        color: '#B3B3B3',
        fontSize: 15,
        textAlign: 'center',
    },
    emptyList: {
        flexGrow: 1,
    },
});
