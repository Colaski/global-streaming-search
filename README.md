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
npm run build
npm run start
```
open `localhost:8000` in your browser.

## Running In Docker/Server

Unfortunately, I do not have the time or will power to create a docker image with an instruction writeup to make self-hosting easy. For this to work outside of your localhost you would need to set up a [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) proxy somewhere, get all the ports to play nicely, and modify the souce of this app to send the API requests through your proxy. You can set up the cors proxy on the same machine, another docker image, or probably on the same docker image.

Some places to start would be [this cors proxy](https://github.com/Rob--W/cors-anywhere) and my [implementation for the github site](https://github.com/Colaski/global-streaming-search/blob/github-pages/src/backend/justwatchapi.ts). Note: my implementation is designed to mitigate rate limiting by the hosting provider for the proxy.

If anyone wants to try this on their own and do a pull request with easy to follow instructions I'd be happy to merge it.

## FAQ

### Why is loading taking so much time?

The website is generated in your browser, so there isn't a powerful server rendering the website. Also, because pages are generated in-browser, accessing the JustWatch API must be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). So running the website locally will be faster, just make sure you have [Node.js installed](https://nodejs.org/en/download/) and then follow the Run Locally comands above!

### Why are the results blank?

The website is generated in your browser, so accessing the JustWatch API must be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Since I'm using free instances to run the proxy, I sometimes run out of free hours for the proxy. At this point problems should be very rare, but if there is one please open an issue on this repo. 
