import Login from '../PageObjects/LoginPage';

describe('POM', () => {

    it('LoginTest', () => {

        cy.visit('https://opensource-demo.orangehrmlive.com/');

        const ln = new Login();

        ln.setUserName('Admin');
        ln.setPassword('admin123');
        ln.clickSubmit();
        ln.verifyLogin();

    });

});