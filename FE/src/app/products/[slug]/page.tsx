import { ProductDetail } from "@/components/pages";

// app/blog/[slug]/page.tsx
// import { Metadata } from 'next'

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string }
// }): Promise<Metadata> {
//   const post = await getBlogPost(params.slug) // fetch từ API/DB

//   return {
//     title: post.title,
//     description: post.metaDescription,
//     openGraph: {
//       title: post.title,
//       description: post.metaDescription,
//       url: `https://myblog.com/blog/${params.slug}`,
//       type: 'article',
//       publishedTime: post.publishDate,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: post.title,
//     },
//   }
// }
//
export default function ProductPage() {
  return (
    <main className="mx-auto max-w-400 w-full px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail />
    </main>
  );
}
