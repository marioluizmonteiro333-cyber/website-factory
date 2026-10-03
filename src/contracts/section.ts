import { z } from "zod";
import { artifactIdentitySchema, artifactReferenceSchema } from "./common";

export const sectionContractSchema = artifactIdentitySchema
  .extend({
    components: z.array(artifactReferenceSchema),
    dataRequirements: z.array(z.string().min(1)),
  })
  .strict();

export type SectionContract = z.infer<typeof sectionContractSchema>;
