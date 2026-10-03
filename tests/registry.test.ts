import { describe, expect, it } from "vitest";
import {
  registry,
  resolveArtifact,
  validateDependenciesForNewVersion,
  validateNewArtifactVersion,
} from "../src/registry";
import { registrySchema } from "../src/registry/schema";
import { validateRegistry } from "../src/registry/validation";
import { registryFixture } from "./fixtures/registry";

describe("Registry validation and resolution", () => {
  it("loads the canonical physical Registry through Registry Validation", () => {
    expect(registry.schemaVersion).toBe("1.0.0");
    expect(registry.artifacts).toEqual([]);
  });

  it("accepts valid Registry entries and rejects invalid entries", () => {
    expect(registrySchema.safeParse(registryFixture).success).toBe(true);
    expect(
      registrySchema.safeParse({
        schemaVersion: "1.0.0",
        artifacts: [{ ...registryFixture.artifacts[0], status: "UNKNOWN" }],
      }).success,
    ).toBe(false);
  });

  it("rejects missing artifacts and exact versions without fallback", () => {
    expect(() =>
      resolveArtifact(registryFixture, {
        id: "template.missing",
        version: "1.0.0",
      }),
    ).toThrow(/does not exist/);
    expect(() =>
      resolveArtifact(registryFixture, {
        id: "template.basic",
        version: "2.0.0",
      }),
    ).toThrow(/does not exist/);
  });

  it("rejects ineligible selections and resolves exact eligible dependencies", () => {
    expect(() =>
      resolveArtifact(registryFixture, {
        id: "template.draft",
        version: "1.0.0",
      }),
    ).toThrow(/not eligible/);
    const result = resolveArtifact(registryFixture, {
      id: "template.basic",
      version: "1.0.0",
    });
    expect(result.map(({ id, version }) => `${id}@${version}`)).toContain(
      "component.button@1.0.0",
    );
    expect(result.at(-1)?.id).toBe("template.basic");
  });

  it("preserves an approved consumer's explicit deprecated pin but rejects a new deprecated selection", () => {
    expect(
      resolveArtifact(registryFixture, {
        id: "template.existing",
        version: "1.0.0",
      }).map(({ id }) => id),
    ).toContain("component.legacy");
    expect(() =>
      resolveArtifact(registryFixture, {
        id: "component.legacy",
        version: "1.0.0",
      }),
    ).toThrow(/not eligible/);
    expect(() =>
      validateDependenciesForNewVersion(registryFixture, [
        {
          id: "component.legacy",
          version: "1.0.0",
          deprecatedPin: true,
        },
      ]),
    ).toThrow(/cannot declare deprecatedPin/);
    expect(() =>
      validateDependenciesForNewVersion(registryFixture, [
        { id: "component.legacy", version: "1.0.0" },
      ]),
    ).toThrow(/not eligible/);
    expect(() =>
      validateNewArtifactVersion(registryFixture, {
        id: "template.existing",
        type: "TEMPLATE",
        version: "2.0.0",
        status: "DEVELOPMENT",
        dependencies: [
          {
            id: "component.legacy",
            version: "1.0.0",
            deprecatedPin: true,
          },
        ],
      }),
    ).toThrow(/cannot declare deprecatedPin/);
    expect(() =>
      validateNewArtifactVersion(registryFixture, {
        id: "template.existing",
        type: "TEMPLATE",
        version: "2.0.0",
        status: "DEVELOPMENT",
        dependencies: [{ id: "component.legacy", version: "1.0.0" }],
      }),
    ).toThrow(/not eligible/);
    const unmarkedExistingPin = {
      ...registryFixture,
      artifacts: registryFixture.artifacts.map((artifact) =>
        artifact.id === "template.existing"
          ? {
              ...artifact,
              dependencies: artifact.dependencies.map(({ id, version }) => ({
                id,
                version,
              })),
            }
          : artifact,
      ),
    };
    expect(() =>
      resolveArtifact(unmarkedExistingPin, {
        id: "template.existing",
        version: "1.0.0",
      }),
    ).toThrow(/ineligible for use/);
  });

  it("rejects unresolved dependencies and duplicate identity/version pairs", () => {
    expect(() =>
      validateRegistry({
        ...registryFixture,
        artifacts: [
          {
            ...registryFixture.artifacts[0],
            dependencies: [{ id: "not.registered", version: "1.0.0" }],
          },
        ],
      }),
    ).toThrow(/Unresolved dependency/);
    expect(() =>
      validateRegistry({
        ...registryFixture,
        artifacts: [...registryFixture.artifacts, registryFixture.artifacts[0]],
      }),
    ).toThrow(/Duplicate Registry artifact/);
  });
});
