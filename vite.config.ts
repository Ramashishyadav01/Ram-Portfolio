import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contactHandler from './api/contact.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-contact-handler',
      configureServer(server) {
        server.middlewares.use('/api/contact', async (req, res) => {
          try {
            await contactHandler(req as any, res as any);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: err.message || 'Server error' }));
          }
        });
      }
    }
  ],
  server:{
    open:true,
  }
})

