import { Helmet } from "react-helmet-async";

type HeadSEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
};

const SITE_URL = "https://vivalegria.com.br";

const defaults = {
  title: "Vivalegria Recreação Infantil | Festas e Eventos em São Paulo",
  description:
    "Recreação infantil premium em São Paulo para festas, casamentos, eventos corporativos e escolas. Pacotes a partir de R$589 com monitores qualificados.",
  ogImage: "/logo-vivalegria.jpg",
};

export const HeadSEO = ({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
}: HeadSEOProps = {}) => {
  const fullTitle = title ? `${title} | Vivalegria` : defaults.title;
  const desc = description || defaults.description;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const img = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : `${SITE_URL}${defaults.ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      {canonical && <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Vivalegria Recreação Infantil" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default HeadSEO;
