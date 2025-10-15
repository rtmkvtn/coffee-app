export type GreetingPeriod = 'morning' | 'day' | 'evening'

export function getGreetingPeriod(): GreetingPeriod {
  const hour = new Date().getHours()
  if (hour >= 8 && hour < 11) {
    return 'morning'
  }
  if (hour >= 11 && hour < 17) {
    return 'day'
  }

  return 'evening'
}
