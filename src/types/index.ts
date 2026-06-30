// ============================================================
// Core types for 我的计划日历
// ============================================================

// ---------- Enums / Literal unions ----------

export type Period = 'morning' | 'afternoon' | 'evening'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type CalendarView = 'month' | 'week' | 'day'
export type MeasurementType = 'boolean' | 'count' | 'duration' | 'numeric'
export type ThemeMode = 'light' | 'dark' | 'system'
export type WeekStartDay = 0 | 1 | 6 // Sunday, Monday, Saturday

// ---------- Recurrence ----------

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays'
  interval: number // e.g., every 2 days/weeks
  byWeekday?: number[] // ISO weekdays (1=Mon..7=Sun)
  byMonthDay?: number
  bySetPos?: number // e.g., 1st, 2nd, 3rd, -1 (last)
  endDate?: string // ISO date string
  count?: number // Max occurrences
}

// ---------- Task (Plan Item) ----------

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  task_date: string // ISO date (YYYY-MM-DD), no time
  period: Period
  start_time?: string // HH:mm
  end_time?: string // HH:mm
  tag_id?: string
  priority: Priority
  status: TaskStatus
  estimated_minutes?: number
  actual_minutes?: number
  reminder_at?: string // ISO datetime with tz
  recurrence_rule?: RecurrenceRule | null
  recurrence_parent_id?: string
  order_index: number
  completed_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  // Populated relations
  tag?: Tag
  subitems?: TaskSubitem[]
}

export interface TaskSubitem {
  id: string
  user_id: string
  task_id: string
  title: string
  is_completed: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface RecurrenceException {
  id: string
  user_id: string
  task_id: string
  exception_date: string // The date that is modified/skipped
  action: 'skip' | 'modify'
  modified_data?: Partial<Task>
  created_at: string
}

// ---------- Tag ----------

export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  icon?: string
  is_default: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ---------- Habit ----------

export interface Habit {
  id: string
  user_id: string
  name: string
  description?: string
  icon?: string
  color?: string
  measurement_type: MeasurementType
  target_value: number
  unit?: string
  schedule_rule: RecurrenceRule // e.g., daily, weekdays
  reminder_time?: string
  start_date: string
  archived_at?: string
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  habit_id: string
  log_date: string
  value: number
  is_completed: boolean
  note?: string
  created_at: string
  updated_at: string
}

// ---------- Daily Review ----------

export interface DailyReview {
  id: string
  user_id: string
  review_date: string
  score?: number // 1-10
  subjective_completion?: number // 0-100
  mood?: number // 1-5
  energy?: number // 1-5
  achievement?: string
  unfinished?: string
  problems?: string
  lessons?: string
  tomorrow_focus?: string
  summary?: string
  created_at: string
  updated_at: string
}

// ---------- Task Template ----------

export interface TaskTemplate {
  id: string
  user_id: string
  name: string
  description?: string
  template_data: Partial<Task>[]
  created_at: string
  updated_at: string
}

// ---------- User ----------

export interface UserProfile {
  id: string
  display_name?: string
  avatar_url?: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  user_id: string
  theme: ThemeMode
  accent_color: string
  default_calendar_view: CalendarView
  week_starts_on: WeekStartDay
  timezone: string
  notification_enabled: boolean
  compact_mode: boolean
  created_at: string
  updated_at: string
}

// ---------- UI state types ----------

export interface TaskFormData {
  title: string
  description?: string
  task_date: string
  period: Period
  start_time?: string
  end_time?: string
  tag_id?: string
  priority: Priority
  status: TaskStatus
  estimated_minutes?: number
  reminder_at?: string
  recurrence_rule?: RecurrenceRule | null
}

export interface DailyReviewFormData {
  score?: number
  subjective_completion?: number
  mood?: number
  energy?: number
  achievement?: string
  unfinished?: string
  problems?: string
  lessons?: string
  tomorrow_focus?: string
  summary?: string
}

export interface HabitFormData {
  name: string
  description?: string
  icon?: string
  color?: string
  measurement_type: MeasurementType
  target_value: number
  unit?: string
  schedule_rule: RecurrenceRule
  reminder_time?: string
  start_date: string
}

// ---------- Stats ----------

export interface TaskStats {
  total: number
  done: number
  inProgress: number
  todo: number
  cancelled: number
  overdue: number
  completion_rate: number
  by_period: Record<Period, { total: number; done: number }>
  by_tag: Record<string, { total: number; done: number; name: string; color: string }>
  by_priority: Record<Priority, { total: number; done: number }>
}

export interface HabitStats {
  total: number
  active: number
  today_completed: number
  week_completion: number
  month_completion: number
  streaks: Record<string, { current: number; longest: number }>
}

// ---------- Date Range ----------

export interface DateRange {
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
}

// ---------- Repository Data types (IndexedDB local types) ----------

export interface LocalTask extends Task {
  _synced?: boolean
  _pendingDelete?: boolean
}

export interface LocalHabitLog extends HabitLog {
  _synced?: boolean
}
