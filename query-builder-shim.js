(function () {
  const origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (typeof input === "string") {
      if (input === "/health" || input.startsWith("/api/")) {
        input = "/query-builder" + input;
      }
    } else if (input instanceof Request) {
      try {
        const u = new URL(input.url);
        if (u.origin === window.location.origin && (u.pathname === "/health" || u.pathname.startsWith("/api/"))) {
          u.pathname = "/query-builder" + u.pathname;
          input = new Request(u.toString(), input);
        }
      } catch (_) {}
    }
    return origFetch(input, init);
  };
})();
