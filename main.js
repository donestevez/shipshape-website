/* Shipshape Handyman: page logic.
   You shouldn't need to edit this file. Business details live in site-config.js. */
(function () {
  "use strict";

  var PLACEHOLDER = /\[[^\]]+\]/g;
  var DRAFT_KEY = "shipshape-estimate-draft";
  var PHONE_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';

  var IG_ICON =
    '<svg class="ig-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>';

  var FB_ICON =
    '<svg class="ig-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 7.5h-1.5A2.5 2.5 0 0 0 12 10v11M9.5 13h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  var MAIL_ICON =
    '<svg class="ig-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7.5l8 5.5 8-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Escape text and highlight any [placeholder] so it's easy to spot.
  function rich(s) {
    return esc(s).replace(PLACEHOLDER, function (m) { return '<span class="ph">' + m + "</span>"; });
  }
  function hasPlaceholder(s) { PLACEHOLDER.lastIndex = 0; return PLACEHOLDER.test(String(s)); }

  // "A, B and C" / "A, B, C and nearby towns"
  function joinTowns(towns, max, more) {
    var list = towns.slice(0, max);
    var extra = towns.length > max;
    if (extra) list.push(more || "nearby towns");
    if (list.length <= 1) return list.join("");
    if (list.length === 2) return list[0] + " and " + list[1];
    return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
  }

  function telHref(phone) { return "tel:" + String(phone).replace(/[^\d+]/g, ""); }
  function looksLikeEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

  /* ---------- render ---------- */
  function renderSite(cfg) {
    var towns = (cfg.serviceArea || []).filter(Boolean);
    var name = cfg.businessName || "Shipshape Handyman";

    // Page title + search description
    var titleTowns = joinTowns(towns, 3, "nearby towns");
    var descTowns = joinTowns(towns, 4, "nearby towns");
    document.title = (cfg.seoTitle || "{name}").replace("{name}", name).replace("{towns}", titleTowns);
    var desc = (cfg.seoDescription || "").replace("{towns}", descTowns);
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[property="og:description"]', desc, "property", "og:description");

    // Opening sentence
    $("#hero-sentence").innerHTML = rich((cfg.heroSentence || "").replace("{towns}", joinTowns(towns, 3)));

    // Call buttons appear only when a phone number is set
    var phone = (cfg.phone || "").trim();
    $all("[data-call]").forEach(function (el) {
      if (!phone) { el.hidden = true; el.removeAttribute("href"); return; }
      var style = el.getAttribute("data-call-style");
      el.href = telHref(phone);
      el.hidden = false;
      if (style === "icon") {
        el.innerHTML = PHONE_ICON + '<span class="label-long">Call</span>';
        el.setAttribute("aria-label", "Call " + phone);
      } else if (style === "bar") {
        el.innerHTML = PHONE_ICON + "<span>Call</span>";
        el.setAttribute("aria-label", "Call " + phone);
      } else if (style === "full") {
        el.innerHTML = PHONE_ICON + "<span>Call " + esc(phone) + "</span>";
      } else {
        el.textContent = "Call " + phone;
      }
    });
    var callAlt = $("#call-alt");
    if (callAlt) callAlt.hidden = !phone;
    $all("[data-call]").forEach(function (el) {
      // Footer wraps its link in a <p>; hide the empty paragraph too.
      if (el.parentElement && el.parentElement.closest(".footer-contact")) el.parentElement.hidden = !phone;
    });

    // Services
    $("#service-list").innerHTML = (cfg.services || []).map(function (group) {
      return '<article class="service"><h3>' + rich(group.title) + "</h3><ul>" +
        (group.examples || []).map(function (ex) {
          return '<li><button type="button" class="job-pick" data-job="' + esc(ex) + '" aria-describedby="pick-hint">' +
            "<span>" + rich(ex) + '</span><span class="job-go" aria-hidden="true">→</span></button></li>';
        }).join("") +
        "</ul></article>";
    }).join("");

    // Recent work: only shown when photos exist
    var projects = (cfg.projects || []).filter(function (p) { return p && p.image; });
    var work = $("#work");
    work.hidden = projects.length === 0;
    $all("[data-needs-projects]").forEach(function (el) { el.hidden = projects.length === 0; });
    $("#gallery").innerHTML = projects.map(function (p) {
      return '<figure><img src="' + esc(p.image) + '" alt="' + esc(p.alt || "") + '" loading="lazy">' +
        (p.caption ? "<figcaption>" + rich(p.caption) + "</figcaption>" : "") + "</figure>";
    }).join("");

    // About
    var owner = cfg.ownerFirstName || "";
    $("#about-text").innerHTML = (cfg.about || []).map(function (para) {
      return "<p>" + rich(para.replace(/\{name\}/g, owner)) + "</p>";
    }).join("");
    // Promises: shown together in About; no-fix-no-charge also under the hero button
    var promises = [];
    if (cfg.noFixNoCharge) promises.push(["No fix, no charge", cfg.noFixNoCharge]);
    if (cfg.guarantee) promises.push(["My satisfaction guarantee", cfg.guarantee]);
    var g = $("#guarantee");
    g.innerHTML = promises.map(function (p) {
      return '<p class="promise"><strong>' + esc(p[0]) + "</strong>" + rich(p[1]) + "</p>";
    }).join("");
    g.hidden = promises.length === 0;
    var hp = $("#hero-promise");
    hp.innerHTML = rich(cfg.noFixNoCharge || "");
    hp.hidden = !cfg.noFixNoCharge;

    // Service area
    $("#town-list").innerHTML = towns.map(function (t) { return "<li>" + rich(t) + "</li>"; }).join("");    var note = $("#area-note");
    note.innerHTML = rich(cfg.serviceAreaNote || "");
    note.hidden = !cfg.serviceAreaNote;

    // Footer
    var fe = $("#footer-email");
    fe.href = "mailto:" + (looksLikeEmail(cfg.email) ? cfg.email : encodeURIComponent(cfg.email || ""));
    fe.innerHTML = MAIL_ICON + "<span>" + rich(cfg.email || "") + "</span>";
    fe.parentElement.hidden = !cfg.email;
    $("#footer-area").innerHTML = towns.length ? "Serving " + rich(joinTowns(towns, towns.length)) : "";
    $("#legal-name").textContent = cfg.legalName || name;
    $("#year").textContent = new Date().getFullYear();

    // Instagram: accepts "handle", "@handle", or the full profile link
    var ig = String(cfg.instagram || "").trim()
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
      .replace(/^@/, "").replace(/[\/?#].*$/, "");
    var igUrl = ig ? "https://www.instagram.com/" + encodeURIComponent(ig) + "/" : "";
    var igLink = function (text) {
      return '<a href="' + igUrl + '" target="_blank" rel="noopener">' + IG_ICON +
        "<span>" + text + '</span><span class="sr-only"> (opens Instagram in a new tab)</span></a>';
    };
    var fi = $("#footer-instagram");
    fi.innerHTML = ig ? igLink("@" + esc(ig)) : "";
    fi.hidden = !ig;
    var ai = $("#about-instagram");
    var showAboutIg = ig && cfg.instagramInAbout === true;
    ai.innerHTML = showAboutIg ? igLink("See my recent work on Instagram") : "";
    ai.hidden = !showAboutIg;

    // Facebook: accepts the full page link or just the page name
    var fbRaw = String(cfg.facebook || "").trim();
    var fbUrl = "";
    if (fbRaw && !hasPlaceholder(fbRaw)) {
      fbUrl = /^(https?:\/\/)?([a-z0-9-]+\.)?(facebook|fb)\.com\//i.test(fbRaw)
        ? fbRaw.replace(/^(https?:\/\/)?/i, "https://")
        : "https://www.facebook.com/" + encodeURIComponent(fbRaw.replace(/^@/, "").replace(/[\/?#].*$/, "")) + "/";
    }
    var ff = $("#footer-facebook");
    ff.innerHTML = fbUrl
      ? '<a href="' + esc(fbUrl) + '" target="_blank" rel="noopener">' + FB_ICON +
        '<span>Facebook</span><span class="sr-only"> (opens Facebook in a new tab)</span></a>'
      : "";
    ff.hidden = !fbUrl;

    // Structured data for search engines (skips anything still a placeholder)
    var ld = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      name: name,
      areaServed: towns.filter(function (t) { return !hasPlaceholder(t); })
    };
    if (phone) ld.telephone = phone;
    if (cfg.email && !hasPlaceholder(cfg.email)) ld.email = cfg.email;
    var sameAs = [igUrl, fbUrl].filter(Boolean);
    if (sameAs.length) ld.sameAs = sameAs;
    if (cfg.legalName) ld.legalName = cfg.legalName;
    var ldEl = $("#ld-json") || document.head.appendChild(Object.assign(document.createElement("script"), { id: "ld-json", type: "application/ld+json" }));
    ldEl.textContent = JSON.stringify(ld);
  }

  function setMeta(selector, value, attr, attrValue) {
    var el = $(selector);
    if (!el && attr) {
      el = document.createElement("meta");
      el.setAttribute(attr, attrValue);
      document.head.appendChild(el);
    }
    if (el) el.setAttribute("content", value);
  }

  /* ---------- estimate form ---------- */
  function initForm(cfg) {
    var form = $("#estimate-form");
    var fields = {
      name: $("#f-name"),
      town: $("#f-town"),
      contact: $("#f-contact"),
      job: $("#f-job")
    };
    var summary = $("#form-errors");

    // Keep what the customer typed, even if they leave and come back.
    try {
      var saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      Object.keys(fields).forEach(function (k) { if (saved[k]) fields[k].value = saved[k]; });
    } catch (e) { /* storage unavailable: form still works */ }

    function saveDraft() {
      try {
        var data = {};
        Object.keys(fields).forEach(function (k) { data[k] = fields[k].value; });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch (e) { /* ignore */ }
    }

    function check(key) {
      var v = fields[key].value.trim();
      if (key === "name" && !v) return "Please add your name.";
      if (key === "town" && !v) return "Please add your town or ZIP code.";
      if (key === "contact") {
        if (!v) return "Please add a phone number or email so I can get back to you.";
        var digits = v.replace(/\D/g, "").length;
        if (!looksLikeEmail(v) && digits < 7) return "That doesn’t look like a phone number or email. Please check it.";
      }
      if (key === "job" && !v) return "Please tell me a little about the job.";
      return "";
    }

    function showError(key, msg) {
      var input = fields[key];
      var err = $("#" + input.id + "-err");
      if (msg) {
        input.setAttribute("aria-invalid", "true");
        err.textContent = msg;
        err.hidden = false;
      } else {
        input.removeAttribute("aria-invalid");
        err.textContent = "";
        err.hidden = true;
      }
    }

    Object.keys(fields).forEach(function (k) {
      fields[k].addEventListener("input", function () {
        saveDraft();
        if (fields[k].getAttribute("aria-invalid") === "true") showError(k, check(k));
      });
      fields[k].addEventListener("blur", function () {
        if (fields[k].getAttribute("aria-invalid") === "true") showError(k, check(k));
      });
    });

    var sendBtn = $("#send-btn");
    var failBox = $("#send-fail");
    var okBox = $("#send-ok");
    var formFields = $("#form-fields");
    var live = $("#send-live");
    var sending = false;

    function values() {
      var v = {};
      Object.keys(fields).forEach(function (k) { v[k] = fields[k].value.trim(); });
      return v;
    }

    // Sends the request. Resolves only when the form service confirms it
    // received it; rejects with a reason code otherwise.
    function sendRequest(v) {
      var endpoint = String(cfg.formEndpoint || "").trim();
      if (!/^https:\/\/\S+$/.test(endpoint) || hasPlaceholder(endpoint)) {
        return Promise.reject(new Error("not-connected"));
      }
      if (!navigator.onLine) return Promise.reject(new Error("offline"));

      var payload = {
        "Name": v.name,
        "Town or ZIP": v.town,
        "Phone or email": v.contact,
        "Job": v.job,
        "_subject": "Estimate request: " + v.name + " (" + v.town + ")",
        "_gotcha": $("#f-company").value
      };
      // Lets you hit Reply in your inbox when the customer gave an email.
      if (looksLikeEmail(v.contact)) payload.email = v.contact;

      var ctrl = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);

      return fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (res) {
        clearTimeout(timer);
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok && data.ok !== false && data.success !== false) return data;
          throw new Error("server");
        });
      }, function (err) {
        clearTimeout(timer);
        throw new Error(err && err.name === "AbortError" ? "timeout" : "network");
      });
    }

    var REASONS = {
      "not-connected": "This form isn’t connected to an inbox yet, so nothing was sent.",
      "offline": "It looks like you’re offline, so nothing was sent.",
      "timeout": "The connection timed out before your request was confirmed.",
      "network": "Your request couldn’t reach me. The connection may have dropped.",
      "server": "Something went wrong on my end and your request wasn’t received."
    };

    function setSending(on) {
      sending = on;
      sendBtn.disabled = on;
      sendBtn.textContent = on ? "Sending…" : "Send request";
      form.setAttribute("aria-busy", on ? "true" : "false");
    }

    function showFailure(code) {
      $("#fail-reason").textContent = REASONS[code] || REASONS.server;
      var alt = [];
      var phone = (cfg.phone || "").trim();
      if (phone) alt.push('call <a href="' + telHref(phone) + '">' + esc(phone) + "</a>");
      if (looksLikeEmail(cfg.email) && !hasPlaceholder(cfg.email)) alt.push('email <a href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + "</a>");
      var altEl = $("#fail-alt");
      altEl.innerHTML = alt.length ? "Or reach me directly: " + alt.join(" or ") + "." : "";
      altEl.hidden = !alt.length;
      failBox.hidden = false;
      failBox.focus();
    }

    function showSuccess(v) {
      $("#ok-contact").textContent = v.contact;
      formFields.hidden = true;
      okBox.hidden = false;
      okBox.focus();
      live.textContent = "Request sent.";
      form.reset();
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
    }

    $("#new-request").addEventListener("click", function () {
      okBox.hidden = true;
      failBox.hidden = true;
      formFields.hidden = false;
      live.textContent = "";
      fields.name.focus();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;
      var problems = [];
      Object.keys(fields).forEach(function (k) {
        var msg = check(k);
        showError(k, msg);
        if (msg) problems.push({ id: fields[k].id, msg: msg });
      });

      if (problems.length) {
        failBox.hidden = true;
        summary.innerHTML =
          "<p style=\"margin:0 0 6px\">Please fix " + (problems.length === 1 ? "this" : "these " + problems.length + " things") + " first:</p><ul style=\"margin:0;padding-left:20px\">" +
          problems.map(function (p) { return '<li><a href="#' + p.id + '">' + esc(p.msg) + "</a></li>"; }).join("") +
          "</ul>";
        summary.hidden = false;
        summary.focus();
        return;
      }

      summary.hidden = true;
      failBox.hidden = true;
      saveDraft();
      var v = values();
      setSending(true);
      live.textContent = "Sending your request…";
      sendRequest(v).then(function () {
        setSending(false);
        showSuccess(v);
      }, function (err) {
        setSending(false);
        live.textContent = "";
        showFailure(err && err.message);
      });
    });

    // Error summary links: move focus to the field, not just scroll.
    summary.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']");
      if (!a) return;
      e.preventDefault();
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) target.focus();
    });

  }

  /* ---------- phone sticky bar ---------- */
  // Shows once the top "Request an estimate" button has scrolled away;
  // hides again while the estimate form or footer is on screen.
  function initStickyBar() {
    var bar = $("#mobile-cta");
    if (!bar || !("IntersectionObserver" in window)) return;
    var heroCta = $(".hero .cta-row");
    var estimate = $("#estimate");
    var footer = $(".site-footer");
    var inView = { hero: true, estimate: false, footer: false };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === heroCta) inView.hero = e.isIntersecting;
        else if (e.target === estimate) inView.estimate = e.isIntersecting;
        else if (e.target === footer) inView.footer = e.isIntersecting;
      });
      bar.classList.toggle("is-shown", !inView.hero && !inView.estimate && !inView.footer);
    });
    [heroCta, estimate, footer].forEach(function (el) { if (el) io.observe(el); });
  }

  /* ---------- scroll-in animations ---------- */
  // Skipped entirely for people who ask their device to reduce motion.
  function initReveal() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    var targets = $all(".section .section-head, .service, .gallery figure, .about-copy, .area-card, .estimate-form");
    document.documentElement.classList.add("motion");
    targets.forEach(function (el) { el.classList.add("reveal"); });
    // Cards in the same row arrive one after another.
    $all("#service-list .service, #gallery figure").forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + "ms";
    });

    function show(el) {
      if (!el.classList.contains("reveal")) return;
      el.classList.add("is-visible");
      io.unobserve(el);
      // Once settled, drop the animation classes so hover effects work normally.
      setTimeout(function () {
        el.style.transitionDelay = "";
        el.classList.remove("reveal", "is-visible");
      }, 900);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) show(e.target); });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    targets.forEach(function (el) { io.observe(el); });

    // Keyboard users never land on something still faded out.
    document.addEventListener("focusin", function (e) {
      var r = e.target.closest && e.target.closest(".reveal");
      if (r) show(r);
    });
  }

  /* ---------- shortcuts into the estimate form ---------- */
  var REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // If a request was just sent, bring the empty form back.
  function openForm() {
    var ok = $("#send-ok");
    if (ok && !ok.hidden) $("#new-request").click();
  }
  function setField(el, value) {
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true })); // saves the draft, clears errors
  }
  function flash(el) {
    el.classList.remove("just-filled");
    void el.offsetWidth; // restart the highlight if it's already running
    el.classList.add("just-filled");
    setTimeout(function () { el.classList.remove("just-filled"); }, 1600);
  }
  function firstEmpty(ids) {
    for (var i = 0; i < ids.length; i++) {
      var f = document.getElementById(ids[i]);
      if (f && !f.value.trim()) return f;
    }
    return null;
  }
  function goToForm(focusEl) {
    // Show the estimate section right away so the scroll lands in the right spot.
    $all("#estimate .reveal").forEach(function (el) {
      el.style.transitionDelay = "";
      el.classList.remove("reveal", "is-visible");
    });
    if (focusEl) focusEl.focus({ preventScroll: true });
    $("#estimate-form").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  }

  /* ---------- pick a job from Services ---------- */
  function initJobPick() {
    $("#service-list").addEventListener("click", function (e) {
      var btn = e.target.closest(".job-pick");
      if (!btn) return;
      openForm();
      var job = $("#f-job");
      var text = btn.getAttribute("data-job");
      var current = job.value.replace(/\s+$/, "");
      if (current.toLowerCase().indexOf(text.toLowerCase()) === -1) {
        setField(job, (current ? current + "\n" : "") + text + ". ");
      }
      var next = firstEmpty(["f-name", "f-town", "f-contact"]);
      goToForm(next || job);
      if (!next) job.setSelectionRange(job.value.length, job.value.length);
      flash(job);
      $("#send-live").textContent = "Added “" + text + "” to your request.";
    });
  }

  /* ---------- highlight the menu link for the section on screen ---------- */
  function initScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    var links = $all(".site-nav a[href^='#']");
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var onScreen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { onScreen[e.target.id] = e.isIntersecting; });
      var current = Object.keys(byId).filter(function (id) { return onScreen[id]; })[0];
      links.forEach(function (a) {
        var on = a === byId[current];
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  /* ---------- start ---------- */
  function start() {
    var cfg = window.SITE || {};
    renderSite(cfg);
    initForm(cfg);
    initJobPick();
    initStickyBar();
    initScrollSpy();
    initReveal();
  }
  window.renderSite = renderSite; // handy for testing config changes in the console

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
