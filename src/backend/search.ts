import { search_for_item_id, get_all_locales, get_title_from_id, IDSearch, get_all_providers, Locale } from "./justwatchapi";

export async function search(query: string, locale: Locale): Promise<any> {
  return await search_for_item_id(query, locale)
}

export class TVOrMovie extends IDSearch {
  short_description: string
  number_seasons: string
  offers: [CountryOffers]

  constructor(is: IDSearch, short_description: string, number_seasons: string, offers: [CountryOffers]) {
    super(is.title, is.id, is.poster_uri, is.type, is.release_year, is.query_locale)
    this.short_description = short_description
    this.number_seasons = number_seasons
    this.offers = offers
  }
}

class CountryOffers {
  country: string
  offers: [Offer]
  constructor(country: string, offers: any) {
    this.country = country
    this.offers = offers
  }
}
class Offer {
  id: string
  short_name: string
  clear_name: string
  icon_uri: string
  monetization_types: [string]
  url: string
}

export async function get_all_info_from_id(search: IDSearch, providers: [Provider]): Promise<TVOrMovie> {
  const locales = await get_all_locales()

  let country_info: any = []
  var append_country_info = locales.map(async (i: any) => {
    let r = await get_title_from_id(search.id, i.full_locale, search.type)
    country_info.push({ country: i.country, info: r })
  })
  await Promise.all(append_country_info)

  let home = country_info.filter((obj: any) => {
    return obj.country === search.query_locale.country
  })
  home = home[0].info
  let short_description = home["short_description"]

  let number_seasons = ("seasons" in home) ? home["seasons"].length.toString() : "NULL"

  let offers: any = []
  var append_offers = country_info.map(async (i: any) => {
    let country = i.country
    i = i.info

    if ("offers" in i) {
      let os: any = []
      var append_os = i["offers"].map(async (i: any) => {
        if (i["monitization_types"] == "flatrate" || "ads" || "free") {
          providers.forEach(provider => {
            if (i.provider_id == provider.id) {
              os.push({
                id: provider.id,
                short_name: provider.short_name,
                clear_name: provider.clear_name,
                icon_uri: provider.icon_uri,
                monetization_types: provider.monetization_types,
                url: i["urls"]["standard_web"],
                seasons: i["element_count"]
              })
            }
          })
        }
      })
      await Promise.all(append_os)
      offers.push({
        country: country,
        offers: os
      })
    }
  })
  await Promise.all(append_offers)
  return new TVOrMovie(search, short_description, number_seasons, offers)
}

export class Provider {
  id: number
  short_name: string
  clear_name: string
  icon_uri: string
  monetization_types: [string]
  seasons: number

  constructor(id: number, short_name: string, clear_name: string, icon_uri: string, monetization_types: [string], seasons: number) {
    this.id = id
    this.short_name = short_name
    this.clear_name = clear_name
    this.icon_uri = icon_uri
    this.monetization_types = monetization_types
    this.seasons = seasons
  }
}
export async function distilled_providers(): Promise<[Provider]> {
  var p = await get_all_providers() as any
  var providers: any = []

  var extract_country = p.map(async (i: any) => {
    let provs: any = []

    i["providers"].forEach((i: any) => {
      if (i["monetization_types"]?.includes("flatrate") || i["monetization_types"]?.includes("free") || i["monetization_types"]?.includes("ads")) {
        var monetization_types = i["monetization_types"]

        let regex = new RegExp("\\s*([0-9]+)")
        var regex_match: any = regex.exec(i["icon_url"])
        let icon_uri = (regex_match != null) ? `https://www.justwatch.com/images/icon/${regex_match[0]}/s100/icon.webp` : "NULL"

        providers.push(
          new Provider(
            i["id"],
            i["short_name"],
            i["clear_name"],
            icon_uri,
            monetization_types,
            undefined
          ))
      }
    })
  })
  await Promise.all(extract_country)
  const unique = [...new Map(providers.map((item: { [x: string]: any; }) => [item["id"], item])).values()]
  return unique as [Provider]
}