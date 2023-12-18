---
layout: archive
title: Archive
nav: true
---
{% if site.posts.size == 0 %}
  <h1>No posts found</h1>
{% else %}
  <div itemscope itemtype="http://schema.org/Blog">
    {% for post in site.posts %}
      {% if post.layout == 'post' %}
        {% assign currentDate = post.date | date: "%Y" %}
        {% if currentDate != myDate %}
          {% unless forloop.first %}
            </ul>
          {% endunless %}
          <h2>{{ currentDate }}</h2>
          <ul>
          {% assign myDate = currentDate %}
        {% endif %}
        <li>
          <a href="{{ post.url }}">{{ post.title }}</a>
          &nbsp;
          <span class="meta">
            <i class="fa-regular fa-calendar"></i>
            <time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">
                {% assign date_format = site.minima.date_format | default: "%d %b %Y" %}{{ post.date | date:
                date_format }}
            </time>
            &nbsp;
            <i class="fa-regular fa-clock"></i>&nbsp;
            {% assign words = post.content | number_of_words %}
            {% if words < 360 %}
              1 min
            {% else %}
              {{ words | divided_by:180 }} mins
            {% endif %}
          </span>
        </li>
        {% if forloop.last %}</ul>{% endif %}
      {% endif %}
    {% endfor %}
  </div>
{% endif %}
