const NodeRSA = require('node-rsa');
const crypto = require('crypto');

// RSA keypair
function generateRSAKeyPair() {
  const key = new NodeRSA({ b: 2048 });
  key.setOptions({ encryptionScheme: 'pkcs1' });
  return {
    publicKey: key.exportKey('public'),
    privateKey: key.exportKey('private'),
  };
}

// RSA encryption/decryption
function rsaEncrypt(publicKeyPem, data) {
  const key = new NodeRSA(publicKeyPem);
  key.setOptions({ encryptionScheme: 'pkcs1' });
  return key.encrypt(Buffer.from(data), 'base64');
}

function rsaDecrypt(privateKeyPem, base64) {
  const key = new NodeRSA(privateKeyPem);
  key.setOptions({ encryptionScheme: 'pkcs1' });
  return key.decrypt(Buffer.from(base64, 'base64')).toString();
}

// AES helpers
function aesEncryptHex(plain, keyHex) {
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let enc = cipher.update(plain, 'utf8', 'base64');
  enc += cipher.final('base64');
  return { iv: iv.toString('base64'), data: enc };
}

function aesDecryptHex({ iv, data }, keyHex) {
  const key = Buffer.from(keyHex, 'hex');
  const ivbuf = Buffer.from(iv, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivbuf);
  let out = decipher.update(data, 'base64', 'utf8');
  out += decipher.final('utf8');
  return out;
}

module.exports = {
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  aesEncryptHex,
  aesDecryptHex,
};
