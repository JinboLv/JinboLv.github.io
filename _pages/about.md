---
permalink: /
title: ""
excerpt: "Jinbo Lv is a master's student at Tsinghua University, researching autonomous driving, computer vision, vision-language models, and embodied AI."
redirect_from:
  - /about/
  - /about.html
---

<section class="hero-panel" id="home" aria-labelledby="hero-title">
  <div class="hero-copy">
    <p class="eyebrow">A personal pursuit of discovery</p>
    <h1 id="hero-title">Explore. Build.<span class="hero-title__statement">Make research <span class="hero-title__accent">matter.</span></span></h1>
    <p class="hero-intro">I'm Jinbo Lv, a master's student at Tsinghua University, exploring autonomous driving and computer vision.</p>
    <div class="hero-links" aria-label="Profile and contact links">
      {% if site.author.github %}<a href="https://github.com/{{ site.author.github }}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.author.huggingface %}<a href="https://huggingface.co/{{ site.author.huggingface }}" target="_blank" rel="noopener noreferrer">Hugging Face <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.author.linkedin %}<a href="{{ site.author.linkedin }}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.author.orcid %}<a href="{{ site.author.orcid }}" target="_blank" rel="noopener noreferrer">ORCID <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.author.googlescholar %}<a href="{{ site.author.googlescholar }}" target="_blank" rel="noopener noreferrer">Google Scholar <span aria-hidden="true">↗</span></a>{% endif %}
      {% if site.author.email %}<a href="mailto:{{ site.author.email }}">Get in touch <span aria-hidden="true">↗</span></a>{% endif %}
    </div>
  </div>
  <figure class="hero-portrait">
    <div class="hero-portrait__image"><img src="{{ site.author.avatar | relative_url }}" alt="Portrait of Jinbo Lv" width="1086" height="1448" fetchpriority="high"></div>
    <figcaption><span>Jinbo Lv</span><span>Beijing, China</span></figcaption>
  </figure>
</section>

{% include_relative includes/aboutme.md %}
{% include_relative includes/research.md %}
{% include_relative includes/news.md %}
{% include_relative includes/publications.md %}
{% include_relative includes/education.md %}
{% include_relative includes/internships.md %}
{% include_relative includes/contact.md %}
