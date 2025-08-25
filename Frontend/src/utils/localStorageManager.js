export const KEY_ACCESS_TOKEN = "accessToken";

export const getItem = (key) => {
  return localStorage.getItem(key);
};

export const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

export const removeItem = (key) => {
  localStorage.removeItem(key);
};
