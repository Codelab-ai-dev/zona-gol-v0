import type React from "react"

interface RecentActivityItem {
  id: string | number
  title: string
  description: string
  icon: React.ReactNode
}

interface RecentActivityProps {
  items: RecentActivityItem[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-4">
          <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">{item.icon}</div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
