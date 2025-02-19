import express, { Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import * as cheerio from 'cheerio';
import { IncomingMessage } from 'http';
import decompressResponse from 'decompress-response';

const app = express();
const PORT = 3000;

const TARGET = process.env.PROXY_URL;

const proxy = createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  selfHandleResponse: true,
  on: {
    proxyRes: (proxyRes: IncomingMessage, req: Request, res: Response) => {
      const decompressed = decompressResponse(proxyRes);
      const contentType = proxyRes.headers['content-type'] || '';

      delete proxyRes.headers['content-encoding'];

      Object.keys(proxyRes.headers).forEach(key => {
        const value = proxyRes.headers[key];
        if (value) {
          res.setHeader(key, value);
        }
      });

      if (!contentType.includes('text/html')) {
        decompressed.pipe(res);
        return;
      }

      let body = '';
      decompressed.on('data', (chunk: Buffer) => {
        body += chunk;
      });

      decompressed.on('end', () => {
        try {
          const $ = cheerio.load(body);

          delete proxyRes.headers['content-security-policy'];
          delete proxyRes.headers['content-security-policy-report-only'];

          $('head').append('<link rel="stylesheet" href="/dist/styles/main.css">');
          $('body').append('<script type="module" src="/dist/js/main.js"></script>');

          Object.keys(proxyRes.headers).forEach(key => {
            const value = proxyRes.headers[key];
            if (value) {
              res.setHeader(key, value);
            }
          });

          res.setHeader('Access-Control-Allow-Origin', '*');

          res.end($.html());
        } catch (error) {
          console.error('Error modifying the response:', error);
          res.end(body);
        }
      });
    }
  }
});

app.use('/dist', express.static('dist'));

app.use('/', proxy);

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Targeting: ${TARGET}`);
  console.log(`BrowserSync will be available at http://localhost:3001`);
});
