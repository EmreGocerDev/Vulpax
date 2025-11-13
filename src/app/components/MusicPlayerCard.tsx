'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';

interface Music {
  id: string;
  title: string;
  artist: string;
  file_url: string;
  duration: number | null;
  cover_image: string | null;
  genre: string | null;
  play_count: number;
}

interface MusicPlayerCardProps {
  music: Music;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export default function MusicPlayerCard({ music, isPlaying, onPlay, onPause }: MusicPlayerCardProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(music.file_url);
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      onPause();
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [music.file_url, onPause]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Müzik çalma hatası:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = music.file_url;
    link.download = `${music.artist} - ${music.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group overflow-hidden">
      {/* Cover Image */}
      <div className="relative w-full aspect-square bg-linear-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center overflow-hidden">
        {music.cover_image ? (
          <img src={music.cover_image} alt={music.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <svg className="w-20 h-20 text-white/20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        )}
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" fill="white" />
            )}
          </button>
        </div>
      </div>

      {/* Music Info */}
      <div className="p-4 mb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate mb-1 group-hover:text-purple-400 transition-colors">{music.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{music.artist}</p>
          </div>
          <button
            onClick={handleDownload}
            className="shrink-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40"
            title="İndir"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        {music.genre && (
          <span className="inline-block px-2 py-1 text-xs backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-full">
            {music.genre}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4">
        <div 
          className="mb-3 h-1.5 bg-white/10 rounded-full cursor-pointer group/progress overflow-hidden"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-100 relative rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Time and Controls */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span className="font-mono">{formatTime(duration || music.duration || 0)}</span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={toggleMute}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-xs text-white/60 w-8 text-right font-mono">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
        </div>

        {/* Play Count */}
        <div className="pt-3 border-t border-white/10 text-xs text-zinc-400 text-center flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          {music.play_count} görüntülenme
        </div>
      </div>
    </div>
  );
}
