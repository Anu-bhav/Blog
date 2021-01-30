<script>
    import Fa from 'svelte-fa'
    import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

    export let showOnPx = 450;
    let hidden = true;

    function goTop() {
        document.body.scrollIntoView();
    }

    function scrollContainer() {
        return document.documentElement || document.body;
    }

    function handleOnScroll() {
        if (!scrollContainer()) {
            return;
        }

        if (scrollContainer().scrollTop > showOnPx) {
            hidden = false;
        } else {
            hidden = true;
        }
    }
</script>

<style>
    .back-to-top {
        /* opacity: 1;
        transition: opacity 0.5s, visibility 0.5s;
        position: fixed;
        z-index: 99;
        right: 20px;
        user-select: none;
        bottom: 20px;
        color: white;
        background-color: black; */

        background-color: black;
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        font-size: 20px;
        line-height: 48px;
        width: 48px;
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 100;
        /* opacity: 0; */
        opacity: 1;
        transition: opacity 0.5s, visibility 0.5s;
        transform: translateY(0px);
        /* transition: all .5s ease */
    }

    .back-to-top.hidden {
        opacity: 0;
        /* visibility: hidden;
        opacity: 1; */
        transform: translateY(0)
    }

    .back-to-top:hover {
        background: #43c1e7;
    }
</style>

<svelte:window on:scroll={handleOnScroll} />

<button class="back-to-top" on:click={goTop} class:hidden>
    <Fa icon={faArrowUp} size="lg" />
</button>