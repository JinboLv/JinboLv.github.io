---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

<div id="scroll-progress" aria-hidden="true"></div>

<section class="hero-panel" id="home" aria-labelledby="hero-title">
  <div class="hero-panel__glow" aria-hidden="true"></div>
  <h1 id="hero-title">Explore. Build.<br><em>Make research matter.</em></h1>
  <div class="hero-panel__actions">
    <a class="button button--primary" href="#publications">View Research <span aria-hidden="true">↗</span></a>
    <a class="button button--ghost" href="#contact">Contact Me</a>
  </div>
</section>

{% include_relative includes/aboutme.md %}
{% include_relative includes/news.md %}
{% include_relative includes/publications.md %}
{% include_relative includes/education.md %}
{% include_relative includes/internships.md %}
{% include_relative includes/contact.md %}
