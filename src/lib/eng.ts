/* Small, dependency-free engineering helpers used by the workbench tools and the terminal. */

/* ---------- Resistor colour code ---------- */

export type BandColor = {
  name: string;
  hex: string;
  digit?: number;
  exp?: number;
  tol?: number;
};

export const bandColors: BandColor[] = [
  { name: 'Black', hex: '#1d1d1f', digit: 0, exp: 0 },
  { name: 'Brown', hex: '#7b4a26', digit: 1, exp: 1, tol: 1 },
  { name: 'Red', hex: '#d6382c', digit: 2, exp: 2, tol: 2 },
  { name: 'Orange', hex: '#f07c22', digit: 3, exp: 3 },
  { name: 'Yellow', hex: '#f3d031', digit: 4, exp: 4 },
  { name: 'Green', hex: '#3c9c4e', digit: 5, exp: 5, tol: 0.5 },
  { name: 'Blue', hex: '#2f6ed6', digit: 6, exp: 6, tol: 0.25 },
  { name: 'Violet', hex: '#8b52d6', digit: 7, exp: 7, tol: 0.1 },
  { name: 'Grey', hex: '#8e9196', digit: 8, exp: 8, tol: 0.05 },
  { name: 'White', hex: '#f4f4f1', digit: 9, exp: 9 },
  { name: 'Gold', hex: '#c9a23c', exp: -1, tol: 5 },
  { name: 'Silver', hex: '#c3c7cc', exp: -2, tol: 10 }
];

export const digitColors = bandColors.filter(c => c.digit !== undefined);
export const multiplierColors = bandColors.filter(c => c.exp !== undefined);
export const toleranceColors = bandColors.filter(c => c.tol !== undefined);

export function colorByName(name: string) {
  return bandColors.find(c => c.name === name) ?? bandColors[0];
}

/** Value in ohms from significant-digit colours plus a multiplier colour. */
export function bandsToOhms(digits: string[], multiplier: string) {
  const significant = Number(digits.map(d => colorByName(d).digit ?? 0).join(''));
  const exp = colorByName(multiplier).exp ?? 0;
  return roundTiny(significant * Math.pow(10, exp));
}

function roundTiny(n: number) {
  return Number(n.toPrecision(12));
}

const prefixes: [number, string][] = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, '']];

export function formatOhms(value: number) {
  if (!Number.isFinite(value)) return 'n/a';
  if (value === 0) return '0 Ω';
  for (const [scale, prefix] of prefixes) {
    if (Math.abs(value) >= scale) return `${trim(value / scale)} ${prefix}Ω`;
  }
  return `${trim(value)} Ω`;
}

function trim(n: number, precision = 4) {
  return String(Number(n.toPrecision(precision)));
}

/** Parses "4.7k", "4k7", "220", "1M", "10R", "2.2 kΩ". Lower-case m is read as mega, the resistor convention. */
export function parseOhms(input: string): number | null {
  const s = input.trim().replace(/\s+/g, '').replace(/(Ω|ohms?)$/i, '');
  if (!s) return null;
  const mult: Record<string, number> = { r: 1, k: 1e3, m: 1e6, g: 1e9 };
  const infix = s.match(/^(\d+)([rkmg])(\d+)$/i);
  if (infix) return roundTiny(Number(`${infix[1]}.${infix[3]}`) * mult[infix[2].toLowerCase()]);
  const plain = s.match(/^(\d*\.?\d+)([rkmg]?)$/i);
  if (!plain) return null;
  return roundTiny(Number(plain[1]) * (plain[2] ? mult[plain[2].toLowerCase()] : 1));
}

/** Finds the colour bands for a value. Returns an error string when the value cannot be shown exactly. */
export function ohmsToBands(value: number, significantDigits: 2 | 3): { digits: string[]; multiplier: string } | string {
  if (!(value > 0)) return 'Enter a value above 0 Ω.';
  let exp = Math.floor(Math.log10(value)) - (significantDigits - 1);
  let sig = Math.round(value / Math.pow(10, exp));
  if (sig >= Math.pow(10, significantDigits)) { exp += 1; sig = Math.round(value / Math.pow(10, exp)); }
  const exact = Math.abs(sig * Math.pow(10, exp) - value) / value < 1e-9;
  if (!exact) return `${formatOhms(value)} needs more than ${significantDigits} significant digits. Try ${significantDigits === 2 ? 'the 5-band code' : 'a nearby standard value'}.`;
  if (exp < -2 || exp > 9) return 'That value is outside the range a colour code can show.';
  const digits = String(sig).padStart(significantDigits, '0').split('').map(d => digitColors[Number(d)].name);
  const multiplier = multiplierColors.find(c => c.exp === exp)!.name;
  return { digits, multiplier };
}

/* ---------- Ohm's law and LED resistors ---------- */

export type OhmTarget = 'V' | 'I' | 'R';

export function solveOhm(target: OhmTarget, v: number, i: number, r: number) {
  let V = v, I = i, R = r;
  if (target === 'V') V = I * R;
  if (target === 'I') I = V / R;
  if (target === 'R') R = V / I;
  return { V, I, R, P: V * I };
}

const e12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];

/** The smallest E12 standard value that is at least the requested resistance. */
export function nextE12(ohms: number) {
  if (!(ohms > 0)) return NaN;
  let decade = Math.pow(10, Math.floor(Math.log10(ohms)) - 1);
  for (let pass = 0; pass < 2; pass++) {
    for (const base of e12) {
      const candidate = roundTiny(base * decade);
      if (candidate >= ohms * (1 - 1e-9)) return candidate;
    }
    decade *= 10;
  }
  return NaN;
}

export type LedResult =
  | { ok: true; exact: number; standard: number; actualCurrent: number; power: number; rating: string }
  | { ok: false; error: string };

export function ledResistor(supply: number, forward: number, currentMa: number): LedResult | null {
  const current = currentMa / 1000;
  if (!(supply > 0) || !(forward >= 0) || !(current > 0)) return null;
  if (forward >= supply) return { ok: false, error: 'The LED forward voltage must be lower than the supply voltage.' };
  const exact = (supply - forward) / current;
  const standard = nextE12(exact);
  const actualCurrent = (supply - forward) / standard;
  const power = actualCurrent * actualCurrent * standard;
  const ratings: [number, string][] = [[0.125, '1/8 W'], [0.25, '1/4 W'], [0.5, '1/2 W'], [1, '1 W'], [2, '2 W']];
  const rating = ratings.find(([w]) => w >= power * 2)?.[1] ?? 'above 2 W';
  return { ok: true, exact, standard, actualCurrent, power, rating };
}

/** Formats a number with an SI prefix, e.g. 0.0125 A becomes 12.5 mA. */
export function si(value: number, unit: string) {
  if (!Number.isFinite(value)) return 'n/a';
  if (value === 0) return `0 ${unit}`;
  const steps: [number, string][] = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n']];
  const abs = Math.abs(value);
  const [scale, prefix] = steps.find(([s]) => abs >= s) ?? steps[steps.length - 1];
  return `${trim(value / scale)} ${prefix}${unit}`;
}

/* ---------- IPv4 subnetting ---------- */

export function ipToInt(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    n = n * 256 + octet;
  }
  return n >>> 0;
}

export function intToIp(n: number) {
  return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

function prefixFromMask(mask: number): number | null {
  const bits = mask.toString(2).padStart(32, '0');
  if (!/^1*0*$/.test(bits)) return null;
  return bits.indexOf('0') === -1 ? 32 : bits.indexOf('0');
}

export type SubnetResult = {
  ip: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  totalAddresses: number;
  ipClass: string;
  scope: string;
  ipBits: string;
};

/** Accepts "192.168.1.10/24", "192.168.1.10 255.255.255.0", or a bare address (treated as /24). */
export function subnet(input: string): SubnetResult | string {
  const s = input.trim();
  if (!s) return 'Enter an IPv4 address, for example 192.168.1.10/26.';
  const [ipPart, maskPart] = s.split(/\s*\/\s*|\s+/);
  const ip = ipToInt(ipPart);
  if (ip === null) return `“${ipPart}” is not a valid IPv4 address. Use four numbers from 0 to 255, like 10.0.0.1.`;
  let prefix = 24;
  if (maskPart !== undefined && maskPart !== '') {
    if (/^\d{1,2}$/.test(maskPart)) {
      prefix = Number(maskPart);
      if (prefix > 32) return 'The prefix length must be between /0 and /32.';
    } else {
      const maskInt = ipToInt(maskPart);
      const p = maskInt === null ? null : prefixFromMask(maskInt);
      if (p === null) return `“${maskPart}” is not a valid subnet mask. Masks are a run of 1 bits followed by 0 bits, like 255.255.255.192.`;
      prefix = p;
    }
  }
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = Math.pow(2, 32 - prefix);
  const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : total - 2;
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  const o1 = ip >>> 24, o2 = (ip >>> 16) & 255;
  const ipClass = o1 < 128 ? 'A' : o1 < 192 ? 'B' : o1 < 224 ? 'C' : o1 < 240 ? 'D (multicast)' : 'E (reserved)';
  let scope = 'Public';
  if (o1 === 10 || (o1 === 172 && o2 >= 16 && o2 <= 31) || (o1 === 192 && o2 === 168)) scope = 'Private (RFC 1918)';
  else if (o1 === 127) scope = 'Loopback';
  else if (o1 === 169 && o2 === 254) scope = 'Link-local';
  else if (o1 === 100 && o2 >= 64 && o2 <= 127) scope = 'Shared address space (CGNAT)';
  else if (o1 >= 224 && o1 < 240) scope = 'Multicast';
  else if (o1 >= 240 || o1 === 0) scope = 'Reserved';
  return {
    ip: intToIp(ip),
    prefix,
    mask: intToIp(mask),
    wildcard: intToIp(~mask >>> 0),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(first),
    lastHost: intToIp(last),
    usableHosts: usable,
    totalAddresses: total,
    ipClass,
    scope,
    ipBits: ip.toString(2).padStart(32, '0')
  };
}

/* ---------- Number bases ---------- */

export type Base = 2 | 8 | 10 | 16;
export const MAX_U32 = 0xffffffff;

/** Parses a number in the given base. Accepts 0x, 0b, 0o prefixes, spaces and underscores, and negative decimals down to -2^31. */
export function parseInBase(input: string, base: Base): number | string {
  let s = input.trim().replace(/[\s_]/g, '').toLowerCase();
  if (!s) return 'Type a number to convert.';
  let negative = false;
  if (s.startsWith('-')) { negative = true; s = s.slice(1); }
  let b: number = base;
  if (s.startsWith('0x')) { b = 16; s = s.slice(2); }
  else if (s.startsWith('0b')) { b = 2; s = s.slice(2); }
  else if (s.startsWith('0o')) { b = 8; s = s.slice(2); }
  const valid: Record<number, RegExp> = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/ };
  if (!valid[b].test(s)) return `“${input.trim()}” is not a valid base-${b} number.`;
  const value = parseInt(s, b);
  if (negative) {
    if (b !== 10) return 'Negative values are only accepted in decimal.';
    if (value > 0x80000000) return 'Negative values must be -2,147,483,648 or higher.';
    return (-value) >>> 0;
  }
  if (value > MAX_U32) return 'This converter works with 32-bit values, up to 4,294,967,295 (0xFFFFFFFF).';
  return value;
}

export function groupDigits(s: string, size: number, sep = ' ') {
  const out: string[] = [];
  for (let i = s.length; i > 0; i -= size) out.unshift(s.slice(Math.max(0, i - size), i));
  return out.join(sep);
}

export function describeNumber(n: number) {
  const bits = n > 0xffff ? 32 : n > 0xff ? 16 : 8;
  return {
    dec: n.toLocaleString('en-US'),
    hex: '0x' + n.toString(16).toUpperCase(),
    oct: '0o' + n.toString(8),
    bin: groupDigits(n.toString(2).padStart(bits, '0'), 4),
    signed: (n | 0).toLocaleString('en-US'),
    ascii: n >= 32 && n < 127 ? String.fromCharCode(n) : null
  };
}

/* ---------- Ticket references ---------- */

export function makeTicketRef() {
  const alphabet = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return 'EOQ-' + Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}
