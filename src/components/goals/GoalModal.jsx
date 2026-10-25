import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/UIElements';
import { Check } from 'lucide-react';

export function GoalModal({
  isOpen,
  onClose,
  goal,
  onSave,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (goal) {
      setTitle(goal.title || '');
      setDescription(goal.description || '');
      setSuccessCriteria(goal.successCriteria || '');
      setNotes(goal.notes || '');
    }
  }, [goal, isOpen]);

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(goal.id, {
      title: title.trim(),
      description: description.trim(),
      successCriteria: successCriteria.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Transformation Goal"
      subtitle={`Pillar ${goal.priority}: ${goal.title}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Goal Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-sm text-content-main focus:outline-none focus:border-content-main font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Description & Purpose
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs text-content-main focus:outline-none focus:border-content-main resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Success Criteria & Definition of Done
          </label>
          <textarea
            rows="2"
            value={successCriteria}
            onChange={(e) => setSuccessCriteria(e.target.value)}
            placeholder="e.g. 3+ hours daily code, full system design fluency..."
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs text-content-main focus:outline-none focus:border-content-main resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Personal Notes & Commitments
          </label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Execution principles, reminders, or mindsets..."
            className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs text-content-main focus:outline-none focus:border-content-main resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Check}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
