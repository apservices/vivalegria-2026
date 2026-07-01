import { useLocation } from "react-router-dom";

type JsonLdType =
  | "organization"
  | "local-business"
  | "faq"
  | "product"
  | "all-products"
  | "service"
  | "article"
  | "about-page"
  | "contact-page"
  | "breadcrumb"
  | "job-posting"
  | "website"
  | "custom";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface JsonLdProps {
  type?: JsonLdType;
  productData?: {
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  serviceData?: {
    name: string;
    description: string;
    price?: number;
    image?: string;
    areaServed?: string[];
  };
  articleData?: {
    headline: string;
    description: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
  };
  breadcrumbItems?: BreadcrumbItem[];
  jobData?: {
    title: string;
    description: string;
    datePosted?: string;
    validThrough?: string;
    employmentType?: string;
  };
  data?: Record<string, unknown>;
}

const SITE_URL = "https://vivalegria.com.br";

const JsonLd = ({
  type = "organization",
  productData,
  serviceData,
  articleData,
  breadcrumbItems,
  jobData,
  data,
}: JsonLdProps) => {
  const location = useLocation();
  const pageUrl = `${SITE_URL}${location.pathname}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vivalegria Recreação Infantil",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-vivalegria.jpg`,
    description:
      "Recreação infantil premium em São Paulo com profissionalismo, segurança e alto impacto emocional. Mais de 500 eventos realizados com excelência.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "São Paulo e região",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "01000-000",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-96598-2251",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://www.instagram.com/vivalegria_/",
      "https://www.facebook.com/vivalegriarecreacao",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vivalegria Recreação Infantil",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Vivalegria Recreação Infantil",
    image: `${SITE_URL}/logo-vivalegria.jpg`,
    priceRange: "R$ 589 - R$ 1.769",
    telephone: "+55-11-96598-2251",
    email: "contato@vivalegria.com.br",
    description:
      "Recreação infantil para festas em São Paulo. Pacotes a partir de R$589,90 com recreadores profissionais, pintura facial, caça ao tesouro e muito mais! Atendemos Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "São Paulo e região metropolitana",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "01000-000",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -23.5505,
      longitude: -46.6333,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "12:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "AdministrativeArea", name: "Vila Mariana" },
      { "@type": "AdministrativeArea", name: "Moema" },
      { "@type": "AdministrativeArea", name: "Santo Amaro" },
      { "@type": "AdministrativeArea", name: "Morumbi" },
      { "@type": "AdministrativeArea", name: "Pinheiros" },
      { "@type": "AdministrativeArea", name: "Jardins" },
      { "@type": "AdministrativeArea", name: "ABC Paulista" },
    ],
    paymentAccepted: "PIX, Cartão de Crédito",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quanto custa o pacote Select para 25 crianças?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O pacote Select para 25 crianças custa R$ 1.119,90. Este valor inclui 4 horas de recreação, 2 recreadores profissionais, pintura facial, caça ao tesouro personalizada, escultura de balão, e muito mais!",
        },
      },
      {
        "@type": "Question",
        name: "O que está incluso na recreação clássica?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Pacote Clássico inclui 4 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro, toalha de piquenique com kit desenho, e brincadeiras com cordas, bolas e cones. A partir de R$ 589,90 para até 15 crianças.",
        },
      },
      {
        "@type": "Question",
        name: "Vocês atendem em toda São Paulo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! Atendemos São Paulo capital e região metropolitana, incluindo Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins e ABC.",
        },
      },
      {
        "@type": "Question",
        name: "Como funciona o pagamento?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PIX: à vista ou 60% de sinal + 40% até 7 dias antes do evento. Cartão: 3x sem juros acima de R$600 ou até 10x com juros. Emitimos contrato digital e nota fiscal.",
        },
      },
    ],
  };

  const productSchema = productData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productData.name,
        description: productData.description,
        image: productData.image || `${SITE_URL}/logo-vivalegria.jpg`,
        brand: { "@type": "Brand", name: "Vivalegria" },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: productData.price,
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Vivalegria Recreação Infantil",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "127",
        },
      }
    : null;

  const allProductsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "Pacote SELECT - Recreação Infantil",
        description:
          "4 horas de recreação com 2 recreadores profissionais, pintura facial, caça ao tesouro, escultura de balão e muito mais",
        brand: { "@type": "Brand", name: "Vivalegria" },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "789.90",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        name: "Pacote CLÁSSICO - Recreação Infantil",
        description:
          "4 horas de recreação com 1 recreador, escultura de balão, tatuagem infantil, caça ao tesouro",
        brand: { "@type": "Brand", name: "Vivalegria" },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "589.90",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        name: "Baladinha Kids",
        description:
          "Estrutura 3x3m com pista iluminada, luzes LED, máquina de fumaça e playlist personalizada para até 20 crianças",
        brand: { "@type": "Brand", name: "Vivalegria" },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "989.00",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        name: "Área Baby",
        description:
          "Espaço dedicado com atividades sensoriais e profissionais especializados para até 10 bebês",
        brand: { "@type": "Brand", name: "Vivalegria" },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "679.90",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  const serviceSchema = serviceData
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceData.name,
        description: serviceData.description,
        image: serviceData.image || `${SITE_URL}/logo-vivalegria.jpg`,
        provider: {
          "@type": "Organization",
          name: "Vivalegria Recreação Infantil",
          url: SITE_URL,
        },
        areaServed: (
          serviceData.areaServed || ["São Paulo", "ABC Paulista"]
        ).map((a) => ({ "@type": "City", name: a })),
        ...(serviceData.price
          ? {
              offers: {
                "@type": "Offer",
                price: serviceData.price,
                priceCurrency: "BRL",
              },
            }
          : {}),
      }
    : null;

  const articleSchema = articleData
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: articleData.headline,
        description: articleData.description,
        image: articleData.image || `${SITE_URL}/logo-vivalegria.jpg`,
        datePublished: articleData.datePublished,
        dateModified: articleData.dateModified || articleData.datePublished,
        author: {
          "@type": "Organization",
          name: articleData.author || "Vivalegria Recreação Infantil",
        },
        publisher: {
          "@type": "Organization",
          name: "Vivalegria Recreação Infantil",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo-vivalegria.jpg`,
          },
        },
        mainEntityOfPage: pageUrl,
      }
    : null;

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: pageUrl,
    name: "Quem Somos - Vivalegria Recreação Infantil",
    description:
      "Conheça a história, missão e equipe da Vivalegria — referência em recreação infantil premium em São Paulo.",
    mainEntity: organizationSchema,
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: pageUrl,
    name: "Contato - Vivalegria Recreação Infantil",
    description:
      "Entre em contato com a Vivalegria para orçamento de recreação infantil em São Paulo.",
    mainEntity: {
      "@type": "Organization",
      name: "Vivalegria Recreação Infantil",
      telephone: "+55-11-96598-2251",
      email: "contato@vivalegria.com.br",
    },
  };

  const breadcrumbSchema = breadcrumbItems
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      }
    : null;

  const jobPostingSchema = jobData
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: jobData.title,
        description: jobData.description,
        datePosted: jobData.datePosted || new Date().toISOString().slice(0, 10),
        validThrough: jobData.validThrough,
        employmentType: jobData.employmentType || "PART_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: "Vivalegria Recreação Infantil",
          sameAs: SITE_URL,
          logo: `${SITE_URL}/logo-vivalegria.jpg`,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            addressCountry: "BR",
          },
        },
      }
    : null;

  const getSchema = () => {
    switch (type) {
      case "website":
        return websiteSchema;
      case "local-business":
        return localBusinessSchema;
      case "faq":
        return faqSchema;
      case "product":
        return productSchema;
      case "all-products":
        return allProductsSchema;
      case "service":
        return serviceSchema;
      case "article":
        return articleSchema;
      case "about-page":
        return aboutPageSchema;
      case "contact-page":
        return contactPageSchema;
      case "breadcrumb":
        return breadcrumbSchema;
      case "job-posting":
        return jobPostingSchema;
      case "custom":
        return data ?? null;
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
