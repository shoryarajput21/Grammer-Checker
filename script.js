const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");
const textInput = document.getElementById("textInput");
const suggestionsList = document.getElementById("suggestions");

checkBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const lang = document.getElementById("language").value;

  suggestionsList.innerHTML = "<li>Checking grammar...</li>";

  try {
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text, language: lang })
    });

    if (!response.ok) throw new Error("API response not OK");

    const data = await response.json();
    suggestionsList.innerHTML = "";

    if (!data.matches || data.matches.length === 0) {
      suggestionsList.innerHTML = "<li>No issues found 🎉</li>";
      return;
    }

    data.matches.forEach(match => {
      const li = document.createElement("li");
      const suggestions = match.replacements.map(r => r.value).join(", ") || "None";
      li.innerHTML = `<strong>Issue:</strong> ${match.message}<br><strong>Suggestions:</strong> ${suggestions}`;
      suggestionsList.appendChild(li);
    });

  } catch (error) {
    console.error("Error:", error);
    suggestionsList.innerHTML = "<li>Failed to check grammar. Try again!</li>";
  }
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  suggestionsList.innerHTML = "";
});
