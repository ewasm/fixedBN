export const padHexToLength = (hex: string, bitLength: number): string => {
  return '0'.repeat(2 * (bitLength / 8 - hex.length / 2)).concat(hex)
}
