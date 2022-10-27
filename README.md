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

A dockerfile is provided for running within your localhost.

```sh
git clone https://github.com/Colaski/global-streaming-search.git
cd global-streaming-search
docker build . -t "streaming-search"
docker run -p 8000:8000 streaming-search 
```

Open `localhost:8000` in your browser.


Note: The first 8000 in `docker run -p 8000:8000 streaming-search` can be replaced with whatever port you would like to use to access the site on your localhost for example, `docker run -p 80:8000 streaming-search` would put the site on http://localhost:80 (which can be shortened to just http://localhost since browsers assume 80)

**However** if you wish to self-host the site beyond localhost, proxying is needed due to [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). You would need to set up a  proxy somewhere, and get all the ports to play nicely.

Unfortunately, I do not have the time to create a docker image with an instruction writeup to make self-hosting easy. If anyone wants to try this on their own and do a pull request with easy to follow instructions I'd be happy to merge it.

## FAQ

### Why is loading taking so much time?

The website is generated in your browser, so there isn't a powerful server rendering the website. Also, because pages are generated in-browser, accessing the JustWatch API must be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). So running the website locally will be faster, just make sure you have [Node.js installed](https://nodejs.org/en/download/) and then follow the Run Locally comands above!

### Why are the results blank?

The website is generated in your browser, so accessing the JustWatch API must be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Since I'm using free instances to run the proxy, I sometimes run out of free hours for the proxy. At this point problems should be very rare, but if there is one please open an issue on this repo.
