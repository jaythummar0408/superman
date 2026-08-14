"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

import {
  Panel,
  Field,
  NumberField,
  ResultCard,
  controlInputClass,
  formatNumber,
} from "@/components/tools/utility/utility-tool-ui";

interface UnitDef {
  id: string;
  label: string;
  factor: number; // to base unit
}
interface Category {
  name: string;
  units: UnitDef[];
}

const CATEGORIES: Category[] = [
  {
    name: "Length",
    units: [
      { id: "m", label: "Meter (m)", factor: 1 },
      { id: "km", label: "Kilometer (km)", factor: 1000 },
      { id: "cm", label: "Centimeter (cm)", factor: 0.01 },
      { id: "mm", label: "Millimeter (mm)", factor: 0.001 },
      { id: "mi", label: "Mile (mi)", factor: 1609.344 },
      { id: "yd", label: "Yard (yd)", factor: 0.9144 },
      { id: "ft", label: "Foot (ft)", factor: 0.3048 },
      { id: "in", label: "Inch (in)", factor: 0.0254 },
    ],
  },
  {
    name: "Mass",
    units: [
      { id: "kg", label: "Kilogram (kg)", factor: 1 },
      { id: "g", label: "Gram (g)", factor: 0.001 },
      { id: "mg", label: "Milligram (mg)", factor: 1e-6 },
      { id: "t", label: "Tonne (t)", factor: 1000 },
      { id: "lb", label: "Pound (lb)", factor: 0.45359237 },
      { id: "oz", label: "Ounce (oz)", factor: 0.028349523 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { id: "C", label: "Celsius (°C)", factor: 1 },
      { id: "F", label: "Fahrenheit (°F)", factor: 1 },
      { id: "K", label: "Kelvin (K)", factor: 1 },
    ],
  },
  {
    name: "Volume",
    units: [
      { id: "l", label: "Liter (L)", factor: 1 },
      { id: "ml", label: "Milliliter (mL)", factor: 0.001 },
      { id: "m3", label: "Cubic meter (m³)", factor: 1000 },
      { id: "gal", label: "Gallon (US)", factor: 3.785411 },
      { id: "qt", label: "Quart (US)", factor: 0.946353 },
      { id: "cup", label: "Cup (US)", factor: 0.236588 },
      { id: "floz", label: "Fluid ounce (US)", factor: 0.0295735 },
    ],
  },
  {
    name: "Area",
    units: [
      { id: "m2", label: "Square meter (m²)", factor: 1 },
      { id: "km2", label: "Square km (km²)", factor: 1e6 },
      { id: "ha", label: "Hectare (ha)", factor: 1e4 },
      { id: "acre", label: "Acre", factor: 4046.856 },
      { id: "ft2", label: "Square foot (ft²)", factor: 0.092903 },
      { id: "in2", label: "Square inch (in²)", factor: 0.00064516 },
    ],
  },
  {
    name: "Speed",
    units: [
      { id: "ms", label: "Meter/second (m/s)", factor: 1 },
      { id: "kmh", label: "Kilometer/hour (km/h)", factor: 0.277778 },
      { id: "mph", label: "Miles/hour (mph)", factor: 0.44704 },
      { id: "knot", label: "Knot", factor: 0.514444 },
    ],
  },
  {
    name: "Digital",
    units: [
      { id: "B", label: "Byte (B)", factor: 1 },
      { id: "KB", label: "Kilobyte (KB)", factor: 1024 },
      { id: "MB", label: "Megabyte (MB)", factor: 1024 ** 2 },
      { id: "GB", label: "Gigabyte (GB)", factor: 1024 ** 3 },
      { id: "TB", label: "Terabyte (TB)", factor: 1024 ** 4 },
      { id: "bit", label: "Bit", factor: 0.125 },
    ],
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let c: number;
  if (from === "C") c = value;
  else if (from === "F") c = (value - 32) * (5 / 9);
  else c = value - 273.15;
  if (to === "C") return c;
  if (to === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}

export function UnitConverter() {
  const [catName, setCatName] = useState("Length");
  const cat = CATEGORIES.find((c) => c.name === catName)!;
  const [from, setFrom] = useState(cat.units[0].id);
  const [to, setTo] = useState(cat.units[1].id);
  const [value, setValue] = useState<number | "">(1);

  const changeCategory = (name: string) => {
    const next = CATEGORIES.find((c) => c.name === name)!;
    setCatName(name);
    setFrom(next.units[0].id);
    setTo(next.units[1].id);
  };

  const v = typeof value === "number" ? value : 0;
  const result = useMemo(() => {
    if (catName === "Temperature") return convertTemp(v, from, to);
    const fu = cat.units.find((u) => u.id === from);
    const tu = cat.units.find((u) => u.id === to);
    if (!fu || !tu) return 0;
    return (v * fu.factor) / tu.factor;
  }, [catName, from, to, v, cat.units]);

  const fromLabel = cat.units.find((u) => u.id === from)?.label ?? from;
  const toLabel = cat.units.find((u) => u.id === to)?.label ?? to;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Panel title="Unit converter">
        <div className="space-y-5">
          <Field label="Category">
            <select value={catName} onChange={(e) => changeCategory(e.target.value)} className={`${controlInputClass} cursor-pointer`}>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <Field label="From">
              <select value={from} onChange={(e) => setFrom(e.target.value)} className={`${controlInputClass} cursor-pointer`}>
                {cat.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              title="Swap units"
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <Field label="To">
              <select value={to} onChange={(e) => setTo(e.target.value)} className={`${controlInputClass} cursor-pointer`}>
                {cat.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <NumberField label="Value" value={value} onChange={setValue} />
        </div>
      </Panel>

      <ResultCard
        label={`${formatNumber(v, 6)} ${fromLabel} =`}
        value={`${formatNumber(result, 6)}`}
        sub={toLabel}
      />
    </div>
  );
}
