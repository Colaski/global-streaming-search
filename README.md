**Archive Notice**: Don't have the time to properly maintain this as an OSS project and it probably should be re-written. Originally wrote this thing in about a week and never expected it to have as much interested as it did, thank you! Feel free to fork the project or and/or reach out about taking it over so I can point to it in this README.

# Global Streaming Search

Powered by the unofficial [JustWatch API](https://www.justwatch.com) using [JustWatch API TypeScript](https://github.com/Colaski/JustWatchAPITypeScript).

## Disclaimer

This is not the official JustWatch API.

The work of many developers went and is still going into the development and maintenance of the data and the API. The main business of JustWatch is to operate a streaming guide with apps for iOS, Android and TV that offers the data for business intelligence and marketing. Therefore it is prohibited to use the API for commercial purposes, meaning all purposes intended for, or directed towards, commercial advantage or monetization by an individual or organization (consumer service, data science, business intelligence etc.). The API may be used for non-commercial purposes such as private projects, but please be respectful with your API calls to prevent an overload on the API.

JustWatch does not warrant that the API is free of inaccuracies, errors, bugs, malicious code or interruptions or that it is reliable, flawless, complete or otherwise valid. JustWatch does not warrant that the API will meet your requirements, will be available without interruption, or that the results from its use will be accurate or reliable, the quality of the products, services, information or other materials received through the API meets your expectations, and errors regarding the API are corrected. Use of the API is at your sole discretion and risk. You are solely responsible for any damages resulting from your use of the API, including damage to its system or loss of data. JustWatch can disable and change the API at any time without notice and without giving any reason. JustWatch excludes any liability to the extent permitted for direct, indirect or incidental damages, consequential damages, lost profits, quantifiable pecuniary losses arising out of or in connection with the use of the API.
Incorrect or prohibited use of the API, for example for commercial use, may result in a claim for damages by JustWatch.

If you would like to work with JustWatch and use the official Data API take a look at JustWatch Media and contact us at data-partner@justwatch.com. Currently, JustWatch can only work with bigger partners and clients. JustWatch is also hiring: https://www.justwatch.com/us/talent and has some interesting open source projects on GitHub.

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

```bash
docker run -p 8000:8000 colaski/global-streaming-search
```

[https://hub.docker.com/r/colaski/global-streaming-search](https://hub.docker.com/r/colaski/global-streaming-search)

## FAQ

### What happened to the website?

Because pages were generated in-browser, accessing the JustWatch API had to be done through a proxy because of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). Unfortunately, the service that was hosting the proxy is no longer available for free. Thus, the website is down for the forseeable future.
