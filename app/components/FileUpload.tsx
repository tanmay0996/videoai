'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  label: string;
  accept: string;
  value?: string;
  onChange: (value: string) => void;
  type: 'video' | 'image';
  className?: string;
   onFileSelect?: (file: File) => Promise<string>;
  isUploading?: boolean;
  uploadProgress?: number;
}

export default function FileUpload({ label, accept, value, onChange, type, className }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-300 mb-3 block">{label}</Label>
      
      {/* URL Input Alternative */}
      <div className="mb-4">
        <Input
          type="url"
          placeholder={`Or enter ${type} URL`}
          value={value || ''}
          onChange={(e) => {
            const url = e.target.value;
            setPreview(url);
            onChange(url);
          }}
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
        />
      </div>

      {/* File Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
          isDragOver
            ? 'border-purple-400 bg-purple-400/10'
            : 'border-white/20 hover:border-white/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {!preview ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-400 mb-2">
              Drag and drop your {type} here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              {accept.split(',').join(', ')}
            </p>
          </div>
        ) : (
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {type === 'video' ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-12 w-12 text-white/80" />
                </div>
              </div>
            ) : (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setPreview('');
                    onChange('');
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <ImageIcon className="h-12 w-12 text-white/80" />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}