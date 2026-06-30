'use client'

import { useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { DEFAULT_TAGS } from '@/lib/constants'

/**
 * Ensures default tags exist in the database on first login/demo session.
 */
export function useInitializeDefaultTags() {
  const { user } = useAuth()
  const { tags } = useRepos()

  useEffect(() => {
    if (!user) return

    const init = async () => {
      const existing = await tags.getAll(user.id)
      if (existing.length === 0) {
        for (let i = 0; i < DEFAULT_TAGS.length; i++) {
          const tag = DEFAULT_TAGS[i]
          await tags.create(user.id, {
            name: tag.name,
            color: tag.color,
            icon: tag.icon,
            is_default: true,
            is_visible: true,
            sort_order: i,
          })
        }
      }
    }

    init().catch(console.error)
  }, [user, tags])
}
