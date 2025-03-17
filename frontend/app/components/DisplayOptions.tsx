import { Dispatch, SetStateAction } from 'react';

type DisplayOption = 1 | 3 | 6;

type DisplayOptionsProps = {
  displayOption: DisplayOption;
  setDisplayOption: Dispatch<SetStateAction<DisplayOption>>;
};

export default function DisplayOptions({ displayOption, setDisplayOption }: DisplayOptionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Display:</span>
      <div className="flex space-x-1">
        <button
          onClick={() => setDisplayOption(1)}
          className={`p-2 rounded-lg transition-all ${
            displayOption === 1
              ? 'bg-white/50 text-warm-gray'
              : 'text-warm-gray/80 hover:text-warm-gray hover:bg-white/50'
          }`}
          title="One per row"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={() => setDisplayOption(3)}
          className={`p-2 rounded-lg transition-all ${
            displayOption === 3
              ? 'bg-white/50 text-warm-gray'
              : 'text-warm-gray/80 hover:text-warm-gray hover:bg-white/50'
          }`}
          title="Three per row"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h4M12 6h4M20 6h4M4 12h4M12 12h4M20 12h4M4 18h4M12 18h4M20 18h4" />
          </svg>
        </button>
        <button
          onClick={() => setDisplayOption(6)}
          className={`p-2 rounded-lg transition-all ${
            displayOption === 6
              ? 'bg-white/50 text-warm-gray'
              : 'text-warm-gray/80 hover:text-warm-gray hover:bg-white/50'
          }`}
          title="Six per row"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h2M8 6h2M12 6h2M16 6h2M20 6h2M4 12h2M8 12h2M12 12h2M16 12h2M20 12h2M4 18h2M8 18h2M12 18h2M16 18h2M20 18h2" />
          </svg>
        </button>
      </div>
    </div>
  );
} 