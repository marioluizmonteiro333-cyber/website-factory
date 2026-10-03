import { z } from "zod";
import { artifactIdentitySchema, artifactReferenceSchema } from "./common";

export const componentContractSchema = artifactIdentitySchema
  .extend({
    inputs: z.array(z.string().min(1)),
    dependencies: z.array(artifactReferenceSchema),
  })
  .strict();

export type ComponentContract = z.infer<typeof componentContractSchema>;
