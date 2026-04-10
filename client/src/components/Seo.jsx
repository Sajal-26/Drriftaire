import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.drriftaire.com";
const DEFAULT_IMAGE = `${SITE_URL}/drone-spraying.png`;

const pages = {
  "/": {
    title: "Drriftaire | Drone Pesticide Spraying Services for Indian Farms",
    description:
      "Book precision drone pesticide spraying, fertilizer spraying, crop mapping, and farm drone services with Drriftaire for safer, faster Indian agriculture.",
    keywords:
      "Drriftaire, drone pesticide spraying, drone spraying services, agriculture drone services India, crop spraying drone, fertilizer spraying drone, farm drone booking",
  },
  "/services": {
    title: "Drone Spraying Services | Crop Spraying, Mapping and Farm Operations",
    description:
      "Explore Drriftaire drone services for pesticide spraying, fertilizer application, crop health monitoring, field mapping, and scheduled farm operations.",
    keywords:
      "drone spraying services, pesticide spraying drone, crop spraying service, farm mapping drone, agriculture drone service",
  },
  "/booking": {
    title: "Book Drone Pesticide Spraying | Drriftaire Farm Service Booking",
    description:
      "Schedule drone pesticide spraying and crop application services for your farm with Drriftaire. Share acreage, crop type, pesticide type, and preferred date.",
    keywords:
      "book drone spraying, drone pesticide booking, agriculture drone booking, farm spraying service, Drriftaire booking",
  },
  "/partner": {
    title: "Become a Drone Service Partner | Drriftaire Partner Network",
    description:
      "Partner with Drriftaire to build a rural drone service business with training, farm demand, operations support, and agricultural drone opportunities.",
    keywords:
      "drone service partner, agriculture drone business, drone pilot partner India, Drriftaire partner, rural drone business",
  },
  "/why-us": {
    title: "Why Drriftaire | Precision Drone Agriculture for Indian Farms",
    description:
      "See why farmers and operators choose Drriftaire for precision spraying, local support, field coordination, and reliable drone agriculture services.",
    keywords:
      "why Drriftaire, precision agriculture drone, drone agriculture India, drone crop spraying benefits",
  },
  "/about": {
    title: "About Drriftaire | Drone Agriculture Services in India",
    description:
      "Learn about Drriftaire's mission to make drone pesticide spraying, precision agriculture, and rural drone services accessible for Indian farmers.",
    keywords:
      "about Drriftaire, drone agriculture company India, precision farming company, farm drone services",
  },
  "/careers": {
    title: "Careers at Drriftaire | Work in Drone Agriculture",
    description:
      "Join Drriftaire and help build the future of drone agriculture, rural operations, precision spraying, and farm technology in India.",
    keywords:
      "Drriftaire careers, drone agriculture jobs, drone pilot jobs, agri tech careers India",
  },
  "/contact": {
    title: "Contact Drriftaire | Drone Spraying and Agriculture Drone Support",
    description:
      "Contact Drriftaire for drone pesticide spraying, agriculture drone services, partnerships, pilot opportunities, and farm service support.",
    keywords:
      "contact Drriftaire, drone spraying contact, agriculture drone support, pesticide spraying service contact",
  },
  "/admin": {
    title: "Drriftaire Admin",
    description: "Drriftaire admin dashboard.",
    keywords: "",
    noindex: true,
  },
};

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes.identity).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute("content", attributes.content);
};

const setLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const Seo = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, "") || "/";
    const page = pages[pathname] || pages["/"];
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

    document.title = page.title;

    setMeta('meta[name="description"]', {
      identity: { name: "description" },
      content: page.description,
    });
    setMeta('meta[name="keywords"]', {
      identity: { name: "keywords" },
      content: page.keywords,
    });
    setMeta('meta[name="robots"]', {
      identity: { name: "robots" },
      content: page.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
    });
    setMeta('meta[property="og:title"]', {
      identity: { property: "og:title" },
      content: page.title,
    });
    setMeta('meta[property="og:description"]', {
      identity: { property: "og:description" },
      content: page.description,
    });
    setMeta('meta[property="og:url"]', {
      identity: { property: "og:url" },
      content: canonicalUrl,
    });
    setMeta('meta[property="og:type"]', {
      identity: { property: "og:type" },
      content: "website",
    });
    setMeta('meta[property="og:image"]', {
      identity: { property: "og:image" },
      content: DEFAULT_IMAGE,
    });
    setMeta('meta[name="twitter:card"]', {
      identity: { name: "twitter:card" },
      content: "summary_large_image",
    });
    setMeta('meta[name="twitter:title"]', {
      identity: { name: "twitter:title" },
      content: page.title,
    });
    setMeta('meta[name="twitter:description"]', {
      identity: { name: "twitter:description" },
      content: page.description,
    });
    setMeta('meta[name="twitter:image"]', {
      identity: { name: "twitter:image" },
      content: DEFAULT_IMAGE,
    });
    setLink("canonical", canonicalUrl);
  }, [location.pathname]);

  return null;
};

export default Seo;
