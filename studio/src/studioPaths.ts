/** Workspace-relative URL, including when Studio is hosted below a dashboard path. */
export function pageEditorPath(basePath: string, pageType: string) {
  return `${basePath.replace(/\/$/, '')}/content/pages;${encodeURIComponent(pageType)}`
}
