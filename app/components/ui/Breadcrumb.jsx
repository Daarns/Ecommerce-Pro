import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-text-muted mx-2" />
          )}
          {item.active ? (
            <span className="text-text-muted">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="text-text-secondary hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}