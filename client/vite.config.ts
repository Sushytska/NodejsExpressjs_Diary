import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig(() => {
  const mode = 'development';

  const env = loadEnv(mode, process.cwd(), '');

  const API_URL = env.VITE_API_URL || 'http://localhost:3000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': API_URL,
      },
    },
  };
});
