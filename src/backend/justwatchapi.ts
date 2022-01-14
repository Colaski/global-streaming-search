// Search for an Item (either a show or movie title) in a locale/country (ex. "en_US" for USA)
import { all_locales, all_providers } from "./data"

function proxy(): string {
  let proxies = [
    // // Colaski OG
    // "https://quiet-inlet-02682.herokuapp.com/", 
    // "https://arcane-woodland-11290.herokuapp.com/", 
    // "https://infinite-reef-34828.herokuapp.com/", 
    // "https://shielded-island-83939.herokuapp.com/",
    // "https://blooming-savannah-63408.herokuapp.com/",

    // // Colaski Pro
    // "https://desolate-bastion-94108.herokuapp.com/",
    // "https://secure-cliffs-97501.herokuapp.com/",
    // "https://fierce-oasis-99209.herokuapp.com/",
    // "https://polar-waters-99939.herokuapp.com/",
    // "https://polar-woodland-98004.herokuapp.com/",

    // // John Johnson
    // "https://hidden-tundra-52798.herokuapp.com/",
    // "https://intense-anchorage-79654.herokuapp.com/",
    // "https://pacific-refuge-02180.herokuapp.com/",
    // "https://serene-everglades-75055.herokuapp.com/",
    // "https://still-ocean-32580.herokuapp.com/",

    // // Jack Daniels
    // "https://enigmatic-stream-81793.herokuapp.com/",
    // "https://safe-beach-77258.herokuapp.com/",
    // "https://mysterious-cove-12751.herokuapp.com/",
    // "https://radiant-plains-59810.herokuapp.com/",
    // "https://guarded-reef-53294.herokuapp.com/",

    // // Jim Bean
    // "https://lit-fortress-39884.herokuapp.com/",
    // "https://serene-depths-23002.herokuapp.com/",
    // "https://whispering-waters-07258.herokuapp.com/",
    // "https://peaceful-castle-44825.herokuapp.com/",
    // "https://murmuring-thicket-31058.herokuapp.com/",

    // // James Jameson
    // "https://pure-cliffs-22620.herokuapp.com/",
    // "https://pacific-brushlands-02877.herokuapp.com/",
    // "https://frozen-coast-95713.herokuapp.com/",
    // "https://salty-everglades-46529.herokuapp.com/",
    // "https://enigmatic-springs-90651.herokuapp.com/",

    // Evan Williams
    "https://whispering-earth-79732.herokuapp.com/",
    "https://whispering-inlet-34670.herokuapp.com/",
    "https://gentle-wildwood-67571.herokuapp.com/",
    "https://powerful-crag-23558.herokuapp.com/",
    "https://obscure-ocean-48137.herokuapp.com/",

    // JOHNNIE WALKER
    "https://blooming-coast-35749.herokuapp.com/",
    "https://floating-citadel-26217.herokuapp.com/",
    "https://warm-depths-36138.herokuapp.com/",
    "https://still-gorge-22931.herokuapp.com/",
    "https://desolate-sierra-66017.herokuapp.com/",
  ]
  let randomIndex = Math.floor(Math.random() * proxies.length)
  return proxies[randomIndex]
}

export async function search_for_item(query: string, country: string): Promise<any> {
  console.log(proxy())
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