import { describe, expect, it } from "vitest";
import {
  businessDataContractSchema,
  componentContractSchema,
  featureContractSchema,
  layoutContractSchema,
  sectionContractSchema,
  templateContractSchema,
  themeContractSchema,
} from "../src/contracts";
import { businessDataFixture } from "./fixtures/business-data";

const themeFixture = {
  id: "theme.default",
  version: "1.0.0",
  tokens: {
    colors: {
      primary: "#112233",
      secondary: "#223344",
      background: "#FFFFFF",
      surface: "#F8F8F8",
      text: "#111111",
      muted: "#666666",
      border: "#DDDDDD",
      accent: "#AA3322",
    },
    typography: {
      bodyFontFamily: "Arial, sans-serif",
      headingFontFamily: "Arial, sans-serif",
    },
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
    radius: { sm: "4px", md: "8px", lg: "12px", full: "9999px" },
    shadows: {
      sm: "0 1px 2px #00000022",
      md: "0 2px 4px #00000022",
      lg: "0 4px 8px #00000022",
    },
  },
};

describe("contract schemas", () => {
  it("accepts valid Business Data and rejects invalid or unknown fields", () => {
    expect(businessDataContractSchema.parse(businessDataFixture)).toEqual(
      businessDataFixture,
    );
    expect(
      businessDataContractSchema.safeParse({ identity: { name: "" } }).success,
    ).toBe(false);
    expect(
      businessDataContractSchema.safeParse({
        identity: { name: "Example", arbitrary: "value" },
      }).success,
    ).toBe(false);
  });

  it("accepts valid Theme tokens and rejects invalid tokens and unknown fields", () => {
    expect(themeContractSchema.parse(themeFixture)).toEqual(themeFixture);
    expect(
      themeContractSchema.safeParse({
        ...themeFixture,
        tokens: {
          ...themeFixture.tokens,
          colors: { ...themeFixture.tokens.colors, primary: "not-a-color" },
        },
      }).success,
    ).toBe(false);
    expect(
      themeContractSchema.safeParse({
        ...themeFixture,
        unexpected: true,
      }).success,
    ).toBe(false);
  });

  it("accepts LEVEL 1 and LEVEL 2 Features but rejects LEVEL 3", () => {
    const feature = {
      id: "feature.contact",
      version: "1.0.0",
      level: "LEVEL 2",
      dependencies: [],
      compatibleWith: [{ id: "template.basic", version: "1.0.0" }],
    };
    expect(featureContractSchema.parse(feature)).toEqual(feature);
    expect(
      featureContractSchema.safeParse({ ...feature, level: "LEVEL 3" }).success,
    ).toBe(false);
  });

  it("defines the minimum structural shapes for the other canonical contracts", () => {
    expect(
      componentContractSchema.safeParse({
        id: "component.button",
        version: "1.0.0",
        inputs: ["label"],
        dependencies: [],
      }).success,
    ).toBe(true);
    expect(
      sectionContractSchema.safeParse({
        id: "section.header",
        version: "1.0.0",
        components: [{ id: "component.button", version: "1.0.0" }],
        dataRequirements: ["identity.name"],
      }).success,
    ).toBe(true);
    expect(
      layoutContractSchema.safeParse({
        id: "layout.default",
        version: "1.0.0",
        zones: [{ id: "main", sections: [] }],
      }).success,
    ).toBe(true);
    expect(
      templateContractSchema.safeParse({
        id: "template.basic",
        version: "1.0.0",
        category: "business",
        layout: { id: "layout.default", version: "1.0.0" },
        theme: { id: "theme.default", version: "1.0.0" },
        sections: [],
        features: [],
        businessDataRequirements: ["identity.name"],
      }).success,
    ).toBe(true);
  });
});
