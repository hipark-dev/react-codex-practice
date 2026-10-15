export function formatCount(count: number): string {
  if (count < 1000) return String(count)

  const isMillion = count >= 1000000
  const divisor = isMillion ? 1000000 : 1000
  const rounded = Math.round((count / divisor) * 10) / 10
  // 백만 미만의 값은 반올림으로 1000k가 되더라도 k 단위를 유지한다.
  const value = isMillion ? rounded : Math.min(rounded, 999.9)

  return `${value}${isMillion ? 'M' : 'k'}`
}
