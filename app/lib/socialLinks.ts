export type SocialPlatform = "Facebook" | "Instagram" | "LinkedIn";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  ariaLabel: string;
};

export const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    url: "https://www.facebook.com/tiganu.eugen1/",
    ariaLabel: "Follow TOKNAV on Facebook"
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/tiganueugen/",
    ariaLabel: "Follow TOKNAV on Instagram"
  },
  {
    platform: "LinkedIn",
    url: "https://md.linkedin.com/in/tiganueugeniu",
    ariaLabel: "Follow TOKNAV on LinkedIn"
  }
];
