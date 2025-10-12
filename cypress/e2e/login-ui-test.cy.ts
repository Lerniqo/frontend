/// <reference types="cypress" />

describe("Login UI flow", () => {
  it("lands on landing page, navigates to login, logs in and redirects to student home", () => {
    // 1. Visit landing page (local dev) in a small/mobile viewport
    // cy.viewport("iphone-6");
    cy.visit("https://main.ddwyki3l42m0e.amplifyapp.com");

    // 2. Open the mobile menu (nav items are hidden on small screens)
    cy.get('button[aria-label="Toggle menu"]').should("be.visible").click();

    // 3. Wait for mobile menu to open, then click Login link
    cy.get('a[href="/login"]').should("be.visible");
    cy.get('a[href="/login"]').first().click();

    // 3. Fill email
    cy.get("#email").should("be.visible").clear().type("student@gmail.com");

    // 4. Fill password
    cy.get("#password").should("be.visible").clear().type("Password123&");

    // 5. Click Sign In button
    cy.contains("button", /Sign In|Signing In.../i).click();

    // 6. Assert redirected to student home (dashboard)
    // The app redirects to /dashboard on successful login per AuthContext
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
  });

  it('login-test', function() {
         cy.visit("https://main.ddwyki3l42m0e.amplifyapp.com/login");
  });
});

it('log-in-test', function() {
       cy.visit("https://main.ddwyki3l42m0e.amplifyapp.com");
       cy.get('button.transition-colors svg.h-6.w-6').click();
       cy.get('a.border').click();
       cy.get('#email').click();
       cy.get('#email').type('student@gmail.com');
       cy.get('#password').click();
       cy.get('#password').type('Password123&');
       cy.get('button.text-gray-400 svg.h-4').click();
       cy.get('button.flex').click();
       cy.get('div.text-xs.border').click();
});
