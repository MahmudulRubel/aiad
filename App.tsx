
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AdPreview from './components/AdPreview';
import { AdPlatform, AdSize, AdCreative, BrandKit, UserState } from './types';
import { generateAdCopy, generateAdImage } from './services/geminiService';

const DEFAULT_BRAND_KIT: BrandKit = {
  name: "EcoStyle Wear",
  logo: "https://picsum.photos/200/200?random=1",
  primaryColor: "#4f46e5",
  secondaryColor: "#10b981",
  fontFamily: "Inter"
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userState, setUserState] = useState<UserState>({
    credits: 142,
    brandKit: DEFAULT_BRAND_KIT,
    creatives: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState({
    productDesc: "Sustainable bamboo fiber t-shirts for conscious urban dwellers.",
    targetAudience: "Eco-conscious millennials, 25-40, urban residents",
    platform: AdPlatform.INSTAGRAM,
    size: AdSize.SQUARE
  });

  // Mock initial data
  useEffect(() => {
    const mockCreatives: AdCreative[] = [
      {
        id: '1',
        platform: AdPlatform.FACEBOOK,
        size: AdSize.LANDSCAPE,
        headline: 'Sustainable Style for Your Life',
        primaryText: 'Ditch the plastic. Wear the future. Our 100% bamboo tees are breathable, antibacterial and better for the planet.',
        cta: 'Shop Now',
        imageUrl: 'https://picsum.photos/800/600?nature=1',
        performanceScore: 94,
        timestamp: Date.now() - 1000000
      },
      {
        id: '2',
        platform: AdPlatform.INSTAGRAM,
        size: AdSize.STORY,
        headline: 'Softest Tee on Earth',
        primaryText: 'Once you try bamboo, you never go back. Experience the ultimate comfort today.',
        cta: 'Learn More',
        imageUrl: 'https://picsum.photos/1080/1920?fashion=1',
        performanceScore: 88,
        timestamp: Date.now() - 2000000
      }
    ];
    setUserState(prev => ({ ...prev, creatives: mockCreatives }));
  }, []);

  const handleGenerate = async () => {
    if (userState.credits < 5) {
      alert("Not enough credits!");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Generate text variations
      const copies = await generateAdCopy(
        userState.brandKit.name,
        form.productDesc,
        form.targetAudience,
        form.platform
      );

      // 2. Generate a base background image
      const imageUrl = await generateAdImage(
        form.productDesc,
        form.size
      );

      // 3. Create variants
      const newCreatives: AdCreative[] = copies.map((copy, idx) => ({
        id: Math.random().toString(36).substr(2, 9),
        platform: form.platform,
        size: form.size,
        headline: copy.headline,
        primaryText: copy.primaryText,
        cta: copy.cta,
        imageUrl: imageUrl, 
        performanceScore: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
        timestamp: Date.now()
      }));

      setUserState(prev => ({
        ...prev,
        credits: prev.credits - 5,
        creatives: [...newCreatives, ...prev.creatives]
      }));
      setActiveTab('projects');
    } catch (error) {
      console.error("Generation failed", error);
      alert("Something went wrong during generation. Check your API Key in the environment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, Sarah</h1>
                <p className="text-slate-500">You have enough credits for 28 more high-converting campaigns.</p>
              </div>
              <button onClick={() => setActiveTab('generate')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                New Campaign
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Creatives', val: userState.creatives.length, trend: '+12% this month' },
                { label: 'Avg. Perf Score', val: '92%', trend: '+4% improved' },
                { label: 'Credits Used', val: '458', trend: 'Budget on track' }
              ].map((stat, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="text-slate-500 text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">{stat.val}</div>
                  <div className="text-xs text-green-600 font-semibold">{stat.trend}</div>
                </div>
              ))}
            </div>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
                <button onClick={() => setActiveTab('projects')} className="text-indigo-600 font-semibold text-sm hover:underline">View all</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userState.creatives.slice(0, 4).map(creative => (
                  <AdPreview key={creative.id} creative={creative} brandKit={userState.brandKit} />
                ))}
              </div>
            </section>
          </div>
        );

      case 'generate':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Generate Your Creative</h1>
              <p className="text-slate-500">Our AI will handle the design, copy, and optimization for you.</p>
            </header>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Project Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Summer 2024 Launch" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Platform</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={form.platform}
                    onChange={e => setForm({...form, platform: e.target.value as AdPlatform})}
                  >
                    {Object.values(AdPlatform).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Product / Service Description</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none" 
                  placeholder="Tell us what you are selling..."
                  value={form.productDesc}
                  onChange={e => setForm({...form, productDesc: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Target Audience</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="e.g. Small business owners looking for SEO tools"
                  value={form.targetAudience}
                  onChange={e => setForm({...form, targetAudience: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Choose Ad Sizes</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.values(AdSize).map(size => (
                    <button 
                      key={size}
                      onClick={() => setForm({...form, size})}
                      className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                        form.size === size ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={`border-2 border-current rounded bg-transparent ${
                        size === AdSize.SQUARE ? 'w-8 h-8' : 
                        size === AdSize.STORY ? 'w-6 h-10' :
                        size === AdSize.LANDSCAPE ? 'w-12 h-7' : 'w-8 h-10'
                      }`}></div>
                      <span className="text-[10px] font-bold uppercase">{size}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all ${
                  isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                   <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Magic...
                   </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Generate High-Converting Ads (5 Credits)
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
                <p className="text-slate-500">Manage and download your generated creative assets.</p>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userState.creatives.map(creative => (
                <AdPreview key={creative.id} creative={creative} brandKit={userState.brandKit} />
              ))}
            </div>
            {userState.creatives.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-400">No projects yet. Generate your first ad!</p>
              </div>
            )}
          </div>
        );

      case 'brandkit':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
            <header>
              <h1 className="text-3xl font-bold text-slate-900 text-center">Brand Kit</h1>
              <p className="text-slate-500 text-center">Set up your brand identity once, use it for every ad.</p>
            </header>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
               <div className="flex justify-center">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200">
                       {userState.brandKit.logo && <img src={userState.brandKit.logo} className="w-full h-full object-cover" />}
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Brand Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={userState.brandKit.name} readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Primary Color</label>
                      <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                        <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: userState.brandKit.primaryColor }}></div>
                        <span className="text-sm font-mono">{userState.brandKit.primaryColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Secondary Color</label>
                      <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                        <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: userState.brandKit.secondaryColor }}></div>
                        <span className="text-sm font-mono">{userState.brandKit.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
               </div>
               <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Save Brand Kit</button>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            <header className="text-center">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Choose Your Plan</h1>
              <p className="text-slate-500 max-w-xl mx-auto">Get more credits and unlock premium templates to scale your marketing campaigns effortlessly.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: 'Starter', price: '$29', credits: '100', features: ['All Platforms', 'Standard Templates', '5 Brands'] },
                 { name: 'Professional', price: '$99', credits: '500', features: ['AI Image Gen', 'A/B Testing', 'Unlimited Brands', 'Priority Support'], popular: true },
                 { name: 'Scale', price: '$299', credits: '2500', features: ['API Access', 'Custom Templates', 'Bulk Export', 'Account Manager'] },
               ].map((plan, i) => (
                 <div key={i} className={`relative p-8 rounded-3xl shadow-xl flex flex-col ${plan.popular ? 'bg-slate-900 text-white scale-105 z-10' : 'bg-white text-slate-900 border border-slate-100'}`}>
                    {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</span>}
                    <div className="text-xl font-bold mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className={plan.popular ? 'text-slate-400' : 'text-slate-500'}>/mo</span>
                    </div>
                    <div className="mb-6 pb-6 border-b border-slate-700/20">
                      <div className="text-indigo-500 font-bold mb-1">{plan.credits} Credits</div>
                      <div className="text-sm opacity-60">per month</div>
                    </div>
                    <ul className="space-y-4 mb-10 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm">
                          <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 shadow-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                      Select {plan.name}
                    </button>
                 </div>
               ))}
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-slate-900 text-white p-4 flex justify-between items-center z-50">
          <span className="text-xl font-bold">AdGenius AI</span>
          <button className="p-2 bg-indigo-600 rounded-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
      </div>

      <main className="flex-1 lg:ml-64 p-4 md:p-10 pt-24 lg:pt-10 transition-all">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
