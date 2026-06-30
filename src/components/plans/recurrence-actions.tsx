'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Calendar, CalendarRange, List } from 'lucide-react'

export type RecurrenceActionScope = 'this' | 'future' | 'all'

interface RecurrenceActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (scope: RecurrenceActionScope) => void
  action: 'edit' | 'delete'
  title?: string
}

export function RecurrenceActionDialog({
  open,
  onOpenChange,
  onSelect,
  action,
  title,
}: RecurrenceActionDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const content = (
    <div className="space-y-4">
      <div className="space-y-3">
        <button
          onClick={() => {
            onSelect('this')
            onOpenChange(false)
          }}
          className="w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {action === 'edit' ? '仅修改本次' : '仅删除本次'}
              </p>
              <p className="text-xs text-muted-foreground">
                {action === 'edit'
                  ? '只修改这一个实例，其他重复事项不受影响'
                  : '只删除这一个实例，其他重复事项保持不变'}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            onSelect('future')
            onOpenChange(false)
          }}
          className="w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <CalendarRange className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {action === 'edit' ? '修改本次及以后' : '删除本次及以后'}
              </p>
              <p className="text-xs text-muted-foreground">
                {action === 'edit'
                  ? '从此实例开始应用修改，之前的事项保持不变'
                  : '从此实例开始删除，之前的事项保持不变'}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            onSelect('all')
            onOpenChange(false)
          }}
          className="w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <List className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {action === 'edit' ? '修改整个系列' : '删除整个系列'}
              </p>
              <p className="text-xs text-muted-foreground">
                {action === 'edit'
                  ? '修改所有重复事项（包括过去和未来）'
                  : '删除所有重复事项（包括过去和未来）'}
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          取消
        </Button>
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {action === 'edit' ? '修改重复事项' : '删除重复事项'}
            </DialogTitle>
            <DialogDescription className="truncate">
              {title && `「${title}」是一个重复事项，请选择范围`}
              {!title && '请选择要应用的范围'}
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {action === 'edit' ? '修改重复事项' : '删除重复事项'}
          </DrawerTitle>
          <DrawerDescription>
            {title && `「${title}」是一个重复事项，请选择范围`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  )
}
