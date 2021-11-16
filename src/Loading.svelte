<div style="padding-top:8rem; height: 100vh;">
  <span>
    <h1>Loading...</h1>
  </span>
  <span>
    <div class="loader"/>
  </span>
</div>

<style>
  h1 {
    Color: white;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loader {
    border: 1rem solid grey;
    border-top: 1rem solid rgb(255, 230, 0);
    border-radius: 50%;
    width: 7rem;
    height: 7rem;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
