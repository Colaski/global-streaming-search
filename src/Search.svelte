<script lang="ts">
  import App from "./App.svelte";
  import { get_all_locales } from "./backend/justwatchapi";
  import Loading from "./Loading.svelte";

  let query: string;
  let locales: any = get_all_locales();

  let selected_locale;
  let submitted = false;
  function onSubmit() {
    if (query != undefined) {
      submitted = true;
    } else {
      alert("Please input a valid title.");
    }
  }
</script>

{#if submitted}
  <App
    page="SearchResults"
    search="{query},"
    locale={JSON.parse(selected_locale)}
  />
{:else}
  <div class="class">
    {#await locales}
      <Loading />
    {:then locales}
      <div class="background" />
      <div class="top">
        <div class="welcome">
          <h1>Global Streaming Search</h1>
        <h3>
          Search for a movie or TV show title and see what streaming services
          offer it worldwide!
        </h3>
          <form on:submit|preventDefault={onSubmit}>
            <div>
              <input
                class="search"
                type="text"
                bind:value={query}
                placeholder="🔎 Title"
                style="width: 40vw; height: 2.5rem;"
              />
              <input type="submit" class="search" value="Search" />
            </div>
            <p>
              Optionally, select a country for the initial search. Search in your country's native language, can also help with titles only found in your country.
            </p>
            <select class="search" bind:value={selected_locale}>
              {#each locales as locale}
                <option value={JSON.stringify(locale)}
                  >{locale["country"]}</option
                >
              {/each}
            </select>
          </form>
        </div>
      </div>
    {/await}
  </div>
{/if}

<style>
  option {
    background-color: black;
  }
  .welcome {
    padding-top: calc(100vh / 6);
    padding-left: 5vw;
    padding-right: 5vw;
  }
  p {
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
  }
  .top {
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 100vh;
    margin-top: calc(100vh / 6);
  }
  .background {
    background-image: url("https://colaski.github.io/global-streaming-search/images/movie-poster-collection.webp");
    filter: blur(0.5rem);
    height: 100vh;
    margin-top: -3rem;
  }
  .class {
    text-align: center;
    padding: 1rem;
    margin: 0 auto;
  }

  h3 {
    font-weight: 500;
    color: white;
    font-size: 1rem;
  }

  h1 {
    color: #ff7b00;
    font-size: 2em;
    font-weight: 300;
  }

  .search {
    background-color: transparent;
    color: white;
    border-radius: 0.3rem;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.685);
  }
</style>
