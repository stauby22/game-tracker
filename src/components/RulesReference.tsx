import type { GameId } from '../types';
import { DIRTY_DEUCE_CARD_VALUES, DIRTY_DEUCE_RULES } from '../games/dirtyDeuce';
import { PHASE_10_CARD_VALUES, PHASE_10_RULES, PHASES } from '../games/phaseTen';
import { MEXICAN_TRAIN_RULES } from '../games/mexicanTrain';
import { SKIP_BO_RULES } from '../games/skipBo';

interface Props {
  gameId: GameId;
  onClose: () => void;
}

function parseMarkdown(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={`text-sm text-gray-700 ${i > 0 ? 'mt-2' : ''}`}>
        {parts.map((part, j) =>
          part.startsWith('**') ? (
            <strong key={j} className="font-semibold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default function RulesReference({ gameId, onClose }: Props) {
  const titles: Record<GameId, string> = {
    'dirty-deuce': 'Dirty Deuce Rules',
    'phase-10': 'Phase 10 Rules',
    'mexican-train': 'Mexican Train Rules',
    'skip-bo': 'Skip-Bo Rules',
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-h-[85svh] overflow-y-auto pb-safe slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-bold text-gray-900">{titles[gameId]}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 tap-active">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Card values for scoring games */}
          {(gameId === 'dirty-deuce' || gameId === 'phase-10') && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Card Values (points in hand)</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {(gameId === 'dirty-deuce' ? DIRTY_DEUCE_CARD_VALUES : PHASE_10_CARD_VALUES).map((cv, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2.5 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="text-sm text-gray-700">{cv.label}</span>
                    <span className="text-sm font-bold text-gray-900">{cv.value} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase list for phase-10 */}
          {gameId === 'phase-10' && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">The 10 Phases</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {PHASES.map((phase, i) => (
                  <div key={i} className={`flex items-start gap-3 px-3 py-2.5 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="text-xs font-bold text-blue-500 w-5 mt-0.5 flex-shrink-0">{i + 1}</span>
                    <span className="text-sm text-gray-700">{phase}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules text */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Rules</p>
            <div className="space-y-1">
              {parseMarkdown(
                gameId === 'dirty-deuce'
                  ? DIRTY_DEUCE_RULES
                  : gameId === 'phase-10'
                  ? PHASE_10_RULES
                  : gameId === 'mexican-train'
                  ? MEXICAN_TRAIN_RULES
                  : SKIP_BO_RULES
              )}
            </div>
          </div>
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}
