import { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useVeiculosInfinite } from "@/hooks/useVeiculos";
import type { BuscarVeiculosParams } from "@/types/veiculos";

const hasEnv =
  Boolean(process.env.VITE_APP_BASE_URL) &&
  Boolean(process.env.VITE_APP_API_TOKEN);
const describeIfEnv = hasEnv ? describe : describe.skip;

const createWrapper = ({ children }: { children?: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describeIfEnv("🔥 useVeiculosInfinite (integração)", () => {
  it("faz paginação real da API", async () => {
    const baseParams: Omit<BuscarVeiculosParams, "page" | "perPage"> = {
      tipo: "tracked",
      filter: undefined,
    };

    const { result } = renderHook(() => useVeiculosInfinite(baseParams), {
      wrapper: createWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 20_000,
    });

    const pages = result.current.data!.pages;

    expect(pages.length).toBeGreaterThanOrEqual(1);

    expect(pages[0].content.vehicles.length).toBeGreaterThan(0);

    if (result.current.hasNextPage) {
      act(() => {
        result.current.fetchNextPage();
      });
      await waitFor(
        () => expect(result.current.data!.pages.length).toBeGreaterThan(1),
        { timeout: 20_000 }
      );
    }

    expect(result.current.hasNextPage).toBe(false);
  }, 35_000);
});
