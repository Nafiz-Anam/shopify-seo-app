<script type="application/ld+json">
{
  "@context": "http://schema.org/",
  "@type": "Product",
  "name": {{ product.title | json }},
  "url": {{ shop.url | append: product.url | json }},
  {%- if product.featured_media -%}
    {%- assign media_size = product.featured_media.preview_image.width | append: 'x' -%}
    "image": [
      {{ product.featured_media | img_url: media_size | prepend: "https:" | json }}
    ],
  {%- endif -%}
  "description": {{ product.description | strip_html | json }},
  {%- if current_variant.sku != blank -%}
    "sku": {{ current_variant.sku | json }},
  {%- endif -%}
  "brand": {
    "@type": "Thing",
    "name": {{ product.vendor | json }}
  },
  "offers": [
    {%- for variant in product.variants -%}
      {
        "@type" : "Offer",
        {%- if variant.sku != blank -%}
          "sku": {{ variant.sku | json }},
        {%- endif -%}
        "availability" : "http://schema.org/{% if variant.available %}InStock{% else %}OutOfStock{% endif %}",
        "price" : {{ variant.price | divided_by: 100.00 | json }},
        "priceCurrency" : {{ cart.currency.iso_code | json }},
        "url" : {{ shop.url | append: variant.url | json }}
      }{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  ]
}
</script>