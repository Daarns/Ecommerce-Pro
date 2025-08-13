export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-surface rounded w-64 mb-6"></div>
        
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-surface rounded w-80 mb-4"></div>
          <div className="h-4 bg-surface rounded w-96"></div>
        </div>
        
        {/* Search Skeleton */}
        <div className="h-12 bg-surface rounded-xl max-w-2xl mb-8"></div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-surface rounded-2xl p-6">
              <div className="h-6 bg-surface-elevated rounded w-32 mb-6"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 bg-surface-elevated rounded w-24"></div>
                    <div className="space-y-1">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-4 bg-surface-elevated rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-surface rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-surface-elevated"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-surface-elevated rounded w-3/4"></div>
                    <div className="h-3 bg-surface-elevated rounded w-1/2"></div>
                    <div className="h-4 bg-surface-elevated rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}