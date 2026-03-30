---
title: "CILAB - News"
layout: textlay
sitemap: false
permalink: /allnews.html
---

### News

{% for article in site.data.news %}
{% assign month_number = article.month | plus: 0 %}
<p class="news-archive__item">
<span class="news-archive__month">{{ article.year }}. {{ month_number | prepend: '0' | slice: -2, 2 }}.</span>
<span class="news-archive__separator">-</span>
{% if article.long_description != null %}
<span class="news-archive__text">{{ article.long_description | markdownify | remove: '<p>' | remove: '</p>' }}</span>
{% else %}
<span class="news-archive__text">{{ article.description | markdownify | remove: '<p>' | remove: '</p>' }}</span>
{% endif %}
</p>
{% endfor %}
