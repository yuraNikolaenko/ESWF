export const getBaseApiUrl = () => {
  let BASE_API_URL = import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV && import.meta.env.VITE_API_URL_LOCAL) {
    BASE_API_URL = import.meta.env.VITE_API_URL_LOCAL;
  }
  return BASE_API_URL;
};