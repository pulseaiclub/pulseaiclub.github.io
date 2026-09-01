---
layout: home
title: phi
description: phi is a minimal terminal coding agent harness in Go — sub-agents, hashline edits, a permission gate, and MCP without context death.
---

<section class="hero">
  <div class="container">
    <div class="hero-inner">
      <img class="hero-logo" src="/assets/img/pixel-text-PHI.png" alt="phi" width="440" height="200" style="image-rendering:pixelated; image-rendering:crisp-edges;">

      <h1 class="hero-title">A minimal <span class="hero-accent">terminal</span> coding agent harness.</h1>
      <p class="hero-sub">
        Sub-agents, hashline edits, a permission gate, and MCP without context death —
        in a ~12&nbsp;MB binary that stays out of your way.
      </p>

      <div class="hero-cta">
        <a class="btn btn-primary" href="/docs/getting-started/">
          Get started
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <a class="btn btn-ghost" href="https://github.com/pulseaiclub/phi" rel="noopener">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
          GitHub
        </a>
      </div>

      <div class="install-panel">
        <div class="install-tabs" role="tablist" aria-label="Install command">
          <button class="install-tab is-active" type="button" data-tab="macos">macOS / Linux</button>
          <button class="install-tab" type="button" data-tab="windows">Windows</button>
          <button class="install-tab" type="button" data-tab="source">From source</button>
        </div>
        <div class="term" data-term="macos">
          <div class="term-bar">
            <span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span>
            <span class="term-title">install.sh — zsh</span>
          </div>
          <div class="term-body"><div class="line"><span class="prompt">$</span><span class="cmd">curl -fsSL https://raw.githubusercontent.com/pulseaiclub/phi/main/scripts/install.sh | bash</span></div></div>
        </div>
        <div class="term" data-term="windows" hidden>
          <div class="term-bar">
            <span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span>
            <span class="term-title">install.ps1 — PowerShell</span>
          </div>
          <div class="term-body"><div class="line"><span class="prompt">&gt;</span><span class="cmd">irm https://raw.githubusercontent.com/pulseaiclub/phi/main/scripts/install.ps1 | iex</span></div></div>
        </div>
        <div class="term" data-term="source" hidden>
          <div class="term-bar">
            <span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span>
            <span class="term-title">make — Go 1.26+</span>
          </div>
          <div class="term-body">
            <div class="line"><span class="prompt">$</span><span class="cmd">git clone git@github.com:pulseaiclub/phi.git &amp;&amp; cd phi</span></div>
            <div class="line"><span class="prompt">$</span><span class="cmd">make install</span></div>
          </div>
        </div>
        <p class="hero-meta">First run: <a href="/docs/getting-started/">pick a model with <code>phi config</code></a> · latest release on <a href="https://github.com/pulseaiclub/phi/releases" rel="noopener">GitHub</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="eyebrow">Why phi</p>
    <h2 class="section-title">A harness that treats your context budget as the scarce resource it is.</h2>

    <div class="feature-grid">
      <div class="feature-card">
        <span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="7" r="2.2"/><circle cx="17" cy="6" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M8 7.5h4.2a3 3 0 0 1 2.6 1.5M8 16.5h4.2a3 3 0 0 0 2.6-1.5"/></svg></span>
        <h3>Sub-agents</h3>
        <p>Spawn isolated jobs and watch the run unfold — without stuffing every turn into the parent context.</p>
      </div>

      <div class="feature-card">
        <span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4l-1 7h4l-1 9"/><path d="M4.5 9.5h15M3.5 14.5h15"/></svg></span>
        <h3>Hashline edits</h3>
        <p>Edit by <code>@file#TAG</code> and <code>LINE#HASH</code> anchors instead of rewriting whole files; stale anchors are rejected.</p>
      </div>

      <div class="feature-card">
        <span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.8l7 2.7v5.2c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V5.5l7-2.7z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg></span>
        <h3>Permission gate</h3>
        <p>Gate or Ask before destructive tools fire. Safety is not optional when an agent can touch your tree.</p>
      </div>

      <div class="feature-card">
        <span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.5V7a6 6 0 0 1 12 0v2.5"/><rect x="4.5" y="9.5" width="15" height="11" rx="2.5"/><path d="M12 12.5v3"/></svg></span>
        <h3>MCP without context death</h3>
        <p>Configure as many MCP servers as you want; tool schemas never enter the model prompt.</p>
      </div>

      <div class="feature-card">
        <span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.5L12 21l8.5-4.5"/></svg></span>
        <h3>Any model</h3>
        <p>OpenAI-compatible or Anthropic — no vendor lock-in, switch models at runtime.</p>
      </div>

      <div class="feature-card">
        <span class="feature-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 8V6A1.5 1.5 0 0 1 5 4.5z"/><path d="M5 14.5h14a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18v-2a1.5 1.5 0 0 1 1.5-1.5z"/></svg></span>
        <h3>Skills &amp; extensions</h3>
        <p>Package reusable procedures as <code>SKILL.md</code>; extend phi with native binaries — tools, commands, and event handlers via the PXB protocol.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <p class="eyebrow">Footprint</p>
    <h2 class="section-title">Cheap to run, cheap to hack on.</h2>

    <div class="stats-grid">
      <div class="stat"><span class="stat-num">~12 MB</span><span class="stat-label">release binary</span></div>
      <div class="stat"><span class="stat-num">~21 MB</span><span class="stat-label">idle RSS per session</span></div>
      <div class="stat"><span class="stat-num">~40 ms</span><span class="stat-label">time to first frame</span></div>
      <div class="stat"><span class="stat-num">6</span><span class="stat-label">direct module deps</span></div>
      <div class="stat"><span class="stat-num">~22k LOC</span><span class="stat-label">Go source, 32 packages</span></div>
      <div class="stat"><span class="stat-num">0</span><span class="stat-label">Node / Electron / Python runtimes</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <p class="eyebrow">Terminal first</p>
    <h2 class="section-title">A TUI, not a web app.</h2>

    <div class="shot">
      <div class="shot-bar">
        <span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span><span class="term-dot" aria-hidden="true"></span>
        <span class="term-title">phi — zsh</span>
      </div>
      <img class="shot-img" src="/assets/img/phi.png" alt="phi welcome screen in the terminal" width="1063" height="675">
    </div>

    <div class="hero-cta" style="margin-top:2.8rem">
      <a class="btn btn-primary" href="/docs/getting-started/">Read the docs</a>
      <a class="btn btn-ghost" href="https://github.com/pulseaiclub/phi/blob/main/README.md" rel="noopener">README on GitHub</a>
    </div>
  </div>
</section>
