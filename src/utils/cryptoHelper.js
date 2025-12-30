const crypto = require("crypto");
const lzString = require("lz-string");

const generateTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

const generateSignature = (consId, secretKey, timestamp) => {
  const data = `${consId}&${timestamp}`;
  return crypto.createHmac("sha256", secretKey).update(data).digest("base64");
};

const decryptResponse = (encryptedData, consId, secretKey, timestamp) => {
  try {
    const keyPlain = consId + secretKey + timestamp;

    const keyHash = crypto.createHash("sha256").update(keyPlain).digest();

    const iv = keyHash.slice(0, 16);

    const decipher = crypto.createDecipheriv("aes-256-cbc", keyHash, iv);
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");

    const decompressed = lzString.decompressFromEncodedURIComponent(decrypted);

    return JSON.parse(decompressed);
  } catch (error) {
    console.error("Gagal Decrypt:", error.message);
    return null;
  }
};

module.exports = { generateTimestamp, generateSignature, decryptResponse };
