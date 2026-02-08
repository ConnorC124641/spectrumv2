console.log("Lock script loaded");

document.addEventListener("DOMContentLoaded", () => {
  if (!document.cookie.includes("spectrum_access=true")) { // Not logged in or just iPad kid, so redirect
    console.log("Not logged in");
    window.location.href = "index.html";
  }
});
