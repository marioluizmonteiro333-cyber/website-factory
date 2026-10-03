import { z } from "zod";
import { artifactReferenceSchema } from "../contracts/common";

export const artifactTypeSchema = z.enum([
  "COMPONENT",
  "SECTION",
  "LAYOUT",
  "TEMPLATE",
  "THEME",
  "FEATURE",
]);

export const artifactStatusSchema = z.enum([
  "DRAFT",
  "DEVELOPMENT",
  "TESTING",
  "APPROVED",
  "PRODUCTION",
  "DEPRECATED",
  "ARCHIVED",
]);

export const registryDependencySchema = artifactReferenceSchema
  .extend({
    deprecatedPin: z.literal(true).optional(),
  })
  .strict();

export const registryArtifactSchema = z
  .object({
    id: z.string().min(1),
    type: artifactTypeSchema,
    version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/),
    status: artifactStatusSchema,
    dependencies: z.array(registryDependencySchema),
    compatibleWith: z.array(artifactReferenceSchema).optional(),
  })
  .strict()
  .superRefine((artifact, context) => {
    if (artifact.type === "FEATURE" && artifact.compatibleWith === undefined) {
      context.addIssue({
        code: "custom",
        message: "Feature Registry entries must declare compatible templates.",
        path: ["compatibleWith"],
      });
    }
    if (artifact.type !== "FEATURE" && artifact.compatibleWith !== undefined) {
      context.addIssue({
        code: "custom",
        message:
          "Only Feature Registry entries may declare compatible templates.",
        path: ["compatibleWith"],
      });
    }
  });

export const registrySchema = z
  .object({
    schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    artifacts: z.array(registryArtifactSchema),
  })
  .strict();

export type ArtifactType = z.infer<typeof artifactTypeSchema>;
export type ArtifactStatus = z.infer<typeof artifactStatusSchema>;
export type RegistryDependency = z.infer<typeof registryDependencySchema>;
export type RegistryArtifact = z.infer<typeof registryArtifactSchema>;
export type Registry = z.infer<typeof registrySchema>;
