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

### What happened to the website?

Because pages were generated in-browser, accessing the JustWatch API had to be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Unfortunately, the service that was hosting the proxy is no longer available for free. Thus, the website is down for the forseeable future.
