---
title: "CILAB - Team"
layout: gridlay
sitemap: false
permalink: /members/ 
---

 
### Faculty
{% assign number_printed = 0 %}
{% for member in site.data.professors %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="30%" style="float: left; margin-top: 10px;" />
  {% if member.homepage != null %}
  <span class="member_name"><a href="{{ member.homepage }}" target="_blank">**{{ member.name }}**<span class="icon-link"></span></a></span><br/>
  {% else %}
  <span class="member_name"><a>**{{ member.name }}**</a></span><br/>
  {% endif %}
  <span class="position" style="font-style: italic;">{{ member.position }}</span><br/>
  <span class="email" style="color: #888;">{{ member.email }}</span> 
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}


{% assign number_printed = 0 %}
{% for member in site.data.students %}

{% if number_printed == 0 %}
### Students
{% endif %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="30%" style="float: left; margin-top: 10px; " />
  {% if member.homepage != null %}
  <span class="member_name"><a href="{{ member.homepage }}" target="_blank">**{{ member.name }}**<span class="icon-link"></span></a></span><br/>
  {% else %}
  <span class="member_name"><a>**{{ member.name }}**</a></span><br/>
  {% endif %}
  {% if member.email != null %}
  <span class="email" style="color: #888;">{{ member.email }}</span> <br/>
  <span class="interests" style="font-style: italic;">{{ member.interests }}</span>
  {% elsif member.external_email != null %}
  <span class="external_email" style="color: #888;">{{ member.external_email }}</span> <br/>
  <span class="interests" style="font-style: italic;">{{ member.interests }}</span>
  {% else %}
  <span class="interests" style="font-style: italic;">{{ member.interests }}</span>
  {% endif %}
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}


{% assign number_printed = 0 %}
{% for member in site.data.interns %}

{% if number_printed == 0 %}
### Interns
{% endif %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
  <img src="{{ site.url }}{{ site.baseurl }}/images/teampic/{{ member.photo }}" class="img-responsive" width="30%" style="float: left; margin-top: 10px; " />
  {% if member.homepage != null %}
  <span class="member_name"><a href="{{ member.homepage }}" target="_blank">**{{ member.name }}**<span class="icon-link"></span></a></span><br/>
  {% else %}
  <span class="member_name"><a>**{{ member.name }}**</a></span><br/>
  {% endif %}
  {% if member.email != null %}
  <span class="email" style="color: #888;">{{ member.email }}</span> <br/>
  <span class="interests" style="font-style: italic;">{{ member.interests }}</span>
  {% elsif member.external_email != null %}
  <span class="external_email" style="color: #888;">{{ member.external_email }}</span> <br/>
  <span class="interests" style="font-style: italic;">{{ member.interests }}</span>
  {% else %}
  <span class="interests" style="font-style: italic;">{{ member.interests }}</span>
  {% endif %}
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}


{% assign number_printed = 0 %}
{% for member in site.data.alumni %}

{% if number_printed == 0 %}
### Alumni
{% endif %}

{% assign even_odd = number_printed | modulo: 4 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-3 clearfix">
  <p style="margin-bottom: 3px;">
  {% if member.homepage != null %}
  <span class="member_name"><a href="{{ member.homepage }}" target="_blank">**{{ member.name }}**<span class="icon-link"></span></a></span><br/>
  {% else %}
  <span class="member_name"><a>**{{ member.name }}**</a></span><br/>
  {% endif %}
  </p>
  <span class="degree_year" style="font-style: italic;">{{ member.degree }}, {{ member.year }}</span><br/>
  <span class="career" style="color: #888;">{{ member.career }}</span> 
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 3 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 4 %}
{% if even_odd != 0 %}
</div>
{% endif %}
