import React from "react";
import * as Goals from "@/models/goals";
import { Target } from "@/models/goalCheckIns";

interface TargetDetailsProps {
  target: Target;
}

export function TargetDetails({ target }: TargetDetailsProps) {
  const progress = Goals.targetProgressPercentage(target);
  const { from, to, unit, value } = target;

  const directionText = from! > to! ? "down to" : "to";

  const formatUnit = (value) => {
    return `${value}${unit === "%" ? "%" : ` ${unit}`}`;
  };

  return (
    <div className="text-sm ml-6 rounded-lg my-2">
      <div className="flex items-center gap-2">
        <div className="w-20 font-semibold">Target</div>
        <div>
          From <span className="font-semibold">{from}</span> {directionText} <span className="font-semibold">{to}</span>
          {unit === "%" ? "%" : ` ${unit}`}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div className="w-20 font-semibold">Current</div>
        <div>
          {formatUnit(value)} ({progress.toFixed(1)}%)
        </div>
      </div>
    </div>
  );
}
