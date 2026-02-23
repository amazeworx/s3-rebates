'use client';

import * as React from 'react';
import shopData from '../../data/shopData.json';
import { AdjustableSlider } from './AdjustableSlider';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { calculateTotalSpent } from '@/lib/calculations';

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
    <div className="space-y-4">
      <Card className="w-full bg-white gap-4 py-4">
        <CardContent className='px-4'>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Remaining Balance
              </span>
              <span
                className={`text-xl font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-primary'}`}
              >
                {remainingBalance} / {totalEarned}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Total Spent
              </span>
              <span className="text-xl font-bold text-slate-700">{totalSpent}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full bg-white gap-4 py-4">
        <CardContent className='space-y-4 px-4'>
          {(shopData as ShopItem[]).map((item) => {
            const currentQty = cartItems[item.id] || 0;
            const canAffordOneMore = remainingBalance >= item.cost;
            const isMaxed = currentQty >= item.maxExchange;

            return (
              <div
                key={item.id}
                className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <div className="grow-0">
                    <img src="https://placeholdit.com/56x56/dddddd/999999" alt="" className='rounded-xl w-14 h-14' />
                  </div>
                  <div className="grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="inline-flex gap-2">
                          <h3 className="text-sm font-bold text-slate-800">
                            {item.name}
                          </h3>
                          <Badge>{currentQty * item.qtyPerExchange}</Badge>
                        </div>
                      </div>
                      <div className="font-bold text-primary">{currentQty * item.cost}</div>
                    </div>
                    <div className="mt-1.5">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1.5">
                        <span>{item.qtyPerExchange}x | Cost: {item.cost} | Max Limit: {item.maxExchange}</span>
                        {isMaxed && <span className="font-black text-green-600">MAXED</span>}
                      </div>
                      <AdjustableSlider
                        min={0}
                        max={item.maxExchange}
                        value={currentQty}
                        onChange={(val) => handleQuantityChange(item.id, val)}
                        disabledPlus={!canAffordOneMore}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
