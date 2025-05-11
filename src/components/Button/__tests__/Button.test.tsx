import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../index";

describe("<Button />", () => {
  const handleClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o texto e chama onClick ao ser clicado", async () => {
    render(<Button onClick={handleClick}>Clique Aqui</Button>);

    const button = screen.getByRole("button", { name: /clique aqui/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("aplica a classe de variante secondary corretamente", () => {
    render(<Button variant="secondary">Secundário</Button>);

    const button = screen.getByRole("button", { name: /secundário/i });
    expect(button).toHaveClass("border");
  });
});
