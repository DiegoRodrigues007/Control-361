describe("Página Home (API real)", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("exibe loading e depois mostra mapa e tabela de veículos reais", () => {
    cy.contains(/Carregando mapa/i).should("be.visible");
    cy.contains(/Carregando tabela/i).should("be.visible");

    cy.contains(/Carregando mapa/i, { timeout: 20000 }).should("not.exist");
    cy.contains(/Carregando tabela/i, { timeout: 20000 }).should("not.exist");

    cy.get(".gm-style", { timeout: 10000 }).should("exist");

    cy.get(".gm-style img").its("length").should("be.gte", 1);

    cy.get("table").find("tr").its("length").should("be.gte", 2);
  });

  it('permite trocar o filtro para "outros" e recarrega a tabela', () => {
    cy.get("input[type=radio][value=outros]").check();
    cy.contains(/Carregando tabela/i, { timeout: 20000 }).should("not.exist");
    cy.get("table").should("exist");
  });

  it("permite buscar por placa e refaz a pesquisa", () => {
    cy.get('input[aria-label="Buscar por placa ou frota"]')
      .clear()
      .type("JAN1H26");
    cy.contains(/Carregando tabela/i, { timeout: 20000 }).should("not.exist");
    cy.get('input[aria-label="Buscar por placa ou frota"]').should(
      "have.value",
      "JAN1H26"
    );

    cy.get("table tr")
      .not(":first")
      .each(($row) => {
        cy.wrap($row).should("contain.text", "JAN1H26");
      });
  });
});
