'use client';

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
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
          className="flex-grow"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleIncrement}
          disabled={value >= max || disabledPlus}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          className="w-16 h-8 text-center"
        />
      </div>
    </div>
  );
}
