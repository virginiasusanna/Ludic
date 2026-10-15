(function () {
  var form = document.querySelector("form.reg");
  if (!form) return;
  var err = document.getElementById("form-err");
  var ok = document.getElementById("form-ok");
  var full = document.getElementById("form-full");
  var left = document.querySelector(".cap .left");
  var leftNum = document.getElementById("spots-left");
  var pay = document.querySelector(".paypal-box");
  var endpoint = window.WET_FORM_ENDPOINT;

  // Chiede allo script quanti posti restano. Se lo script non risponde, il form resta aperto.
  function status() {
    if (!endpoint) return Promise.resolve(null);
    return fetch(endpoint + "?action=status&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .catch(function () { return null; });
  }

  function closeForm() {
    form.style.display = "none";
    full.style.display = "block";
    if (left) left.hidden = true;
    var note = document.querySelector("#iscrizione .note");
    if (note) note.style.display = "none";
  }

  function show(s) {
    if (!s || typeof s.left !== "number") return;
    if (s.full) { closeForm(); return; }
    leftNum.textContent = s.left;
    left.hidden = false;
  }

  status().then(show);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.style.display = "none";
    if (!form.reportValidity()) return;
    if (!endpoint) { err.style.display = "block"; return; }
    var btn = form.querySelector("button");
    btn.disabled = true;
    var data = new URLSearchParams(new FormData(form));
    data.append("lingua", document.documentElement.lang);
    data.append("evento", "WET Winter 2026");
    status().then(function (s) {
      if (s && s.full) { closeForm(); return; }
      return fetch(endpoint, { method: "POST", mode: "no-cors", body: data }).then(function () {
        form.style.display = "none";
        ok.style.display = "block";
        pay.classList.add("show");
        if (left) left.hidden = true;
      });
    }).catch(function () { err.style.display = "block"; btn.disabled = false; });
  });
})();
