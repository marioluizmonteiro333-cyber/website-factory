import { z } from "zod";
import { businessDataContractSchema } from "../contracts/business-data";
import { artifactReferenceSchema } from "../contracts/common";
import { ArtifactResolutionError, resolveArtifact } from "../registry/resolver";
import { validateRegistry } from "../registry/validation";
import type { ArtifactType, RegistryArtifact } from "../registry/schema";

export const generationRequestSchema = z
  .object({
    generationId: z.string().min(1),
    businessData: businessDataContractSchema,
    template: artifactReferenceSchema,
    theme: artifactReferenceSchema,
    features: z
      .array(artifactReferenceSchema)
      .refine(
        (features) =>
          new Set(features.map(({ id, version }) => `${id}@${version}`))
            .size === features.length,
        "Feature references must be unique.",
      ),
  })
  .strict();

export type GenerationRequest = z.infer<typeof generationRequestSchema>;

export interface ResolvedGenerationRequest {
  request: GenerationRequest;
  artifacts: RegistryArtifact[];
}

export function validateGenerationRequest(input: unknown): GenerationRequest {
  return generationRequestSchema.parse(input);
}

export function resolveGenerationRequest(
  input: unknown,
  registryInput: unknown,
): ResolvedGenerationRequest {
  const request = validateGenerationRequest(input);
  const registry = validateRegistry(registryInput);
  const selections: {
    reference: GenerationRequest["template"];
    type: ArtifactType;
  }[] = [
    { reference: request.template, type: "TEMPLATE" },
    { reference: request.theme, type: "THEME" },
    ...request.features.map((reference) => ({
      reference,
      type: "FEATURE" as const,
    })),
  ];

  const artifacts: RegistryArtifact[] = [];
  const seen = new Set<string>();
  for (const selection of selections) {
    const resolved = resolveArtifact(
      registry,
      selection.reference,
      selection.type,
    );
    if (selection.type === "FEATURE") {
      const feature = resolved.find(
        ({ id, version }) =>
          id === selection.reference.id &&
          version === selection.reference.version,
      );
      if (
        feature?.compatibleWith?.some(
          ({ id, version }) =>
            id === request.template.id && version === request.template.version,
        ) !== true
      ) {
        throw new ArtifactResolutionError(
          `Feature ${selection.reference.id}@${selection.reference.version} is not compatible with template ${request.template.id}@${request.template.version}.`,
        );
      }
    }
    for (const artifact of resolved) {
      const key = `${artifact.id}@${artifact.version}`;
      if (!seen.has(key)) {
        seen.add(key);
        artifacts.push(artifact);
      }
    }
  }

  if (artifacts.length === 0) {
    throw new ArtifactResolutionError(
      "The Generation Request resolved no Registry artifacts.",
    );
  }
  return { request, artifacts };
}
