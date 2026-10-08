import React from "react";
import { ArrowUpRight, Globe, Instagram, Phone, Send } from "lucide-react";
import "./ContactInfo.scss";
import { useContactInfo } from "../hooks/useContactInfo";
import { useLanguage } from "../contexts/LanguageContext";
import logoIcon from "../assets/logo.png";

type Localized = { ru: string; en: string; ro: string };

interface ContactLink {
  label: Localized;
  url: string;
  icon: string;
}

interface ContactButton {
  number: string;
  text: Localized;
}

interface ContactData {
  header?: Localized;
  links?: ContactLink[];
  button?: ContactButton;
}

const BUILTIN_ICONS: Record<string, React.ReactNode> = {
  website: <Globe />,
  telegram: <Send />,
  instagram: <Instagram />,
};

const getIcon = (icon: string) =>
  icon.startsWith("http") ? <img src={icon} alt="" /> : BUILTIN_ICONS[icon] ?? <Globe />;

const getHost = (url: string) => {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, "");
    if (host.includes("instagram.com")) return "@" + pathname.split("/")[1];
    if (host.includes("goo.gl") || host.includes("google.")) return "Google Maps";
    return host;
  } catch {
    return url;
  }
};

const ContactInfo: React.FC = () => {
  const { data: contact, isLoading } = useContactInfo();

  const { language } = useLanguage();
  const contactData = contact as ContactData | null;

  if (isLoading || !contactData) return <div className="loading">Загрузка...</div>;

  const { header, links, button } = contactData;

  return (
    <div className="contacts">
      <div className="contacts-hero">
        <div className="contacts-logo">
          <img src={logoIcon} alt="Bunker B19" />
        </div>
        <h1>{header?.[language] || "Bunker B19"}</h1>
      </div>

      <ul className="contacts-list">
        {links?.map((link, idx) => (
          <li key={idx}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contacts-link"
            >
              <span className="contacts-icon">{getIcon(link.icon)}</span>
              <span className="contacts-info">
                <span className="contacts-label">{link.label?.[language]}</span>
                <span className="contacts-host">{getHost(link.url)}</span>
              </span>
              <span className="contacts-arrow">
                <ArrowUpRight />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {button && (
        <a href={`tel:${button.number}`} className="contacts-call">
          <span className="contacts-call-icon">
            <Phone />
          </span>
          <span className="contacts-info">
            <span className="contacts-label">
              {button.text?.[language] || button.number}
            </span>
            <span className="contacts-host">{button.number}</span>
          </span>
        </a>
      )}
    </div>
  );
};

export default ContactInfo;
