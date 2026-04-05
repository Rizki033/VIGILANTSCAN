function analyzeURL() {
    const url = document.getElementById("urlInput").value;
    let result = "";

    if (!url) {
        result = "Please enter a URL";
    }

<<<<<<< HEAD

    //  HTTPS check
    if (!url.startsWith("https://")) {
        result += "Not secure (no HTTPS)\n";
    } else {
        result += "Uses HTTPS\n";
    }

    // Long URL check
    if (url.length > 30) {
        result += "⚠URL is too long (suspicious)\n";
    }

    // Suspicious keywords
    const suspiciousWords = ["login", "verify", "free", "bank"];
    suspiciousWords.forEach(word => {
        if (url.includes(word)) {
            result += `⚠Suspicious keyword detected: ${word}\n`;
        }
    });

    // Final result
    if (result === "") {
        result = "URL seems safe";
    }

    document.getElementById("result").innerText = result;

=======
>>>>>>> feature/suspicious-keywords
    document.getElementById("result").innerText = result;
}

if (!url.startsWith("https://")) {
    result += "Not secure (no HTTPS)\n";
} else {
    result += "Uses HTTPS\n";
}

if (url.length > 30) {
    result += "URL is too long (suspicious)\n";
}

if (result === "") {
    result = "URL seems safe";
<<<<<<< HEAD

}
=======
}


const suspiciousWords = ["login", "verify", "free", "bank"];

suspiciousWords.forEach(word => {
    if (url.includes(word)) {
        result += `Suspicious keyword detected: ${word}\n`;
    }
});
>>>>>>> feature/suspicious-keywords
