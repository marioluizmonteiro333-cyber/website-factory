import { z } from "zod";
import { artifactIdentitySchema, artifactReferenceSchema } from "./common";

export const featureContractSchema = artifactIdentitySchema
  .extend({
    level: z.enum(["LEVEL 1", "LEVEL 2"]),
    dependencies: z.array(artifactReferenceSchema),
    compatibleWith: z.array(artifactReferenceSchema),
  })
  .strict();

export type FeatureContract = z.infer<typeof featureContractSchema>;
