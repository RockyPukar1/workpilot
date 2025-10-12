import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesStorage } from "../utils/storage";
import type { EmailTemplate } from "../types";

export const useTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesStorage.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: (template: Omit<EmailTemplate, "id">) =>
      templatesStorage.add(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      changes,
    }: {
      id: number;
      changes: Partial<EmailTemplate>;
    }) => templatesStorage.update(id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => templatesStorage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  return {
    templates,
    isLoading,
    addTemplate: addMutation.mutate,
    updateTemplate: updateMutation.mutate,
    deleteTemplate: deleteMutation.mutate,
  };
};
