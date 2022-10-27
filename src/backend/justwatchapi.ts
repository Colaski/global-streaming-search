// Search for an Item (either a show or movie title) in a locale/country (ex. "en_US" for USA)

import { all_locales, all_providers } from "./data"

export async function search_for_item(query: string, country: string): Promise<any> {
    const url = `https://apis.justwatch.com/content/titles/${country}/popular`

    const body = {
        "query": query,
    }
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
           'Content-Type': 'application/json',
           "X-Requested-With": "fetch"
       }
    })
    if (response.ok == false) throw new Error("Http Error: " + response.status)
    return await response.json()
}

// Returns raw JSON information on every locale supported by JustWatch
async function get_locales(): Promise<any> {
    // const url = "https://apis.justwatch.com/content/locales/state"
    // const response = await fetch(url, {
    //   headers: {"X-Requested-With": "fetch"}
    // })
    // if (response.ok == false) throw new Error("Http Error: " + response.status)
    // return await response.json()

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
    const url = `https://apis.justwatch.com/content/providers/locale/${country}`
    const response = await fetch(url, {
      headers: {"X-Requested-With": "fetch"}
    })
    if (response.ok == false) throw new Error("Http Error: " + response.status)
    return response.json()
}

// Returns the JSON data on every single provider JustWatch has data on for every country
export async function get_all_providers(): Promise<any> {
    // const locale_list = await get_all_locales()
    // var providers_array: any = []
    // var promise = locale_list.map(async locale => {
    //     var r = await get_providers(locale.full_locale)
    //     var provider = {
    //         country: locale.country,
    //         providers: r
    //     }
    //     providers_array.push(provider)
    // })
    // await Promise.all(promise)
    // return providers_array
    return all_providers
}

/*
Returns JustWatch's data for a given show or movie for a given locale.
content_type is either "show" or "movie"
*/
export async function get_title_from_id(title_id: string, country: string, content_type: string): Promise<any> {
    const url = `https://apis.justwatch.com/content/titles/${content_type}/${title_id}/locale/${country}`
    const response = await fetch(url, {
      headers: {"X-Requested-With": "fetch"}
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