export function arrayBufferToHex(buf){
  return Array.from(buf).map(b=>b.toString(16).padStart(2,'0')).join('');
}

export function hexToArrayBuffer(hex){
  const len = hex.length/2;
  const u8 = new Uint8Array(len);
  for(let i=0;i<len;i++) u8[i] = parseInt(hex.substr(i*2,2),16);
  return u8.buffer;
}

export async function aesEncryptBase64(plainText, keyHex){
  const keyBuf = hexToArrayBuffer(keyHex);
  const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, {name:'AES-CBC'}, false, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder().encode(plainText);
  const cipher = await crypto.subtle.encrypt({name:'AES-CBC', iv}, cryptoKey, enc);
  return { iv: btoa(String.fromCharCode(...iv)), data: btoa(String.fromCharCode(...new Uint8Array(cipher))) };
}

export async function aesDecryptBase64WithKeyHex({iv, data}, keyHex){
  const keyBuf = hexToArrayBuffer(keyHex);
  const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, {name:'AES-CBC'}, false, ['decrypt']);
  const ivBuf = Uint8Array.from(atob(iv), c=>c.charCodeAt(0));
  const dataBuf = Uint8Array.from(atob(data), c=>c.charCodeAt(0));
  const plainBuf = await crypto.subtle.decrypt({name:'AES-CBC', iv: ivBuf}, cryptoKey, dataBuf);
  return new TextDecoder().decode(plainBuf);
}
