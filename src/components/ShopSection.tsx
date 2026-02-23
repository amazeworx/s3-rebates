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
import { ChevronUp, Trash2, X, RotateCcw } from 'lucide-react';

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
        <div className="fixed right-0 bottom-0 left-0 z-50">
          <div className="container mx-auto max-w-xl cursor-pointer rounded-t-2xl bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors hover:bg-slate-50">
            <div className="bg-muted/50 mx-auto h-1 w-[100px] shrink-0 rounded-full -mt-1 mb-4"></div>
            <div className="container mx-auto flex max-w-xl items-center justify-between">
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
        </div>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:border-0 data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:max-h-[85vh] bg-white max-w-xl mx-auto">
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader className="border-b border-border/30 pb-4">
            <div className="flex justify-between">
              <div className="">
                <DrawerTitle className='text-left'>Exchange Shop</DrawerTitle>
                <DrawerDescription className='text-left'>Select items to exchange with your medals.</DrawerDescription>
              </div>
              <div className='grow-0'>
                <DrawerClose asChild>
                  <Button variant="outline" size="icon" className="rounded-full size-8">
                    <X />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>
          <div className="h-[calc(100vh-20rem)] overflow-y-auto bg-card">
            <div className="space-y-4">
              {(shopData as ShopItem[]).map((item) => {
                const currentQty = cartItems[item.id] || 0;
                const canAffordOneMore = remainingBalance >= item.cost;
                const isMaxed = currentQty >= item.maxExchange;

                return (
                  <div
                    key={item.id}
                    className="border-b border-border/20 py-4 px-4 last:border-b-0"
                  >
                    <div className="flex gap-3">
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

                              <Badge variant="secondary" className="text-[11px]">
                                +{(currentQty * item.qtyPerExchange).toLocaleString()}
                              </Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-3 text-[10px] font-medium text-slate-500">
                              <span>{item.qtyPerExchange}x per unit</span>
                              <span>Cost: {item.cost.toLocaleString()}</span>
                              <span>Limit: {item.maxExchange}</span>
                            </div>
                          </div>
                          <div className="ml-2 shrink-0 text-right text-sm pt-1 font-bold text-slate-900">
                            {(currentQty * item.cost).toLocaleString()}
                            <span className="block text-[10px] font-normal text-slate-500 uppercase">
                              Spent
                            </span>
                          </div>
                        </div>

                        <div className="pt-1">
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
            <div className="flex w-full gap-2 justify-between items-center">
              <div>
                <span
                  className={`text-lg font-bold ${remainingBalance < 0 ? 'text-red-600' : 'text-primary'}`}
                >
                  {remainingBalance.toLocaleString()}
                </span>
                <span className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Available
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setCartItems({})}
                  disabled={totalSpent === 0}
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
