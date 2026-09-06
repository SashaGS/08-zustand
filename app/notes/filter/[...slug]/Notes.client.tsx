"use client";

import css from "./Notes.module.css";
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api/api";

import Modal from "../../../../components/Modal/Modal";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import Pagination from "../../../../components/Pagination/Pagination";
import Loader from "../../../../components/Loader/Loader";

interface NotesClientProps {
  valTag: string;
}

export default function NotesClient({ valTag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  // const [tag, setTag] = useState(valTag);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModal, setisOpenModal] = useState(false);

  // useEffect(() => {
  //   if (valTag) {
  //     setTag(valTag);
  //   }
  // }, [valTag]);

  const tag = valTag;

  const {
    data: notes,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["note", search, tag, currentPage],
    queryFn: () => fetchNotes(search, tag, currentPage),
    retry: 1,
    staleTime: 5000,
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleClick = () => {
    setisOpenModal(!isOpenModal);
  };
  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);
  useEffect(() => {
    if (isError || notes?.notes.length === 0) {
      toast("Failed to load notes or no matches found. Please try again.");
    }
  }, [isError, notes]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox updateSearchQuery={updateSearchQuery} />}

        {notes && notes.notes.length > 0 && (notes.totalPages ?? 1) > 1 && (
          <Pagination
            totalPages={notes.totalPages ?? 1}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {
          <button className={css.button} onClick={handleClick}>
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
      {isOpenModal && (
        <Modal onClose={handleClick} isOpen={isOpenModal}>
          <NoteForm onClose={handleClick} />
        </Modal>
      )}

      {isSuccess && notes && <NoteList notes={notes?.notes} />}
    </div>
  );
}
