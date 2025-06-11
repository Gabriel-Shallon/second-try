(() => {
  // ——— Setup global controller ———
  window.tweetCollector = {
    links: new Set(),
    running: true,
    getResults() { return [...this.links]; },
    stop() { this.running = false; }
  };

  (async () => {
    // 1) bloqueia live updates (evita 429)
    const _origFetch = window.fetch;
    window.fetch = function(resource, init) {
      if (typeof resource === 'string' &&
          resource.includes('/1.1/live_pipeline/update_subscriptions')) {
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      return _origFetch.apply(this, arguments);
    };

    // 2) vars de controle
    let prevCount = 0;
    let prevHeight = 0;
    let stableCycles = 0;
    const maxStable = 5;
    const delay = 800; // ms

    // 3) loop de coleta + scroll
    while (tweetCollector.running && stableCycles < maxStable) {
      // coleta URLs canônicas
      document
        .querySelectorAll('article a[href*="/status/"]')
        .forEach(a => {
          const m = a.href.match(/^https:\/\/x\.com\/[^\/]+\/status\/\d+$/);
          if (m) tweetCollector.links.add(m[0]);
        });

      const currCount = tweetCollector.links.size;
      const currHeight = document.body.scrollHeight;

      // checa se nada mudou (nem URLs nem altura da página)
      if (currCount === prevCount && currHeight === prevHeight) {
        stableCycles++;
      } else {
        stableCycles = 0;
        prevCount = currCount;
        prevHeight = currHeight;
      }

      // scroll e espera
      if (stableCycles < maxStable && tweetCollector.running) {
        window.scrollBy(0, window.innerHeight);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    // 4) imprime os resultados
    console.log(`✅ Coletados ${tweetCollector.links.size} tweets.`);
    console.log(tweetCollector.getResults().join('\n'));
  })();
})();
