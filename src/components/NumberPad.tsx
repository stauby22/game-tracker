interface Props {
  value: string;
  onChange: (val: string) => void;
  onDone: () => void;
}

export default function NumberPad({ value, onChange, onDone }: Props) {
  function press(key: string) {
    if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (key === 'clear') {
      onChange('');
    } else {
      if (value.length >= 4) return;
      onChange(value + key);
    }
  }

  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['clear', '0', 'del'],
  ];

  return (
    <div className="bg-gray-100 p-3 rounded-2xl">
      <div className="text-center py-2 mb-2">
        <span className="text-3xl font-bold text-gray-900 tabular-nums">
          {value === '' ? <span className="text-gray-300">—</span> : value}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.flat().map((key) => (
          <button
            key={key}
            onPointerDown={(e) => {
              e.preventDefault();
              press(key);
            }}
            className={`py-4 rounded-xl text-center font-semibold text-lg active:scale-95 transition-transform select-none
              ${key === 'del' || key === 'clear'
                ? 'bg-white text-gray-500 text-sm border border-gray-200'
                : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
              }`}
          >
            {key === 'del' ? '⌫' : key === 'clear' ? 'C' : key}
          </button>
        ))}
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            onDone();
          }}
          className="col-span-3 py-3.5 rounded-xl bg-blue-500 text-white font-semibold text-base active:bg-blue-600 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
