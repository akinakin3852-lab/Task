import { useEffect, useState, useMemo, useCallback, type FormEvent } from 'react';
import {
  Plus,
  Search,
  Loader2,
  ListChecks,
  Clock,
  CheckCircle2,
  TrendingUp,
  Trash2,
  Pencil,
  X,
  ChevronDown,
  Calendar,
  Flag,
  ArrowUpRight,
  Home,
  LogOut,
} from 'lucide-react';
import { supabase, type Task, type TaskInsert, type TaskUpdate } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Logo } from '@/components/Logo';

type StatusFilter = 'all' | 'todo' | 'in_progress' | 'done';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
type SortKey = 'created' | 'priority' | 'due' | 'title';

const statusLabels: Record<Task['status'], string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

const statusStyles: Record<Task['status'], string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-amber-50 text-amber-700',
  done: 'bg-emerald-50 text-emerald-700',
};

const statusDot: Record<Task['status'], string> = {
  todo: 'bg-slate-400',
  in_progress: 'bg-amber-500',
  done: 'bg-emerald-500',
};

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-50 text-blue-600',
  high: 'bg-red-50 text-red-600',
};

const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 };

export function Dashboard({ onBackToLanding }: { onBackToLanding: () => void }) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created');

  // Task form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (queryError) {
      setError('Failed to load your tasks. Please try again.');
      toast('error', 'Could not load tasks.');
    } else {
      setTasks((data ?? []) as Task[]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, inProgress, done, completionRate };
  }, [tasks]);

  // Filtered + sorted tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter((t) => t.priority === priorityFilter);

    const sorted = [...result];
    switch (sortKey) {
      case 'priority':
        sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'due':
        sorted.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return a.due_date.localeCompare(b.due_date);
        });
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'created':
      default:
        sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return sorted;
  }, [tasks, search, statusFilter, priorityFilter, sortKey]);

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setFormError(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error: delError } = await supabase.from('tasks').delete().eq('id', deleteId);
    if (delError) {
      toast('error', 'Failed to delete task.');
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== deleteId));
      toast('success', 'Task deleted.');
    }
    setDeleteId(null);
  };

  const handleStatusToggle = async (task: Task) => {
    const nextStatus: Task['status'] = task.status === 'done' ? 'todo' : 'done';
    const update: TaskUpdate = { status: nextStatus };
    const { error: updError } = await supabase.from('tasks').update(update).eq('id', task.id);
    if (updError) {
      toast('error', 'Could not update status.');
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...update } : t))
      );
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onBackToLanding();
  };

  const userName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onBackToLanding} className="btn-ghost hidden sm:inline-flex">
              <Home className="h-4 w-4" /> Home
            </button>
            <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.email}</span>
            </div>
            <button onClick={handleSignOut} className="btn-ghost">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {userName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your work today.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total tasks"
            value={stats.total}
            icon={ListChecks}
            iconBg="bg-slate-100 text-slate-700"
          />
          <StatCard
            label="In progress"
            value={stats.inProgress}
            icon={Clock}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Completed"
            value={stats.done}
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            label="Completion rate"
            value={`${stats.completionRate}%`}
            icon={TrendingUp}
            iconBg="bg-blue-100 text-blue-700"
          />
        </div>

        {/* Task panel */}
        <div className="mt-8 card">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="input pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as StatusFilter)}
                options={[
                  { value: 'all', label: 'All status' },
                  { value: 'todo', label: 'To do' },
                  { value: 'in_progress', label: 'In progress' },
                  { value: 'done', label: 'Done' },
                ]}
              />
              <FilterSelect
                value={priorityFilter}
                onChange={(v) => setPriorityFilter(v as PriorityFilter)}
                options={[
                  { value: 'all', label: 'All priority' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
              />
              <FilterSelect
                value={sortKey}
                onChange={(v) => setSortKey(v as SortKey)}
                options={[
                  { value: 'created', label: 'Newest' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'due', label: 'Due date' },
                  { value: 'title', label: 'Title A-Z' },
                ]}
              />
              <button onClick={openCreate} className="btn-primary">
                <Plus className="h-4 w-4" /> New task
              </button>
            </div>
          </div>

          {/* List */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button onClick={loadTasks} className="btn-secondary mt-4">Retry</button>
              </div>
            ) : filteredTasks.length === 0 ? (
              <EmptyState hasTasks={tasks.length > 0} onCreate={openCreate} />
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className="group flex items-start gap-3 py-3.5 transition-colors hover:bg-slate-50/50"
                  >
                    <button
                      onClick={() => handleStatusToggle(task)}
                      className="mt-0.5 shrink-0"
                      aria-label="Toggle complete"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                          task.status === 'done'
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {task.status === 'done' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`truncate text-sm font-medium ${
                            task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>
                      {task.description && (
                        <p className="mt-0.5 truncate text-sm text-slate-500">{task.description}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className={`badge ${statusStyles[task.status]}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDot[task.status]}`} />
                          {statusLabels[task.status]}
                        </span>
                        <span className={`badge ${priorityStyles[task.priority]}`}>
                          <Flag className="h-3 w-3" />
                          {priorityLabels[task.priority]}
                        </span>
                        {task.due_date && (
                          <span className="badge bg-slate-100 text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(task)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Edit task"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(task.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent activity summary */}
        {!loading && tasks.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
              <ul className="mt-3 space-y-2">
                {tasks.slice(0, 4).map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{t.title}</span>
                    <span className="ml-auto shrink-0 text-xs text-slate-400">
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">Progress</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{stats.done} of {stats.total} done</span>
                  <span className="font-semibold text-slate-900">{stats.completionRate}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        loading={formLoading}
        error={formError}
        onSubmit={async (data) => {
          setFormLoading(true);
          setFormError(null);
          try {
            if (editing) {
              const update: TaskUpdate = data;
              const { data: updated, error: updError } = await supabase
                .from('tasks')
                .update(update)
                .eq('id', editing.id)
                .select()
                .single();
              if (updError) throw updError;
              setTasks((prev) => prev.map((t) => (t.id === editing.id ? (updated as Task) : t)));
              toast('success', 'Task updated.');
            } else {
              const insert: TaskInsert = data;
              const { data: created, error: insError } = await supabase
                .from('tasks')
                .insert(insert)
                .select()
                .single();
              if (insError) throw insError;
              setTasks((prev) => [created as Task, ...prev]);
              toast('success', 'Task created.');
            }
            setFormOpen(false);
          } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Something went wrong.');
          } finally {
            setFormLoading(false);
          }
        }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete task?"
        message="This action cannot be undone. The task will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string | number;
  icon: typeof ListChecks;
  iconBg: string;
}) {
  return (
    <div className="card animate-fade-in p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function EmptyState({ hasTasks, onCreate }: { hasTasks: boolean; onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ListChecks className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {hasTasks ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        {hasTasks
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Create your first task to start organizing your work.'}
      </p>
      {!hasTasks && (
        <button onClick={onCreate} className="btn-primary mt-5">
          <Plus className="h-4 w-4" /> Create task
        </button>
      )}
    </div>
  );
}

function TaskFormModal({
  open,
  onClose,
  editing,
  loading,
  error,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  editing: Task | null;
  loading: boolean;
  error: string | null;
  onSubmit: (data: TaskInsert) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? '');
      setDescription(editing?.description ?? '');
      setStatus(editing?.status ?? 'todo');
      setPriority(editing?.priority ?? 'medium');
      setDueDate(editing?.due_date ?? '');
    }
  }, [open, editing]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit task' : 'New task'}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="What needs to be done?"
            autoFocus
          />
        </div>

        <div>
          <label className="label" htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[80px] resize-y"
            placeholder="Add details (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="task-status">Status</label>
            <div className="relative">
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="input appearance-none pr-9"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="task-priority">Priority</label>
            <div className="relative">
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="input appearance-none pr-9"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="task-due">Due date</label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            <X className="h-4 w-4" /> Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
