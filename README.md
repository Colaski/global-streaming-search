# Global Streaming Search

Powered by the [JustWatch API](https://justwatch.com) using [JustWatch API TypeScript](https://github.com/Colaski/JustWatchAPITypeScript).

## Run Locally!

Execute these commands in your terminal:

```bash
git clone https://github.com/Colaski/global-streaming-search.git
cd global-streaming-search
npm install
npm run build
npm run start
```
open `localhost:8000` in your browser.

## Find it on Docker Hub All Ready to Go!

[https://hub.docker.com/r/colaski/global-streaming-search](https://hub.docker.com/r/colaski/global-streaming-search)

## FAQ

### What happened to the website?

Because pages were generated in-browser, accessing the JustWatch API had to be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Unfortunately, the service that was hosting the proxy is no longer available for free. Thus, the website is down for the forseeable future.
