import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEO = ({
  title = "Recreação Infantil SP | Pacotes a partir de R$589 | Vivalegria 2026",
  description = "Recreação infantil premium em São Paulo para festas, casamentos e eventos. Pacotes Select (4h + 2 recreadores) e Clássico. Vila Mariana, Moema, ABC. ☎️ (11) 96598-2251",
  keywords = "recreação infantil São Paulo, festas infantis SP, animação de festas preço, oficinas criativas, eventos corporativos infantis, recreação Vila Mariana, recreação Moema, recreação ABC Paulista",
  ogImage = "/logo-vivalegria.jpg",
  canonical,
}: SEOProps) => {
  const siteUrl = "https://vivalegria.com.br";
  const fullTitle = title.includes("Vivalegria") ? title : `${title} | Vivalegria Recreação`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="author" content="Vivalegria Recreação" />
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />
    </Helmet>
  );
};

export default SEO;
