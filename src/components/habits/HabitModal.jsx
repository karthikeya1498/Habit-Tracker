import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/UIElements';
import { Check } from 'lucide-react';

export function HabitModal({
  isOpen,
  onClose,
  habit, // null if creating new
  onSave,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('technical');
  const [trackingType, setTrackingType] = useState('duration');
  const [schedule, setSchedule] = useState('daily');
  const [targetValue, setTargetValue] = useState(30);
  const [unit, setUnit] = useState('min');
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setCategoryId(habit.categoryId || 'technical');
      setTrackingType(habit.trackingType || 'duration');
      setSchedule(habit.schedule || 'daily');
      setTargetValue(habit.targetValue || 30);
      setUnit(habit.unit || 'min');
      setIsPrimary(Boolean(habit.isPrimary));
    } else {
      setName('');
      setDescription('');
      setCategoryId('technical');
      setTrackingType('duration');
      setSchedule('daily');
      setTargetValue(30);
      setUnit('min');
      setIsPrimary(false);
    }
  }, [habit, isOpen]);

  const handleTrackingTypeChange = (type) => {
    setTrackingType(type);
    if (type === 'duration') setUnit('min');
    else if (type === 'count') setUnit('words');
    else if (type === 'numeric') setUnit('ml');
    else if (type === 'binary') {
      setUnit('check');
      setTargetValue(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      categoryId,
      trackingType,
      schedule,
      targetValue: Number(targetValue) || 1,
      unit: unit.trim() || 'session',
      isPrimary,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habit ? 'Edit Habit' : 'Create New Habit'}
      subtitle="Define what you will execute consistently"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Habit Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Habit Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Daily LeetCode & Data Structures"
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-content-main focus:outline-none focus:border-content-main"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Description / Standard
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does fulfilling this habit mean specifically?"
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs text-content-main focus:outline-none focus:border-content-main resize-none"
          />
        </div>

        {/* Category & Tracking Type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase font-mono text-content-main">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-medium text-content-main focus:outline-none focus:border-content-main"
            >
              <option value="technical">Technical Mastery</option>
              <option value="communication">Communication & Confidence</option>
              <option value="fitness">Athletic Physique</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase font-mono text-content-main">
              Tracking Metric
            </label>
            <select
              value={trackingType}
              onChange={(e) => handleTrackingTypeChange(e.target.value)}
              className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-medium text-content-main focus:outline-none focus:border-content-main"
            >
              <option value="duration">Duration (Minutes)</option>
              <option value="binary">Binary (Completed / Not)</option>
              <option value="count">Count (Units / Words)</option>
              <option value="numeric">Numeric (ml, reps, pages)</option>
            </select>
          </div>
        </div>

        {/* Schedule Frequency */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Schedule Frequency
          </label>
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-medium text-content-main focus:outline-none focus:border-content-main"
          >
            <option value="daily">Daily (Every Day)</option>
            <option value="weekends">Weekends Only (Saturday & Sunday)</option>
            <option value="weekdays">Weekdays Only (Monday to Friday)</option>
          </select>
          <p className="text-[10px] text-content-muted">
            {schedule === 'weekends'
              ? 'This habit is scheduled only on Saturday and Sunday (e.g. CS Fundamentals, DS, OS, System Design).'
              : schedule === 'daily'
              ? 'This habit is scheduled every single day (e.g. 3-hour daily coding session).'
              : 'This habit is scheduled Monday through Friday.'}
          </p>
        </div>

        {/* Target Value and Unit */}
        {trackingType !== 'binary' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase font-mono text-content-main">
                Daily Target
              </label>
              <input
                type="number"
                min="1"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm font-mono text-content-main focus:outline-none focus:border-content-main"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase font-mono text-content-main">
                Unit Label
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. min, words, ml"
                className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm font-mono text-content-main focus:outline-none focus:border-content-main"
              />
            </div>
          </div>
        )}

        {/* Primary habit flag */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="primary-habit-flag"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="w-4 h-4 rounded border-surface-border-strong text-content-main"
          />
          <label htmlFor="primary-habit-flag" className="text-xs text-content-secondary cursor-pointer">
            Mark as Primary Anchor Habit for this pillar
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Check}>
            {habit ? 'Save Changes' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
