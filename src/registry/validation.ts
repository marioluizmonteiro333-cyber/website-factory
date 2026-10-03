import { registrySchema, type Registry } from "./schema";

export class RegistryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryValidationError";
  }
}

export function validateRegistry(input: unknown): Registry {
  const parsed = registrySchema.safeParse(input);
  if (!parsed.success) {
    throw new RegistryValidationError(
      `Invalid Registry structure: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`,
    );
  }

  const keys = new Set<string>();
  for (const artifact of parsed.data.artifacts) {
    const key = `${artifact.id}@${artifact.version}`;
    if (keys.has(key)) {
      throw new RegistryValidationError(`Duplicate Registry artifact: ${key}`);
    }
    keys.add(key);
  }

  for (const artifact of parsed.data.artifacts) {
    for (const compatibleTemplate of artifact.compatibleWith ?? []) {
      const target = parsed.data.artifacts.find((candidate) =>
        matches(candidate, compatibleTemplate),
      );
      if (target === undefined || target.type !== "TEMPLATE") {
        throw new RegistryValidationError(
          `Compatibility reference ${compatibleTemplate.id}@${compatibleTemplate.version} declared by ${artifact.id}@${artifact.version} must identify a registered TEMPLATE.`,
        );
      }
    }
    for (const dependency of artifact.dependencies) {
      const target = parsed.data.artifacts.find((candidate) =>
        matches(candidate, dependency),
      );
      if (target === undefined) {
        throw new RegistryValidationError(
          `Unresolved dependency ${dependency.id}@${dependency.version} declared by ${artifact.id}@${artifact.version}.`,
        );
      }
      if (dependency.deprecatedPin === true && target.status !== "DEPRECATED") {
        throw new RegistryValidationError(
          `Deprecated pin ${dependency.id}@${dependency.version} does not target a DEPRECATED artifact.`,
        );
      }
      if (
        dependency.deprecatedPin === true &&
        !["APPROVED", "PRODUCTION"].includes(artifact.status)
      ) {
        throw new RegistryValidationError(
          `Artifact ${artifact.id}@${artifact.version} is not eligible to retain a deprecated dependency pin.`,
        );
      }
    }
  }

  return parsed.data;
}

function matches(
  artifact: { id: string; version: string },
  reference: { id: string; version: string },
): boolean {
  return artifact.id === reference.id && artifact.version === reference.version;
}
