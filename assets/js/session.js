const session = localStorage.getItem("sessionID")

if (session != "true") {
    window.location = "index.html"
}