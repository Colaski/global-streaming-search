<script lang="ts">
  import Loading from "./Loading.svelte"
  import type { IDSearch } from "./backend/justwatchapi";
  import { get_all_info_from_id, Provider, TVOrMovie } from "./backend/search";
  import Header from "./Header.svelte"

  export let providers: [Provider];
  export let selection;
  selection = JSON.parse(selection) as IDSearch;

  let title = get_all_info_from_id(selection, providers);
</script>

{#await title}
  <Loading/>
{:then titles}
  <Header/>
  <div class="selection" style="--backdrop-url: url({titles.backdrop_url});">
    <div style="background-color: transparent; height: 15rem;" />
    <div class="box">
      <div style="display: flex; align-items: left">
        <img
          src={titles["poster_uri"]}
          alt="Poster for the {titles['type']} {titles['title']}"
        />
        <div class="text">
          <h1>{titles["title"]}</h1>
          <h3>{titles["release_year"]}</h3>
          <p>{titles["short_description"]}</p>
          {#each titles.offers as country}
            <div class="offer">
              <h4>{country["country"]}</h4>
              {#each country.offers as offer}
                <div style="display: inline-block;">
                  <span style="text-align: center; display: inline-block;">
                    <a href="{offer["url"]}"><img src="{offer["icon_uri"]}" alt="Icon for {offer.clear_name}" id="{offer.short_name}"></a>
                  <label for="{offer.short_name}">{offer.clear_name}</label>
                  </span>
                </div>
                <!--Continue-->
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/await}

<style>
  label {
    font-size: 0.5rem;
    max-width: 7rem;
  }
  .offer {
    border-style: solid;
    border-radius: 2rem;
    border-color: rgba(0, 0, 0, 0.411);
    background-color:rgba(0, 0, 0, 0.411);
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: 2rem;
  }
  .text {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  img {
    width: 35%;
    margin-left: -10%;
    border-color: rgb(44, 16, 16);
    border-radius: 1rem;
    border-width: 0.5rem;
    border-style: solid;
    height: 50%;
  }
  .selection {
    margin-top: -1.5rem;
    background-image: var(--backdrop-url);
    background-size: cover;
    height: 30rem;
    margin-left: -1rem;
    margin-right: -1rem;
  }
  .box {
    display: block;
    margin-left: 10%;
    margin-right: 10%;
    background-color: rgb(44, 44, 44);
    padding: 1rem;
    border-radius: 1rem;
    color: white;
  }
</style>
