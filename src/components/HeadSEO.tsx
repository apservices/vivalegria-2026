import { Helmet } from 'react-helmet-async';

type HeadSEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
};

const defaultProps = {
  title: "Vivalegria Recreação Infantil | Festas e Eventos em São Paulo",
  description: "Recreação infantil premium em São Paulo para festas, casamentos, eventos corporativos e escolas. Pacotes a partir de R$589 com monitores qualificados.",
  canonical: "https://www.vivalegria.com.br",
  ogImage: "https://www.vivalegria.com.br/social-preview.png",
};

export const HeadSEO = ({ title, description, canonical, ogImage }: HeadSEOProps = {}) => {
  const fullTitle = title ? `${title} | Vivalegria` : defaultProps.title;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vivalegria Recreação e Entretenimento",
    "image": "https://www.vivalegria.com.br/logo.png",
    "telephone": "+5511965982251",
    "email": "contato@vivalegria.com.br",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.5687,
      "longitude": -46.6489
    },
    "url": "https://www.vivalegria.com.br",
    "openingHours": "Mo-Su 08:00-20:00",
    "priceRange": "R$589-R$3000",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pacotes de Recreação Infantil",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote Clássico"
          },
          "price": "764.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote Select"
          },
          "price": "969.90",
          "priceCurrency": "BRL"
        }
      ]
    }
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultProps.description} />
      <link rel="canonical" href={canonical || defaultProps.canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultProps.description} />
      <meta property="og:image" content={ogImage || defaultProps.ogImage} />
      <meta property="og:url" content={canonical || defaultProps.canonical} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultProps.description} />
      <meta name="twitter:image" content={ogImage || defaultProps.ogImage} />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
