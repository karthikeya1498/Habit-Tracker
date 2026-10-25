import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { isHabitScheduledForDate } from '../utils/dateUtils';
import { DateNavigator } from '../components/habits/DateNavigator';
import { HabitRow } from '../components/habits/HabitRow';
import { HabitLogModal } from '../components/habits/HabitLogModal';
import { HabitModal } from '../components/habits/HabitModal';
import { Card, Button, Badge } from '../components/common/UIElements';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Code,
  MessageSquare,
  Dumbbell,
  Inbox
} from 'lucide-react';

const CATEGORY_META = {
  technical: {
    name: 'Technical Mastery',
    icon: Code,
    number: '01',
  },
  communication: {
    name: 'Communication & Confidence',
    icon: MessageSquare,
    number: '02',
  },
  fitness: {
    name: 'Athletic Physique',
    icon: Dumbbell,
    number: '03',
  },
};

export function HabitsPage() {
  const {
    habits,
    records,
    selectedDate,
    updateHabitProgress,
    addHabit,
    editHabit,
    reorderHabits
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'incomplete'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [logModalHabit, setLogModalHabit] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits
      .filter(h => !h.archivedAt || h.archivedAt > selectedDate)
      .filter(h => {
        if (categoryFilter !== 'all' && h.categoryId !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = h.name.toLowerCase().includes(q);
          const matchDesc = h.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        if (statusFilter !== 'all') {
          const rec = records[`${h.id}_${selectedDate}`];
          const isDone = Boolean(rec && rec.completed);
          if (statusFilter === 'completed' && !isDone) return false;
          if (statusFilter === 'incomplete' && isDone) return false;
        }
        return true;
      })
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [habits, records, selectedDate, categoryFilter, statusFilter, searchQuery]);

  // Group by category
  const categoriesPresent = useMemo(() => {
    const list = ['technical', 'communication', 'fitness'];
    if (categoryFilter !== 'all') return [categoryFilter];
    return list;
  }, [categoryFilter]);

  // Handle reordering
  const handleMove = (habit, direction) => {
    const catHabits = habits.filter(h => h.categoryId === habit.categoryId);
    const index = catHabits.findIndex(h => h.id === habit.id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= catHabits.length) return;

    const swapped = [...catHabits];
    const temp = swapped[index];
    swapped[index] = swapped[targetIndex];
    swapped[targetIndex] = temp;

    // Update global habits order
    const otherHabits = habits.filter(h => h.categoryId !== habit.categoryId);
    reorderHabits([...otherHabits, ...swapped]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase">
            Daily Habits
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Record your daily execution. What gets measured gets improved.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Add New Habit
        </Button>
      </div>

      {/* Date Navigator */}
      <DateNavigator />

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-card border border-surface-border rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface-hover/50 border border-surface-border rounded-lg text-xs text-content-main placeholder:text-content-muted focus:outline-none focus:border-content-main"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category */}
          <div className="flex items-center gap-1 bg-surface-hover/60 p-1 rounded-lg border border-surface-border text-xs">
            {['all', 'technical', 'communication', 'fitness'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors font-medium ${
                  categoryFilter === cat
                    ? 'bg-surface-card text-content-main shadow-subtle font-semibold'
                    : 'text-content-secondary hover:text-content-main'
                }`}
              >
                {cat === 'all' ? 'All Pillars' : cat === 'technical' ? 'Technical' : cat === 'communication' ? 'Comm' : 'Fitness'}
              </button>
            ))}
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 bg-surface-hover/60 p-1 rounded-lg border border-surface-border text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'incomplete', label: 'Pending' },
              { id: 'completed', label: 'Done' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  statusFilter === s.id
                    ? 'bg-surface-card text-content-main shadow-subtle font-semibold'
                    : 'text-content-secondary hover:text-content-main'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habit Groups by Category */}
      <div className="space-y-6">
        {categoriesPresent.map((catId) => {
          const meta = CATEGORY_META[catId];
          const habitsInCat = filteredHabits.filter(h => h.categoryId === catId);
          if (habitsInCat.length === 0) return null;

          const Icon = meta.icon;
          const completedInCat = habitsInCat.filter(h => {
            const rec = records[`${h.id}_${selectedDate}`];
            return rec && rec.completed;
          }).length;

          return (
            <div key={catId} className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-1 border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-content-muted">
                    {meta.number}
                  </span>
                  <div className="p-1 rounded bg-surface-hover text-content-main">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-content-main font-mono">
                    {meta.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-content-secondary">
                  <span>{completedInCat} / {habitsInCat.filter(h => isHabitScheduledForDate(h, selectedDate)).length} scheduled done</span>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {habitsInCat.map((h, idx) => (
                  <HabitRow
                    key={h.id}
                    habit={h}
                    dateKey={selectedDate}
                    onOpenLogModal={(habit) => setLogModalHabit(habit)}
                    onOpenEditModal={(habit) => setEditingHabit(habit)}
                    onMoveUp={() => handleMove(h, 'up')}
                    onMoveDown={() => handleMove(h, 'down')}
                    isFirst={idx === 0}
                    isLast={idx === habitsInCat.length - 1}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div className="text-center py-16 bg-surface-card border border-surface-border rounded-xl space-y-3">
            <Inbox className="w-8 h-8 text-content-muted mx-auto" />
            <h3 className="text-sm font-semibold text-content-main">No habits match your filters</h3>
            <p className="text-xs text-content-secondary max-w-sm mx-auto">
              Try adjusting your pillar or status filter, or create a new habit for this date.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Habit Progress & Notes Log Modal */}
      {logModalHabit && (
        <HabitLogModal
          isOpen={Boolean(logModalHabit)}
          onClose={() => setLogModalHabit(null)}
          habit={logModalHabit}
          dateKey={selectedDate}
          currentRecord={records[`${logModalHabit.id}_${selectedDate}`]}
          onSave={updateHabitProgress}
        />
      )}

      {/* Habit Create / Edit Modal */}
      {(isCreateModalOpen || editingHabit) && (
        <HabitModal
          isOpen={isCreateModalOpen || Boolean(editingHabit)}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingHabit(null);
          }}
          habit={editingHabit}
          onSave={(data) => {
            if (editingHabit) {
              editHabit(editingHabit.id, data);
            } else {
              addHabit(data);
            }
          }}
        />
      )}
    </div>
  );
}
