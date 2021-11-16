<script lang="ts">
  import Search from "./Search.svelte";
  import SearchResults from "./SearchResults.svelte";
  import Selection from "./Selection.svelte";
  import Loading from "./Loading.svelte";

  import { distilled_providers } from "./backend/search";

  let providers = distilled_providers();
  // change the selected page
  export let page = "search";

  // for "SearchResults" page
  export let search = undefined;
  export let locale: any = undefined;

  // for "Selection"
  export let selection = undefined;
</script>

<!--
  Goes through possible values for the query and renders appropriate page.
  
  values:
      - search
        is the default value, displays the search bar page.

      - SearchResults
        displays the results from the search page search.

      - Selection
        displays the information from the title selected from SearchResults.
-->

{#await providers}
  <Loading/>
{:then providers}
  {#if page == "search"}
    <Search />
  {:else if page == "SearchResults"}
    <SearchResults query="{search}," {locale} />
  {:else if page == "Selection"}
    <Selection {providers} {selection} />
  {/if}
{/await}
