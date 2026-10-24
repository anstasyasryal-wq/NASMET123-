import React, { useState } from 'react';

interface ImageLoaderProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackEmoji?: string;
  fallbackText?: string;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden bg-stone-900 rounded-2xl flex items-center justify-center',
  fallbackEmoji = '🖼️',
  fallbackText = 'صورة مباركة',
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  return (
    <div className={containerClassName}>
      {/* Loading state indicator */}
      {isLoading && !hasError && src && (
        <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-[10px] text-amber-300 font-spiritual">جاري تحميل الصورة...</span>
        </div>
      )}

      {/* Fallback or Main Image */}
      {!src || hasError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full bg-gradient-to-br from-stone-950 to-amber-950 text-amber-200">
          <span className="text-4xl sm:text-5xl mb-2 animate-pulse">{fallbackEmoji}</span>
          <span className="text-xs font-spiritual font-bold text-amber-300">{alt || fallbackText}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`${className} transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
};
