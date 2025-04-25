// Utility to determine if the sidebar should be shown based on pathname

export function shouldShowSidebar(pathname: string): boolean {
  // Hide sidebar on login and signup pages
  return !["/login", "/signup"].includes(pathname);
}
