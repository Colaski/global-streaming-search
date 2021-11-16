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
        <h1>Global Streaming Search</h1>
        <h3>
          Search for a movie or TV show title and see what streaming services
          offer it worldwide!
        </h3>
        <div style="display: inline-block;">
          <form on:submit|preventDefault={onSubmit}>
            <input
              class="search"
              type="text"
              bind:value={query}
              placeholder="Title"
            />
            <select class="search" bind:value={selected_locale}>
              {#each locales as locale}
                <option value={JSON.stringify(locale)}
                  >{locale["country"]}</option
                >
              {/each}
            </select>
            <input type="submit" class="search" />
          </form>
        </div>
      </div>
    {/await}
  </div>
{/if}

<style>
  .top {
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.7); /* Black w/opacity/see-through */
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    padding: 2rem;
    border-radius: 2rem;
  }
  .background {
    background-image: url("../../images/movie-poster-collection.webp");
    filter: blur(0.3rem);
    height: 100vh;
    margin-top: -3rem;
  }
  .class {
    text-align: center;
    padding: 1rem;
    margin: 0 auto;
  }

  h3 {
    font-weight: 300;
    color: white;
  }

  h1 {
    color: #ff7b00;
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 300;
  }

  .search {
    background-color: transparent;
    color: white;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.685);
  }
</style>
