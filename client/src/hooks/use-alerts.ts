import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useAlerts() {
  return useQuery({
    queryKey: [api.alerts.list.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return api.alerts.list.responses[200].parse(await res.json());
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.alerts.resolve.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to resolve alert");
      return api.alerts.resolve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.alerts.list.path] });
    },
  });
}
