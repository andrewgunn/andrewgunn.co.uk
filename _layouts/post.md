---
layout: default
---
<article class="post" itemscope itemtype="http://schema.org/BlogPosting">
    <h1 itemprop="name headline">{{ page.title | escape }}</h1>
    <div class="meta">
        <ul>
            <li>
                <i class="fa-regular fa-calendar"></i>
                <time datetime="{{ page.date | date_to_xmlschema }}" itemprop="datePublished">
                    {% assign date_format = site.minima.date_format | default: "%d %b %Y" %}{{ page.date | date:
                    date_format }}
                </time>
            </li>
            <li>
                &nbsp;
            </li>
            <li>
                <i class="fa-regular fa-clock"></i>&nbsp;
                {% assign words = page.content | number_of_words %}
                {% if words < 360 %} 1 min {% else %} {{ words | divided_by:180 }} mins {% endif %} </li>
        </ul>
    </div>

    {% if page.tags != empty %}
        <div class="meta">
            <i class="fa-solid fa-tags"></i>
            <ul>
                {% for tag in page.tags %}
                    <li>
                        <a class="tag" href="/tags#{{ tag | slugify }}">{{ tag }}</a>
                    </li>
                {% endfor %}
            </ul>
        </div>
    {% endif %}

    <div itemprop="articleBody">
        {{ content }}
    </div>

    <a href="{{ page.url | relative_url }}" hidden></a>
</article>

{% for pageTag in page.tags %}
    {% assign x = pageTag | slugify | replace: '-', '' %}
    {% assign hashtags = hashtags | append: ',' | append: x %}
{% endfor %}
{% assign hashtags = hashtags | slice: 1, hashtags.size %}