// components/common/filters/PriceFilter.tsx
import { useState } from "react";

interface Props {
  onApply: (min: number | null, max: number | null) => void;
}

const PriceFilter = ({ onApply }: Props) => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  return (
    <div className="space-y-2 p-4 border rounded shadow-sm">
      <h4 className="font-bold text-lg">Filter by Price</h4>
      <input
        type="number"
        placeholder="Min"
        className="border w-full p-2 rounded"
        value={min}
        onChange={(e) => setMin(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max"
        className="border w-full p-2 rounded"
        value={max}
        onChange={(e) => setMax(e.target.value)}
      />
      <button
        className="bg-violet-600 text-white w-full py-2 rounded"
        onClick={() =>
          onApply(min ? parseFloat(min) : 0, max ? parseFloat(max) : Infinity)
        }
      >
        Apply
      </button>
    </div>
  );
};

export default PriceFilter;
