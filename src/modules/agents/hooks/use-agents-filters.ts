import { DEFAULT_PAGE } from "@/constants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export function useAgentsFilters() {
  return useQueryStates({
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(DEFAULT_PAGE),
  });
}
