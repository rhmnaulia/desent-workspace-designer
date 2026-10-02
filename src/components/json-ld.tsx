import { ACCESSORIES, CHAIRS, DESKS } from "@/catalog/products";
import { site } from "@/site";

/** Structured data so search engines understand this is a rental catalogue for Bali. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: site.name,
    url: site.url,
    description: site.description,
    applicationCategory: "ShoppingApplication",
    operatingSystem: "Any",
    areaServed: { "@type": "Place", name: "Bali, Indonesia" },
    offers: {
      "@type": "OfferCatalog",
      name: "Rentable office equipment",
      itemListElement: [...DESKS, ...CHAIRS, ...ACCESSORIES].map((product) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: product.name, description: product.blurb },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: (product.pricePerWeek / 100).toFixed(2),
          priceCurrency: "USD",
          unitCode: "WEE",
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Static data, but escape "<" anyway so the pattern is safe to copy.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
