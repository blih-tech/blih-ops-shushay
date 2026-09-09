"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
} from "lucide-react";
import { Badge } from "@blih/ui";
import type { PublicLesson } from "@/types/course";

interface LearnVideoPlayerProps {
  activeLesson: PublicLesson;
  activeLessonIndex?: number;
}

export function LearnVideoPlayer({
  activeLesson,
  activeLessonIndex = 0,
}: LearnVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasVideo = !!activeLesson.videoUrl;
  const hasDocuments = (activeLesson.documents?.length ?? 0) > 0;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      videoRef.current.muted = nextMuted;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Frame aisJd: Video Lesson Player Surface (#0F172A Slate Cinema Container) */}
      <div
        ref={playerContainerRef}
        onMouseMove={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
          }, 3500);
        }}
        className="relative w-full aspect-video bg-[#0F172A] rounded-3xl overflow-hidden shadow-2xl group border border-[#1E293B] flex flex-col justify-between"
      >
        {/* Video Surface */}
        {hasVideo ? (
          <video
            ref={videoRef}
            src={activeLesson.videoUrl!}
            className="w-full h-full object-cover cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white cursor-pointer select-none"
            onClick={togglePlay}
          >
            <div className="w-20 h-20 rounded-full bg-[#1E5BFF] flex items-center justify-center text-white shadow-[0_0_40px_rgba(30,91,255,0.5)] group-hover:scale-110 transition-transform mb-4">
              <Play className="w-9 h-9 fill-current ml-1" />
            </div>
            <p className="font-mono text-xs text-[#BFD0FF] uppercase tracking-wider font-semibold">
              Interactive Video Stream Demo
            </p>
          </div>
        )}

        {/* Top Video Title Overlay (Frame aisJd: Video title overlay) */}
        <div
          className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-[#BFD0FF] font-semibold uppercase tracking-wider block mb-1">
                Lesson {activeLessonIndex + 1}
              </span>
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight max-w-2xl drop-shadow-md">
                {activeLesson.title}
              </h2>
            </div>
            <Badge variant="verified" size="sm">
              HD 1080p
            </Badge>
          </div>
        </div>

        {/* Center Big Play/Pause Button (Frame aisJd: Video play control) */}
        {(!isPlaying || showControls) && (
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1E5BFF] text-white flex items-center justify-center shadow-[0_0_50px_rgba(30,91,255,0.6)] hover:scale-110 transition-transform cursor-pointer z-10"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-9 sm:h-9 fill-current" />
            ) : (
              <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
            )}
          </button>
        )}

        {/* Bottom Custom Controls Rail (Frame aisJd: Video progress rail & value) */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-3 transition-opacity duration-300 z-20 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Slider Bar */}
          <div className="relative w-full flex items-center group/rail">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full appearance-none cursor-pointer accent-[#1E5BFF] transition-all"
            />
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#1E5BFF] rounded-full pointer-events-none h-1.5 group-hover/rail:h-2.5 transition-all"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Controls Toolbar */}
          <div className="flex items-center justify-between gap-4 font-sans text-xs text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="hover:text-[#1E5BFF] transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>

              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="hover:text-[#1E5BFF] transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-red-400" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-[#1E5BFF]"
                />
              </div>

              <span className="font-mono text-xs text-white/80">
                {formatTime(currentTime)} / {formatTime(duration || 765)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Speed Selector Dropdown */}
              <div className="relative inline-block">
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  aria-label="Playback Speed"
                  className="bg-[#0F172A]/90 text-white border border-[#D9CEDF]/30 hover:border-[#1E5BFF] rounded-lg px-2.5 py-1 text-[11px] font-mono font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1E5BFF] appearance-none pr-6 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23BFD0FF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.35rem center",
                    backgroundSize: "0.85em",
                  }}
                >
                  <option value={0.5} className="bg-[#0F172A] text-white">0.5x</option>
                  <option value={0.75} className="bg-[#0F172A] text-white">0.75x</option>
                  <option value={1} className="bg-[#0F172A] text-white">1.0x</option>
                  <option value={1.25} className="bg-[#0F172A] text-white">1.25x</option>
                  <option value={1.5} className="bg-[#0F172A] text-white">1.5x</option>
                  <option value={1.75} className="bg-[#0F172A] text-white">1.75x</option>
                  <option value={2} className="bg-[#0F172A] text-white">2.0x</option>
                </select>
              </div>

              <button
                onClick={toggleFullscreen}
                className="hover:text-[#1E5BFF] transition-colors cursor-pointer p-1"
                aria-label="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Description & Summary Box */}
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Lesson Overview & Key Takeaways
          </h3>
          <Badge variant="secondary" size="sm">
            Core Concept
          </Badge>
        </div>
        {activeLesson.content ? (
          <p className="font-sans text-sm text-[#6E6678] leading-relaxed whitespace-pre-wrap">
            {activeLesson.content}
          </p>
        ) : (
          <p className="font-sans text-sm text-[#6E6678] leading-relaxed">
            In this lesson, we cover architectural boundaries, state design patterns, and system scalability constraints for production interfaces.
          </p>
        )}
      </div>

      {/* Downloadable Resources */}
      {hasDocuments && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-3 shadow-xs">
          <h4 className="font-display text-xs font-bold text-[#17131F] uppercase tracking-wider">
            Downloadable Resources & Files
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeLesson.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={(doc as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#D9CEDF] hover:border-[#1E5BFF]/40 hover:bg-[#EEF3FF] transition-all group"
                >
                  <Download className="w-4 h-4 text-[#1E5BFF] flex-shrink-0" />
                  <span className="text-xs font-medium text-[#17131F] group-hover:text-[#1E5BFF] truncate">
                    {doc.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

