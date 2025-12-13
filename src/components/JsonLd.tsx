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
    "name": "Vivalegria RecreaÃƒÂ§ÃƒÂ£o Infantil",
    "url": "https://vivalegria.com.br",
    "logo": "https://vivalegria.com.br/logo-vivalegria.jpg",
    "description": "RecreaÃƒÂ§ÃƒÂ£o infantil premium em SÃƒÂ£o Paulo com profissionalismo, seguranÃƒÂ§a e alto impacto emocional. Mais de 500 eventos realizados com excelÃƒÂªncia.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SÃƒÂ£o Paulo e regiÃƒÂ£o",
      "addressLocality": "SÃƒÂ£o Paulo",
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
    "name": "Vivalegria RecreaÃƒÂ§ÃƒÂ£o Infantil",
    "image": "https://vivalegria.com.br/logo-vivalegria.jpg",
    "priceRange": "R$ 589 - R$ 1.769",
    "telephone": "+55-11-96598-2251",
    "email": "contato@vivalegria.com.br",
    "description": "RecreaÃƒÂ§ÃƒÂ£o infantil para festas em SÃƒÂ£o Paulo. Pacotes a partir de R$589,90 com recreadores profissionais, pintura facial, caÃƒÂ§a ao tesouro e muito mais! Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "SÃƒÂ£o Paulo e regiÃƒÂ£o metropolitana",
      "addressLocality": "SÃƒÂ£o Paulo",
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
      { "@type": "City", "name": "SÃƒÂ£o Paulo" },
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
      "name": "Pacotes de RecreaÃƒÂ§ÃƒÂ£o Infantil",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote SELECT",
            "description": "4 horas de recreaÃƒÂ§ÃƒÂ£o com 2 recreadores profissionais"
          },
          "price": "789.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote CLÃƒÂSSICO",
            "description": "4 horas de recreaÃƒÂ§ÃƒÂ£o com 1 recreador"
          },
          "price": "589.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Baladinha Kids",
            "description": "2 horas de festa com pista iluminada, luzes LED, mÃƒÂ¡quina de fumaÃƒÂ§a e playlist personalizada"
          },
          "price": "989.00",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ÃƒÂrea Baby",
            "description": "2 horas com espaÃƒÂ§o dedicado, atividades sensoriais e profissionais especializados para bebÃƒÂªs"
          },
          "price": "679.90",
          "priceCurrency": "BRL"
        }
      ]
    },
    "paymentAccepted": "PIX, CartÃƒÂ£o de CrÃƒÂ©dito"
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto custa o pacote Select para 25 crianÃƒÂ§as?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O pacote Select para 25 crianÃƒÂ§as custa R$ 1.119,90. Este valor inclui 4 horas de recreaÃƒÂ§ÃƒÂ£o, 2 recreadores profissionais, pintura facial, caÃƒÂ§a ao tesouro personalizada, escultura de balÃƒÂ£o, e muito mais!"
        }
      },
      {
        "@type": "Question",
        "name": "O que estÃƒÂ¡ incluso na recreaÃƒÂ§ÃƒÂ£o clÃƒÂ¡ssica?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Pacote ClÃƒÂ¡ssico inclui 4 horas de recreaÃƒÂ§ÃƒÂ£o com 1 recreador, escultura de balÃƒÂ£o, tatuagem infantil, caÃƒÂ§a ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones. A partir de R$ 589,90 para atÃƒÂ© 15 crianÃƒÂ§as."
        }
      },
      {
        "@type": "Question",
        "name": "VocÃƒÂªs atendem em toda SÃƒÂ£o Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Atendemos SÃƒÂ£o Paulo capital e regiÃƒÂ£o metropolitana, incluindo Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o pagamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PIX: ÃƒÂ  vista ou 60% de sinal + 40% atÃƒÂ© 7 dias antes do evento. CartÃƒÂ£o: 3x sem juros acima de R$600 ou atÃƒÂ© 10x com juros. Emitimos contrato digital e nota fiscal."
        }
      },
      {
        "@type": "Question",
        "name": "Posso adicionar mais crianÃƒÂ§as depois de fechar o pacote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! VocÃƒÂª pode ajustar o nÃƒÂºmero de crianÃƒÂ§as atÃƒÂ© 3 dias antes do evento. Valores para mais de 50 crianÃƒÂ§as sÃƒÂ£o calculados sob consulta."
        }
      },
      {
        "@type": "Question",
        "name": "Os recreadores sÃƒÂ£o profissionais treinados?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Todos os nossos recreadores passam por treinamento especÃƒÂ­fico da Vivalegria, com foco em seguranÃƒÂ§a infantil, primeiros socorros, e tÃƒÂ©cnicas de animaÃƒÂ§ÃƒÂ£o. SÃƒÂ£o profissionais experientes e apaixonados pelo que fazem!"
        }
      },
      {
        "@type": "Question",
        "name": "O que ÃƒÂ© a Baladinha Kids?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Baladinha Kids ÃƒÂ© uma experiÃƒÂªncia premium com estrutura 3x3m, pista iluminada, luzes LED, caixa de som, mÃƒÂ¡quina de fumaÃƒÂ§a e playlist personalizada. Custa R$989 para atÃƒÂ© 20 crianÃƒÂ§as por 2 horas. Pode ser contratada com ou sem recreaÃƒÂ§ÃƒÂ£o."
        }
      },
      {
        "@type": "Question",
        "name": "VocÃƒÂªs tÃƒÂªm serviÃƒÂ§o especial para bebÃƒÂªs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A ÃƒÂrea Baby oferece espaÃƒÂ§o dedicado com atividades sensoriais, brinquedos adequados e profissionais especializados para os menores. Custa R$679,90 para atÃƒÂ© 10 bebÃƒÂªs por 2 horas."
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
        "name": "Vivalegria RecreaÃƒÂ§ÃƒÂ£o Infantil"
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
        "name": "Pacote SELECT - RecreaÃƒÂ§ÃƒÂ£o Infantil",
        "description": "4 horas de recreaÃƒÂ§ÃƒÂ£o com 2 recreadores profissionais, pintura facial, caÃƒÂ§a ao tesouro, escultura de balÃƒÂ£o e muito mais",
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
        "name": "Pacote CLÃƒÂSSICO - RecreaÃƒÂ§ÃƒÂ£o Infantil",
        "description": "4 horas de recreaÃƒÂ§ÃƒÂ£o com 1 recreador, escultura de balÃƒÂ£o, tatuagem infantil, caÃƒÂ§a ao tesouro",
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
        "description": "Estrutura 3x3m com pista iluminada, luzes LED, mÃƒÂ¡quina de fumaÃƒÂ§a e playlist personalizada para atÃƒÂ© 20 crianÃƒÂ§as",
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
        "name": "ÃƒÂrea Baby",
        "description": "EspaÃƒÂ§o dedicado com atividades sensoriais e profissionais especializados para atÃƒÂ© 10 bebÃƒÂªs",
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
