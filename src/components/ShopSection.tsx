'use client';

import * as React from 'react';
import shopData from '../../data/shopData.json';
import { AdjustableSlider } from './AdjustableSlider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { calculateTotalSpent } from '@/lib/calculations';
import { ChevronUp, Trash2 } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  image: string;
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
    <Drawer>
      <DrawerTrigger asChild>
        <div className="fixed right-0 bottom-0 left-0 z-50 cursor-pointer border-t border-slate-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-slate-50">
          <div className="container mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Remaining Balance <ChevronUp className="h-3 w-3" />
              </span>
              <span
                className={`text-xl font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-primary'}`}
              >
                {remainingBalance.toLocaleString()} / {totalEarned.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Total Spent
              </span>
              <span className="text-xl font-bold text-slate-700">
                {totalSpent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-5xl">
          <DrawerHeader className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="text-left">
              <DrawerTitle>Exchange Shop</DrawerTitle>
              <DrawerDescription>Select items to exchange with your medals.</DrawerDescription>
            </div>
            <div className="text-right">
              <span
                className={`font-mono text-lg font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-primary'}`}
              >
                {remainingBalance.toLocaleString()}
              </span>
              <span className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                Available
              </span>
            </div>
          </DrawerHeader>
          <div className="h-[calc(100vh-14rem)] overflow-y-auto p-4">
            <div className="space-y-6">
              {(shopData as ShopItem[]).map((item) => {
                const currentQty = cartItems[item.id] || 0;
                const canAffordOneMore = remainingBalance >= item.cost;
                const isMaxed = currentQty >= item.maxExchange;

                return (
                  <div
                    key={item.id}
                    className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 grow-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl bg-slate-100 object-cover"
                        />
                      </div>
                      <div className="min-w-0 grow">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-bold text-slate-900">
                                {item.name}
                              </h3>
                              {currentQty * item.qtyPerExchange > 0 && (
                                <Badge variant="secondary" className="font-mono text-[10px]">
                                  +{(currentQty * item.qtyPerExchange).toLocaleString()}
                                </Badge>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-3 text-[10px] font-medium text-slate-500">
                              <span>{item.qtyPerExchange}x per unit</span>
                              <span>Cost: {item.cost.toLocaleString()}</span>
                              <span>Limit: {item.maxExchange}</span>
                            </div>
                          </div>
                          <div className="ml-2 shrink-0 text-right font-bold text-slate-900">
                            {(currentQty * item.cost).toLocaleString()}
                            <span className="block text-[10px] font-normal text-slate-400 uppercase">
                              Spent
                            </span>
                          </div>
                        </div>

                        <div className="pt-1">
                          {isMaxed && (
                            <div className="mb-1 text-[10px] font-black tracking-widest text-green-600 uppercase">
                              Maxed Out
                            </div>
                          )}
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
            </div>
          </div>
          <DrawerFooter className="border-t border-slate-100 pt-4">
            <div className="flex w-full gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setCartItems({})}
                disabled={totalSpent === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
