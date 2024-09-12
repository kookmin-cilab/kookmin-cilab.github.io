---
title: "CILAB - Publications"
layout: gridlay
sitemap: false
permalink: /publications/
---


### Publications

{% assign first_under_review = 1 %}

{% for publi in site.data.publist %}
{% if publi.under_review == 1 %}
{% if first_under_review == 1 %}
<div class="row">
<div class="col-sm-1 clearfix"><h5>Under Review</h5>
</div>
<div class="col-sm-11 clearfix">
{% assign div_opened = 1 %}
{% endif %}

{% assign first_under_review = 0 %}

<div class="well" style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px; margin-bottom: 3px; box-shadow: none;">
<p style="margin-bottom: 0px;">
{% if publi.link_exist == 1 %}
<a href="{{ publi.link }}" target="_blank">**{{ publi.title }}**</a> 
{% endif %}
{% if publi.link_exist == 0 %}
**{{ publi.title }}** 
{% endif %}
<br />
{{ publi.authors }}<br />
In <i>{{ publi.venue }}</i>
</p>
</div>
{% endif %}
{% endfor %}

{% if div_opened == 1 %}
</div>
</div>
{% endif %}
 
{% assign year_last = 0 %}
{% for publi in site.data.publist %}

{% if publi.under_review != 1 %}
{% if year_last != publi.year %}
{% if year_last != 0 %}
</div>
</div>
{% endif %}
{% assign year_last = publi.year %}
<div class="row">
<div class="col-sm-1 clearfix"><h4>{{ publi.year }}</h4>
</div>
<div class="col-sm-11 clearfix">
{% assign div_opened = 1 %}
{% endif %}

<div class="well" style="padding-top: 5px; padding-bottom: 5px; padding-right: 10px; padding-left: 10px; margin-bottom: 3px; box-shadow: none;">
<p style="margin-bottom: 0px;">
{% if publi.link_exist == 1 %}
<a href="{{ publi.link }}" target="_blank">**{{ publi.title }}**</a> 
{% endif %}
{% if publi.link_exist == 0 %}
**{{ publi.title }}** 
{% endif %}

{% if publi.oral == 1 %}
<span style="line-height: 1; font-size: 12px; color: #FFFFFF; background-color: #0076df; text-align: center; display: inline-block; border-radius: 5px 5px 5px 5px; padding: 3px 6px 3px 6px; font-weight: bold; margin-left: 5px;">oral</span>
{% endif %}
{% if publi.highlight == 1 %}
<span style="line-height: 1; font-size: 12px; color: #FFFFFF; background-color: #0076df; text-align: center; display: inline-block; border-radius: 5px 5px 5px 5px; padding: 3px 6px 3px 6px; font-weight: bold; margin-left: 5px;">highlight</span>
{% endif %}
<br />
{{ publi.authors }}<br />
In <i>{{ publi.venue }}</i>
</p>
</div>
{% endif %}
{% endfor %}

{% if div_opened == 1 %}
</div>
</div>
{% endif %}