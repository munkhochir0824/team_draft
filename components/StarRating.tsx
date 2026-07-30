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
          const fill = Math.max(0, Math.min(1, value - (s - 1)));
          return (
            <span
              key={s}
              className={`relative inline-block leading-none text-cs-border ${
                editable ? "transition-transform hover:scale-110" : ""
              }`}
            >
              ★
              <span
                className="absolute inset-y-0 left-0 overflow-hidden text-cs-orange"
                style={{ width: `${fill * 100}%` }}
              >
                ★
              </span>
              {editable && (
                <span className="absolute inset-0 flex">
                  <button
                    type="button"
                    onClick={() => onChange?.(s - 0.5)}
                    className="h-full w-1/2 cursor-pointer"
                    aria-label={`${s - 0.5} stars`}
                  />
                  <button
                    type="button"
                    onClick={() => onChange?.(s)}
                    className="h-full w-1/2 cursor-pointer"
                    aria-label={`${s} stars`}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
