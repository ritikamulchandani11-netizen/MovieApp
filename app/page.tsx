'use client';

import React, { useState, useEffect } from 'react';
import { MovieSection } from '@/components/movie-section';
import { tmdbClient } from '@/lib/tmdb';
import { Play, Star, TrendingUp, Clock, Award, Sparkles } from 'lucide-react';

const HeroGradient = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-neutral-900/20 pointer-events-none" />
);

const AnimatedStats = ({ number, label, icon: Icon }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const increment = number / 20;
            const counter = setInterval(() => {
                setCount((prev) => {
                    if (prev >= number) {
                        clearInterval(counter);
                        return number;
                    }
                    return Math.min(prev + increment, number);
                });
            }, 50);
            return () => clearInterval(counter);
        }, 200);

        return () => clearTimeout(timer);
    }, [number]);

    return (
        <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-600/20 rounded-full flex items-center justify-center border border-amber-600/30">
                <Icon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                    {Math.floor(count).toLocaleString()}+
                </div>
                <div className="text-sm text-neutral-400">{label}</div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="group relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-amber-600/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600/30 transition-colors">
                <Icon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);

export default function HomePage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const heroParallax = scrollY * 0.3;

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <HeroGradient />

                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                        style={{ transform: `translateY(${heroParallax}px)` }}
                    />
                    <div
                        className="absolute top-3/4 right-1/3 w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-1000"
                        style={{ transform: `translateY(${-heroParallax}px)` }}
                    />
                    <div
                        className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-500/50 rounded-full animate-pulse delay-500"
                        style={{
                            transform: `translateY(${heroParallax * 0.5}px)`,
                        }}
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                        {/* Main heading with gradient text */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-2 mb-4">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-medium text-amber-300">
                                    Now Streaming
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                    Discover
                                </span>
                                <br />
                                <span className="text-white">
                                    Amazing Movies
                                </span>
                            </h1>
                        </div>

                        <p className="text-lg sm:text-xl lg:text-2xl text-neutral-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                            Explore the latest blockbusters, timeless classics,
                            and hidden cinematic gems from around the world.
                            Your next favorite film awaits.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
                            <button className="group relative bg-amber-600 hover:bg-amber-500 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-600/25 w-full sm:w-auto">
                                <span className="flex items-center justify-center space-x-2">
                                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>Start Exploring</span>
                                </span>
                            </button>

                            <button className="group bg-transparent border-2 border-neutral-700 hover:border-amber-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-amber-600/10 w-full sm:w-auto">
                                <span className="flex items-center justify-center space-x-2">
                                    <Star className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                                    <span>View Top Rated</span>
                                </span>
                            </button>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 pt-12 sm:pt-16">
                            <AnimatedStats
                                number={50000}
                                label="Movies"
                                icon={Play}
                            />
                            <AnimatedStats
                                number={15000}
                                label="Reviews"
                                icon={Star}
                            />
                            <AnimatedStats
                                number={2500}
                                label="New This Month"
                                icon={TrendingUp}
                            />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
                    <div className="w-6 h-10 border-2 border-amber-600/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-transparent to-neutral-950/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Why Choose{' '}
                            <span className="text-amber-400">
                                MovieExplorer
                            </span>
                        </h2>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                            Experience cinema like never before with our curated
                            collections and smart recommendations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <FeatureCard
                            icon={TrendingUp}
                            title="Trending Now"
                            description="Stay updated with the latest trending movies and what everyone's talking about in real-time."
                        />
                        <FeatureCard
                            icon={Award}
                            title="Award Winners"
                            description="Discover critically acclaimed films and award-winning performances from prestigious film festivals."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Fresh Releases"
                            description="Be the first to know about new releases and upcoming premieres before anyone else."
                        />
                    </div>
                </div>
            </section>

            {/* Movie Sections */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 lg:space-y-24">
                    <MovieSection
                        title="Popular Movies"
                        fetchMovies={(page) =>
                            tmdbClient.getPopularMovies(page)
                        }
                        icon={TrendingUp}
                        description="The most watched movies right now"
                    />

                    <MovieSection
                        title="Now Playing"
                        fetchMovies={(page) =>
                            tmdbClient.getNowPlayingMovies(page)
                        }
                        icon={Play}
                        description="Currently in theaters"
                    />

                    <MovieSection
                        title="Top Rated"
                        fetchMovies={(page) =>
                            tmdbClient.getTopRatedMovies(page)
                        }
                        icon={Star}
                        description="Highest rated by critics and audiences"
                    />
                </div>
            </section>
        </div>
    );
}
