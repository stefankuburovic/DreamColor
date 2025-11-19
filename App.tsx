import React, { useState } from 'react';
import { BookOpen, Palette, Download, Sparkles, Wand2, AlertCircle } from 'lucide-react';
import { generateColoringPage, generateCoverImage } from './services/geminiService';
import { generatePDF } from './utils/pdfUtils';
import ChatBot from './components/ChatBot';
import ImageCard from './components/ImageCard';
import { BookSettings, GeneratedImage, GenerationStatus } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<BookSettings>({ childName: '', theme: '' });
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [progressMsg, setProgressMsg] = useState('');

  const handleGenerate = async () => {
    if (!settings.childName || !settings.theme) return;

    setStatus(GenerationStatus.GENERATING);
    setImages([]);
    setProgressMsg('Initializing creative engines...');

    try {
      // 1. Generate Cover
      setProgressMsg(`Painting a cover for ${settings.childName}...`);
      const coverUrl = await generateCoverImage(settings.theme);
      const coverImage: GeneratedImage = {
        id: 'cover',
        url: coverUrl,
        type: 'cover',
        prompt: settings.theme
      };
      setImages([coverImage]);

      // 2. Generate 5 Pages Sequentially (to avoid hitting rate limits too hard if any)
      // Optimistic update: Show placeholder or loading for these? No, just append as they come.
      const tempImages = [coverImage];
      
      for (let i = 1; i <= 5; i++) {
        setProgressMsg(`Sketching page ${i} of 5...`);
        
        // Slight variation in prompt logic could be handled in service, but for now simple theme is passed
        // Maybe add variation keywords locally
        const variations = ['scene', 'character close up', 'action pose', 'funny moment', 'peaceful scene'];
        const specificTheme = `${settings.theme} - ${variations[i-1]}`;
        
        const pageUrl = await generateColoringPage(specificTheme);
        const pageImage: GeneratedImage = {
          id: `page-${i}`,
          url: pageUrl,
          type: 'page',
          prompt: specificTheme
        };
        
        tempImages.push(pageImage);
        setImages([...tempImages]);
      }

      setStatus(GenerationStatus.COMPLETE);
      setProgressMsg('');

    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setProgressMsg('Something went wrong creating the magic book. Please try again.');
    }
  };

  const handleDownload = () => {
    if (images.length > 0) {
      generatePDF(images, settings);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-pattern">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-yellow-100/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500 p-2 rounded-xl text-white shadow-lg transform -rotate-3">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              DreamColor
            </h1>
          </div>
          {status === GenerationStatus.COMPLETE && (
            <button 
              onClick={handleDownload}
              className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Download size={20} />
              Download PDF
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        
        {/* Hero / Form Section */}
        <section className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Create a <span className="text-brand-500">Magical</span> Coloring Book
            </h2>
            <p className="text-lg text-slate-600 max-w-lg mx-auto">
              Enter a theme and a name, and our AI will generate a personalized printable coloring book just for you!
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-brand-100 space-y-6 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-left">
                <label className="block text-sm font-bold text-slate-700 ml-1">Child's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Leo"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all font-display"
                  value={settings.childName}
                  onChange={(e) => setSettings({ ...settings, childName: e.target.value })}
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-sm font-bold text-slate-700 ml-1">Adventure Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Space Dinosaurs"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all font-display"
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={status === GenerationStatus.GENERATING || !settings.childName || !settings.theme}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-xl font-display font-bold text-xl shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
            >
              {status === GenerationStatus.GENERATING ? (
                <>
                  <Palette className="animate-spin" />
                  Creating Magic...
                </>
              ) : (
                <>
                  <Wand2 />
                  Generate Coloring Book
                </>
              )}
            </button>

            {/* Status Message */}
            {status !== GenerationStatus.IDLE && (
              <div className={`flex items-center justify-center gap-2 text-sm font-medium animate-pulse ${status === GenerationStatus.ERROR ? 'text-red-500' : 'text-brand-600'}`}>
                {status === GenerationStatus.ERROR ? <AlertCircle size={16} /> : <Sparkles size={16} />}
                {progressMsg}
              </div>
            )}
          </div>
        </section>

        {/* Results Grid */}
        {images.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-display text-2xl font-bold text-slate-800">Preview Pages</h3>
              <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-bold">
                {images.length} / 6 Generated
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {images.map((img) => (
                <ImageCard key={img.id} image={img} />
              ))}
              
              {/* Skeletons for remaining */}
              {status === GenerationStatus.GENERATING && Array.from({ length: 6 - images.length }).map((_, i) => (
                <div key={`skel-${i}`} className="aspect-[3/4] bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 animate-pulse">
                  <Palette size={32} className="mb-2 opacity-50" />
                  <span className="text-xs font-bold">Waiting...</span>
                </div>
              ))}
            </div>

            {/* Mobile Download Button */}
            {status === GenerationStatus.COMPLETE && (
              <div className="flex justify-center md:hidden pt-4">
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold shadow-lg w-full justify-center"
                >
                  <Download size={20} />
                  Download PDF Book
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <ChatBot />
    </div>
  );
};

export default App;