import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product" | "profile";
  canonical?: string;
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

const SITE_URL = "https://vivalegria.com.br";

const SEO = ({
  title = "Recreação Infantil SP | Pacotes a partir de R$589 | Vivalegria 2026",
  description = "Recreação infantil premium em São Paulo para festas, casamentos e eventos. Pacotes Select (4h + 2 recreadores) e Clássico. Vila Mariana, Moema, ABC. Tel: (11) 96598-2251",
  keywords = "recreação infantil São Paulo, festas infantis SP, animação de festas preço, oficinas criativas, eventos corporativos infantis, recreação Vila Mariana, recreação Moema, recreação ABC Paulista",
  ogImage = "/logo-vivalegria.jpg",
  ogType = "website",
  canonical,
  noindex = false,
  article,
}: SEOProps) => {
  const fullTitle = title.includes("Vivalegria")
    ? title
    : `${title} | Vivalegria Recreação`;

  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const image = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {canonical && <link rel="canonical" href={url} />}

      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="language" content="pt-BR" />
      <meta name="author" content="Vivalegria Recreação Infantil" />
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Vivalegria Recreação Infantil" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />

      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {article?.author && (
        <meta property="article:author" content={article.author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
