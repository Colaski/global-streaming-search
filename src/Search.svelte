<script lang="ts">
  import App from "./App.svelte";
  import { get_all_locales } from "./backend/justwatchapi";
  import Loading from "./Loading.svelte"

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
      <Loading/>
    {:then locales}
      <h1>Search</h1>
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
              <option value={JSON.stringify(locale)}>{locale["country"]}</option
              >
            {/each}
          </select>
          <input type="submit" class="search" />
        </form>
      </div>
    {/await}
  </div>
{/if}

<style>
  .class {
    text-align: center;
    padding: 1rem;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .search {
    background-color: transparent;
    color: white;
  }

  input::placeholder {
    color: rgba(255, 255, 255, 0.685);
  }
</style>
