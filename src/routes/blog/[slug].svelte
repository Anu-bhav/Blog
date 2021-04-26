<script context="module">
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].html
    const res = await this.fetch(`blog/${params.slug}.json`);
    const data = await res.json();
    let pdf_location = "pdf/" + params.slug + ".pdf";
    let pdf_res = await this.fetch(pdf_location);
    let has_pdf = true;

    if (pdf_res.status === 404) {
      pdf_location = "#";
      has_pdf = false;
    }

    if (res.status === 200) {
      return { pdf_location, has_pdf, post: data };
    } else {
      this.error(res.status, data.message);
    }
  }

</script>

<script>
  import Bio from '../../components/Bio.svelte';
  import BackToTop from "./BackToTop.svelte";
  export let post, pdf_location, has_pdf
</script>

<style>
  header {
    text-align: center;
  }

  header h1 {
    margin-bottom: 0.7em;
  }

  header p {
    color: #AAA;
    text-transform: uppercase;
    font-family: Rubik, sans-serif;
    font-weight: 600;
  }

  header hr {
    min-width: 100px;
    width: 30%;
  }

  #pdf_link {
    color: #fff;
    background-color: #333;
    border-radius: 5px;
    padding: 8px;
    border: none;
  }
</style>

<svelte:head>
  <title>{post.title}</title>
  <!--  Include canonical links to your blog -->
  <!--   <link rel="canonical" href="" /> -->

  <!-- Validate your twitter card with https://cards-dev.twitter.com/validator  -->
  <!-- Update content properties with your URL   -->
  <!-- 	<meta property="og:url" content=""} /> -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={post.title} />
  <meta name="Description" content={post.excerpt} />
  <meta property="og:description" content={post.excerpt} />

  <!--  Link to your preferred image  -->
  <!-- 	<meta property="og:image" content="" /> -->

  <meta name="twitter:card" content="summary_large_image" />

  <!--  Link to your Domain  -->
  <!-- 	<meta name="twitter:domain" value="" /> -->

  <!--  Link to your Twitter Account  -->
  <!-- 	<meta name="twitter:creator" value="" /> -->

  <meta name="twitter:title" value={post.title} />
  <meta name="twitter:description" content={post.excerpt} />

  <!--  Link to your preferred image to be displayed on Twitter (832x520px) -->
  <!-- 	<meta name="twitter:image" content="" /> -->

  <meta name="twitter:label1" value="Published on" />
  <meta name="twitter:data1" value={new Date(post.printDate).toLocaleDateString(undefined, { year: 'numeric' ,
    month: 'short' , day: 'numeric' })} />
  <meta name="twitter:label2" value="Reading Time" />
  <meta name="twitter:data2" value={post.printReadingTime} />
</svelte:head>

<header>
  <p>{post.printDate} ~ {post.printReadingTime}</p>
  <h1>{post.title}</h1>
  {#if has_pdf}
  <a id="pdf_link" target="_blank" rel="nofollow" href="{pdf_location}">View As PDF</a>
  {/if}
  <hr />
</header>
<div class="container">
  <article class="content">
    {@html post.html}
  </article>
  <hr />
  <BackToTop />
  <Bio />
</div>