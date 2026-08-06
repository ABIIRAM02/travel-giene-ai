import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export function redirectDestination (searchParams: ReadonlyURLSearchParams, router: AppRouterInstance) {
  const redirectParam = searchParams.get("redirect");
  const destination = redirectParam?.startsWith("/") // to avoid https redirecting like evil websites
    ? redirectParam
    : "/dashboard";

  router.replace(destination);
}
