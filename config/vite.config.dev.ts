import {mergeConfig} from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConig from './vite.config.base';

export default mergeConfig(
    {
        mode: 'development',
        server: {
            open: true,
            fs: {
                strict: true
            },
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    timeout: 10000,
                    rewrite: (path: string) => path.replace(/^\/api/, ''),
                }
            }
        },
        plugins: [
            eslint({
                cache: false,
                include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
                exclude: ['node_modules']
            })
        ]
    },
    baseConig
);
