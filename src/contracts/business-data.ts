import { z } from "zod";

const optionalNonEmptyString = z.string().trim().min(1).optional();
const urlSchema = z.url();

export const businessDataContractSchema = z
  .object({
    identity: z
      .object({
        name: z.string().trim().min(1),
        description: optionalNonEmptyString,
      })
      .strict(),
    contact: z
      .object({
        phone: optionalNonEmptyString,
        email: z.email().optional(),
        website: urlSchema.optional(),
      })
      .strict()
      .optional(),
    location: z
      .object({
        address: optionalNonEmptyString,
        city: optionalNonEmptyString,
        postalCode: optionalNonEmptyString,
        country: optionalNonEmptyString,
      })
      .strict()
      .optional(),
    openingHours: z
      .array(
        z
          .object({
            day: z.enum([
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY",
              "SUNDAY",
            ]),
            opens: z.iso.time().optional(),
            closes: z.iso.time().optional(),
            closed: z.boolean().optional(),
          })
          .strict()
          .refine(
            (hours) =>
              hours.closed === true ||
              (hours.opens !== undefined && hours.closes !== undefined),
            "Opening hours need opening and closing times unless the day is closed.",
          ),
      )
      .optional(),
    branding: z
      .object({
        logo: urlSchema.optional(),
      })
      .strict()
      .optional(),
    servicesProducts: z
      .array(
        z
          .object({
            name: z.string().trim().min(1),
            description: optionalNonEmptyString,
          })
          .strict(),
      )
      .optional(),
    gallery: z
      .array(
        z
          .object({
            url: urlSchema,
            alt: z.string().trim().min(1),
          })
          .strict(),
      )
      .optional(),
    socialLinks: z
      .array(
        z
          .object({
            platform: z.string().trim().min(1),
            url: urlSchema,
          })
          .strict(),
      )
      .optional(),
    features: z.array(z.string().trim().min(1)).optional(),
  })
  .strict();

export type BusinessData = z.infer<typeof businessDataContractSchema>;
