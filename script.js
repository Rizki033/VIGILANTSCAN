function analyzeURL() {
    const url = document.getElementById("urlInput").value;
    let result = "";

    // Vérification input
    if (!url) {
        result = "Please enter a URL";
        document.getElementById("result").innerText = result;
        return;
    }

    // HTTPS check
    if (!url.startsWith("https://")) {
        result += "⚠Not secure (no HTTPS)\n";
    } else {
        result += "Uses HTTPS\n";
    }

    // URL length check
    if (url.length > 30) {
        result += " URL is too long (suspicious)\n";
    }

    // Suspicious keywords
    const suspiciousWords = ["login", "verify", "free", "bank"];
    suspiciousWords.forEach(word => {
        if (url.toLowerCase().includes(word)) {
            result += `⚠Suspicious keyword detected: ${word}\n`;
        }
    });

    // Final result
    if (result === "") {
        result = "URL seems safe";
    }

    document.getElementById("result").innerText = result;
}