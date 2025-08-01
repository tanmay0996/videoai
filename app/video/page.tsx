'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import FormCard from '../components/FormCard';
import FileUpload from '../components/FileUpload';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { IVideo } from '@/models/Video';



const videoUploadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  videoUrl: z.string().min(1, 'Video is required'),
  thumbnailUrl: z.string().min(1, 'Thumbnail is required'),
  controls: z.boolean(),
  quality: z.number().min(1).max(100),
});

type VideoUploadFormData = z.infer<typeof videoUploadSchema>;

export default function VideoUpload() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState([100]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VideoUploadFormData>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: { 
      controls: true, 
      quality: 100 
    },
  });

  const watchedValues = watch();

  const onSubmit: SubmitHandler<VideoUploadFormData> = async (data) => {
    setIsLoading(true);
    try {
      // Call backend to save video metadata
      const savedVideo: IVideo = await apiClient.createVideo({
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        controls: data.controls,
        transformation: { 
          height: 1920, 
          width: 1080, 
          quality: data.quality 
        },
      });

      toast.success('Video uploaded successfully!', {
        description: 'Your video is being processed and will be ready shortly.',
      });

      reset();
      setQuality([100]);
      
      // Redirect to the new video's page
      router.push(`/video/${savedVideo._id}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Upload failed', { 
        description: error.message || 'Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualityChange = (value: number[]) => {
    setQuality(value);
    setValue('quality', value[0]);
  };

  const handleControlsChange = (checked: boolean) => {
    setValue('controls', checked);
  };

  return (
    <main className="min-h-screen relative p-4">
      <AnimatedBackground />
      <Navbar />
      <div className="max-w-4xl mx-auto pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Upload Your Video
          </h1>
          <p className="text-gray-400 text-lg">
            Transform your video with AI-powered processing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <FormCard>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Basic Information</span>
                  </h3>
                  
                  {/* Title */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                      Video Title *
                    </Label>
                    <Input
                      {...register('title')}
                      id="title"
                      placeholder="Enter your video title"
                      className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 transition-colors"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </motion.div>
                  
                  {/* Description */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                      Description *
                    </Label>
                    <Textarea
                      {...register('description')}
                      id="description"
                      placeholder="Describe your video..."
                      rows={4}
                      className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 transition-colors resize-none"
                      disabled={isLoading}
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Media Files */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Media Files</span>
                  </h3>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <FileUpload
                      label="Video File *"
                      accept="video/mp4,video/avi,video/mov,video/wmv"
                      value={watchedValues.videoUrl || ''}
                      onChange={(v) => setValue('videoUrl', v)}
                      type="video"
                    />
                    {errors.videoUrl && (
                      <p className="text-red-400 text-sm mt-1">{errors.videoUrl.message}</p>
                    )}
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <FileUpload
                      label="Thumbnail Image *"
                      accept="image/*"
                      value={watchedValues.thumbnailUrl || ''}
                      onChange={(v) => setValue('thumbnailUrl', v)}
                      type="image"
                    />
                    {errors.thumbnailUrl && (
                      <p className="text-red-400 text-sm mt-1">{errors.thumbnailUrl.message}</p>
                    )}
                  </motion.div>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Processing Settings</span>
                  </h3>
                  
                  <motion.div 
                    className="space-y-4" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="controls"
                        checked={watchedValues.controls || false}
                        onCheckedChange={handleControlsChange}
                        disabled={isLoading}
                      />
                      <Label htmlFor="controls" className="text-sm text-gray-300">
                        Show video controls
                      </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-300">
                        Quality: {quality[0]}%
                      </Label>
                      <Slider
                        value={quality}
                        onValueChange={handleQualityChange}
                        max={100}
                        min={1}
                        step={1}
                        className="w-full"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Submit */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 font-semibold text-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div 
                        className="flex items-center space-x-2" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Video...</span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <Upload className="h-5 w-5" />
                        <span>Upload & Process</span>
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </FormCard>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FormCard title="Preview" className="sticky top-24">
                <div className="space-y-4">
                  {watchedValues.thumbnailUrl ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <img 
                        src={watchedValues.thumbnailUrl} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Thumbnail preview</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-white truncate">
                      {watchedValues.title || 'Video Title'}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {watchedValues.description || 'Video description will appear here...'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Quality: {quality[0]}%</span>
                    <span className="flex items-center space-x-1">
                      {watchedValues.controls && <Check className="h-3 w-3" />}
                      <span>Controls</span>
                    </span>
                  </div>
                </div>
              </FormCard>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}