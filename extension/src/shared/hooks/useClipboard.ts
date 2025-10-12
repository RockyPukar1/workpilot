import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clipboardStorage } from "../utils/storage";
import type { ClipboardItem } from "../types";

export const useClipboard = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["clipboard"],
    queryFn: () => clipboardStorage.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: (item: Omit<ClipboardItem, "id">) => clipboardStorage.add(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clipboard"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: number;
      changes: Partial<ClipboardItem>;
    }) => clipboardStorage.update(id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clipboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clipboardStorage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clipboard"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clipboardStorage.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clipboard"] });
    },
  });

  return {
    items,
    isLoading,
    addItem: addMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
    clearAll: clearMutation.mutate,
  };
};
