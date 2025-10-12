import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { screenshotsStorage } from "../utils/storage";
import type { Screenshot } from "../types";

export const useScreenshots = () => {
  const queryClient = useQueryClient();

  const { data: screenshots = [], isLoading } = useQuery({
    queryKey: ["screenshots"],
    queryFn: () => screenshotsStorage.getAll(),
  });

  const addMutation = useMutation({
    mutationFn: (screenshot: Omit<Screenshot, "id">) =>
      screenshotsStorage.add(screenshot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenshots"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => screenshotsStorage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenshots"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => screenshotsStorage.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenshots"] });
    },
  });

  return {
    screenshots,
    isLoading,
    addScreenshot: addMutation.mutate,
    deleteScreenshot: deleteMutation.mutate,
    clearAll: clearMutation.mutate,
  };
};
