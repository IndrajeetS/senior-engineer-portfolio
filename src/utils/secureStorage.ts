import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET || "default_secure_key_123!";

export const secureStorage = {
  setItem: (key: string, value: string) => {
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  },
  getItem: (key: string): string | null => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue || null;
    } catch (e) {
      console.warn("Invalid token format, clearing old plain-text token.");
      localStorage.removeItem(key);
      return null;
    }
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  },
};
