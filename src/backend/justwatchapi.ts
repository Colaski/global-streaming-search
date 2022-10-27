// Search for an Item (either a show or movie title) in a locale/country (ex. "en_US" for USA)
import { all_locales, all_providers } from "./data"

let d = new Date()
let date = d.getDate()

function proxy(): string {
  var proxies = []

  if (date <= 4) {
    proxies = [
      // Rowan Creek
      "https://immense-depths-02780.herokuapp.com/",
      "https://infinite-depths-28550.herokuapp.com/",
      "https://infinite-dusk-31128.herokuapp.com/",
      "https://stormy-cliffs-99933.herokuapp.com/",
      "https://vast-dusk-31175.herokuapp.com/",
    ]
  }
  else if (date <= 8 && date > 4) {
    proxies = [
      // Elijah Craig
      "https://mighty-meadow-71712.herokuapp.com/",
      "https://morning-dusk-98003.herokuapp.com/",
      "https://infinite-gorge-75225.herokuapp.com/",
      "https://lit-waters-97162.herokuapp.com/",
      "https://hidden-caverns-23398.herokuapp.com/"
    ]
  } else if (date <= 12 && date > 8) {
    proxies = [
      // JOHNNIE WALKER
      "https://blooming-coast-35749.herokuapp.com/",
      "https://floating-citadel-26217.herokuapp.com/",
      "https://warm-depths-36138.herokuapp.com/",
      "https://still-gorge-22931.herokuapp.com/",
      "https://desolate-sierra-66017.herokuapp.com/",
    ]
  } else if (date <= 16 && date > 12) {
    proxies = [
      // Colaski OG
      "https://quiet-inlet-02682.herokuapp.com/", 
      "https://arcane-woodland-11290.herokuapp.com/", 
      "https://infinite-reef-34828.herokuapp.com/", 
      "https://shielded-island-83939.herokuapp.com/",
      "https://blooming-savannah-63408.herokuapp.com/",
    ]
  } else if (date <= 20 && date > 16) {
    proxies = [
      // Glen Fohdry
      "https://guarded-wave-43380.herokuapp.com/",
      "https://fathomless-headland-13472.herokuapp.com/",
      "https://protected-escarpment-40664.herokuapp.com/",
      "https://whispering-oasis-41062.herokuapp.com/",
      "https://secure-depths-48114.herokuapp.com/",

    ]
  } else { // if (date <= 24 && date > 20) {
    proxies = [
      // Evan Williams
      "https://whispering-earth-79732.herokuapp.com/",
      "https://whispering-inlet-34670.herokuapp.com/",
      "https://gentle-wildwood-67571.herokuapp.com/",
      "https://powerful-crag-23558.herokuapp.com/",
      "https://obscure-ocean-48137.herokuapp.com/",
    ]
  } // else {
//     proxies = [
      
//     ]
//   }

  let randomIndex = Math.floor(Math.random() * proxies.length)
  return proxies[randomIndex]
}

export async function search_for_item(query: string, country: string): Promise<any> {
    const url = `${proxy()}https://apis.justwatch.com/content/titles/${country}/popular`

    const body = {
        "query": query,
    }
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
           'Content-Type': 'application/json',
           "X-Requested-With": "fetch",
           "Origin": "https://colaski.github.io"
       }
    })
    if (response.ok == false) throw new Error("Http Error: " + response.status)
    return await response.json()
}

// Returns raw JSON information on every locale supported by JustWatch
async function get_locales(): Promise<any> {
    return all_locales
}

export class Locale {
    country: string;
    full_locale: string;
    constructor(country: string, full_locale: string) {
        this.country = country
        this.full_locale = full_locale
    }
}
/* 
Returns the usable information about every JustWatch supported locale, 
the property for key 'full_locale' is the one usable for API requests.
ex. en_US
*/
export async function get_all_locales(): Promise<[Locale]> {
    const locales = await get_locales()
    var all_locales: any = []

    locales.forEach((i: any) => {
        var l = new Locale(i.country, i.full_locale)
        all_locales.push(l)
    })
    return all_locales
}

// Returns JSON data on every provider JustWatch has data on for a given locale/country
async function get_providers(country: string): Promise<any> {
    const url = `${proxy()}https://apis.justwatch.com/content/providers/locale/${country}`
    const response = await fetch(url, {
      headers: {
        "X-Requested-With": "fetch",
        "Origin": "https://colaski.github.io"
      }
    })
    if (response.ok == false) throw new Error("Http Error: " + response.status)
    return response.json()
}

// Returns the JSON data on every single provider JustWatch has data on for every country
export async function get_all_providers(): Promise<any> {
    return all_providers
}

/*
Returns JustWatch's data for a given show or movie for a given locale.
content_type is either "show" or "movie"
*/
export async function get_title_from_id(title_id: string, country: string, content_type: string): Promise<any> {
    const url = `${proxy()}https://apis.justwatch.com/content/titles/${content_type}/${title_id}/locale/${country}`
    const response = await fetch(url, {
      headers: {
        "X-Requested-With": "fetch",
        "Origin": "https://colaski.github.io"
    }
    })
    if (response.ok == false) throw new Error("Http Error: " + response.status)
    return response.json()
}

export class IDSearch {
    title: string
    id: string
    poster_uri: string
    type: string
    release_year: string
    query_locale: Locale

    constructor(title: string, id: string, poster_uri: string, type: string, release_year: string, query_locale: Locale) {
        this.title = title
        this.id = id
        this.poster_uri = poster_uri
        this.type = type
        this.release_year = release_year
        this.query_locale = query_locale
    }
}
// Returns the most useful data from a search query as an array of IDSearch objects.
// IDSearch's properties are the title of the movie or show, JustWatch's id for that movie or show, 
// the URL of that movie or show's poster, the type (show or movie), the release year, and the Locale 
// object used to make the search
export async function search_for_item_id(query: string, locale: Locale): Promise<[IDSearch]> {
    const r = await search_for_item(query, locale.full_locale)
    var titles: any = []

    r["items"].forEach((i: any) => {
        let regex = new RegExp("\\s*([0-9]+)")
        var regex_match: any = regex.exec(i["poster"])
        var poster_uri: string
        if (regex_match == null) {
            poster_uri = "NULL"
        } else {
            poster_uri = `https://images.justwatch.com/poster/${regex_match[0]}/s592/poster.webp`
        }
        titles.push(new IDSearch(i["title"], i["id"], poster_uri, i["object_type"], i["original_release_year"], locale))
    })
    return titles
}
