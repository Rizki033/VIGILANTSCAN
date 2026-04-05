function analyzeURL() {
    const url = document.getElementById("urlInput").value;
    let result = "";

    if (!url) {
        result = "Please enter a URL";
    }

    document.getElementById("result").innerText = result;
}