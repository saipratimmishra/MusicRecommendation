let language = "HINDI";
function changeLangugage(event){
  language = event.target.innerText.toUpperCase(); 
  let lang=document.getElementById("lang")
  lang.textContent=language;
}
async function sendMood(mood) {
  const resultUL = document.getElementById('adviceText');
  if(document.getElementById("personal-Search").value!="")
  {
  mood=document.getElementById("personal-Search").value;
  document.getElementById("personal-Search").value=""
  }
   resultUL.innerHTML = '<li>Loading recommendations…</li>';
  try {
    const res = await fetch('/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood,language })
    });
    const data = await res.json();
    const items = data.items || [];

    if (items.length === 0) {
      resultUL.innerHTML = '<li>No recommendations found for this mood.</li>';
      return;
    }

    resultUL.innerHTML = items.map(t =>
      `<li>
        <strong>${t.name}</strong> – ${t.artists[0].name}<br>
        <a href="${t.external_urls.spotify}" target="_blank">Listen on Spotify</a>
        ${t.preview_url ? `<br><audio controls src="${t.preview_url}"></audio>` : ''}
      </li>`
    ).join('');
  } catch (err) {
    console.error(err);
    resultUL.innerHTML = '<li style="color:red;">An unexpected error occurred.</li>';
  }
}
