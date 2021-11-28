<script>
  import App from "./App.svelte";
</script>

<main>
  <a href="https://github.com/Colaski/global-streaming-search"
    ><img
      src="https://colaski.github.io/global-streaming-search/images/github.png"
      alt="github logo"
    /></a
  >
  <App />
</main>

<style>
  img {
    float: right;
    float: top;
    position: relative;
    z-index: 100;
    width: 2rem;
    padding-right: 0.5rem;
    padding-top: calc(100vh / 50);
  }
  :global(body) {
    background-image: linear-gradient(135deg, rgb(16, 24, 44), rgb(44, 16, 16));
    height: max-content;
    margin: 0;
    background-repeat: no-repeat;
    background-attachment: fixed;
    z-index: 0;
  }
</style>
