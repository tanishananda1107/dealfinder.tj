if (!document.getElementById("amazonSidebar")) {
  const iframe = document.createElement("iframe");
  iframe.src = chrome.runtime.getURL("popup.html");
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.right = "0";
  iframe.style.width = "400px";
  iframe.style.height = "100%";
  iframe.style.zIndex = "100000";
  iframe.style.border = "none";
  iframe.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  iframe.id = "amazonSidebar";
  document.body.appendChild(iframe);
} else {
  document.getElementById("amazonSidebar").remove();
}

window.addEventListener('message', (event) => {
  if (event.data?.type === 'CLOSE_SIDEBAR') {
    const sidebar = document.getElementById("amazonSidebar");
    if (sidebar) sidebar.remove();
  }
});
