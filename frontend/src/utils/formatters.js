export function formatPrice(price) {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatMileage(km) {
  return new Intl.NumberFormat('sr-RS').format(km) + ' km'
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Danas'
  if (diffDays === 1) return 'Juče'
  if (diffDays < 7) return `Pre ${diffDays} dana`
  if (diffDays < 30) return `Pre ${Math.floor(diffDays / 7)} nedelja`
  if (diffDays < 365) return `Pre ${Math.floor(diffDays / 30)} meseci`
  return `Pre ${Math.floor(diffDays / 365)} godina`
}
