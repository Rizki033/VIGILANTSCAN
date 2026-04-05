function analyzeURL() {
    const url = document.getElementById("urlInput").value;
    let result = "";

    if (!url) {
        result = "Please enter a URL";
    }

    //  code ajouté de check-https
    if (!url.startsWith("https://")) {
        result += "Not secure (no HTTPS)\n";
    } else {
        result += "Uses HTTPS\n";
    }

    document.getElementById("result").innerText = result;
}