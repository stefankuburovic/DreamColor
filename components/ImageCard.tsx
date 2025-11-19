import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-md bg-white border border-slate-100 aspect-[3/4] transition-transform hover:-translate-y-1 hover:shadow-lg">
      <img 
        src={image.url} 
        alt={image.prompt} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
        <span className="text-white font-medium text-sm bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
          {image.type === 'cover' ? 'Cover Art' : 'Page'}
        </span>
      </div>
    </div>
  );
};

export default ImageCard;