(function () {
  const root = document.querySelector("[data-test-runner]");
  if (!root) return;

  const config = JSON.parse(document.getElementById("testRunnerConfig").textContent || "{}");
  const saveStatus = root.querySelector("[data-save-status]");
  const timerElement = root.querySelector("[data-test-timer]");
  const notePanel = root.querySelector("[data-notes-panel]");
  const noteInput = root.querySelector("[data-note-input]");
  const noteList = root.querySelector("[data-note-list]");
  const contentRoot = root.querySelector("[data-highlight-root]") || root;
  const audio = root.querySelector("audio[data-test-audio]");
  const startedAt = Date.now();
  let notes = Array.isArray(config.notes) ? config.notes : [];
  let highlights = Array.isArray(config.highlights) ? config.highlights : [];
  let isSubmitted = false;
  let isDirty = false;

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(name + "=")) return decodeURIComponent(trimmed.slice(name.length + 1));
    }
    return "";
  }

  function postJson(url, payload) {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) throw new Error(data.error || "Request failed.");
      return data;
    });
  }

  function showSaveStatus(message, state) {
    if (!saveStatus) return;
    saveStatus.textContent = message;
    saveStatus.dataset.state = state || "";
  }

  function collectAnswers() {
    const answers = {};
    root.querySelectorAll("[data-question], input[name], select[name], textarea[name]").forEach((field) => {
      if (field.closest("[data-notes-panel]")) return;
      const question = field.dataset.question || field.name;
      if (!question) return;
      if (field.type === "radio") {
        if (field.checked) answers[question] = field.value;
        return;
      }
      if (field.type === "checkbox") {
        if (!answers[question]) answers[question] = [];
        if (field.checked) answers[question].push(field.value);
        return;
      }
      if (field.value.trim() !== "") answers[question] = field.value.trim();
    });
    return answers;
  }

  function restoreAnswers() {
    Object.entries(config.answers || {}).forEach(([question, value]) => {
      const selector = `[data-question="${CSS.escape(question)}"], [name="${CSS.escape(question)}"]`;
      root.querySelectorAll(selector).forEach((field) => {
        if (field.type === "radio" || field.type === "checkbox") {
          field.checked = Array.isArray(value) ? value.includes(field.value) : String(value) === field.value;
        } else {
          field.value = Array.isArray(value) ? value.join(", ") : value;
        }
      });
    });
    markAnswered();
  }

  function markAnswered() {
    const answers = collectAnswers();
    root.querySelectorAll("[data-nav]").forEach((button) => {
      button.classList.toggle("answered", Object.prototype.hasOwnProperty.call(answers, button.dataset.nav));
    });
    root.querySelectorAll("label").forEach((label) => {
      const input = label.querySelector("input[type='radio'], input[type='checkbox']");
      if (input) label.classList.toggle("selected", input.checked);
    });
  }

  function scrollToQuestion(questionNumber) {
    const target = root.querySelector(`[data-question-block="${CSS.escape(String(questionNumber))}"]`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function calculateTimeSpent() {
    return Math.max(Math.floor((Date.now() - startedAt) / 1000), 0);
  }

  function collectNotes() {
    return notes;
  }

  function collectHighlights() {
    return highlights;
  }

  function autoSaveAnswers() {
    showSaveStatus("Saving...", "saving");
    return postJson(config.saveUrl, {
      answers: collectAnswers(),
      notes: collectNotes(),
      highlights: collectHighlights(),
    })
      .then((data) => {
        isDirty = false;
        showSaveStatus("Saved", "saved");
        return data;
      })
      .catch((error) => {
        showSaveStatus(error.message, "error");
        throw error;
      });
  }

  function submitTest() {
    if (!window.confirm("Submit this test? You cannot edit it after submission.")) return Promise.resolve();
    showSaveStatus("Submitting...", "saving");
    return postJson(config.submitUrl, {
      answers: collectAnswers(),
      notes: collectNotes(),
      highlights: collectHighlights(),
      time_spent_seconds: calculateTimeSpent(),
    }).then((data) => {
      isSubmitted = true;
      window.location.href = data.redirect_url;
      return data;
    });
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function selectedTextInsideContent() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "";
    const range = selection.getRangeAt(0);
    if (!contentRoot.contains(range.commonAncestorContainer)) return "";
    return selection.toString().replace(/\s+/g, " ").trim();
  }

  function clearRenderedHighlights() {
    contentRoot.querySelectorAll(".student-highlight").forEach((span) => {
      span.replaceWith(document.createTextNode(span.textContent));
    });
    contentRoot.normalize();
  }

  function wrapText(text, clientId) {
    if (!text) return false;
    const walker = document.createTreeWalker(contentRoot, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const index = node.nodeValue.indexOf(text);
      if (index >= 0) {
        const fragment = document.createDocumentFragment();
        const before = node.nodeValue.slice(0, index);
        const match = node.nodeValue.slice(index, index + text.length);
        const after = node.nodeValue.slice(index + text.length);
        if (before) fragment.appendChild(document.createTextNode(before));
        const span = document.createElement("span");
        span.className = "student-highlight";
        span.dataset.highlightId = clientId;
        span.textContent = match;
        fragment.appendChild(span);
        if (after) fragment.appendChild(document.createTextNode(after));
        node.replaceWith(fragment);
        return true;
      }
      node = walker.nextNode();
    }
    return false;
  }

  function renderHighlights() {
    clearRenderedHighlights();
    highlights.forEach((highlight) => wrapText(highlight.text || highlight.selected_text, highlight.id || highlight.client_id));
  }

  function saveHighlight() {
    const text = selectedTextInsideContent();
    if (!text) {
      showSaveStatus("Select text first", "error");
      return Promise.resolve();
    }
    if (!highlights.some((highlight) => (highlight.text || highlight.selected_text) === text)) {
      highlights.push({ id: makeId("highlight"), text, color: "yellow", context: "" });
    }
    window.getSelection().removeAllRanges();
    renderHighlights();
    isDirty = true;
    showSaveStatus("Unsaved highlight", "saving");
    return postJson(config.highlightSaveUrl, { highlights }).then((data) => {
      isDirty = false;
      showSaveStatus("Saved", "saved");
      return data;
    });
  }

  function loadHighlights(savedHighlights) {
    highlights = Array.isArray(savedHighlights) ? savedHighlights.map((highlight) => ({
      id: highlight.client_id || highlight.id || makeId("highlight"),
      text: highlight.selected_text || highlight.text || "",
      color: highlight.color || "yellow",
      context: highlight.context || "",
    })).filter((highlight) => highlight.text) : [];
    renderHighlights();
  }

  function renderNotes() {
    if (!noteList) return;
    noteList.replaceChildren();
    notes.forEach((note) => {
      const item = document.createElement("li");
      const text = document.createElement("p");
      text.textContent = note.text;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "exam-button secondary";
      remove.dataset.removeNote = note.id;
      remove.textContent = "Remove";
      item.append(text, remove);
      noteList.appendChild(item);
    });
  }

  function addNote() {
    const text = noteInput.value.trim();
    if (!text) return;
    notes.unshift({ id: makeId("note"), text, created_at: new Date().toISOString() });
    noteInput.value = "";
    renderNotes();
    isDirty = true;
    showSaveStatus("Unsaved note", "saving");
  }

  function startTimer() {
    const durationSeconds = Number(config.durationMinutes || 0) * 60;
    if (!durationSeconds || !timerElement) return;
    const tick = () => {
      const remaining = Math.max(durationSeconds - calculateTimeSpent(), 0);
      const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
      const seconds = String(remaining % 60).padStart(2, "0");
      timerElement.textContent = `${minutes}:${seconds}`;
      timerElement.dataset.warning = remaining <= 300 ? "true" : "false";
      if (remaining === 0 && !isSubmitted) submitTest();
    };
    tick();
    setInterval(tick, 1000);
  }

  function setupAutoPlayAudio() {
    if (!audio || !config.autoPlayAudio) return;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => showSaveStatus("Tap audio to play", "error"));
    }
  }

  function setupMobileTouchHighlighting() {
    let touchTimer = null;
    contentRoot.addEventListener("touchend", () => {
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        const text = selectedTextInsideContent();
        if (text) showSaveStatus("Tap Highlight to save", "saving");
      }, 250);
    }, { passive: true });
  }

  root.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    const action = event.target.closest("[data-action]");
    const removeNote = event.target.closest("[data-remove-note]");
    if (nav) scrollToQuestion(nav.dataset.nav);
    if (removeNote) {
      notes = notes.filter((note) => note.id !== removeNote.dataset.removeNote);
      renderNotes();
      isDirty = true;
    }
    if (!action) return;
    if (action.dataset.action === "save") autoSaveAnswers();
    if (action.dataset.action === "submit") submitTest();
    if (action.dataset.action === "highlight") saveHighlight();
    if (action.dataset.action === "notes") notePanel.classList.toggle("active");
    if (action.dataset.action === "add-note") addNote();
    if (action.dataset.action === "clear-highlights") {
      highlights = [];
      renderHighlights();
      isDirty = true;
      showSaveStatus("Highlights cleared", "saving");
    }
  });

  root.addEventListener("input", () => {
    isDirty = true;
    markAnswered();
  });
  root.addEventListener("change", () => {
    isDirty = true;
    markAnswered();
  });

  window.addEventListener("beforeunload", (event) => {
    if (!isSubmitted && isDirty) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  window.collectAnswers = collectAnswers;
  window.autoSaveAnswers = autoSaveAnswers;
  window.submitTest = submitTest;
  window.saveHighlight = saveHighlight;
  window.loadHighlights = loadHighlights;
  window.scrollToQuestion = scrollToQuestion;
  window.markAnswered = markAnswered;
  window.calculateTimeSpent = calculateTimeSpent;

  restoreAnswers();
  loadHighlights(highlights);
  renderNotes();
  startTimer();
  setupAutoPlayAudio();
  setupMobileTouchHighlighting();
  setInterval(() => {
    if (!isSubmitted) autoSaveAnswers().catch(() => {});
  }, 10000);
})();
