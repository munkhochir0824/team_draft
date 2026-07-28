"use client";

interface StarRatingProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onChange?: (value: number) => void;
}

const sizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
};

export default function StarRating({
  value,
  label,
  size = "sm",
  editable = false,
  onChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-between gap-2">
      {label && (
        <span className="text-[11px] uppercase tracking-wider text-cs-muted font-medium">
          {label}
        </span>
      )}
      <div className={`flex gap-0.5 ${sizeMap[size]}`}>
        {stars.map((s) => {
          const filled = s <= value;
          return (
            <button
              key={s}
              type="button"
              disabled={!editable}
              onClick={() => onChange?.(s)}
              className={`leading-none ${
                editable ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
              } ${filled ? "text-cs-orange" : "text-cs-border"}`}
              aria-label={`${s} star${s > 1 ? "s" : ""}`}
            >
              ★
            </button>
          );
        })}
      </div>
    </div>
  );
}
