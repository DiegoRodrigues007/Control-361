import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/SearchInput";

describe("<SearchInput />", () => {
  it("renderiza placeholder e aceita digitação", async () => {
    const onChange = jest.fn();
    render(
      <SearchInput
        placeholder="Busca"
        value=""
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    );
    const input = screen.getByPlaceholderText(/busca/i);
    await userEvent.type(input, "abc");
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
