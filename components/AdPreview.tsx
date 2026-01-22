
import React from 'react';
import { AdCreative, BrandKit } from '../types';

interface AdPreviewProps {
  creative: AdCreative;
  brandKit: BrandKit;
}

const AdPreview: React.FC<AdPreviewProps> = ({ creative, brandKit }) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Visual Header */}
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {creative.imageUrl ? (
          <img src={creative.imageUrl} alt="Ad background" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        
        {/* Ad Overlay Text (Simplified Preview) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
            {brandKit.logo && (
              <div className="absolute top-4 left-4 h-10 w-10 bg-white p-1 rounded-lg shadow-lg overflow-hidden">
                <img src={brandKit.logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <h3 className="text-white font-bold text-xl leading-tight mb-1 drop-shadow-md">{creative.headline}</h3>
            <p className="text-white/90 text-xs line-clamp-2 mb-3">{creative.primaryText}</p>
            <button 
              className="w-full py-2 rounded-lg font-bold text-sm shadow-lg transform active:scale-95 transition-transform"
              style={{ backgroundColor: brandKit.primaryColor, color: '#fff' }}
            >
              {creative.cta}
            </button>
        </div>

        {/* Performance Score Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1 shadow-md border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-bold text-slate-800">Score: {creative.performanceScore}%</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">{creative.platform}</span>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full uppercase">{creative.size}</span>
        </div>
        <div className="flex gap-2">
            <button className="flex-1 text-xs py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold transition-colors">Edit</button>
            <button className="flex-1 text-xs py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold transition-colors flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
