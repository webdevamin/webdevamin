import Link from 'next/link'

export default function Breadcrumbs({ items, locale = 'nl', className = '' }) {
  if (!items?.length) return null

  return (
    <nav
      aria-label={locale === 'nl' ? 'Broodkruimelnavigatie' : 'Breadcrumb navigation'}
      className={`max-w-full ${className}`}
    >
      <ol className="flex min-h-9 flex-wrap items-center gap-y-1">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li key={`${item.href || item.label}-${index}`} className="inline-flex min-w-0 max-w-full items-center">
              {index > 0 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mx-1.5 h-3 w-3 shrink-0 text-dark/35 sm:mx-2"
                >
                  <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                </svg>
              )}
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-dark/10 bg-white/75 px-2.5 py-1 !text-xs font-semibold leading-5 text-dark shadow-sm sm:!text-sm"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-theme_darker !text-xs" />
                  <span className="min-w-0 break-words !text-xs sm:!text-sm">{item.label}</span>
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-8 max-w-full items-center gap-1.5 break-words rounded-full px-2 py-1 !text-xs font-medium leading-5 text-dark/65 transition-colors hover:bg-theme/10 hover:text-theme_darker focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme_darker sm:!text-sm"
                >
                  {index === 0 && (
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0 text-theme_darker">
                      <path d="m2.5 9 7.5-6 7.5 6v7.25c0 .69-.56 1.25-1.25 1.25h-4v-5h-4v5h-4C3.56 17.5 3 16.94 3 16.25V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                    </svg>
                  )}
                  {item.label}
                </Link>
              ) : (
                <span className="px-2 !text-xs font-medium leading-5 text-dark/65 sm:!text-sm">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
