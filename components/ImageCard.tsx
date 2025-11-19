
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { RefreshCw, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';

interface ImageCardProps {
  image: GeneratedImage;
  onRegenerate: (id: string, newPrompt: string) => void;
  onDelete: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRegenerate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [promptText, setPromptText] = useState(image.prompt);

  const handleSave = () => {
    onRegenerate(image.id, promptText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPromptText(image.prompt);
    setIsEditing(false);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-md bg-white border border-slate-100 aspect-[3/4] transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col">
      {image.isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 animate-pulse p-4 text-center">
          <Loader2 size={32} className="animate-spin mb-3 text-brand-400" />
          <p className="text-sm font-medium text-slate-500 line-clamp-3">{image.prompt}</p>
          <span className="text-xs mt-2">Generating...</span>
        </div>
      ) : isEditing ? (
        <div className="w-full h-full p-4 flex flex-col bg-slate-50">
          <label className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Edit Prompt</label>
          <textarea
            className="flex-1 w-full p-3 text-sm border rounded-lg mb-3 resize-none focus:ring-2 focus:ring-brand-200 outline-none border-slate-200"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Describe the image..."
          />
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="flex-1 bg-brand-500 text-white text-sm font-bold py-2 rounded-lg hover:bg-brand-600 flex items-center justify-center gap-1"
            >
              <RefreshCw size={14} /> Generate
            </button>
            <button 
              onClick={handleCancel}
              className="px-3 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <img 
            src={image.url} 
            alt={image.prompt} 
            className="w-full h-full object-cover"
          />
          
          {/* Label Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="text-white font-bold text-[10px] bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
              {image.type === 'cover' ? 'COVER' : 'PAGE'}
            </span>
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-slate-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-brand-50 hover:text-brand-600 transform transition-transform hover:scale-105 shadow-lg"
            >
              <Edit2 size={14} /> Edit Page
            </button>
            
            {image.type === 'page' && (
               <button
               onClick={() => onDelete(image.id)}
               className="bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-red-500/80 transform transition-transform hover:scale-105 backdrop-blur-sm"
             >
               <Trash2 size={14} /> Delete
             </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCard;
