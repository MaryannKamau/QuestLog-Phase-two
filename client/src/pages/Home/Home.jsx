import React, { useState, useEffect } from 'react';
import GameCard from '../../components/GameCard/GameCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchResults from '../../components/SearchResults/SearchResults'; // Uses your exact component
import { getGames, searchGames } from '../../services/rawgApi';
import '../../components/SearchBar/SearchBar.css';
import '../../components/SearchResults/SearchResults.css';

const Home = () => {
    // 1. Trending Content State
    const [trendingGames, setTrendingGames] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);
    const [trendingError, setTrendingError] = useState(null);

    // 2. Search Content State (Matches the exact props your SearchResults needs)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchGamesList, setSearchGamesList] = useState([]);
    const [searchStatus, setSearchStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [searchError, setSearchError] = useState('');

    // Fetch default trending games on boot
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setTrendingLoading(true);
                const data = await getGames();
                setTrendingGames(data.results || []);
            } catch (err) {
                setTrendingError(err.message);
            } finally {
                setTrendingLoading(false);
            }
        };
        fetchTrending();
    }, []);

    // Fetch search queries automatically when text is submitted
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchStatus('idle');
            setSearchGamesList([]);
            return;
        }

        const fetchSearch = async () => {
            try {
                setSearchStatus('loading');
                setSearchError('');
                const data = await searchGames(searchQuery);
                setSearchGamesList(data.results || []);
                setSearchStatus('success');
            } catch (err) {
                setSearchError('Failed to fetch search records.');
                setSearchStatus('error');
            }
        };

        fetchSearch();
    }, [searchQuery]);

    const handleSearchSubmit = (query) => {
        setSearchQuery(query);
    };

    return (
        <div className="home-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            
            {/* Header Hero Banner */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Track Your Next Adventure</h1>
                    <p>Discover trending titles, track your backlog, and manage your ultimate library.</p>
                    <button 
                        className="hero-cta-btn"
                        onClick={() => document.getElementById('search-anchor')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Explore Games
                    </button>
                </div>
            </header>

            {/* Search Input Box */}
            <div id="search-anchor" style={{ margin: '40px 0 20px 0', width: '100%' }}>
                <SearchBar onSearch={handleSearchSubmit} />
            </div>

            {/* DYNAMIC LAYOUT AREA */}
            {searchQuery ? (
                // Condition A: Pass exact required props directly into your custom SearchResults component
                <div className="search-results-section" style={{ marginTop: '20px', width: '100%' }}>
                    <SearchResults 
                        games={searchGamesList} 
                        query={searchQuery} 
                        status={searchStatus} 
                        error={searchError} 
                    />
                </div>
            ) : (
                // Condition B: Fallback defaults display trending items automatically
                <section className="trending-games-section" style={{ marginTop: '40px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--accent-purple, #8b5cf6)' }}>
                        Trending Games
                    </h2>

                    {trendingLoading && <p className="loading-text">Loading awesome games...</p>}
                    {trendingError && <p className="error-text">Oops! {trendingError}</p>}
                    
                    {!trendingLoading && !trendingError && (
                        <div className="games-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                            {trendingGames.map((singleGame) => (
                                <GameCard key={singleGame.id} game={singleGame} />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Home;
