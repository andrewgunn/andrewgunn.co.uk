---
layout: tags
title: Tags
nav: true
---
{% if site.tags.size == 0 %}
  <h1>No tags found</h1>
{% else %}
  <div class="meta">
    <p>
      <i class="fa-solid fa-tags"></i>
    </p>
    <ul>
      {% for tag in site.tags %}
        <li>
          <a class="tag" href="#{{ tag[0] | slugify }}">
            {{ tag[0] }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </div>
  <div>
    {% for tag in site.tags %}
      <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
      <ul>
        {% for post in tag[1] %}
        <li>
          <a href="{{ post.url }}">{{ post.title }}</a>
          &nbsp;
          <span class="meta">
            <i class="fa-regular fa-calendar"></i>
            <time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">
                {% assign date_format = site.minima.date_format | default: "%d %b %Y" %}{{ post.date | date:
                date_format }}
            </time>
          </span>
        </li>
        {% endfor %}
      </ul>
    {% endfor %}
  </div>
{% endif %}
