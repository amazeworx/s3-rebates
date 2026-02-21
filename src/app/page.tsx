'use client';

import * as React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TasksSection } from "@/components/TasksSection";
import { ShopSection } from "@/components/ShopSection";

export default function Home() {
  const [buildingLevels, setBuildingLevels] = useLocalStorage<Record<string, number>>("buildingLevels", {});
  const [cartItems, setCartItems] = useLocalStorage<Record<string, number>>("cartItems", {});
  const [totalEarned, setTotalEarned] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-amber-600 font-mono animate-pulse uppercase tracking-[0.2em]">Initializing System...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500/30">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-white">DW</div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900">
              Rebate <span className="text-amber-600">Calculator</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 font-mono text-sm">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 leading-none font-bold">SYSTEM STATUS</span>
              <span className="text-green-600 font-bold">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Tasks Section (Left/Top) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-l-4 border-amber-500 pl-4 py-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Building Progress</h2>
              <button 
                onClick={() => setBuildingLevels({})}
                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
              >
                Reset Progress
              </button>
            </div>
            <TasksSection 
              levels={buildingLevels} 
              setLevels={setBuildingLevels} 
              onTotalEarnedChange={setTotalEarned}
            />
          </div>

          {/* Shop Section (Right/Bottom) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-l-4 border-blue-600 pl-4 py-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Exchange Shop</h2>
              <button 
                onClick={() => setCartItems({})}
                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
              >
                Clear Cart
              </button>
            </div>
            <ShopSection 
              totalEarned={totalEarned}
              cartItems={cartItems}
              setCartItems={setCartItems}
              onTotalSpentChange={() => {}}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold">
            Season Building Rebates Protocol
          </div>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            Data values are based on the latest game event specifications. 
            Accumulative rewards are automatically calculated per tier level.
          </p>
        </div>
      </footer>
    </div>
  );
}
