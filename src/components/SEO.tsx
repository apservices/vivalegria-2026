import { Helmet } from "react-helmet-async";
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}
const SEO = ({
  title = "RecreaÃ§Ã£o Infantil SP | Pacotes a partir de R$589 | Vivalegria 2026",
  description = "RecreaÃ§Ã£o infantil premium em SÃ£o Paulo para festas, casamentos e eventos. Pacotes Select (4h + 2 recreadores) e ClÃ¡ssico. Vila Mariana, Moema, ABC. â˜Žï¸ (11) 96598-2251",
  keywords = "recreaÃ§Ã£o infantil SÃ£o Paulo, festas infantis SP, animaÃ§Ã£o de festas preÃ§o, oficinas criativas, eventos corporativos infantis, recreaÃ§Ã£o Vila Mariana, recreaÃ§Ã£o Moema, recreaÃ§Ã£o ABC Paulista",
  ogImage = "/logo-vivalegria.jpg",
  canonical,
}: SEOProps) => {
  const siteUrl = "https://vivalegria.com.br";
  const fullTitle = title.includes("Vivalegria") ? title : `${title} | Vivalegria RecreaÃ§Ã£o`;
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
      <meta name="author" content="Vivalegria RecreaÃ§Ã£o" />
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="SÃ£o Paulo" />
    </Helmet>
  );
};
export default SEO;
