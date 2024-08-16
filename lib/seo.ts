import configs from "@/config";

interface SEOTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
  };
  canonicalUrlRelative?: string;
  extraTags?: Record<string, any>;
}

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: SEOTagsProps = {}) => {
  return {
    title: title || configs.appName,
    description: description || configs.description,
    keywords: keywords || [configs.appName],
    applicationName: configs.appName,
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://${configs.domain}/`
    ),
    openGraph: {
      title: openGraph?.title || configs.appName,
      description: openGraph?.description || configs.description,
      url: openGraph?.url || `https://${configs.domain}/`,
      siteName: openGraph?.title || configs.appName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: openGraph?.title || configs.appName,
      description: openGraph?.description || configs.description,
      card: "summary_large_image",
      creator: "@gauravvan",
    },
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),
    ...extraTags,
  };
};
