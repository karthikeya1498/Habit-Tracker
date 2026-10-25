import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/UIElements';
import { Check, Plus, Trash2 } from 'lucide-react';

export function HabitLogModal({
  isOpen,
  onClose,
  habit,
  dateKey,
  currentRecord,
  onSave
}) {
  const [actualValue, setActualValue] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState('');
  const [words, setWords] = useState([]); // For vocabulary habit

  useEffect(() => {
    if (habit) {
      if (currentRecord) {
        setActualValue(currentRecord.actualValue !== undefined ? currentRecord.actualValue : (currentRecord.completed ? habit.targetValue : 0));
        setCompleted(Boolean(currentRecord.completed));
        setNote(currentRecord.note || '');
        setWords(currentRecord.words || []);
      } else {
        setActualValue(0);
        setCompleted(false);
        setNote('');
        setWords([]);
      }
    }
  }, [habit, currentRecord, isOpen]);

  if (!habit) return null;

  const isVocab = habit.id === 'habit_vocab';
  const target = habit.targetValue || 1;

  const handleAddWord = () => {
    setWords(prev => [...prev, { word: '', meaning: '', example: '' }]);
  };

  const handleUpdateWord = (index, field, value) => {
    setWords(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveWord = (index) => {
    setWords(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalVal = isVocab ? words.filter(w => w.word.trim()).length : Number(actualValue);
    const finalCompleted = completed || finalVal >= target;
    onSave(habit.id, dateKey, finalVal, finalCompleted, note, words);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habit.name}
      subtitle={`Target: ${target} ${habit.unit} • ${dateKey}`}
      maxWidth={isVocab ? 'max-w-lg' : 'max-w-md'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <p className="text-xs text-content-secondary leading-relaxed bg-surface-hover/50 p-2.5 rounded-lg border border-surface-border">
          {habit.description}
        </p>

        {/* Input depending on habit tracking type */}
        {habit.trackingType === 'binary' ? (
          <div className="flex items-center gap-3 p-3 bg-surface-hover/30 rounded-xl border border-surface-border">
            <input
              type="checkbox"
              id="binary-complete-toggle"
              checked={completed}
              onChange={(e) => {
                setCompleted(e.target.checked);
                setActualValue(e.target.checked ? target : 0);
              }}
              className="w-5 h-5 rounded border-surface-border-strong text-content-main focus:ring-content-accent"
            />
            <label htmlFor="binary-complete-toggle" className="text-sm font-medium text-content-main cursor-pointer">
              Mark as completed for this day
            </label>
          </div>
        ) : isVocab ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-content-main uppercase font-mono">
                Vocabulary Words ({words.filter(w => w.word.trim()).length} / {target})
              </label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddWord} icon={Plus}>
                Add Word
              </Button>
            </div>

            {words.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-surface-border rounded-lg text-xs text-content-muted">
                No words recorded yet today. Click "Add Word" to log.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {words.map((w, idx) => (
                  <div key={idx} className="p-2.5 bg-surface-hover/40 border border-surface-border rounded-lg space-y-1.5 relative group">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-content-muted">{idx + 1}.</span>
                      <input
                        type="text"
                        placeholder="Word (e.g. Tenacious)"
                        value={w.word}
                        onChange={(e) => handleUpdateWord(idx, 'word', e.target.value)}
                        className="flex-1 text-xs font-semibold px-2 py-1 bg-surface-card border border-surface-border rounded text-content-main focus:outline-none focus:border-content-main"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWord(idx)}
                        className="text-content-muted hover:text-status-missed p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Meaning / Definition"
                      value={w.meaning}
                      onChange={(e) => handleUpdateWord(idx, 'meaning', e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-surface-card border border-surface-border rounded text-content-secondary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Example sentence"
                      value={w.example}
                      onChange={(e) => handleUpdateWord(idx, 'example', e.target.value)}
                      className="w-full text-xs italic px-2 py-1 bg-surface-card border border-surface-border rounded text-content-secondary focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-content-main uppercase font-mono">
                Progress ({habit.unit})
              </label>
              <span className="text-xs text-content-secondary font-mono">
                {actualValue} / {target} {habit.unit}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                step={habit.unit === 'hours' ? '0.5' : '1'}
                value={actualValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setActualValue(val);
                  setCompleted(val >= target);
                }}
                className="w-32 px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm font-mono text-content-main focus:outline-none focus:border-content-main"
              />
              <span className="text-sm text-content-secondary">{habit.unit}</span>

              {/* Quick increment buttons */}
              {habit.unit === 'min' && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {[15, 30, 60].map(add => (
                    <button
                      key={add}
                      type="button"
                      onClick={() => {
                        const next = Number(actualValue) + add;
                        setActualValue(next);
                        setCompleted(next >= target);
                      }}
                      className="px-2 py-1 text-xs font-mono bg-surface-hover hover:bg-surface-active rounded border border-surface-border text-content-main"
                    >
                      +{add}m
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Completion checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="habit-completed-status"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border-strong text-content-main"
              />
              <label htmlFor="habit-completed-status" className="text-xs text-content-secondary cursor-pointer">
                Mark as fulfilled ({actualValue >= target ? 'Target reached' : 'Partial or manual mark'})
              </label>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-content-main uppercase font-mono">
            Notes / Reflection (Optional)
          </label>
          <textarea
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context, project link, exercise completed, or lesson learned..."
            className="w-full text-xs p-2.5 bg-surface-card border border-surface-border rounded-lg text-content-main placeholder:text-content-muted focus:outline-none focus:border-content-main resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Check}>
            Save Record
          </Button>
        </div>
      </form>
    </Modal>
  );
}
