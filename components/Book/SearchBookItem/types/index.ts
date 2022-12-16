export type Info = {
    authors?: string[] | null
    categories?: string[] | null
    description?: string | null
    imageLinks?: { smallThumbnail: string; thumbnail: string } | null
    industryIdentifiers?: Array<{ type: string; identifier: string }> | null
    pageCount?: number | null
    previewLink?: string | null
    publishedDate?: string | null
    readingModes?: { text: boolean; image: boolean } | null
    title?: string | null
  }