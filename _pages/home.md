---
title: "CILAB - Home"
layout: homelay
sitemap: false
permalink: //
---

<div markdown="0" id="carousel" class="carousel slide" data-ride="carousel" data-interval="5000" data-pause="hover" >
    <!-- Menu -->
    <ol class="carousel-indicators">
        {% for slide in site.data.home_slider %}
        <li data-target="#carousel" data-slide-to="{{ forloop.index0 }}"{% if forloop.first %} class="active"{% endif %}></li>
        {% endfor %}
    </ol>

    <!-- Items -->
    <div class="carousel-inner" markdown="0">
        {% for slide in site.data.home_slider %}
        {% assign slide_path = slide.image %}
        {% assign slide_prefix = slide.image | slice: 0 %}
        {% unless slide.image contains '://' or slide_prefix == '/' %}
            {% assign slide_path = '/images/photos/' | append: slide.image %}
        {% endunless %}
        <div class="item{% if forloop.first %} active{% endif %}">
            <div class="home-carousel__frame">
                <img src="{{ slide_path | relative_url }}" alt="{{ slide.alt | default: slide.title | default: 'Home slide' | escape }}" />
            </div>
        </div>
        {% endfor %}
    </div>
  {% if site.data.home_slider.size > 1 %}
  <a class="left carousel-control" href="#carousel" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#carousel" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
  {% endif %}
</div>

<strong style="color: #0076df;">Welcome to the Computational Intelligence Laboratory (CILAB).</strong>
We focus on advancing computer vision and its integration with robotics. Our mission is to develop cutting-edge technologies that enable machines to perceive, understand, and interact with the world through visual data. Our research covers a broad range of topics, including multimodal perception, 3D reconstruction, and image search and matching. By exploring these areas, we aim to create intelligent and adaptable robotic systems capable of performing complex tasks in real-world environments.

Join us as we push the boundaries of robotic intelligence through advancements in computer vision. We are committed to enhancing robot perception, enabling machines to interpret complex visual environments and interact with the physical world naturally and intuitively. Our work in visual processing, 3D understanding, and robot navigation strives to create systems that seamlessly integrate into human environments, performing tasks with precision and autonomy.
