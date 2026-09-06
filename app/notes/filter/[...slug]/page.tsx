import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import NotesClient from "./Notes.client";

interface NotesPageProps {
  params: Promise<{ slug?: string[] }>;
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
