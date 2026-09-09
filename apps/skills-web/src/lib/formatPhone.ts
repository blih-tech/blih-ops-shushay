/**
 * Formats a raw phone number string for display by grouping digits with spaces.
 *
 * International (leading `+`): `+[CC] [2] [3] [4]` digit groups.
 * Example: "+2519436687 96" → "+251 94 366 8796"
 *
 * Local: groups as [2] [3] [4].
 *
 * Returns the original value unchanged if it is empty or falsy.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return phone ?? "";

  const hasPlus = phone.trimStart().startsWith("+");
  const digits = phone.replace(/\D/g, "");

  if (!digits) return phone;

  if (hasPlus) {
    // Country code: first 1–3 digits (greedily 3)
    const ccLen = Math.min(3, digits.length);
    const cc = digits.slice(0, ccLen);
    const rest = digits.slice(ccLen);
    // Groups: 2, 3, 4 — any remaining digits appended to last group
    const sizes = [2, 3, 4];
    const groups: string[] = [];
    let offset = 0;
    for (let i = 0; i < sizes.length; i++) {
      if (offset >= rest.length) break;
      const isLast = i === sizes.length - 1;
      const chunk = isLast
        ? rest.slice(offset)
        : rest.slice(offset, offset + sizes[i]);
      groups.push(chunk);
      offset += sizes[i];
    }
    return `+${cc}${groups.length ? " " + groups.join(" ") : ""}`;
  }

  // Local: same 2-3-4 grouping without the +CC
  const sizes = [2, 3, 4];
  const groups: string[] = [];
  let offset = 0;
  for (let i = 0; i < sizes.length; i++) {
    if (offset >= digits.length) break;
    const isLast = i === sizes.length - 1;
    const chunk = isLast
      ? digits.slice(offset)
      : digits.slice(offset, offset + sizes[i]);
    groups.push(chunk);
    offset += sizes[i];
  }
  return groups.join(" ");
}
