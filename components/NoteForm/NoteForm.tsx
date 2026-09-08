"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { useId } from "react";
import { addNote } from "../../lib/api/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useNoteStore } from "../../lib/store/noteStore";

function NoteForm() {
  const queryClient = useQueryClient();
  const fieldId     = useId();
  const router      = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const { mutate } = useMutation({
    mutationFn: addNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["note"], exact: false });
      // queryClient.refetchQueries({ queryKey: ["note"], exact: false });
      clearDraft();
      router.back();
    },
    onError(error) {
      toast(`Error adding note ${error}`);
    },
  });

  async function handleSubmit(formData: FormData):Promise<void> {
    const values = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
    };
      mutate({ ...values });
  }

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form}>
      <fieldset>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <input
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
            required
            minLength={3}
            maxLength={50}
            defaultValue={draft.title}
            onChange={(e) => setDraft({ title: e.target.value })}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <textarea
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
            maxLength={500}
            defaultValue={draft.content}
            onChange={(e) => setDraft({ content: e.target.value })}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <select
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
            required
            defaultValue={draft.tag}
            onChange={(e) => setDraft({ tag: e.target.value })}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>
      </fieldset>

      <fieldset>
        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            formAction={handleSubmit}
          >
            Create note
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default NoteForm;
