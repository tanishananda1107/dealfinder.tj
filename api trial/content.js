(function () {
    if (document.getElementById("shopping-sidebar") === null) {
      let query = "";
      const input = document.querySelector("input[name='q'], input[type='search']");
      if (input) query = input.value.trim();
  
      const sidebar = document.createElement("div");
      sidebar.id = "shopping-sidebar";
      sidebar.setAttribute("data-query", encodeURIComponent(query));
      sidebar.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100%;
        background: white;
        z-index: 9999;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        border-left: 1px solid #ddd;
      `;
  
      document.body.appendChild(sidebar);
  
      fetch(chrome.runtime.getURL("sidebar.html"))
        .then(response => response.text())
        .then(html => {
          sidebar.innerHTML = html;
  
          const css = document.createElement("link");
          css.rel = "stylesheet";
          css.href = chrome.runtime.getURL("sidebar.css");
          document.head.appendChild(css);
  
          const script = document.createElement("script");
          script.src = chrome.runtime.getURL("sidebar.js");
          script.type = "module";
          script.onload = () => console.log("Sidebar script loaded");
          document.body.appendChild(script);
        });
    }
  })();
  