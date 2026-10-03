import { z } from "zod";
import { artifactIdentitySchema } from "./common";

const cssLengthSchema = z.string().regex(/^\d+(?:\.\d+)?(?:px|rem|em)$/);
const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const themeContractSchema = artifactIdentitySchema
  .extend({
    tokens: z
      .object({
        colors: z
          .object({
            primary: colorSchema,
            secondary: colorSchema,
            background: colorSchema,
            surface: colorSchema,
            text: colorSchema,
            muted: colorSchema,
            border: colorSchema,
            accent: colorSchema,
          })
          .strict(),
        typography: z
          .object({
            bodyFontFamily: z.string().min(1),
            headingFontFamily: z.string().min(1),
          })
          .strict(),
        spacing: z
          .object({
            xs: cssLengthSchema,
            sm: cssLengthSchema,
            md: cssLengthSchema,
            lg: cssLengthSchema,
            xl: cssLengthSchema,
          })
          .strict(),
        radius: z
          .object({
            sm: cssLengthSchema,
            md: cssLengthSchema,
            lg: cssLengthSchema,
            full: z.literal("9999px"),
          })
          .strict(),
        shadows: z
          .object({
            sm: z.string().min(1),
            md: z.string().min(1),
            lg: z.string().min(1),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export type ThemeContract = z.infer<typeof themeContractSchema>;
