---
title: "CILAB - News"
layout: textlay
sitemap: false
permalink: /allnews.html
---

### News

{% assign year_last = 0 %}
{% for article in site.data.news %}
{% assign month_lower = article.month | downcase %}
{% assign month_number = article.month %}
{% case month_lower %}
{% when 'jan' or 'january' %}{% assign month_number = '01' %}
{% when 'feb' or 'february' %}{% assign month_number = '02' %}
{% when 'mar' or 'march' %}{% assign month_number = '03' %}
{% when 'apr' or 'april' %}{% assign month_number = '04' %}
{% when 'may' %}{% assign month_number = '05' %}
{% when 'jun' or 'june' %}{% assign month_number = '06' %}
{% when 'jul' or 'july' %}{% assign month_number = '07' %}
{% when 'aug' or 'august' %}{% assign month_number = '08' %}
{% when 'sep' or 'sept' or 'september' %}{% assign month_number = '09' %}
{% when 'oct' or 'october' %}{% assign month_number = '10' %}
{% when 'nov' or 'november' %}{% assign month_number = '11' %}
{% when 'dec' or 'december' %}{% assign month_number = '12' %}
{% endcase %}


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
<span class="news-archive__month">{{ month_number }}</span>
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
