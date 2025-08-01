// components/VideoCard.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IVideo } from '@/models/Video';

interface VideoCardProps {
  video: IVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleImageError = () => {
    console.error('Failed to load thumbnail:', video.thumbnailUrl);
    setImageError(true);
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-video bg-gray-800 overflow-hidden">
        {!isPlaying ? (
          // Thumbnail View
          <div className="relative w-full h-full cursor-pointer" onClick={handleVideoClick}>
            {!imageError && video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={handleImageError}
                onLoad={() => console.log('Thumbnail loaded:', video.title)}
              />
            ) : (
              // Fallback when thumbnail fails to load
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Video Preview</p>
                </div>
              </div>
            )}
            
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          // Video Player View
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              preload="metadata"
              onError={(e) => {
                console.error('Video failed to load:', video.videoUrl);
                setIsPlaying(false);
              }}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={video.videoUrl} type="video/mp4" />
              <source src={video.videoUrl} type="video/webm" />
              <source src={video.videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
            
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(false);
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {video.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-3">
          {video.description}
        </p>

        {/* Video stats/actions */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Recently'}
          </span>
          
          <div className="flex items-center space-x-2">
            {/* Debug indicators */}
            <span className={`px-1 py-0.5 rounded text-xs ${video.videoUrl ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {video.videoUrl ? 'Video ✓' : 'Video ✗'}
            </span>
            <span className={`px-1 py-0.5 rounded text-xs ${video.thumbnailUrl ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {video.thumbnailUrl ? 'Thumb ✓' : 'Thumb ✗'}
            </span>
          </div>
        </div>

        {/* Debug URLs (remove in production) */}
        <div className="mt-2 text-xs text-gray-600 break-all">
          <p>Video: {video.videoUrl?.substring(0, 50)}...</p>
          <p>Thumb: {video.thumbnailUrl?.substring(0, 50)}...</p>
        </div>
      </div>
    </motion.div>
  );
}