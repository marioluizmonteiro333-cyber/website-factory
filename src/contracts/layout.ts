import { z } from "zod";
import { artifactIdentitySchema, artifactReferenceSchema } from "./common";

export const layoutContractSchema = artifactIdentitySchema
  .extend({
    zones: z
      .array(
        z
          .object({
            id: z.string().min(1),
            sections: z.array(artifactReferenceSchema),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export type LayoutContract = z.infer<typeof layoutContractSchema>;
