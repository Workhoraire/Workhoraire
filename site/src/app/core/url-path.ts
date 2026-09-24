/** Path of a router URL, without query string nor fragment: "/tarifs?offre=essentiel#faq" -> "/tarifs". */
export function pathOf(url: string): string {
  return url.split(/[?#]/)[0] || '/';
}
