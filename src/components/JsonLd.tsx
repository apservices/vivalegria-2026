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
    "name": "Vivalegria Recreação Infantil",
    "url": "https://vivalegria.com.br",
    "logo": "https://vivalegria.com.br/logo-vivalegria.jpg",
    "description": "Recreação infantil premium em São Paulo com profissionalismo, segurança e alto impacto emocional. Mais de 500 eventos realizados com excelência.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "São Paulo e região",
      "addressLocality": "São Paulo",
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
      "https://instagram.com/vivalegriareceacao",
      "https://facebook.com/vivalegriareceacao"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vivalegria Recreação Infantil",
    "image": "https://vivalegria.com.br/logo-vivalegria.jpg",
    "priceRange": "R$ 589 - R$ 1.769",
    "telephone": "+55-11-96598-2251",
    "email": "contato@vivalegria.com.br",
    "description": "Recreação infantil para festas em São Paulo. Pacotes a partir de R$589,90 com recreadores profissionais, pintura facial, caça ao tesouro e muito mais! Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "São Paulo e região metropolitana",
      "addressLocality": "São Paulo",
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
      { "@type": "City", "name": "São Paulo" },
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
      "name": "Pacotes de Recreação Infantil",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote SELECT",
            "description": "4 horas de recreação com 2 recreadores profissionais"
          },
          "price": "789.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pacote CLÁSSICO",
            "description": "4 horas de recreação com 1 recreador"
          },
          "price": "589.90",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Baladinha Kids",
            "description": "2 horas de festa com pista iluminada, luzes LED, máquina de fumaça e playlist personalizada"
          },
          "price": "989.00",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Área Baby",
            "description": "2 horas com espaço dedicado, atividades sensoriais e profissionais especializados para bebês"
          },
          "price": "679.90",
          "priceCurrency": "BRL"
        }
      ]
    },
    "paymentAccepted": "PIX, Cartão de Crédito"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto custa o pacote Select para 25 crianças?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O pacote Select para 25 crianças custa R$ 1.119,90. Este valor inclui 4 horas de recreação, 2 recreadores profissionais, pintura facial, caça ao tesouro personalizada, escultura de balão, e muito mais!"
        }
      },
      {
        "@type": "Question",
        "name": "O que está incluso na recreação clássica?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O Pacote Clássico inclui 4 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones. A partir de R$ 589,90 para até 15 crianças."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês atendem em toda São Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Atendemos São Paulo capital e região metropolitana, incluindo Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o pagamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PIX: à vista ou 60% de sinal + 40% até 7 dias antes do evento. Cartão: 3x sem juros acima de R$600 ou até 10x com juros. Emitimos contrato digital e nota fiscal."
        }
      },
      {
        "@type": "Question",
        "name": "Posso adicionar mais crianças depois de fechar o pacote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Você pode ajustar o número de crianças até 3 dias antes do evento. Valores para mais de 50 crianças são calculados sob consulta."
        }
      },
      {
        "@type": "Question",
        "name": "Os recreadores são profissionais treinados?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Todos os nossos recreadores passam por treinamento específico da Vivalegria, com foco em segurança infantil, primeiros socorros, e técnicas de animação. São profissionais experientes e apaixonados pelo que fazem!"
        }
      },
      {
        "@type": "Question",
        "name": "O que é a Baladinha Kids?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Baladinha Kids é uma experiência premium com estrutura 3x3m, pista iluminada, luzes LED, caixa de som, máquina de fumaça e playlist personalizada. Custa R$989 para até 20 crianças por 2 horas. Pode ser contratada com ou sem recreação."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês têm serviço especial para bebês?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! A Área Baby oferece espaço dedicado com atividades sensoriais, brinquedos adequados e profissionais especializados para os menores. Custa R$679,90 para até 10 bebês por 2 horas."
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
        "name": "Vivalegria Recreação Infantil"
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
        "name": "Pacote SELECT - Recreação Infantil",
        "description": "4 horas de recreação com 2 recreadores profissionais, pintura facial, caça ao tesouro, escultura de balão e muito mais",
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
        "name": "Pacote CLÁSSICO - Recreação Infantil",
        "description": "4 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro",
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
        "description": "Estrutura 3x3m com pista iluminada, luzes LED, máquina de fumaça e playlist personalizada para até 20 crianças",
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
        "name": "Área Baby",
        "description": "Espaço dedicado com atividades sensoriais e profissionais especializados para até 10 bebês",
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