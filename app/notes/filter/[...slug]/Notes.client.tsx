"use client";

import css from "./Notes.module.css";
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { fetchNotes } from "@/lib/api/api";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import Loader from "../../../../components/Loader/Loader";

interface NotesClientProps {
  valTag: string;
}

export default function NotesClient({ valTag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tag = valTag;

  const {
    data: notes,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["notes", search, tag, currentPage],
    queryFn: () => fetchNotes(search, tag, currentPage),
    retry: 1,
    staleTime: 5000,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const onSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notes. Please try again.", {
        id: "notes-error",
      });
    } else if (isSuccess && notes?.notes.length === 0) {
      toast("No notes found. Please try a different search or tag.", {
        id: "notes-empty",
      });
    }
  }, [isError, isSuccess, notes]);

  const router = useRouter();

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onSearchChange={onSearchChange} />}

        {
          <button
            className={css.button}
            onClick={() => router.push("/notes/action/create")}
          >
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #713200",
            background: "#d67719cb",
          },
        }}
      />
      {isError && (
        <p className={css.error}>Failed to load notes. Please try again.</p>
      )}
      {isSuccess && notes?.notes.length === 0 && (
        <p className={css.noNotes}>
          No notes found. Please try a different search or tag.
        </p>
      )}

      {isSuccess && notes && <NoteList notes={notes?.notes} />}
      {notes && (notes.totalPages ?? 1) > 1 && (
        <Pagination
          totalPages={notes.totalPages ?? 1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
