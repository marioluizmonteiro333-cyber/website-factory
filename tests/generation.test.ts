import { describe, expect, it } from "vitest";
import { businessDataFixture } from "./fixtures/business-data";
import { registryFixture } from "./fixtures/registry";
import {
  createBuildManifest,
  resolveGenerationRequest,
  validateGenerationRequest,
} from "../src/generation";

const generationRequestFixture = {
  generationId: "generation-test-001",
  businessData: businessDataFixture,
  template: { id: "template.basic", version: "1.0.0" },
  theme: { id: "theme.default", version: "1.0.0" },
  features: [{ id: "feature.contact", version: "1.0.0" }],
};

describe("Generation Request", () => {
  it("accepts a valid request and rejects invalid data or unresolved references", () => {
    expect(validateGenerationRequest(generationRequestFixture)).toEqual(
      generationRequestFixture,
    );
    expect(() =>
      validateGenerationRequest({
        ...generationRequestFixture,
        businessData: { identity: { name: "" } },
      }),
    ).toThrow();
    expect(() =>
      resolveGenerationRequest(
        {
          ...generationRequestFixture,
          theme: { id: "theme.missing", version: "1.0.0" },
        },
        registryFixture,
      ),
    ).toThrow(/does not exist/);
  });

  it("resolves request references and their pinned dependencies", () => {
    const resolved = resolveGenerationRequest(
      generationRequestFixture,
      registryFixture,
    );
    expect(resolved.request.generationId).toBe("generation-test-001");
    expect(resolved.artifacts.map(({ id }) => id)).toContain(
      "component.button",
    );
  });

  it("accepts eligible themes and compatible features absent from direct dependencies", () => {
    expect(
      resolveGenerationRequest(
        {
          ...generationRequestFixture,
          theme: { id: "theme.alternative", version: "1.0.0" },
          features: [{ id: "feature.unlisted", version: "1.0.0" }],
        },
        registryFixture,
      ).artifacts.map(({ id }) => id),
    ).toContain("theme.alternative");
    expect(() =>
      resolveGenerationRequest(
        {
          ...generationRequestFixture,
          features: [{ id: "feature.other-template", version: "1.0.0" }],
        },
        registryFixture,
      ),
    ).toThrow(/not compatible/);
  });

  it("rejects an ineligible theme", () => {
    expect(() =>
      resolveGenerationRequest(
        {
          ...generationRequestFixture,
          theme: { id: "theme.draft", version: "1.0.0" },
        },
        registryFixture,
      ),
    ).toThrow(/not eligible/);
  });

  it("rejects nonexistent or ineligible feature selections", () => {
    expect(() =>
      resolveGenerationRequest(
        {
          ...generationRequestFixture,
          features: [{ id: "feature.missing", version: "1.0.0" }],
        },
        registryFixture,
      ),
    ).toThrow(/does not exist/);
    expect(() =>
      resolveGenerationRequest(
        {
          ...generationRequestFixture,
          features: [{ id: "feature.draft", version: "1.0.0" }],
        },
        registryFixture,
      ),
    ).toThrow(/not eligible/);
  });
});

describe("Build Manifest", () => {
  it("records required references and creates a deterministic input hash", () => {
    const resolved = resolveGenerationRequest(
      generationRequestFixture,
      registryFixture,
    );
    const manifest = createBuildManifest(resolved.request, resolved.artifacts, {
      factoryVersion: "0.1.0",
      factoryCommit: "b925c47",
      generatedAt: "2025-01-01T00:00:00.000Z",
    });
    const repeated = createBuildManifest(resolved.request, resolved.artifacts, {
      factoryVersion: "0.1.0",
      generatedAt: "2026-01-01T00:00:00.000Z",
    });

    expect(manifest).toMatchObject({
      generationId: generationRequestFixture.generationId,
      factoryVersion: "0.1.0",
      factoryCommit: "b925c47",
      template: generationRequestFixture.template,
      theme: generationRequestFixture.theme,
      features: generationRequestFixture.features,
      contracts: {
        businessData: "1.0.0",
        feature: "1.0.0",
      },
    });
    expect(manifest.components).toContainEqual({
      id: "component.button",
      version: "1.0.0",
    });
    expect(manifest.inputHash).toMatch(/^[a-f0-9]{64}$/);
    expect(repeated.inputHash).toBe(manifest.inputHash);
    expect(
      createBuildManifest(
        {
          ...resolved.request,
          businessData: {
            ...businessDataFixture,
            identity: { name: "Different input" },
          },
        },
        resolved.artifacts,
        { factoryVersion: "0.1.0" },
      ).inputHash,
    ).not.toBe(manifest.inputHash);
    expect(JSON.stringify(manifest)).not.toContain("Atelier Exemplo");
  });
});
