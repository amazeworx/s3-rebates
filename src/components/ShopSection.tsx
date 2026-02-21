'use client';

import * as React from "react";
import shopData from "../../data/shopData.json";
import { AdjustableSlider } from "./AdjustableSlider";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { calculateTotalSpent } from "@/lib/calculations";

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  maxExchange: number;
  qtyPerExchange: number;
}

interface ShopSectionProps {
  totalEarned: number;
  cartItems: Record<string, number>;
  setCartItems: (items: Record<string, number>) => void;
  onTotalSpentChange: (total: number) => void;
}

export function ShopSection({
  totalEarned,
  cartItems,
  setCartItems,
  onTotalSpentChange,
}: ShopSectionProps) {
  const totalSpent = calculateTotalSpent(cartItems);
  const remainingBalance = totalEarned - totalSpent;

  React.useEffect(() => {
    onTotalSpentChange(totalSpent);
  }, [totalSpent, onTotalSpentChange]);

  const handleQuantityChange = (id: string, value: number) => {
    const item = (shopData as ShopItem[]).find((i) => i.id === id);
    if (!item) return;

    const currentQty = cartItems[id] || 0;
    
    // Calculate max affordable quantity based on total available funds (current balance + what's already spent on this item)
    const currentSpentOnItem = currentQty * item.cost;
    const totalAvailableForItem = remainingBalance + currentSpentOnItem;
    const maxAffordable = Math.floor(totalAvailableForItem / item.cost);
    
    // Clamp the new value
    const newValue = Math.min(value, maxAffordable, item.maxExchange);
    
    const nextItems = { ...cartItems, [id]: newValue };
    setCartItems(nextItems);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-20 z-10 bg-white/90 backdrop-blur-md p-4 border border-slate-200 rounded-lg flex justify-between items-center shadow-md transition-all">
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Remaining Balance</span>
          <span className={`text-2xl font-mono font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-amber-600'}`}>
            {remainingBalance} / {totalEarned}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-xs uppercase tracking-widest font-bold block">Total Spent</span>
          <span className="text-xl font-mono font-bold text-slate-700">{totalSpent}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {(shopData as ShopItem[]).map((item) => {
          const currentQty = cartItems[item.id] || 0;
          const canAffordOneMore = remainingBalance >= item.cost;
          const isMaxed = currentQty >= item.maxExchange;

          return (
            <Card key={item.id} className="bg-white border-slate-200 text-slate-900 hover:border-amber-500/50 transition-colors shadow-sm">
              <CardContent className="p-4 grid gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base text-slate-800 font-bold">{item.name}</CardTitle>
                    <div className="text-xs text-slate-500 mt-1 font-medium">
                      {item.qtyPerExchange}x per exchange | Cost: {item.cost}
                    </div>
                  </div>
                  <div className="text-amber-600 font-mono font-bold">
                    {currentQty * item.cost}
                  </div>
                </div>
                
                <AdjustableSlider
                  min={0}
                  max={item.maxExchange}
                  value={currentQty}
                  onChange={(val) => handleQuantityChange(item.id, val)}
                  disabledPlus={!canAffordOneMore}
                />
                
                <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-tighter font-bold">
                  <span>Max Limit: {item.maxExchange}</span>
                  {isMaxed && <span className="text-green-600 font-black">MAXED</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
