import { useLocation } from "react-router-dom";
interface JsonLdProps {
  type?: "organization" | "local-business" | "faq" | "product" | "all-products";
  productData?: {
    name: string;
    description: string;
    price: number;
    image?: string;
  };
}
const JsonLd = ({ type = "organization", productData }: JsonLdProps) => {
  const location = useLocation();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vivalegria RecreaÃ§Ã£o Infantil",
    "url": "https://vivalegria.com.br",
    "logo": "https://vivalegria.com.br/logo-vivalegria.jpg",
    "description": "RecreaÃ§Ã£o infantil premium em SÃ£o Paulo com profissionalismo, seguranÃ§a e alto impacto emocional. Mais de 500 eventos realizados com excelÃªncia.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SÃ£o Paulo e regiÃ£o",
      "addressLocality": "SÃ£o Paulo",
      "addressRegion": "SP",
      "postalCode": "01000-000",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-96598-2251",
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.instagram.com/vivalegria_/",
      "https://www.facebook.com/vivalegriarecreacao"
    ]
  };
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vivalegria RecreaÃ§Ã£o Infantil",
    "image": "https://vivalegria.com.br/logo-vivalegria.jpg",
    "priceRange": "R$ 589 - R$ 1.769",
    "telephone": "+55-11-96598-2251",
    "email": "contato@vivalegria.com.br",
    "description": "RecreaÃ§Ã£o infantil para festas em SÃ£o Paulo. Pacotes a partir de R$589,90 com recreadores profissionais, pintura facial, caÃ§a ao tesouro e muito mais! Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SÃ£o Paulo e regiÃ£o metropolitana",
      "addressLocality": "SÃ£o Paulo",
      "addressRegion": "SP",
      "postalCode": "01000-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.5505,
      "longitude": -46.6333
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "12:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "areaServed": [
      { "@type": "City", "name": "SÃ£o Paulo" },
      { "@type": "AdministrativeArea", "name": "Vila Mariana" },
      { "@type": "AdministrativeArea", "name": "Moema" },
      { "@type": "AdministrativeArea", "name": "Santo Amaro" },
      { "@type": "AdministrativeArea", "name": "Morumbi" },
      { "@type": "AdministrativeArea", "name": "Pinheiros" },
      { "@type": "AdministrativeArea", "name": "Jardins" },
      { "@type": "AdministrativeArea", "name": "ABC Paulista" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pacotes de RecreaÃ§Ã£o Infantil",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote SELECT",
            "description": "4 horas de recreaÃ§Ã£o com 2 recreadores profissionais"
          },
          "price": "789.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote CLÃSSICO",
            "description": "4 horas de recreaÃ§Ã£o com 1 recreador"
          },
          "price": "589.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Baladinha Kids",
            "description": "2 horas de festa com pista iluminada, luzes LED, mÃ¡quina de fumaÃ§a e playlist personalizada"
          },
          "price": "989.00",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ãrea Baby",
            "description": "2 horas com espaÃ§o dedicado, atividades sensoriais e profissionais especializados para bebÃªs"
          },
          "price": "679.90",
          "priceCurrency": "BRL"
        }
      ]
    },
    "paymentAccepted": "PIX, CartÃ£o de CrÃ©dito"
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto custa o pacote Select para 25 crianÃ§as?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O pacote Select para 25 crianÃ§as custa R$ 1.119,90. Este valor inclui 4 horas de recreaÃ§Ã£o, 2 recreadores profissionais, pintura facial, caÃ§a ao tesouro personalizada, escultura de balÃ£o, e muito mais!"
        }
      },
      {
        "@type": "Question",
        "name": "O que estÃ¡ incluso na recreaÃ§Ã£o clÃ¡ssica?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Pacote ClÃ¡ssico inclui 4 horas de recreaÃ§Ã£o com 1 recreador, escultura de balÃ£o, tatuagem infantil, caÃ§a ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones. A partir de R$ 589,90 para atÃ© 15 crianÃ§as."
        }
      },
      {
        "@type": "Question",
        "name": "VocÃªs atendem em toda SÃ£o Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Atendemos SÃ£o Paulo capital e regiÃ£o metropolitana, incluindo Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o pagamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PIX: Ã  vista ou 60% de sinal + 40% atÃ© 7 dias antes do evento. CartÃ£o: 3x sem juros acima de R$600 ou atÃ© 10x com juros. Emitimos contrato digital e nota fiscal."
        }
      },
      {
        "@type": "Question",
        "name": "Posso adicionar mais crianÃ§as depois de fechar o pacote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! VocÃª pode ajustar o nÃºmero de crianÃ§as atÃ© 3 dias antes do evento. Valores para mais de 50 crianÃ§as sÃ£o calculados sob consulta."
        }
      },
      {
        "@type": "Question",
        "name": "Os recreadores sÃ£o profissionais treinados?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Todos os nossos recreadores passam por treinamento especÃ­fico da Vivalegria, com foco em seguranÃ§a infantil, primeiros socorros, e tÃ©cnicas de animaÃ§Ã£o. SÃ£o profissionais experientes e apaixonados pelo que fazem!"
        }
      },
      {
        "@type": "Question",
        "name": "O que Ã© a Baladinha Kids?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Baladinha Kids Ã© uma experiÃªncia premium com estrutura 3x3m, pista iluminada, luzes LED, caixa de som, mÃ¡quina de fumaÃ§a e playlist personalizada. Custa R$989 para atÃ© 20 crianÃ§as por 2 horas. Pode ser contratada com ou sem recreaÃ§Ã£o."
        }
      },
      {
        "@type": "Question",
        "name": "VocÃªs tÃªm serviÃ§o especial para bebÃªs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A Ãrea Baby oferece espaÃ§o dedicado com atividades sensoriais, brinquedos adequados e profissionais especializados para os menores. Custa R$679,90 para atÃ© 10 bebÃªs por 2 horas."
        }
      }
    ]
  };
  const productSchema = productData ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "description": productData.description,
    "image": productData.image || "https://vivalegria.com.br/logo-vivalegria.jpg",
    "brand": {
      "@type": "Brand",
      "name": "Vivalegria"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": productData.price,
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Vivalegria RecreaÃ§Ã£o Infantil"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  } : null;
  const allProductsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Pacote SELECT - RecreaÃ§Ã£o Infantil",
        "description": "4 horas de recreaÃ§Ã£o com 2 recreadores profissionais, pintura facial, caÃ§a ao tesouro, escultura de balÃ£o e muito mais",
        "brand": { "@type": "Brand", "name": "Vivalegria" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "BRL",
          "price": "789.90",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "Pacote CLÃSSICO - RecreaÃ§Ã£o Infantil",
        "description": "4 horas de recreaÃ§Ã£o com 1 recreador, escultura de balÃ£o, tatuagem infantil, caÃ§a ao tesouro",
        "brand": { "@type": "Brand", "name": "Vivalegria" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "BRL",
          "price": "589.90",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "Baladinha Kids",
        "description": "Estrutura 3x3m com pista iluminada, luzes LED, mÃ¡quina de fumaÃ§a e playlist personalizada para atÃ© 20 crianÃ§as",
        "brand": { "@type": "Brand", "name": "Vivalegria" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "BRL",
          "price": "989.00",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "Product",
        "name": "Ãrea Baby",
        "description": "EspaÃ§o dedicado com atividades sensoriais e profissionais especializados para atÃ© 10 bebÃªs",
        "brand": { "@type": "Brand", "name": "Vivalegria" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "BRL",
          "price": "679.90",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };
  const getSchema = () => {
    switch (type) {
      case "local-business":
        return localBusinessSchema;
      case "faq":
        return faqSchema;
      case "product":
        return productSchema;
      case "all-products":
        return allProductsSchema;
      default:
        return organizationSchema;
    }
  };
  const schema = getSchema();
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
export default JsonLd;
