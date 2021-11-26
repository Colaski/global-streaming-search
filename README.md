# Global Streaming Search

The global streaming search engine.
[https://colaski.github.io/global-streaming-search/](https://colaski.github.io/global-streaming-search/)

Powered by the [JustWatch API](https://justwatch.com) using [JustWatch API TypeScript](https://github.com/Colaski/JustWatchAPITypeScript).

## Run Locally!

Execute these commands in your terminal:

```bash
git clone https://github.com/Colaski/global-streaming-search.git
cd global-streaming-search
npm install
npm run start
```
open `localhost:8000` in your browser.

## Why is loading taking so much time?

The website is generated in your browser, so there isn't a powerful server rendering the website. Also, because pages are generated in-browser accessing the JustWatch API must be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). So running the website locally will be faster, just make sure you have [Node.js installed](https://nodejs.org/en/download/) and then follow the Run Locally comands above!
