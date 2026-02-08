document.addEventListener("DOMContentLoaded", () => {
  if (!document.cookie.includes("spectrum_access=true") { // Not logged in or just iPad kid, so redirect
    window.location.href = "index.html";
  }
});
