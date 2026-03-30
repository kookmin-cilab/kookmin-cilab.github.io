---
title: "CILAB - News"
layout: textlay
sitemap: false
permalink: /allnews.html
---

### News

{% assign year_last = 0 %}
{% for article in site.data.news %}


{% if year_last != article.year %}
{% if year_last != 0 %}
</div>
</div>
{% endif %}
{% assign year_last = article.year %}
<div class="row" style="margin-bottom: 20px;">
<div class="col-sm-1 clearfix"><h4 style="margin-top: 0px;">{{ article.year }}</h4>
</div>
<div class="col-sm-11 clearfix">
{% assign div_opened = 1 %}
{% endif %}
<p class="news-archive__item">
<span class="news-archive__month">{{ article.month }}</span>
<span class="news-archive__separator">-</span>
{% if article.long_description != null %}
<span class="news-archive__text">{{ article.long_description }}</span>
{% else %}
<span class="news-archive__text">{{ article.description }}</span>
{% endif %}
</p>
{% endfor %}

{% if div_opened == 1 %}
</div>
</div>
{% endif %}
