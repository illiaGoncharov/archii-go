// Store для управления состоянием камеры

import { create } from 'zustand';

interface CameraStore {
  photoUri: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  
  setPhoto: (uri: string | null) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  photoUri: null,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  
  setPhoto: (uri) => set({ photoUri: uri }),
  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setError: (error) => set({ error }),
  
  reset: () => set({ 
    photoUri: null, 
    isUploading: false, 
    uploadProgress: 0, 
    error: null 
  })
}));

