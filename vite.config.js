import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserSite = repositoryName?.endsWith('.github.io');
const inferredBase =
  process.env.GITHUB_ACTIONS && repositoryName && !isUserSite
    ? `/${repositoryName}/`
    : '/';

export default defineConfig({
  base: process.env.VITE_BASE ?? inferredBase,
  plugins: [react()],
});
