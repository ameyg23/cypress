import Login from '../PageObjects/LoginPage2';

describe('POM with fixture', () => {

    it('LoginTest', () => {

        cy.visit('https://opensource-demo.orangehrmlive.com/');

        cy.fixture('orangehrm').then((data) => {

            const ln = new Login();

            ln.setUserName(data.username);
            ln.setPassword(data.password);
            ln.clickSubmit();
            ln.verifyLogin();

        });

    });

});