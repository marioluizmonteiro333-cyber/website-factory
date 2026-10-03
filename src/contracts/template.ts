import { z } from "zod";
import { artifactIdentitySchema, artifactReferenceSchema } from "./common";

export const templateContractSchema = artifactIdentitySchema
  .extend({
    category: z.string().min(1),
    layout: artifactReferenceSchema,
    theme: artifactReferenceSchema,
    sections: z.array(artifactReferenceSchema),
    features: z.array(artifactReferenceSchema),
    businessDataRequirements: z.array(z.string().min(1)),
  })
  .strict();

export type TemplateContract = z.infer<typeof templateContractSchema>;
