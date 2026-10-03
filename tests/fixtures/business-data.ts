import type { BusinessData } from "../../src/contracts";

export const businessDataFixture: BusinessData = {
  identity: {
    name: "Atelier Exemplo",
    description: "Serviços de referência para testes da Foundation.",
  },
  contact: {
    email: "contact@example.test",
    phone: "+351 210 000 000",
  },
  location: {
    city: "Lisboa",
    country: "Portugal",
  },
  openingHours: [
    {
      day: "MONDAY",
      opens: "09:00:00",
      closes: "18:00:00",
    },
  ],
  servicesProducts: [{ name: "Serviço de exemplo" }],
  gallery: [
    { url: "https://example.test/image.jpg", alt: "Imagem de exemplo" },
  ],
  socialLinks: [{ platform: "instagram", url: "https://example.test/social" }],
  features: ["Atendimento presencial"],
};
