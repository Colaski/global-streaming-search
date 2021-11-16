<script>
  import App from "./App.svelte"
</script>

<svelte:head>
  <title>Steaming Search</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <html lang="en" />
</svelte:head>

<main>
  <App/>
</main>

<style>
  :global(body) {
    background-image: linear-gradient(135deg, rgb(16, 24, 44), rgb(44, 16, 16));
    height: 100%;
    margin: 0;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
</style>