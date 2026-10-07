/**
 * SHA-1 Cryptographic Hash Utility (RFC 3174 / FIPS PUB 180-4)
 * 100% Client-side. Uses Web Crypto API when available, with a pure JS fallback.
 */

function pureJsSha1(bytes: Uint8Array): string {
  // RFC 3174 Constants
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const originalLength = bytes.length;
  // Pad: append 0x80, then zeros, then 64-bit length in bits
  const bitLength = originalLength * 8;
  const remainder = (originalLength + 9) % 64;
  const paddingLength = remainder === 0 ? 0 : 64 - remainder;
  const totalLength = originalLength + 1 + paddingLength + 8;

  const padded = new Uint8Array(totalLength);
  padded.set(bytes, 0);
  padded[originalLength] = 0x80;

  // Append 64-bit bitLength in big-endian
  const view = new DataView(padded.buffer);
  // Upper 32 bits of bit length (for texts under 500MB, 0 is sufficient)
  const highBits = Math.floor(bitLength / 0x100000000);
  const lowBits = bitLength >>> 0;
  view.setUint32(totalLength - 8, highBits, false);
  view.setUint32(totalLength - 4, lowBits, false);

  const w = new Uint32Array(80);

  function rotl(n: number, s: number): number {
    return ((n << s) | (n >>> (32 - s))) >>> 0;
  }

  for (let offset = 0; offset < totalLength; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;

      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (rotl(a, 5) + f + e + k + w[i]) >>> 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  const toHex = (n: number) => n.toString(16).padStart(8, "0");
  return `${toHex(h0)}${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}`;
}

export async function calculateSha1(text: string): Promise<string> {
  if (text === "") {
    // Known standard empty string digest
    return "da39a3ee5e6b4b0d3255bfef95601890afd80709";
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.subtle &&
    typeof window.crypto.subtle.digest === "function"
  ) {
    try {
      const hashBuffer = await window.crypto.subtle.digest("SHA-1", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fallback to pure JS if SubtleCrypto errors
      return pureJsSha1(data);
    }
  }

  return pureJsSha1(data);
}

export function getByteCount(text: string): number {
  return new TextEncoder().encode(text).length;
}
