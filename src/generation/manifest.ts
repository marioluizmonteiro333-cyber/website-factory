import { createHash } from "node:crypto";
import { z } from "zod";
import { artifactReferenceSchema } from "../contracts/common";
import type { RegistryArtifact } from "../registry/schema";
import { generationRequestSchema, type GenerationRequest } from "./request";

export const CONTRACT_VERSIONS = {
  component: "1.0.0",
  section: "1.0.0",
  layout: "1.0.0",
  template: "1.0.0",
  theme: "1.0.0",
  businessData: "1.0.0",
  feature: "1.0.0",
} as const;

export const buildManifestSchema = z
  .object({
    generationId: z.string().min(1),
    factoryVersion: z.string().min(1),
    factoryCommit: z.string().min(1).optional(),
    generatedAt: z.string().datetime().optional(),
    template: artifactReferenceSchema,
    theme: artifactReferenceSchema,
    features: z.array(artifactReferenceSchema),
    components: z.array(artifactReferenceSchema),
    contracts: z
      .object({
        component: z.string().min(1),
        section: z.string().min(1),
        layout: z.string().min(1),
        template: z.string().min(1),
        theme: z.string().min(1),
        businessData: z.string().min(1),
        feature: z.string().min(1),
      })
      .strict(),
    inputHash: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();

export type BuildManifest = z.infer<typeof buildManifestSchema>;

export interface BuildManifestOptions {
  factoryVersion: string;
  factoryCommit?: string;
  generatedAt?: string;
}

export function createBuildManifest(
  input: GenerationRequest | unknown,
  resolvedArtifacts: RegistryArtifact[],
  options: BuildManifestOptions,
): BuildManifest {
  const request = generationRequestSchema.parse(input);
  const inputHash = createHash("sha256")
    .update(canonicalize(request))
    .digest("hex");
  const components = resolvedArtifacts
    .filter((artifact) => artifact.type === "COMPONENT")
    .map(({ id, version }) => ({ id, version }));

  return buildManifestSchema.parse({
    generationId: request.generationId,
    factoryVersion: options.factoryVersion,
    factoryCommit: options.factoryCommit,
    generatedAt: options.generatedAt,
    template: request.template,
    theme: request.theme,
    features: request.features,
    components,
    contracts: CONTRACT_VERSIONS,
    inputHash,
  });
}

function canonicalize(value: unknown): string {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Generation input contains a non-finite number.");
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) =>
      left < right ? -1 : left > right ? 1 : 0,
    );
    return `{${entries
      .map(([key, item]) => {
        if (item === undefined) {
          throw new TypeError(
            `Generation input contains undefined at "${key}".`,
          );
        }
        return `${JSON.stringify(key)}:${canonicalize(item)}`;
      })
      .join(",")}}`;
  }
  throw new TypeError(
    `Generation input contains unsupported value: ${typeof value}.`,
  );
}
