import { createServer, defineConfig, type Plugin } from 'vite';

const APPS = ['rules', 'scenarios'];

/** Serves each app from its own folder, as the published site does, so one dev server runs the whole site. */
function apps(): Plugin {
  return {
    name: 'apps',
    apply: 'serve',
    async configureServer(server) {
      for (const name of APPS) {
        const base = `/${name}/`;
        const app = await createServer({
          configFile: `${name}/vite.config.ts`,
          root: name,
          base,
          // Apps that share a cache folder undo each other's prebuilt dependencies.
          cacheDir: `../node_modules/.vite/${name}`,
          server: { middlewareMode: true, hmr: { server: server.httpServer ?? undefined } },
        });
        server.httpServer?.once('close', () => app.close());
        server.middlewares.use((req, res, next) => {
          const path = req.url!.split(/[?#]/)[0];
          if (path === `/${name}`) {
            res.writeHead(302, { Location: base + req.url!.slice(path.length) });
            res.end();
          } else if (path.startsWith(base)) {
            app.middlewares(req, res, next);
          } else {
            next();
          }
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [apps()],
  // The apps' folders are their own servers' to watch and prebuild.
  server: { watch: { ignored: APPS.map((name) => `**/${name}/**`) } },
  optimizeDeps: { entries: ['index.html'] },
});
