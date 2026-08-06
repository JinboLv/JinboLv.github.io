<section class="contact-panel reveal-section" id="contact" aria-labelledby="contact-title">
  <div>
    <h2 id="contact-title">Let's start a conversation.</h2>
    <p>jinbo2277@gmail.com</p>
  </div>
  {% if site.author.email %}
    <a class="button button--light" href="mailto:{{ site.author.email }}">Send Email <span aria-hidden="true">↗</span></a>
  {% else %}
    <span class="button button--light">preparing</span>
  {% endif %}
</section>
