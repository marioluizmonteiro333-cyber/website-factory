import registryData from "./registry.json";
import { validateRegistry } from "./validation";

export const registry = validateRegistry(registryData);
