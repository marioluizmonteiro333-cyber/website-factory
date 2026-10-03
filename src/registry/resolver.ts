import type { ArtifactReference } from "../contracts/common";
import { validateRegistry } from "./validation";
import {
  registryArtifactSchema,
  type ArtifactType,
  type Registry,
  type RegistryArtifact,
  type RegistryDependency,
} from "./schema";

const eligibleStatuses = new Set(["APPROVED", "PRODUCTION"]);

export class ArtifactResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArtifactResolutionError";
  }
}

export function resolveArtifact(
  input: Registry | unknown,
  reference: ArtifactReference,
  expectedType?: ArtifactType,
): RegistryArtifact[] {
  const registry = validateRegistry(input);

  const root = findArtifact(registry, reference);
  assertEligible(root, "new use");
  if (expectedType !== undefined && root.type !== expectedType) {
    throw new ArtifactResolutionError(
      `${reference.id}@${reference.version} is ${root.type}, expected ${expectedType}.`,
    );
  }

  const resolved: RegistryArtifact[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(artifact: RegistryArtifact): void {
    const key = artifactKey(artifact);
    if (visited.has(key)) return;
    if (visiting.has(key)) {
      throw new ArtifactResolutionError(`Dependency cycle detected at ${key}.`);
    }
    visiting.add(key);

    for (const dependency of artifact.dependencies) {
      const child = findArtifact(registry, dependency);
      const grandfatheredPin =
        dependency.deprecatedPin === true &&
        eligibleStatuses.has(artifact.status) &&
        child.status === "DEPRECATED";
      if (!eligibleStatuses.has(child.status) && !grandfatheredPin) {
        throw new ArtifactResolutionError(
          `Dependency ${artifactKey(child)} is ineligible for use by ${artifactKey(artifact)}.`,
        );
      }
      visit(child);
    }

    visiting.delete(key);
    visited.add(key);
    resolved.push(artifact);
  }

  visit(root);
  return resolved;
}

export function validateDependenciesForNewVersion(
  input: Registry | unknown,
  dependencies: RegistryDependency[],
): RegistryArtifact[] {
  const registry = validateRegistry(input);
  const resolved: RegistryArtifact[] = [];
  const seen = new Set<string>();

  for (const reference of dependencies) {
    if (reference.deprecatedPin === true) {
      throw new ArtifactResolutionError(
        `New artifact versions cannot declare deprecatedPin for ${reference.id}@${reference.version}.`,
      );
    }
    const artifact = findArtifact(registry, reference);
    assertEligible(artifact, "a new artifact version");
    for (const dependency of resolveArtifact(registry, reference)) {
      const key = artifactKey(dependency);
      if (!seen.has(key)) {
        seen.add(key);
        resolved.push(dependency);
      }
    }
  }

  return resolved;
}

export function validateNewArtifactVersion(
  input: Registry | unknown,
  candidateInput: unknown,
): RegistryArtifact {
  const registry = validateRegistry(input);
  const parsed = registryArtifactSchema.safeParse(candidateInput);
  if (!parsed.success) {
    throw new ArtifactResolutionError(
      `Invalid new artifact version: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`,
    );
  }
  const candidate = parsed.data;
  if (
    registry.artifacts.some(
      (artifact) =>
        artifact.id === candidate.id && artifact.version === candidate.version,
    )
  ) {
    throw new ArtifactResolutionError(
      `Artifact ${artifactKey(candidate)} already exists in the Registry.`,
    );
  }

  for (const dependency of candidate.dependencies) {
    if (dependency.deprecatedPin === true) {
      throw new ArtifactResolutionError(
        `New artifact version ${artifactKey(candidate)} cannot declare deprecatedPin for ${dependency.id}@${dependency.version}.`,
      );
    }
    const target = findArtifact(registry, dependency);
    assertEligible(target, "a new artifact version");
    resolveArtifact(registry, dependency);
  }

  return candidate;
}

function findArtifact(
  registry: Registry,
  reference: ArtifactReference,
): RegistryArtifact {
  const artifact = registry.artifacts.find(
    (candidate) =>
      candidate.id === reference.id && candidate.version === reference.version,
  );
  if (artifact === undefined) {
    throw new ArtifactResolutionError(
      `Artifact ${reference.id}@${reference.version} does not exist in the Registry.`,
    );
  }
  return artifact;
}

function assertEligible(artifact: RegistryArtifact, use: string): void {
  if (!eligibleStatuses.has(artifact.status)) {
    throw new ArtifactResolutionError(
      `Artifact ${artifactKey(artifact)} is ${artifact.status} and is not eligible for ${use}.`,
    );
  }
}

function artifactKey(
  artifact: Pick<RegistryArtifact, "id" | "version">,
): string {
  return `${artifact.id}@${artifact.version}`;
}
