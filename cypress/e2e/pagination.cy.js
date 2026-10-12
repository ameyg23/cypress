describe('Handle Tables', () => {

    beforeEach('Login', () => {

        cy.visit("http://localhost:8080/admin/");

        cy.get("#input-username").type("demo");
        cy.get("#input-password").type("demo");
        cy.get("button[type='submit']").click();

        //cy.get(".btn-close").click();

        // Customers
        cy.get("#menu-customer>a").click();
        cy.get("#menu-customer>ul>li:first-child").click();

    });


    // 1. Check number of rows and columns
    it.skip('Check Number Rows & Columns', () => {

        cy.get("table[class='table table-bordered table-hover']>tbody>tr")
            .should('have.length', 12);

        cy.get("table[class='table table-bordered table-hover']>thead>tr>td")
            .should('have.length', 8);

    });


    // 2. Check cell data from a specific row and column
    it('Check cell data from specific row & Column', () => {

        cy.get("table[class='table table-bordered table-hover']>tbody>tr:nth-child(5)>td:nth-child(3)")
            .contains("sqaVbA@gmail.com");

    });


    // 3. Read all rows and columns from the first page
    it('Read all the rows & Columns data in the first page', () => {

        cy.get("table[class='table table-bordered table-hover']>tbody>tr")
            .each(($row, index, $rows) => {

                cy.wrap($row).within(() => {

                    cy.get("td").each(($col, index, $cols) => {

                        cy.log($col.text());

                    });

                });

            });

    });


    // 4. Pagination
    it.only('Pagination', () => {

        // Get total number of pages
        cy.get(".col-sm-6.text-end").then((e) => {

            let mytext = e.text();

            

            let totalPages = mytext.substring(
                mytext.indexOf("(") + 1,
                mytext.indexOf("Pages") - 1
            );

            totalPages = Number(totalPages);

            cy.log("Total number of pages ===> " + totalPages);


            // Loop through every page
            for (let p = 1; p <= totalPages; p++) {

                cy.log("Active page is ===> " + p);

                // Click page number
                cy.get("ul[class='pagination']>li:nth-child(" + p + ")")
                    .click();

                cy.wait(3000);


                // Get all rows from current page
                cy.get("table[class='table table-bordered table-hover']>tbody>tr")
                    .each(($row, index, $rows) => {

                        cy.wrap($row).within(() => {

                            // Get Email column
                            cy.get("td:nth-child(3)").then((e) => {

                                cy.log(e.text());

                            });

                        });

                    });

            }

        });

    });

});