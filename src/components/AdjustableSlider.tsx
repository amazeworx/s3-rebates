'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdjustableSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabledPlus?: boolean;
}

export function AdjustableSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  disabledPlus = false,
}: AdjustableSliderProps) {
  const handleSliderChange = (vals: number[]) => {
    onChange(vals[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabledPlus) {
      onChange(value + step);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex grow items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hover:border-border/50 h-6 w-6 shrink-0 cursor-pointer rounded-lg bg-white disabled:cursor-not-allowed"
            onClick={handleDecrement}
            disabled={value <= min}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Slider
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={handleSliderChange}
            className="grow"
          />
          <Button
            variant="outline"
            size="icon"
            className="hover:border-border/50 h-6 w-6 shrink-0 cursor-pointer rounded-lg bg-white disabled:cursor-not-allowed"
            onClick={handleIncrement}
            disabled={value >= max || disabledPlus}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grow-0">
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="border-border h-8 w-12 rounded bg-white text-center text-sm lg:w-20 lg:pr-1"
          />
        </div>
      </div>
    </div>
  );
}
