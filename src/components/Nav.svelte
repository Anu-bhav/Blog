<script>
  export let segment;
</script>

<style>
  nav {
    align-items: flex-end;
    display: flex;
    flex: 1;
    font-family: Rubik, sans-serif;
    font-weight: 700;
    justify-content: center;
    text-transform: uppercase;
    line-height: 75px;
  }

  a {
    color: inherit;
    text-decoration: none;
    padding: 10px 5px;
    display: block;
    position: relative;
    margin-left: 20px;
  }

  a:not(.selected) {
    opacity: 0.7;
  }

  a::before {
    content: '';
    position: absolute;
    transition: transform .3s ease;
    left: 0;
    bottom: 25px;
    width: 100%;
    height: 2px;
    background: #AAA;
    transform: scaleX(0);
  }

  a:hover::before,
  .selected::before {
    transform: scaleX(1);
  }

  .selected::before {
    background: #43c1e7;
  }
</style>

<nav>
  <a class='{segment === undefined ? "selected" : ""}' href='.'>Home</a>
  <a rel=prefetch class='{segment === "blog" ? "selected" : ""}' href='blog'>Blog</a>
  <a class='{segment === "website" ? "selected" : ""}' href='https://anubhav.xyz'>Website</a>
</nav>