<section class="contact-panel" id="contact" aria-labelledby="contact-title">
  <div>
    <p class="eyebrow">Good research starts with a conversation</p>
    <h2 id="contact-title">Let's think together.</h2>
    <p>{{ site.author.email }}</p>
  </div>
  {% if site.author.email %}
    <a class="button" href="mailto:{{ site.author.email }}">Get in touch <span aria-hidden="true">↗</span></a>
  {% else %}
    <span class="button">preparing</span>
  {% endif %}
</section>
