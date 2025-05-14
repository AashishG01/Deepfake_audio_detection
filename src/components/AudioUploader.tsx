import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, X, Loader2 } from 'lucide-react';

interface AudioUploaderProps {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setResult: (result: any) => void;
  isLoading: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ 
  setIsLoading, 
  setError, 
  setResult,
  isLoading 
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only accept the first file
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Check file type
      const fileType = file.type;
      if (!fileType.startsWith('audio/')) {
        setError('Please upload an audio file (MP3, WAV, OGG)');
        return;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  }, [setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an audio file');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'An error occurred during analysis');
      } else {
        setError('Could not connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-blue-900 flex items-center">
        <Upload className="mr-2 h-6 w-6 text-teal-500" />
        Upload Audio
      </h2>
      <p className="text-gray-600 mb-4">
        Select or drag and drop an audio file for analysis.
      </p>

      {!selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive 
              ? 'border-teal-500 bg-teal-50' 
              : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload className={`h-12 w-12 ${isDragActive ? 'text-teal-500' : 'text-gray-400'}`} />
            <p className="text-lg font-medium">Click to upload</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
            <p className="text-xs text-gray-400">MP3, WAV, OGG, etc. (Max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-teal-100 p-2 rounded-md mr-3">
                <Upload className="h-5 w-5 text-teal-700" />
              </div>
              <div className="truncate">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${!selectedFile || isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-teal-500 text-white hover:bg-teal-600 shadow-md hover:shadow-lg'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </span>
          ) : (
            'Analyze Audio'
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioUploader;