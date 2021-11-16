<script lang="ts">
  import Loading from "./Loading.svelte"
  import App from "./App.svelte";
  import Header from "./Header.svelte"

  import type { Locale, IDSearch } from "./backend/justwatchapi";
  import { search } from "./backend/search";

  export let query: string;
  export let locale: Locale;

  // not sure why here is randomly 2 commas that sometimes appear
  // on my query so frick em.
  query = query.replace(",,", "");

  let search_results = search(query, locale);

  let selected = false;
  let selection: string;
  function select(r: any) {
    selected = true;
    selection = JSON.stringify(r);
  }
</script>

{#if selected}
  <App page="Selection" {selection} />
{:else}
  <Header/>
  <h2 style="color: white; text-align: center;">
    Results for <span style="color: red;">{query}</span>
  </h2>
  {#await search_results}
    <Loading/>
  {:then search_results}
    {#if search_results.length > 0}
      <div class="results">
        {#each search_results as result}
          <div
            style="display: inline-block; margin-left: 2rem; margin-right: 2rem; margin-bottom: 2rem;"
          >
            <div class="result">
              {#if result["poster_uri"] != "NULL"}
                <img
                src={result["poster_uri"]}
                alt="Poster for the {result['type']} {result['title']}"
                />
              {:else}
                <img
                src="./images/noImage.webp"
                alt="No image found for the {result['type']} {result['title']}"
                />
              {/if}
              <span class="resultinfo" on:click={() => select(result)}>
                <h2>{result["title"]}</h2>
                <h4>({result["release_year"]})</h4>
                <h4>{result["type"]}</h4>
              </span>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <span style="color: white; text-align: center;">
        <h1>No results 😭</h1>
        <h2>please reload the page and try a different title.</h2>
      </span>
    {/if}
  {/await}
{/if}

<style>
  img {
    width: 15rem;
  }
  .results {
    text-align: center;
  }
  .result {
    position: relative;
    width: 15rem;
  }
  .resultinfo {
    display: inline-block;
    padding-left: 2rem;
    padding-right: 2rem;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(29, 106, 154, 0.72);
    color: #fff;
    text-align: center;
    visibility: hidden;
    opacity: 0;

    /* transition effect. not necessary */
    transition: opacity 0.2s, visibility 0.2s;
  }
  .result:hover .resultinfo {
    visibility: visible;
    opacity: 1;
  }
</style>
