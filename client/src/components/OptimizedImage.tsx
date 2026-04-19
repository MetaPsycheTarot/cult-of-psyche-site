import { ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

/**
 * OptimizedImage Component
 * Provides automatic image optimization with:
 * - Lazy loading (except for priority images)
 * - WebP format with fallback
 * - Responsive srcset
 * - Blur-up placeholder effect
 * - Error handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate WebP version of the image
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // Generate responsive srcset
  const generateSrcSet = (imageSrc: string) => {
    if (!width) return imageSrc;
    return `
      ${imageSrc}?w=${width} 1x,
      ${imageSrc}?w=${width * 2} 2x
    `.trim();
  };

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source
        srcSet={generateSrcSet(webpSrc)}
        type="image/webp"
      />
      
      {/* Fallback to original format */}
      <source
        srcSet={generateSrcSet(src)}
        type={`image/${src.split('.').pop()}`}
      />
      
      {/* Img element with lazy loading and optimization */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`
          ${className}
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
          ${hasError ? 'bg-gray-800' : ''}
        `}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        {...props}
      />
    </picture>
  );
}

/**
 * Hook to preload images
 * Usage: usePreloadImage('https://example.com/image.jpg')
 */
export function usePreloadImage(src: string) {
  useState(() => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Hook to prefetch images
 * Usage: usePrefetchImage('https://example.com/image.jpg')
 */
export function usePrefetchImage(src: string) {
  useState(() => {
    if (typeof window === 'undefined') return;
    
    const img = new Image();
    img.src = src;
  });
}
