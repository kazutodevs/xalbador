import { classNames } from '@utils/helpers'

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={classNames('skeleton animate-pulse', className)}
      {...props}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl">
      <Skeleton className="w-full h-48 rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}
