import { useLocation } from "react-router-dom";

interface JsonLdProps {
  type?: "organization" | "local-business" | "faq" | "product";
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
    "name": "Vivalegria Recreação",
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
      "https://instagram.com/vivalegria",
      "https://facebook.com/vivalegria"
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
    "description": "Recreação infantil para festas em São Paulo. Pacotes a partir de R$589,90 com monitores profissionais, pintura facial, caça ao tesouro e muito mais!",
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
        "closes": "17:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
    "areaServed": {
      "@type": "City",
      "name": "São Paulo"
    },
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
            "description": "3 horas de recreação com 1 recreador"
          },
          "price": "589.90",
          "priceCurrency": "BRL"
        }
      ]
    }
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
          "text": "O Pacote Clássico inclui 3 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones. A partir de R$ 589,90 para até 15 crianças."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês atendem em toda São Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Atendemos São Paulo capital e região metropolitana. Para locais mais distantes, pode ser aplicada uma taxa de deslocamento. Consulte-nos para mais detalhes."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o pagamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Trabalhamos com 50% de sinal via PIX para reserva da data, e o restante pode ser pago no dia do evento. Aceitamos PIX, cartão e boleto. Emitimos contrato digital e nota fiscal."
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
        "name": "Qual a diferença entre pintura artística profissional e básica?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A pintura profissional inclui desenhos mais elaborados e detalhados (a partir de R$ 249,90), enquanto a básica oferece motivos mais simples mas igualmente divertidos (a partir de R$ 149,90). O pacote Select já inclui a pintura básica."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fornecem todos os materiais?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Todos os materiais necessários para as atividades estão inclusos nos pacotes. Você só precisa se preocupar com a festa!"
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
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Vivalegria Recreação"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  } : null;

  const getSchema = () => {
    switch (type) {
      case "local-business":
        return localBusinessSchema;
      case "faq":
        return faqSchema;
      case "product":
        return productSchema;
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
