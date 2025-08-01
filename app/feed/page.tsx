'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import VideoCard from '../components/VideoCard';
import { IVideo } from '@/models/Video';

export default function VideoFeedPage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/api/video');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: IVideo[] = await res.json();
        
        // DEBUG: Log the fetched data
        console.log('Fetched videos:', data);
        console.log('First video data:', data[0]);
        
        setVideos(data);
      } catch (err) {
        console.error('Failed to load videos', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-10 px-4 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          All Videos
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore the most recent uploads.
        </motion.p>
      </section>

      <section className="relative z-10 px-4 pb-20">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos uploaded yet</p>
        ) : (
          <>
            {/* DEBUG: Show raw data */}
            <div className="mb-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white mb-2">Debug Info:</h3>
              <p className="text-gray-300">Total videos: {videos.length}</p>
              {videos[0] && (
                <div className="text-sm text-gray-400 mt-2">
                  <p>First video title: {videos[0].title}</p>
                  <p>Video URL: {videos[0].videoUrl}</p>
                  <p>Thumbnail URL: {videos[0].thumbnailUrl}</p>
                </div>
              )}
            </div>
            
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video._id?.toString() || index}
                  className="border border-gray-600 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* DEBUG: Manual card to test URLs */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="relative aspect-video bg-gray-800">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Thumbnail failed to load:', video.thumbnailUrl);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onLoad={() => console.log('Thumbnail loaded successfully:', video.thumbnailUrl)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Thumbnail
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{video.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                      
                      {/* Video element for testing */}
                      {video.videoUrl && (
                        <video
                          className="w-full h-32 object-cover rounded"
                          controls
                          preload="metadata"
                          onError={(e) => {
                            console.error('Video failed to load:', video.videoUrl);
                          }}
                          onLoadedMetadata={() => console.log('Video loaded successfully:', video.videoUrl)}
                        >
                          <source src={video.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      
                      {/* Debug URLs */}
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Video: {video.videoUrl ? '✓' : '✗'}</p>
                        <p>Thumb: {video.thumbnailUrl ? '✓' : '✗'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}