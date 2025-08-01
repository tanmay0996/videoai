// pages/upload-test.tsx

'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface ImageKitAuthParams {
  token: string;
  signature: string;
  expire: number;
}

interface ImageKitResponse {
  url: string;
  fileId: string;
  name: string;
}

export default function UploadTestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbUrl, setThumbUrl] = useState('');
  const [status, setStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{video: number, thumb: number}>({
    video: 0,
    thumb: 0
  });
  const [isUploading, setIsUploading] = useState(false);

  // Fetch ImageKit auth params
  async function getAuthParams(): Promise<ImageKitAuthParams> {
    const res = await fetch('/api/imagekit-auth');
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch auth: ${errorText}`);
    }
    return res.json();
  }

  // Generic upload function using XHR
  function uploadToImageKit(
    file: File, 
    folder: string, 
    onProgress?: (p: number) => void
  ): Promise<ImageKitResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const auth = await getAuthParams();
        
        // Validate auth parameters
        if (!auth.token || !auth.signature || !auth.expire) {
          throw new Error('Invalid authentication parameters received');
        }

        const formData = new FormData();
        
        // Generate unique filename to avoid conflicts
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('folder', folder);
        
        // Ensure public key is available
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
        if (!publicKey) {
          throw new Error('ImageKit public key not configured');
        }
        
        formData.append('publicKey', publicKey);
        formData.append('token', auth.token);
        formData.append('signature', auth.signature);
        formData.append('expire', String(auth.expire));

        // Add transformation parameters - but not as FormData for ImageKit
        // ImageKit expects these as URL parameters or separate fields
        if (file.type.startsWith('video/')) {
          // Add video-specific parameters if needed
          formData.append('useUniqueFileName', 'true');
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response: ImageKitResponse = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (parseError) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            let errorMessage = `Upload failed with status: ${xhr.status}`;
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
              // Use default error message
            }
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
        
        // Set timeout to 5 minutes for large files
        xhr.timeout = 300000; 
        
        xhr.send(formData);
      } catch (err) {
        reject(err);
      }
    });
  }

  const onVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setStatus('Please select a valid video file');
      return;
    }

    // Validate file size (e.g., max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setStatus('Video file is too large. Maximum size is 100MB');
      return;
    }

    setIsUploading(true);
    setStatus('Uploading video...');
    setUploadProgress(prev => ({ ...prev, video: 0 }));

    try {
      const response = await uploadToImageKit(file, '/videos', (progress) => {
        setUploadProgress(prev => ({ ...prev, video: progress }));
        setStatus(`Uploading video: ${progress}%`);
      });
      
      setVideoUrl(response.url);
      setStatus('Video uploaded successfully');
    } catch (err) {
      console.error('Video upload error:', err);
      setStatus(`Video upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onThumbChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setStatus('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setStatus('Image file is too large. Maximum size is 5MB');
      return;
    }

    setIsUploading(true);
    setStatus('Uploading thumbnail...');
    setUploadProgress(prev => ({ ...prev, thumb: 0 }));

    try {
      const response = await uploadToImageKit(file, '/thumbnails', (progress) => {
        setUploadProgress(prev => ({ ...prev, thumb: progress }));
        setStatus(`Uploading thumbnail: ${progress}%`);
      });
      
      setThumbUrl(response.url);
      setStatus('Thumbnail uploaded successfully');
    } catch (err) {
      console.error('Thumbnail upload error:', err);
      setStatus(`Thumbnail upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setStatus('Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      setStatus('Please enter a description');
      return;
    }
    
    if (!videoUrl) {
      setStatus('Please upload a video file');
      return;
    }
    
    if (!thumbUrl) {
      setStatus('Please upload a thumbnail image');
      return;
    }

    setStatus('Saving video metadata...');
    
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl,
          thumbnailUrl: thumbUrl,
          controls: true,
          transformation: {
            height: 1080,
            width: 1920,
            quality: 80
          }
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to save video');
      }
      
      const data = await res.json();
      setStatus(`Video saved successfully! ID: ${data._id}`);
      
      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbUrl('');
      setUploadProgress({ video: 0, thumb: 0 });
      
    } catch (err) {
      console.error('Save error:', err);
      setStatus(`Failed to save video: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const canSubmit = title.trim() && description.trim() && videoUrl && thumbUrl && !isUploading;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Upload Video</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Title: *
          </label>
          <input 
            type="text"
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isUploading}
            style={{ 
              width: '100%', 
              padding: 8, 
              border: '1px solid #ccc',
              borderRadius: 4
            }}
            placeholder="Enter video title"
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Description: *
          </label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isUploading}
            rows={4}
            style={{ 
              width: '100%', 
              padding: 8, 
              border: '1px solid #ccc',
              borderRadius: 4,
              resize: 'vertical'
            }}
            placeholder="Enter video description"
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Video File: * (Max 100MB)
          </label>
          <input 
            type="file" 
            accept="video/*" 
            onChange={onVideoChange}
            disabled={isUploading}
            style={{ marginBottom: 8 }}
          />
          {uploadProgress.video > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#f0f0f0', 
                borderRadius: 4, 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  width: `${uploadProgress.video}%`, 
                  backgroundColor: '#4CAF50', 
                  height: 20, 
                  transition: 'width 0.3s' 
                }} />
              </div>
              <small>{uploadProgress.video}% uploaded</small>
            </div>
          )}
          {videoUrl && (
            <p style={{ color: 'green', fontSize: 14 }}>
              ✓ Video uploaded successfully
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Thumbnail Image: * (Max 5MB)
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={onThumbChange}
            disabled={isUploading}
            style={{ marginBottom: 8 }}
          />
          {uploadProgress.thumb > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#f0f0f0', 
                borderRadius: 4, 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  width: `${uploadProgress.thumb}%`, 
                  backgroundColor: '#2196F3', 
                  height: 20, 
                  transition: 'width 0.3s' 
                }} />
              </div>
              <small>{uploadProgress.thumb}% uploaded</small>
            </div>
          )}
          {thumbUrl && (
            <div>
              <p style={{ color: 'green', fontSize: 14 }}>
                ✓ Thumbnail uploaded successfully
              </p>
              <img 
                src={thumbUrl} 
                alt="Thumbnail preview" 
                style={{ 
                  maxWidth: 200, 
                  maxHeight: 150, 
                  objectFit: 'cover',
                  border: '1px solid #ccc',
                  borderRadius: 4
                }} 
              />
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: '12px 24px',
            backgroundColor: canSubmit ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          {isUploading ? 'Uploading...' : 'Save Video'}
        </button>
      </form>
      
      {status && (
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          backgroundColor: status.includes('failed') || status.includes('error') ? '#ffebee' : '#e8f5e8',
          color: status.includes('failed') || status.includes('error') ? '#c62828' : '#2e7d32',
          borderRadius: 4,
          border: `1px solid ${status.includes('failed') || status.includes('error') ? '#ffcdd2' : '#c8e6c9'}`
        }}>
          <strong>Status:</strong> {status}
        </div>
      )}
    </div>
  );
}