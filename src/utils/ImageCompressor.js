// utils/imageHelper.js
import ImageCompressor from 'react-native-image-compressor';
import { Platform } from 'react-native';

/**
 * Compresses an image file with error handling and fallback
 * @param {string} imageUri - URI of the image to compress
 * @param {object} options - Compression options
 * @returns {Promise<string>} URI of the compressed image (or original if compression fails)
 */
export const compressImage = async (imageUri, options = {}) => {
  const defaultOptions = {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8,
    output: 'jpg',
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    return await ImageCompressor.compress(imageUri, compressionOptions);
  } catch (error) {
    console.warn('Image compression failed, using original:', error);
    return imageUri;
  }
};

/**
 * Extracts filename from path and normalizes it
 * @param {string} path - Full file path
 * @returns {string} Clean filename with extension
 */
const getCleanFileName = (path) => {
  if (!path) return `image_${Date.now()}.jpg`;
  
  // Handle Android content URIs and normal paths
  const filename = path.split('/').pop() || `image_${Date.now()}.jpg`;
  return filename.includes('?') ? filename.split('?')[0] : filename;
};

/**
 * Prepares image data for FormData upload
 * @param {object} imageData - Original image data { uri, type?, fileName? }
 * @param {object} options - Compression options
 * @returns {Promise<object|null>} Prepared image object for FormData or null if invalid
 */
export const prepareImageForUpload = async (imageData, options = {}) => {
  if (!imageData?.uri) {
    console.warn('No image URI provided');
    return null;
  }

  try {
    const compressedUri = await compressImage(imageData.uri, options);
    const fileName = getCleanFileName(imageData.fileName || imageData.uri);
    const mimeType = imageData.type || 'image/jpeg';

    return {
      uri: Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri,
      type: mimeType,
      name: fileName,
    };
  } catch (error) {
    console.error('Failed to prepare image:', error);
    return null;
  }
};

/**
 * Creates FormData with compressed image
 * @param {string} fieldName - Field name for the FormData
 * @param {object} imageData - Original image data
 * @param {object} options - Compression options
 * @returns {Promise<FormData>} FormData with image or empty FormData if preparation fails
 */
export const createImageFormData = async (fieldName, imageData, options = {}) => {
  const formData = new FormData();
  const preparedImage = await prepareImageForUpload(imageData, options);

  if (preparedImage) {
    formData.append(fieldName, preparedImage);
  }

  return formData;
};