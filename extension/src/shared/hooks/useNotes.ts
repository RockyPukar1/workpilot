import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesStorage } from "../utils/storage";
import type { Note } from "../types";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => notesStorage.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: (note: Omit<Note, "id">) => notesStorage.add(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: Partial<Note> }) =>
      notesStorage.update(id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => notesStorage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    notes,
    isLoading,
    addNote: addMutation.mutate,
    updateNote: updateMutation.mutate,
    deleteNote: deleteMutation.mutate,
  };
};
