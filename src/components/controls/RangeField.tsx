interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: RangeFieldProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <label className="range-field">
      <span className="range-label-row">
        <span>{label}</span>
        <strong>
          {value} {suffix}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="range-bounds">
        <small>{min}</small>
        <small>{max}</small>
      </span>
    </label>
  );
}
