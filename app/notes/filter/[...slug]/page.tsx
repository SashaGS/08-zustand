import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import NotesClient from "./Notes.client";
import {Metadata} from "next";

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const slugArray = (await params).slug || [];
  const tag = slugArray[0] || "all";
  return {
    title: `Notes - ${tag}`,
    description: `Notes filtered by tag: ${tag}`,   
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Notes filtered by tag: ${tag}`,
      url: `/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes filtered by tag: ${tag}`,
        },
      ],
    },
  };
} 

export default async function Notes({ params }: NotesPageProps) {
  const queryClient = new QueryClient();
  const slugArray = (await params).slug || [];
  const tag = slugArray[0] || "all";

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: () => fetchNotes("", tag, 1),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient valTag={tag} />
      </HydrationBoundary>
    </>
  );
}
