import { z } from "zod";

export const artifactVersionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

export const artifactReferenceSchema = z
  .object({
    id: z.string().min(1),
    version: artifactVersionSchema,
  })
  .strict();

export const artifactIdentitySchema = artifactReferenceSchema;

export type ArtifactReference = z.infer<typeof artifactReferenceSchema>;
export type ArtifactIdentity = z.infer<typeof artifactIdentitySchema>;
