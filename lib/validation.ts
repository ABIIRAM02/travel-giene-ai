import type { ZodIssue } from "zod";

export function formatZodErrors(issues: ZodIssue[]) {

  return issues.reduce <Record<string, string>> ((acc, issue) => {
    
    acc[issue.path[0] as string] = issue.message;
    return acc;

  }, {});

}
