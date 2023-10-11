export function removeRpPrefix(text: string) {
  return text.replace('Rp', '').replaceAll('.', '').replaceAll(',', '.');
}
