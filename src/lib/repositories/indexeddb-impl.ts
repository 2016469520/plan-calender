// ============================================================
// IndexedDB Repository Implementation
// ============================================================

import { getDB } from '@/lib/db/indexeddb'
import type {
  ITaskRepository,
  ITagRepository,
  IHabitRepository,
  IHabitLogRepository,
  IDailyReviewRepository,
  ITaskTemplateRepository,
  IUserRepository,
  ITaskSubitemRepository,
  IRecurrenceExceptionRepository,
  RepositoryFactory,
} from '@/lib/repositories/interfaces'
import type {
  Task,
  TaskSubitem,
  Tag,
  Habit,
  HabitLog,
  DailyReview,
  TaskTemplate,
  UserProfile,
  UserPreferences,
  RecurrenceException,
  DateRange,
} from '@/types'
import { nowISO } from '@/lib/utils/date'

// ---------- Helpers ----------

function genId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

function makeRecord<T>(userId: string, data: Partial<T>): T {
  const now = nowISO()
  return {
    id: genId(),
    user_id: userId,
    created_at: now,
    updated_at: now,
    ...data,
  } as unknown as T
}

// ---------- Task Repository ----------

class IndexedDBTaskRepository implements ITaskRepository {
  async getByDateRange(userId: string, range: DateRange): Promise<Task[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('tasks', 'user_id', userId)
    return all.filter(
      (t) => t.task_date >= range.start && t.task_date <= range.end && !t.deleted_at
    )
  }

  async getByDate(userId: string, date: string): Promise<Task[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('tasks', 'user_date', [userId, date])
    return all.filter((t) => !t.deleted_at)
  }

  async getById(userId: string, id: string): Promise<Task | null> {
    const db = await getDB()
    const task = await db.get('tasks', id)
    if (!task || task.user_id !== userId || task.deleted_at) return null
    return task
  }

  async create(
    userId: string,
    data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Task> {
    const db = await getDB()
    const task = makeRecord<Task>(userId, data)
    await db.add('tasks', task)
    return task
  }

  async update(userId: string, id: string, data: Partial<Task>): Promise<Task> {
    const db = await getDB()
    const existing = await db.get('tasks', id)
    if (!existing || existing.user_id !== userId) throw new Error('Task not found')
    const updated = { ...existing, ...data, updated_at: nowISO() }
    await db.put('tasks', updated)
    return updated
  }

  async softDelete(userId: string, id: string): Promise<void> {
    await this.update(userId, id, { deleted_at: nowISO() } as Partial<Task>)
  }

  async restore(userId: string, id: string): Promise<void> {
    await this.update(userId, id, { deleted_at: undefined } as Partial<Task>)
  }

  async permanentlyDelete(userId: string, id: string): Promise<void> {
    const db = await getDB()
    const existing = await db.get('tasks', id)
    if (!existing || existing.user_id !== userId) return
    await db.delete('tasks', id)
  }

  async reorder(userId: string, updates: { id: string; order_index: number }[]): Promise<void> {
    const db = await getDB()
    for (const { id, order_index } of updates) {
      const task = await db.get('tasks', id)
      if (task && task.user_id === userId) {
        task.order_index = order_index
        task.updated_at = nowISO()
        await db.put('tasks', task)
      }
    }
  }

  async moveTask(
    userId: string,
    id: string,
    target: { task_date?: string; period?: string; order_index?: number }
  ): Promise<Task> {
    const db = await getDB()
    const task = await db.get('tasks', id)
    if (!task || task.user_id !== userId) throw new Error('Task not found')
    const updated = { ...task, ...target, updated_at: nowISO() }
    await db.put('tasks', updated)
    return updated
  }

  async search(userId: string, query: string): Promise<Task[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('tasks', 'user_id', userId)
    const q = query.toLowerCase()
    return all.filter(
      (t) =>
        !t.deleted_at &&
        (t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)))
    )
  }

  async filter(
    userId: string,
    options: import('@/lib/repositories/interfaces').TaskFilterOptions
  ): Promise<Task[]> {
    const db = await getDB()
    let all = await db.getAllFromIndex('tasks', 'user_id', userId)
    all = all.filter((t) => !t.deleted_at)

    if (options.search) {
      const q = options.search.toLowerCase()
      all = all.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    }

    if (options.tagIds && options.tagIds.length > 0) {
      all = all.filter((t) => t.tag_id && options.tagIds!.includes(t.tag_id))
    }

    if (options.status && options.status.length > 0) {
      all = all.filter((t) => options.status!.includes(t.status))
    }

    if (options.priority && options.priority.length > 0) {
      all = all.filter((t) => options.priority!.includes(t.priority))
    }

    if (options.dateFrom) {
      all = all.filter((t) => t.task_date >= options.dateFrom!)
    }

    if (options.dateTo) {
      all = all.filter((t) => t.task_date <= options.dateTo!)
    }

    if (options.overdue) {
      const today = new Date().toISOString().slice(0, 10)
      all = all.filter(
        (t) => t.task_date < today && t.status !== 'done' && t.status !== 'cancelled'
      )
    }

    if (options.hasRecurrence) {
      all = all.filter((t) => !!t.recurrence_rule)
    }

    // Sort by date descending then order_index
    all.sort((a, b) => b.task_date.localeCompare(a.task_date) || a.order_index - b.order_index)

    if (options.maxResults) {
      all = all.slice(0, options.maxResults)
    }

    return all
  }
}

// ---------- Task Subitem Repository ----------

class IndexedDBTaskSubitemRepository implements ITaskSubitemRepository {
  async getByTaskId(userId: string, taskId: string): Promise<TaskSubitem[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('task_subitems', 'task_id', taskId)
    return all.filter((s) => s.user_id === userId).sort((a, b) => a.sort_order - b.sort_order)
  }

  async create(
    userId: string,
    data: Omit<TaskSubitem, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<TaskSubitem> {
    const db = await getDB()
    const record = makeRecord<TaskSubitem>(userId, data)
    await db.add('task_subitems', record)
    return record
  }

  async update(userId: string, id: string, data: Partial<TaskSubitem>): Promise<TaskSubitem> {
    const db = await getDB()
    const existing = await db.get('task_subitems', id)
    if (!existing || existing.user_id !== userId) throw new Error('Not found')
    const updated = { ...existing, ...data, updated_at: nowISO() }
    await db.put('task_subitems', updated)
    return updated
  }

  async delete(userId: string, id: string): Promise<void> {
    const db = await getDB()
    const existing = await db.get('task_subitems', id)
    if (existing && existing.user_id === userId) {
      await db.delete('task_subitems', id)
    }
  }

  async toggleComplete(userId: string, id: string): Promise<TaskSubitem> {
    const db = await getDB()
    const existing = await db.get('task_subitems', id)
    if (!existing || existing.user_id !== userId) throw new Error('Not found')
    return this.update(userId, id, { is_completed: !existing.is_completed })
  }
}

// ---------- Tag Repository ----------

class IndexedDBTagRepository implements ITagRepository {
  async getAll(userId: string): Promise<Tag[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('tags', 'user_id', userId)
    return all.sort((a, b) => a.sort_order - b.sort_order)
  }

  async getById(userId: string, id: string): Promise<Tag | null> {
    const db = await getDB()
    const tag = await db.get('tags', id)
    if (!tag || tag.user_id !== userId) return null
    return tag
  }

  async create(
    userId: string,
    data: Omit<Tag, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Tag> {
    const db = await getDB()
    const tag = makeRecord<Tag>(userId, data)
    await db.add('tags', tag)
    return tag
  }

  async update(userId: string, id: string, data: Partial<Tag>): Promise<Tag> {
    const db = await getDB()
    const existing = await db.get('tags', id)
    if (!existing || existing.user_id !== userId) throw new Error('Tag not found')
    const updated = { ...existing, ...data, updated_at: nowISO() }
    await db.put('tags', updated)
    return updated
  }

  async delete(userId: string, id: string, migrateToTagId?: string): Promise<void> {
    const db = await getDB()
    const existing = await db.get('tags', id)
    if (!existing || existing.user_id !== userId) return

    // Migrate tasks if needed
    if (migrateToTagId) {
      const all = await db.getAllFromIndex('tasks', 'user_id', userId)
      for (const task of all) {
        if (task.tag_id === id && !task.deleted_at) {
          task.tag_id = migrateToTagId
          task.updated_at = nowISO()
          await db.put('tasks', task)
        }
      }
    }

    await db.delete('tags', id)
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    const db = await getDB()
    for (let i = 0; i < ids.length; i++) {
      const tag = await db.get('tags', ids[i])
      if (tag && tag.user_id === userId) {
        tag.sort_order = i
        tag.updated_at = nowISO()
        await db.put('tags', tag)
      }
    }
  }
}

// ---------- Habit Repository ----------

class IndexedDBHabitRepository implements IHabitRepository {
  async getAll(userId: string, includeArchived = false): Promise<Habit[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('habits', 'user_id', userId)
    if (includeArchived) return all
    return all.filter((h) => !h.archived_at)
  }

  async getById(userId: string, id: string): Promise<Habit | null> {
    const db = await getDB()
    const habit = await db.get('habits', id)
    if (!habit || habit.user_id !== userId) return null
    return habit
  }

  async create(
    userId: string,
    data: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Habit> {
    const db = await getDB()
    const habit = makeRecord<Habit>(userId, data)
    await db.add('habits', habit)
    return habit
  }

  async update(userId: string, id: string, data: Partial<Habit>): Promise<Habit> {
    const db = await getDB()
    const existing = await db.get('habits', id)
    if (!existing || existing.user_id !== userId) throw new Error('Habit not found')
    const updated = { ...existing, ...data, updated_at: nowISO() }
    await db.put('habits', updated)
    return updated
  }

  async archive(userId: string, id: string): Promise<void> {
    await this.update(userId, id, { archived_at: nowISO() })
  }

  async unarchive(userId: string, id: string): Promise<void> {
    await this.update(userId, id, { archived_at: undefined })
  }
}

// ---------- Habit Log Repository ----------

class IndexedDBHabitLogRepository implements IHabitLogRepository {
  async getByDate(userId: string, date: string): Promise<HabitLog[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('habit_logs', 'user_id', userId)
    return all.filter((l) => l.log_date === date)
  }

  async getByDateRange(userId: string, range: DateRange): Promise<HabitLog[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('habit_logs', 'user_id', userId)
    return all.filter((l) => l.log_date >= range.start && l.log_date <= range.end)
  }

  async getByHabit(userId: string, habitId: string, limit = 100): Promise<HabitLog[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('habit_logs', 'habit_id', habitId)
    return all
      .filter((l) => l.user_id === userId)
      .sort((a, b) => b.log_date.localeCompare(a.log_date))
      .slice(0, limit)
  }

  async create(
    userId: string,
    data: Omit<HabitLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<HabitLog> {
    const db = await getDB()
    // Check for existing log for same habit+date
    const existing = await db.getAllFromIndex('habit_logs', 'user_habit_date', [
      userId,
      data.habit_id,
      data.log_date,
    ])
    if (existing.length > 0) {
      return this.update(userId, existing[0].id, data)
    }
    const log = makeRecord<HabitLog>(userId, data)
    await db.add('habit_logs', log)
    return log
  }

  async update(userId: string, id: string, data: Partial<HabitLog>): Promise<HabitLog> {
    const db = await getDB()
    const existing = await db.get('habit_logs', id)
    if (!existing || existing.user_id !== userId) throw new Error('Log not found')
    const updated = { ...existing, ...data, updated_at: nowISO() }
    await db.put('habit_logs', updated)
    return updated
  }

  async delete(userId: string, id: string): Promise<void> {
    const db = await getDB()
    const existing = await db.get('habit_logs', id)
    if (existing && existing.user_id === userId) {
      await db.delete('habit_logs', id)
    }
  }
}

// ---------- Daily Review Repository ----------

class IndexedDBDailyReviewRepository implements IDailyReviewRepository {
  async getByDate(userId: string, date: string): Promise<DailyReview | null> {
    const db = await getDB()
    const all = await db.getAllFromIndex('daily_reviews', 'user_date', [userId, date])
    return all[0] || null
  }

  async getByDateRange(userId: string, range: DateRange): Promise<DailyReview[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('daily_reviews', 'user_id', userId)
    return all.filter((r) => r.review_date >= range.start && r.review_date <= range.end)
  }

  async upsert(
    userId: string,
    data: Omit<DailyReview, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<DailyReview> {
    const db = await getDB()
    const existing = await this.getByDate(userId, data.review_date)
    if (existing) {
      const updated = { ...existing, ...data, updated_at: nowISO() }
      await db.put('daily_reviews', updated)
      return updated
    }
    const review = makeRecord<DailyReview>(userId, data)
    await db.add('daily_reviews', review)
    return review
  }

  async delete(userId: string, date: string): Promise<void> {
    const db = await getDB()
    const existing = await this.getByDate(userId, date)
    if (existing) {
      await db.delete('daily_reviews', existing.id)
    }
  }
}

// ---------- Task Template Repository ----------

class IndexedDBTaskTemplateRepository implements ITaskTemplateRepository {
  async getAll(userId: string): Promise<TaskTemplate[]> {
    const db = await getDB()
    return db.getAllFromIndex('task_templates', 'user_id', userId)
  }

  async create(
    userId: string,
    data: Omit<TaskTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<TaskTemplate> {
    const db = await getDB()
    const tpl = makeRecord<TaskTemplate>(userId, data)
    await db.add('task_templates', tpl)
    return tpl
  }

  async delete(userId: string, id: string): Promise<void> {
    const db = await getDB()
    const existing = await db.get('task_templates', id)
    if (existing && existing.user_id === userId) {
      await db.delete('task_templates', id)
    }
  }
}

// ---------- User Repository ----------

class IndexedDBUserRepository implements IUserRepository {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const db = await getDB()
    return (await db.get('profiles', userId)) || null
  }

  async upsertProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const db = await getDB()
    const existing = await db.get('profiles', userId)
    const profile = {
      ...(existing || { id: userId, created_at: nowISO() }),
      ...data,
      updated_at: nowISO(),
    }
    await db.put('profiles', profile)
    return profile
  }

  async getPreferences(userId: string): Promise<UserPreferences | null> {
    const db = await getDB()
    return (await db.get('user_preferences', userId)) || null
  }

  async upsertPreferences(
    userId: string,
    data: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    const db = await getDB()
    const existing = await db.get('user_preferences', userId)
    const defaults: UserPreferences = {
      user_id: userId,
      theme: 'system',
      accent_color: '#3b82f6',
      default_calendar_view: 'month',
      week_starts_on: 0,
      timezone: 'Asia/Shanghai',
      notification_enabled: true,
      compact_mode: false,
      created_at: nowISO(),
      updated_at: nowISO(),
    }
    const prefs = { ...defaults, ...(existing || {}), ...data, updated_at: nowISO() }
    await db.put('user_preferences', prefs)
    return prefs
  }
}

// ---------- Recurrence Exception Repository ----------

class IndexedDBRecurrenceExceptionRepository implements IRecurrenceExceptionRepository {
  async getByTask(userId: string, taskId: string): Promise<RecurrenceException[]> {
    const db = await getDB()
    const all = await db.getAllFromIndex('recurrence_exceptions', 'task_id', taskId)
    return all.filter((e) => e.user_id === userId)
  }

  async create(
    userId: string,
    data: Omit<RecurrenceException, 'id' | 'user_id' | 'created_at'>
  ): Promise<RecurrenceException> {
    const db = await getDB()
    const record = {
      ...data,
      id: genId(),
      user_id: userId,
      created_at: nowISO(),
    }
    await db.add('recurrence_exceptions', record)
    return record
  }

  async delete(userId: string, id: string): Promise<void> {
    const db = await getDB()
    const existing = await db.get('recurrence_exceptions', id)
    if (existing && existing.user_id === userId) {
      await db.delete('recurrence_exceptions', id)
    }
  }
}

// ---------- Factory ----------

export function createIndexedDBRepositoryFactory(): RepositoryFactory {
  return {
    tasks: new IndexedDBTaskRepository(),
    taskSubitems: new IndexedDBTaskSubitemRepository(),
    tags: new IndexedDBTagRepository(),
    habits: new IndexedDBHabitRepository(),
    habitLogs: new IndexedDBHabitLogRepository(),
    dailyReviews: new IndexedDBDailyReviewRepository(),
    taskTemplates: new IndexedDBTaskTemplateRepository(),
    users: new IndexedDBUserRepository(),
    recurrenceExceptions: new IndexedDBRecurrenceExceptionRepository(),
  }
}
