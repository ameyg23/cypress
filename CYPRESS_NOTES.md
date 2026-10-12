# Cypress Study Notes

My personal notes for learning and revising Cypress. Written so that I can come back after a few days and understand everything quickly.

**How to read this file**

1. Part 1 – What Cypress is and why we use it (theory from scratch)
2. Part 2 – Directory structure of this project
3. Part 3 – File-by-file notes (what each file has, which concept it uses, why it's useful, how it's implemented)
4. Part 4 – Cypress commands cheat sheet (what each command does)
5. Part 5 – Common mistakes / gotchas I noticed in my own code

---

# Part 1 – Cypress from scratch

## 1.1 What is Cypress?

Cypress is a **test automation tool** for **web applications**. Instead of a human opening a website, typing a username, clicking Login and checking "did the dashboard appear?", we write a small JavaScript program that does all this automatically, and Cypress runs it in a real browser (Chrome, Edge, Firefox, Electron).

Simple example from my own code:

```js
cy.visit("https://www.saucedemo.com/")      // open the site
cy.title().should('eq','Swag Labs')         // check the page title is "Swag Labs"
```

That's a complete automated test.

## 1.2 Why do we use it?

| Reason | Explanation in simple words |
|---|---|
| **Saves time** | Re-testing 100 pages by hand after every code change is boring and slow. A script does it in minutes. |
| **Fewer human mistakes** | A script checks the same thing the same way every time. |
| **Runs inside the browser** | Cypress runs in the same run-loop as the app, so it can see everything happening (network calls, DOM, timers). This makes it fast and gives very accurate results. |
| **Automatic waiting** | Most tools need "sleep 5 seconds" everywhere. Cypress automatically waits (up to 4 seconds by default) for an element to appear, be visible and be clickable. This removes most flaky tests. |
| **Time-travel debugging** | In the Cypress runner, you can hover over each step in the left panel and see a snapshot of how the page looked at that moment. |
| **Easy setup** | `npm install cypress` and you are ready. No separate drivers to download (unlike Selenium). |
| **Great error messages** | Failures tell you exactly what was expected and what happened, with screenshots and videos. |
| **Language is JavaScript** | Most web developers already know it. |

## 1.3 Cypress vs Selenium (quick view)

- **Selenium**: sits *outside* the browser and sends commands to it through a driver. Supports many languages (Java, Python, C#...). Needs explicit waits. Slower.
- **Cypress**: runs *inside* the browser. Only JavaScript/TypeScript. Auto-waits. Faster and easier to debug. Limitations: does not natively support multiple browser tabs/windows, and is limited to one origin (domain) per test in the old days (now `cy.origin()` helps).

## 1.4 Types of testing Cypress does

- **E2E (End-to-End) testing** – tests the whole application like a real user. *(This is what this project uses – see the `e2e` folder.)*
- **Component testing** – tests a single UI component (React, Vue, Angular) in isolation.
- **API testing** – with `cy.request()` we can hit backend APIs directly.

## 1.5 Key building blocks (concepts I must remember)

### a) Mocha structure – `describe`, `it`
Cypress uses **Mocha** for structuring tests.
- `describe('name', () => {...})` – a **test suite** (a group of related tests).
- `it('name', () => {...})` – one **test case**.
- Hooks: `before`, `after`, `beforeEach`, `afterEach` – run setup/cleanup code.
- `it.only` – run **only** this test. `it.skip` – **skip** this test.

### b) Chai assertions – `should`, `expect`, `assert`
An **assertion** = a check. "I expect the title to be X." If wrong, the test fails.
- **Implicit** assertions (`.should()` / `.and()`) – chained on a Cypress command. Cypress retries them automatically until they pass or time out.
- **Explicit** assertions (`expect()` / `assert()`) – used inside `.then()` blocks when we have a normal JavaScript value.

### c) Selectors / Locators
A **locator** tells Cypress *which element* on the page to work with.
- **CSS selectors** (default): `cy.get("#id")`, `cy.get(".class")`, `cy.get("input[name='x']")`
- **XPath** (needs plugin `cypress-xpath`): `cy.xpath("//input[@name='search']")`
- **Text based**: `cy.contains("Login")`

### d) Chaining and the Command Queue (very important!)
Cypress commands are **asynchronous**, but they look synchronous. Each `cy.something()` is *queued*, and Cypress runs them one after another. They are **not** executed instantly at the line where you write them.

Because of this:
- You **cannot** do `let x = cy.get('a')` and use `x` as a normal value.
- To get the actual value, use `.then((value) => {...})`.
- Commands are chained: `cy.get('#a').type('hi').should('have.value','hi')`

### e) Retry-ability
Commands like `cy.get()` and assertions like `.should()` **keep retrying** until they succeed or the timeout (default 4 s) is reached. This is why we rarely need `cy.wait()`.

### f) `cy.wrap()`
Takes a normal JS value/jQuery object and turns it back into a Cypress "chainable" so we can use `.click()`, `.should()` etc. on it. Needed after `.each()` or `.then()` because inside them we get plain jQuery elements (`$el`).

### g) Fixtures (test data files)
A **fixture** is a file (usually JSON) in `cypress/fixtures` holding test data. We load it with `cy.fixture('name')`. This keeps data separate from test logic.

### h) Data-driven testing
Running the **same test with many sets of data** (e.g. three different logins). Done by putting data in a JSON array and looping over it.

### i) Custom commands
We can create our *own* `cy.something()` commands in `cypress/support/commands.js` using `Cypress.Commands.add(...)`. Great for repeated logic (login, iframe handling).

### j) Plugins
Extra npm packages that add features: `cypress-xpath`, `cypress-iframe`, `cypress-file-upload`, `@4tw/cypress-drag-drop`.

### k) Config file – `cypress.config.js`
Central place to configure Cypress: base URL, timeouts, viewport, browser-launch tweaks, node events, etc.

## 1.6 How to install and run

```bash
npm init -y                 # create package.json
npm install cypress --save-dev   # install Cypress
npx cypress open            # opens the interactive Test Runner (GUI)
npx cypress run             # runs all tests headlessly (no browser window) in terminal
npx cypress run --spec "cypress/e2e/alerts.cy.js"   # run one file
npx cypress run --browser chrome                     # choose browser
npx cypress run --headed                             # run with visible browser
```

- **Open mode** (`cypress open`) – for writing/debugging tests, interactive.
- **Run mode** (`cypress run`) – for CI/CD pipelines, headless, records videos/screenshots on failures.

---

# Part 2 – Directory structure of this project

```
Cypress/
│
├── cypress/                       <- everything Cypress related lives here
│   ├── e2e/                       <- the actual TEST FILES (*.cy.js)
│   │   ├── alerts.cy.js
│   │   ├── checkBoxes.cy.js
│   │   ├── cssSelectors.cy.js
│   │   ├── DataDriven.cy.js
│   │   ├── dropdowns.cy.js
│   │   ├── explicitAssertions_BDD_Style.cy.js
│   │   ├── explicitAssertions_TDD_Style.cy.js
│   │   ├── fileUploads.cy.js
│   │   ├── fixtures.cy.js
│   │   ├── handlingWindows.cy.js
│   │   ├── hooks&tags.cy.js
│   │   ├── iFrames.cy.js
│   │   ├── implicitAssertions.cy.js
│   │   ├── MouseElements.cy.js
│   │   ├── myFirstTest.cy.js
│   │   ├── paginition.cy.js
│   │   ├── radioButtons.cy.js
│   │   └── xPath.cy.js
│   │
│   ├── fixtures/                  <- TEST DATA (json) and files for upload
│   │   ├── example.json
│   │   ├── orangehrm.json
│   │   ├── orangehrm2.json
│   │   ├── t2.pdf
│   │   └── test1.pdf
│   │
│   └── support/                   <- code that loads BEFORE every test file
│       ├── commands.js            <- custom commands + plugin imports
│       └── e2e.js                 <- global setup, imports commands.js
│
├── cypress.config.js              <- Cypress configuration
├── package.json                   <- project info + list of npm dependencies
├── package-lock.json              <- exact versions of installed packages (auto-generated)
├── image.png                      <- screenshot of the Cypress runner showing a JS alert
├── node_modules/                  <- downloaded packages (NOT pushed to GitHub)
└── CYPRESS_NOTES.md               <- this notes file
```

### What each folder means (short)

| Folder / File | Purpose |
|---|---|
| `cypress/e2e` | Where test files live. Cypress picks up any file matching `*.cy.js` here. |
| `cypress/fixtures` | Static data for tests (JSON, PDFs, images...). Loaded with `cy.fixture()` or `attachFile()`. |
| `cypress/support` | Runs automatically before every spec. Put reusable commands and global config here. |
| `cypress.config.js` | Settings for Cypress itself. |
| `package.json` | Lists dependencies so that anyone can run `npm install` and get the same setup. |
| `node_modules` | Where npm installs packages. Huge. Never commit it – it's recreated by `npm install`. |

### Dependencies (from package.json)

| Package | What it does |
|---|---|
| `cypress` | The main tool. |
| `cypress-xpath` | Adds `cy.xpath()`. |
| `cypress-iframe` | Adds `cy.frameLoaded()` and `cy.iframe()` for iframes. |
| `cypress-file-upload` | Adds `.attachFile()` for uploading files. |
| `@4tw/cypress-drag-drop` | Adds `.drag()` for drag-and-drop. |

---

# Part 3 – File-by-file notes

> Note: In many files I used `it.only` / `it.skip`. That's why some tests are "greyed out". I explain this in each file.
> Also, most test files use public practice websites (the-internet.herokuapp.com, OrangeHRM demo, etc.). If a site changes or goes down, the test may fail even though the code is fine.

---

## 3.1 `cypress.config.js` – Cypress configuration

**What it contains**
```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--enable-features=DeprecateUnload');
        }
        return launchOptions;
      });
    },
  },
});
```

**Concepts used**
- `defineConfig` – helper that gives auto-complete and validates config.
- `e2e` block – settings specific to end-to-end tests.
- `setupNodeEvents` – a function that runs in **Node.js** (not in the browser). Used for plugins/events.
- `before:browser:launch` event – lets us change how the browser is started (add flags).

**What it does here (in plain words)**
Newer Chrome versions (153+) turn off the browser `unload` event in the Cypress test profile. Because of that, Cypress was not able to auto-close JavaScript alert/confirm popups (the page would hang with the popup showing – exactly what `image.png` shows). The fix is to start Chromium-based browsers with the flag `--enable-features=DeprecateUnload`. The comment references Cypress GitHub issue #34856.

**Why it's useful**
Without it, `alerts.cy.js` would get stuck on the alert. It shows how to customise browser launch arguments – the same trick can be used for things like disabling web security, setting window size, etc.

**Other things I can put in this file later**
```js
e2e: {
  baseUrl: "https://example.com",     // then cy.visit("/login") works
  defaultCommandTimeout: 8000,        // default wait 4s -> 8s
  viewportWidth: 1280, viewportHeight: 720,
  video: false,
  retries: 1,                          // retry failed tests once
}
```

---

## 3.2 `package.json` and `package-lock.json`

**package.json** – describes the project: name, author, and **dependencies**. `dependencies` are needed to run; `devDependencies` are only for development/testing (the plugins here). Anyone who clones the repo runs `npm install` and gets the same packages.

**package-lock.json** – auto-generated. Pins the *exact* version of every package (and sub-package). Guarantees identical installs across machines. Never edit by hand.

**Tip**: the `scripts` section currently has the default `test` placeholder. A useful improvement:
```json
"scripts": {
  "cy:open": "cypress open",
  "cy:run": "cypress run"
}
```
Then run `npm run cy:open`.

---

## 3.3 `image.png`

A screenshot of the Cypress Test Runner while running `alerts.cy.js`: the left panel shows the commands (`visit`, `get`, `click`) and a browser alert "I am a JS Alert" with the OK button. It's useful as a visual reminder of what the runner looks like and what the alert problem looked like. It's not used by any test.

---

## 3.4 `cypress/support/e2e.js` – global support file

**What it contains**
```js
import './commands'
require('cypress-xpath')
```

**Concepts used**
- Support file – Cypress **automatically loads this before every test file**.
- `import './commands'` – pulls in our custom commands file so that they are available in all tests.
- `require('cypress-xpath')` – activates the XPath plugin globally, so `cy.xpath()` works in any test without importing it each time.

**Why it's useful**
One place to register everything global. If I add a new plugin that should work everywhere, I `require` it here.

---

## 3.5 `cypress/support/commands.js` – custom commands

**What it contains**
1. Lots of commented template lines (Cypress default) showing how to create parent, child, dual commands and how to overwrite a command.
2. `/// <reference types='cypress' />` and `/// <reference types='cypress-xpath' />` – these special comments give VS Code **auto-complete / IntelliSense** for `cy.` and `cy.xpath`.
3. **A custom command `getIframe`:**
```js
Cypress.Commands.add('getIframe', (iframe) => {
    return cy.get(iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap);
});
```
4. `import 'cypress-iframe';` – activates the iframe plugin.

**Concepts used**
- `Cypress.Commands.add(name, fn)` – registers a new `cy.name()` command.
- `.its('0.contentDocument.body')` – `its` reads a property. `0` = first element of the jQuery list, `.contentDocument` = the document inside the iframe, `.body` = its body.
- `.should('be.visible')` – retry until the iframe body is loaded/visible (prevents grabbing an empty iframe too early).
- `.then(cy.wrap)` – wraps the plain DOM body so we can chain Cypress commands (`.clear()`, `.type()`) on it.

**Why it's useful**
Iframes are a separate document, so `cy.get()` can't see inside them. This command hides the ugly code behind a clean call: `cy.getIframe('#mce_0_ifr')`. Write once, use in many tests (**reusability**, DRY principle).

**Command types (from the template comments)**
- **Parent command** – starts a chain (`cy.login()`).
- **Child command** – needs a previous subject (`cy.get('x').drag()`), uses `prevSubject: 'element'`.
- **Dual command** – can work both ways, `prevSubject: 'optional'`.
- **Overwrite** – change the behaviour of an existing command with `Cypress.Commands.overwrite()`.

---

## 3.6 `cypress/fixtures/` – test data files

### `example.json`
Default file created by Cypress with sample name/email/body. Just a demo of what a fixture looks like. Not used by my tests.

### `orangehrm.json`
```json
{ "username": "Admin", "password": "admin123", "expected": "manda user" }
```
A **single object** with login credentials and the expected name to see after login. Used in `fixtures.cy.js`.

### `orangehrm2.json`
An **array of 3 objects** – one valid login and two invalid ones (wrong username / wrong password), each with an `expected` message (name or "Invalid credentials"). Used in `DataDriven.cy.js`.

### `test1.pdf` and `t2.pdf`
Sample PDF files used as upload files in `fileUploads.cy.js`. `attachFile('test1.pdf')` automatically looks for the file in the fixtures folder.

**Why fixtures are beneficial**
- Test data is **separated** from test code. Change the data without touching tests.
- Same data reused across tests.
- Makes data-driven testing easy.

---

## 3.7 `cypress/e2e/myFirstTest.cy.js` – my first test

**Contains:** two tests that open https://www.saucedemo.com/ and check the title.

```js
it('Verify positive title', ()=>{
    cy.visit("https://www.saucedemo.com/")
    cy.title().should('eq','Swag Labs')       // passes
})
it('verify title negative case', ()=>{
    cy.visit("https://www.saucedemo.com/")
    cy.title().should('eq',"Sauce demo")      // fails on purpose
})
```

**Concepts:** `describe`, `it`, `cy.visit`, `cy.title`, `.should('eq', ...)`.

**Why useful:** the simplest possible example. The second test is a **negative test** – it is *supposed* to fail, so I can see what a failure looks like in the runner (expected vs actual shown in red).

---

## 3.8 `cypress/e2e/cssSelectors.cy.js` – CSS locators

**Contains:** opens the TutorialsNinja demo shop, types "MacBook" into the search box, clicks the search button.

```js
cy.get("[name='search']").type("MacBook")
cy.get("button[class='btn btn-default btn-lg']").click()
```

**Concepts:** CSS selectors. The comment block in the file is a cheat-sheet:

| Type | Syntax | Example |
|---|---|---|
| tag + id | `tag#id` | `input#username` |
| tag + class | `tag.class` | `button.btn` |
| tag + attribute | `tag[attr='value']` | `input[name='search']` |
| tag + class + attribute | `tag.class[attr='value']` | `button.btn[type='submit']` |
| attribute only | `[attr='value']` | `[name='search']` |

**Why useful:** CSS selectors are fast, readable and the default for `cy.get()`. Use `#` for id, `.` for class.

---

## 3.9 `cypress/e2e/xPath.cy.js` – XPath locators

**Contains:** the same search scenario as above but using XPath.

```js
cy.xpath("//input[@name='search']").type("MacBook")
cy.xpath("//button[@class='btn btn-default btn-lg']").click()
```

**Concepts:** XPath (`//tag[@attribute='value']`), plugin `cypress-xpath` (activated in `support/e2e.js`).

**Why useful:** XPath can do things CSS cannot, like finding an element by its **text** (`//a[text()='Login']`) or going **up** to a parent (`/..`). Cypress doesn't support XPath natively, hence the plugin.

**CSS vs XPath – when to choose**
- CSS: simpler, faster – use first.
- XPath: when I need text matching or parent/sibling navigation.

---

## 3.10 `cypress/e2e/implicitAssertions.cy.js` – implicit assertions

**Contains:** visits OrangeHRM login page; most examples are commented out (kept as reference). Active part: types "Admin" in the username box and checks its value.

```js
cy.get("input[placeholder='Username']").type("Admin")
cy.get("input[placeholder='Username']").should('have.value', 'Admin')
```

**Commented examples worth remembering**
```js
cy.url().should('include','orangehrmlive.com')
cy.url().should('include','orangehrmlive.com').and('eq','https://...').and('contain','orangehrmlive.com')  // chaining with .and()
cy.title().should('include','Orange').and('contain','HRM')
cy.get('.logo').should('be.visible').and('exist')
cy.xpath('//a').should('have.length', 13)       // count elements
```

**Concepts:** implicit assertions – `.should()` and `.and()` (`and` is just an alias of `should` for readability). They are attached directly to a command and **auto-retry**.

**Why useful:** short, readable, and retry-able. This is the preferred way to check things on the page.

---

## 3.11 `cypress/e2e/explicitAssertions_BDD_Style.cy.js`

**Contains:** logs in to OrangeHRM, reads the displayed user name and compares with expected "Automation QE".

```js
cy.get(".oxd-userdropdown-name").then((x) => {
    let actName = x.text()
    expect(actName).to.equal(expName)
})
```

**Concepts**
- **Explicit assertion** – we first extract the value into a normal JS variable, then assert it ourselves.
- `.then((x) => {...})` – x is a jQuery object; `.text()` gets its text.
- **BDD style** – `expect(actual).to.equal(expected)` reads like English ("Behaviour Driven Development"). Negative form: `.to.not.equal()`.

**Why useful:** use explicit assertions when `.should()` isn't flexible enough (compare two values from the page, do calculations, use `if` logic).

> ⚠️ Possible issue: the actual OrangeHRM demo user name is random/changing, and `fixtures` file expects "manda user", so tests may fail because the demo site data changes, not because of code.

---

## 3.12 `cypress/e2e/explicitAssertions_TDD_Style.cy.js`

**Contains:** identical scenario to the BDD file, but uses the **TDD** style:

```js
assert.equal(actName, expName)
// assert.notEqual(actName, expName)
```

**Concepts:** `assert.equal(actual, expected)` – the classic, function-style assertion ("Test Driven Development" style).

**BDD vs TDD cheat-sheet**

| BDD (`expect`) | TDD (`assert`) |
|---|---|
| `expect(a).to.equal(b)` | `assert.equal(a, b)` |
| `expect(a).to.not.equal(b)` | `assert.notEqual(a, b)` |
| `expect(a).to.be.true` | `assert.isTrue(a)` |
| `expect(arr).to.have.length(3)` | `assert.lengthOf(arr, 3)` |

Both do the same job. Choose whichever style you like and be consistent.

---

## 3.13 `cypress/e2e/hooks&tags.cy.js` – hooks

**Contains:** four hooks and three tests, only logging messages (`cy.log`) to show the order of execution.

```
before      -> runs ONCE before all tests ("Launch app")
beforeEach  -> runs before EVERY test ("Login")
  it(...)   -> the test
afterEach   -> runs after EVERY test ("Logout")
after       -> runs ONCE after all tests ("Close app")
```

With 3 tests the order is:
`before → (beforeEach → test1 → afterEach) → (beforeEach → test2 → afterEach) → (beforeEach → test3 → afterEach) → after`

**Concepts:** Mocha hooks, `cy.log()` (prints a message in the runner's command log).

**Why useful:** avoids repeating setup (login, open URL) in every test and guarantees cleanup (logout, clear data).

**About "tags":** the filename says tags, but this file only shows hooks. Tags are labels like `@smoke`, `@regression` used with the `@cypress/grep` plugin to run groups of tests. Also `it.only` and `it.skip` are a simple built-in way to select tests.

---

## 3.14 `cypress/e2e/fixtures.cy.js` – using one fixture file

**Contains:** a commented-out first version, and an active second version.

Active version:
```js
let userdata;
before(() => {
  cy.fixture('orangehrm').then((data) => { userdata = data; });
});

it('FixturesDemoTest', () => {
  cy.visit('https://opensource-demo.orangehrmlive.com/');
  cy.get("input[placeholder='Username']").type(userdata.username);
  cy.get("input[placeholder='Password']").type(userdata.password);
  cy.get("button[type='submit']").click();
  cy.get(".oxd-userdropdown-name").should('have.text', userdata.expected);
});
```

**Concepts:** `cy.fixture()`, `before()` hook, a variable (`userdata`) declared outside so every test in the suite can use it.

**Two approaches (why both are in the file)**
1. **Inside the test** (commented version) – load the fixture right inside `it`. Works for one test.
2. **In a `before` hook** (active version) – load once, store in a variable, reuse in many tests. Better for multiple tests.

**Why useful:** the credentials come from `orangehrm.json`, not hard-coded. If the password changes, edit one JSON file.

---

## 3.15 `cypress/e2e/DataDriven.cy.js` – data-driven test

**Contains:** one test that loops over the three records of `orangehrm2.json` and tries to login with each.

```js
cy.fixture('orangehrm2').then((data) => {
  data.forEach((userdata) => {
    cy.visit(login url);
    type username; type password; click submit;
    if (valid credentials) {
        check name displayed matches expected; open user menu; click Logout;
    } else {
        check error text equals "Invalid credentials";
    }
  });
});
```

**Concepts**
- **Data-driven testing** – one test, many data sets.
- `forEach` loop over the JSON array.
- `if / else` inside a test to handle positive and negative scenarios.
- `.contains('Logout').click()` – find the element with that text and click.

**Why useful:** with 3 lines of data I test 3 scenarios. To add a 4th, I only add a JSON object – no code change.

**Improvement idea:** wrap the logic in `it()` per record (generate multiple `it` blocks in a loop) so each dataset shows as a separate test in the report.

---

## 3.16 `cypress/e2e/alerts.cy.js` – browser alerts

**Contains:** five tests on https://the-internet.herokuapp.com. Currently the first test has `it.only`, so only that one runs.

| # | Test | What it demonstrates |
|---|---|---|
| 1 | JS alert | `cy.on('window:alert', cb)` listens for the alert and checks its text. Cypress **auto-clicks OK**. |
| 2 | JS confirm – OK | `cy.on('window:confirm', cb)` + `return true` → OK pressed. |
| 3 | JS confirm – Cancel | `cy.on('window:confirm', cb)` + `return false` → Cancel pressed. |
| 4 | JS prompt | A prompt can't be handled by an event, so we **stub** it: `cy.window().then(win => cy.stub(win,'prompt').returns('welcome'))`. |
| 5 | Authenticated alert | Basic-auth popup – we send credentials with the URL: `cy.visit(url, { auth: { username, password } })`. |

**Concepts**
- **Events** (`cy.on`) – listening to things the browser does.
- **Stubbing** (`cy.stub`) – replacing a function with a fake one that returns what we want.
- Always set up the listener **before** the click that triggers the alert.
- `.should('have.text', ...)` – exact text match on the result element `#result`.

**Why useful:** alerts are native browser UI and are not part of the page DOM, so normal `cy.get` can't touch them. These are the techniques to handle each kind.

---

## 3.17 `cypress/e2e/dropdowns.cy.js` – dropdowns

**Contains:** four types of dropdown. The first three are `it.skip`, the last runs.

1. **Normal `<select>` dropdown** (skipped)
   ```js
   cy.get('.action-select').select('oranges').should('have.value','fr-oranges')
   ```
   `.select()` works with visible text or value.
2. **Bootstrap/select2 dropdown (no real `<select>`)** (skipped) – click the box, type in the search field, press Enter:
   ```js
   cy.get('#select2-billing_country-container').click()
   cy.get('.select2-search__field').type('Japan').type('{enter}')
   ```
3. **Auto-suggest dropdown** (skipped) – type "Delhi" in Wikipedia search, then `.contains('Delhi Metro').click()` on the suggestion list.
4. **Dynamic dropdown (Google search)** – type, `cy.wait(3000)` for suggestions, check count with `should('have.length', 12)`, then `.each()` through the suggestions and click the one whose text matches:
   ```js
   cy.get('div.wM6W7d>span').each(($el, index, $list) => {
       if ($el.text() === 'cypress automation tutorial') { cy.wrap($el).click() }
   })
   ```

**Concepts:** `.select()`, `{enter}` special key, `.each()`, `cy.wrap()`, `cy.wait()`, `.contains()`.

**Why useful:** dropdowns come in many flavours; this file is a mini-catalog.

> ⚠️ Google's CSS class names (`#ti6dpd`, `.wM6W7d`) are auto-generated and change often, and Google may show captchas to automation. This test is fragile. Prefer stable practice sites.

---

## 3.18 `cypress/e2e/checkBoxes.cy.js` – check boxes

**Contains:** one test on qaplayground.com. Active step: select **all** checkboxes named `skills`. Others are commented as reference.

```js
cy.on('uncaught:exception', () => false)     // ignore the app's own JS error
cy.get("input#skill-playwright").should('be.visible')
cy.get("input[name='skills']").check().should('be.checked')   // check all
// .check() single, .uncheck(), .first().check(), .last().check()
```

**Concepts**
- `.check()` / `.uncheck()` – tick/untick (safe: won't untick if already ticked).
- `.should('be.checked')`, `.should('not.be.checked')`.
- `.first()`, `.last()` – pick from a group.
- `cy.on('uncaught:exception', () => false)` – tells Cypress **not to fail** the test when the *website itself* throws a JS error (here a React hydration error unrelated to our test).
- `/// <reference types="cypress" />` – IntelliSense.

**Why useful:** one selector that matches many elements lets us check all in one line.

---

## 3.19 `cypress/e2e/radioButtons.cy.js` – radio buttons

**Contains:** selects the "business" plan radio and asserts "pro" isn't selected.

```js
cy.get("input#radio-plan-business").check().should('be.checked')
cy.get("input#radio-plan-pro").should('not.be.checked')
```

**Concepts:** `.check()` also works for radios; only one in a group can be checked, so selecting one deselects the others – we verify that with `not.be.checked`.

**Note:** `.uncheck()` doesn't work on radio buttons (only checkboxes).

---

## 3.20 `cypress/e2e/fileUploads.cy.js` – file upload

**Contains:** five tests using plugin `cypress-file-upload` (imported at the top). Four are `it.skip`; the active one is `it.only` (Shadow DOM).

| Test | Technique |
|---|---|
| Single file | `cy.get('#file-upload').attachFile('test1.pdf')` then click Upload |
| Rename | `attachFile({ filePath:'test1.pdf', fileName:'myfile.pdf' })` – uploads under a different name |
| Drag & drop | `attachFile('test1.pdf', { subjectType: 'drag-n-drop' })` |
| Multiple files | `attachFile(['test1.pdf','t2.pdf'])` – pass an array |
| Shadow DOM | `cy.get('.smart-browse-input', { includeShadowDom: true }).attachFile(...)` |

**Concepts**
- Files come from `cypress/fixtures`.
- **Shadow DOM** – a hidden mini-DOM inside a component. Normal `cy.get` can't enter it; `{ includeShadowDom: true }` allows it.
- `cy.wait(5000)` – hard wait (OK for learning, avoid in real projects).
- Since Cypress 9.3, `.selectFile()` is built-in and can replace this plugin.

**Why useful:** uploading is a very common requirement; covers all common variants.

---

## 3.21 `cypress/e2e/handlingWindows.cy.js` – new tabs/windows

**Contains:** two approaches. (Approach 1 is skipped.)

Problem: Cypress **can't switch to a new browser tab**. The trick is to make the link open in the *same* tab.

- **Approach 1 – remove `target` attribute:**
  ```js
  cy.get('.example>a').invoke('removeAttr','target').click()
  ```
  `target="_blank"` makes a link open in a new tab. Remove it and the link opens in the same tab.
- **Approach 2 – read the `href` and visit it:**
  ```js
  cy.get('.example>a').then((e)=>{ let url = e.prop('href'); cy.visit(url) })
  ```
  Works when the new page is on the **same domain**.

Both then verify with `cy.url().should('include', ...)` and use `cy.go('back')` to go back.

**Concepts:** `.invoke()`, `.prop()`, `.then()`, `cy.url()`, `cy.go()`.

**Why useful:** the standard workaround for Cypress's single-tab limitation.

---

## 3.22 `cypress/e2e/iFrames.cy.js` – iframes

**Contains:** the same scenario (type text into a TinyMCE editor inside an iframe and click Bold) done with **three approaches**.

1. **Directly via `contentDocument`**
   ```js
   cy.get('#mce_0_ifr').its('0.contentDocument.body').should('be.visible').then(cy.wrap)
   ```
2. **Custom command** `cy.getIframe('#mce_0_ifr')` (defined in `support/commands.js`).
3. **Plugin `cypress-iframe`**
   ```js
   cy.frameLoaded('#mce_0_ifr')
   cy.iframe('#mce_0_ifr').clear().type('Welcome {cmd+a}')
   ```

**Concepts:** iframe = a web page embedded in another; Cypress needs to grab the iframe's `body` explicitly. Special key `{cmd+a}` = Select all (on Windows use `{ctrl+a}`; `{cmd}` is the Mac key).

**Why useful:** shows progression from raw code → reusable command → plugin. The plugin approach is the cleanest.

---

## 3.23 `cypress/e2e/MouseElements.cy.js` – mouse operations

**Contains:** five tests; four are skipped, `it.only` runs "Scrolling Page". Uses `require('@4tw/cypress-drag-drop')`.

| Test | Technique |
|---|---|
| Mouse hover | `.trigger('mouseover')` (Cypress has no real `.hover()`) |
| Right click | `.trigger('contextmenu')` **or** `.rightclick()` |
| Double click | `.trigger('dblclick')` **or** `.dblclick()` (inside an iframe via `cypress-iframe`) |
| Drag & drop | plugin: `cy.get('#box6').drag('#box106', { force: true })` |
| Scrolling | `.scrollIntoView({ duration: 2000 })` then `.should('be.visible')` |

**Concepts:** mouse events, `trigger()`, `{ force: true }` (do the action even if Cypress thinks the element is covered/hidden), plugin for drag and drop, scrolling.

**Why useful:** covers all "advanced" mouse interactions.

> ⚠️ Bug noticed: in the Right-click test, I wrote `cy.skip("http://swisnl...")` – there is **no** `cy.skip` command; it should be `cy.visit(...)`. It didn't surface because the test is skipped. Also, hover and others use `localhost:8080` – an app (OpenCart) that must be running locally.

---

## 3.24 `cypress/e2e/paginition.cy.js` – tables & pagination

(File name has a typo – should be "pagination". Fine to rename later.)

**Contains:** tests on a local OpenCart admin (`http://localhost:8080/admin/`) – Customers table. A `beforeEach` hook logs in and navigates to Customers. Tests:

1. **Number of rows & columns** (skipped)
   ```js
   cy.get("table.table>tbody>tr").should('have.length', 12)
   cy.get("table.table>thead>tr>td").should('have.length', 8)
   ```
2. **Cell data from a specific row/column** – `tr:nth-child(5)>td:nth-child(3)` `.contains("email")`.
3. **Read all rows & columns of the first page** – nested loops with `.each()` and `.within()`.
4. **Pagination** (the active `it.only`) – reads text such as "Showing 1 to 10 of 100 (10 Pages)", extracts the number of pages using `substring` + `indexOf`, then a `for` loop clicks page 1..N and logs the email of every row.

**Concepts**
- Table selectors: `tbody>tr`, `td:nth-child(n)`.
- `.each(($row, index, $rows) => ...)` – loop over elements.
- `.within(() => ...)` – scope `cy.get` to inside the current element only.
- `.then(e => e.text())` – get text, then do plain JavaScript string manipulation.
- `Number()` converts string to number.
- `for` loop mixing with Cypress commands – allowed because commands are queued.
- `beforeEach` – shared login.

**Why useful:** tables with pagination are very common in real applications, and this is the template for scraping/validating data across pages.

> Requires a local OpenCart server; will fail if `localhost:8080` isn't running.

---

# Part 4 – Cypress commands cheat sheet

## 4.1 Navigation / page

| Command | What it does |
|---|---|
| `cy.visit(url)` | Opens the URL. Can also take options like `{ auth: { username, password } }`. |
| `cy.url()` | Gets the current page URL (use with `.should`). |
| `cy.title()` | Gets the page title. |
| `cy.go('back')` / `cy.go('forward')` | Browser back / forward buttons. |
| `cy.reload()` | Refreshes the page. |
| `cy.location('pathname')` | Gets part of the URL (pathname, hash, search...). |

## 4.2 Finding elements

| Command | What it does |
|---|---|
| `cy.get(selector)` | Finds element(s) by CSS selector. Retries until found. |
| `cy.xpath(path)` | Finds by XPath (plugin). |
| `cy.contains(text)` / `cy.get(sel).contains(text)` | Finds the element containing text. |
| `.find(selector)` | Finds descendants inside the previous element. |
| `.first()`, `.last()`, `.eq(n)` | Picks first, last, or nth (starts from 0). |
| `.children()`, `.parent()`, `.siblings()`, `.next()`, `.prev()` | Move around the DOM tree. |
| `.within(fn)` | Limits all `cy.get` inside `fn` to this element. |
| `.filter(sel)` | Keeps only elements matching selector. |
| `cy.get(sel, { includeShadowDom: true })` | Allows searching inside Shadow DOM. |

## 4.3 Actions (doing things)

| Command | What it does |
|---|---|
| `.click()` | Clicks. Options: `{ force: true }`, `{ multiple: true }`. |
| `.dblclick()` | Double click. |
| `.rightclick()` | Right click. |
| `.type('text')` | Types into an input. Special keys: `{enter}`, `{esc}`, `{backspace}`, `{ctrl+a}`, `{cmd+a}`. |
| `.clear()` | Empties an input. |
| `.check()` / `.uncheck()` | Ticks / unticks checkboxes or radios (uncheck only for checkboxes). |
| `.select('text or value')` | Chooses an option from a `<select>` dropdown. |
| `.trigger('event')` | Fires any DOM event: `mouseover`, `contextmenu`, `dblclick`... |
| `.scrollIntoView()` | Scrolls until element is in view. |
| `cy.scrollTo('bottom')` | Scrolls the window or an element. |
| `.focus()` / `.blur()` | Focus / remove focus from an element. |
| `.submit()` | Submits a form. |
| `.selectFile('path')` | Built-in file upload (Cypress 9.3+). |
| `.attachFile('name')` | File upload with the plugin (`cypress-file-upload`). |
| `.drag('selector')` | Drag and drop with `@4tw/cypress-drag-drop`. |

## 4.4 Assertions

| Command | What it does |
|---|---|
| `.should('be.visible')` | Element is visible. |
| `.should('exist')` / `'not.exist'` | Exists in the DOM or not. |
| `.should('have.text', 'x')` | Text is exactly x. |
| `.should('contain', 'x')` / `'include'` | Contains x. |
| `.should('have.value', 'x')` | Input's value is x. |
| `.should('have.length', n)` | Number of elements is n. |
| `.should('have.attr', 'name', 'value')` | Attribute check. |
| `.should('have.class', 'x')` | Has CSS class. |
| `.should('be.checked')` | Checkbox/radio is checked. |
| `.should('be.disabled')` / `'be.enabled'` | Disabled / enabled. |
| `.should('eq', x)` | Equal to (also `'not.eq'`). |
| `.and(...)` | Same as `.should`, to chain more checks. |
| `expect(a).to.equal(b)` | Explicit, BDD style. |
| `assert.equal(a, b)` | Explicit, TDD style. |

## 4.5 Getting values / working with results

| Command | What it does |
|---|---|
| `.then((x) => {...})` | Gets the result of the previous command so I can use it as a normal value (jQuery element). |
| `.invoke('name')` | Calls a function/property on the subject (e.g. `invoke('text')`, `invoke('removeAttr','target')`, `invoke('show')`). |
| `.its('property')` | Reads a property (e.g. `its('length')`, `its('0.contentDocument.body')`). |
| `.each(($el, index, $list) => {...})` | Loops through every matched element. |
| `cy.wrap(value)` | Turns a plain value/element into a Cypress chain so we can use `.click()`, `.should()` on it. |
| `.as('alias')` | Saves a subject with a name; use later with `cy.get('@alias')`. |
| `.prop('name')` | Reads a property of a jQuery element (e.g. `href`). |
| `.text()` | jQuery method: gets text from a jQuery element (inside `.then`). |

## 4.6 Waiting and timing

| Command | What it does |
|---|---|
| `cy.wait(ms)` | Hard wait (pauses). Avoid when possible. |
| `cy.wait('@alias')` | Waits for a named network request. Better and smarter. |
| `cy.clock()` / `cy.tick(ms)` | Controls time (timers) in the app. |
| `{ timeout: 10000 }` option | Allow a command to wait longer than the 4 s default. |

## 4.7 Test structure and control

| Command | What it does |
|---|---|
| `describe('name', fn)` | Test suite (group). |
| `context('name', fn)` | Alias of `describe`. |
| `it('name', fn)` / `specify()` | A single test. |
| `it.only` / `describe.only` | Run only this. |
| `it.skip` / `describe.skip` | Skip this. |
| `before` / `after` | Once before / after all tests in the suite. |
| `beforeEach` / `afterEach` | Before / after each test. |
| `cy.log('message')` | Prints a message in the command log. |
| `cy.pause()` | Pauses the run so I can inspect manually. |
| `cy.debug()` | Prints the subject to the browser console. |

## 4.8 Test data and files

| Command | What it does |
|---|---|
| `cy.fixture('name')` | Loads a file from `cypress/fixtures` (JSON is auto-parsed). |
| `cy.readFile(path)` | Reads a file from disk. |
| `cy.writeFile(path, data)` | Writes a file. |
| `cy.task('name', arg)` | Runs Node.js code defined in `cypress.config.js`. |

## 4.9 Browser-level events and spies

| Command | What it does |
|---|---|
| `cy.on('window:alert', fn)` | Listens for JS alerts. |
| `cy.on('window:confirm', fn)` | Listens for confirm popups; return true/false for OK/Cancel. |
| `cy.on('uncaught:exception', fn)` | Handles errors thrown by the app; `return false` ignores them. |
| `cy.window()` | Gets the browser `window` object. |
| `cy.document()` | Gets the `document` object. |
| `cy.stub(obj, 'method')` | Replaces a function with a fake one (`.returns(value)`). |
| `cy.spy(obj, 'method')` | Watches a function without changing it. |

## 4.10 Network / API

| Command | What it does |
|---|---|
| `cy.request(method, url, body)` | Sends an HTTP request directly (API testing). |
| `cy.intercept(method, url, response)` | Watches or mocks network calls. |

## 4.11 Custom commands & plugin commands used in this project

| Command | Source | What it does |
|---|---|---|
| `cy.getIframe(selector)` | `support/commands.js` | Returns the body of an iframe, ready for typing. |
| `cy.frameLoaded(selector)` | `cypress-iframe` | Waits until an iframe has loaded. |
| `cy.iframe(selector)` | `cypress-iframe` | Gets the iframe body to chain commands on. |
| `cy.xpath(path)` | `cypress-xpath` | Find by XPath. |
| `.attachFile(file)` | `cypress-file-upload` | Upload a file. |
| `.drag(target)` | `@4tw/cypress-drag-drop` | Drag and drop. |

## 4.12 Terminal (CLI) commands

| Command | What it does |
|---|---|
| `npm install` | Installs all packages from `package.json` (do after cloning). |
| `npx cypress open` | Opens the interactive Test Runner. |
| `npx cypress run` | Runs all tests headless. |
| `npx cypress run --spec "path"` | Runs a specific test file. |
| `npx cypress run --browser chrome` | Picks a browser. |
| `npx cypress run --headed` | Shows the browser window while running. |
| `npx cypress verify` | Checks Cypress is installed correctly. |
| `npx cypress info` | Shows version/browsers detected. |

---

# Part 5 – Gotchas & lessons from my own code

1. **`it.only` hides other tests.** Many files have `it.only` so the other tests don't run. Remove it when you want the whole file to run.
2. **`it.skip` = skipped.** Remember which tests I turned off (dropdowns, fileUploads, MouseElements).
3. **`cy.skip(...)` isn't a command** (in MouseElements right-click test). Use `cy.visit(...)`.
4. **Don't overuse `cy.wait(ms)`.** Prefer assertions, which auto-retry.
5. **Cypress commands don't return values.** Use `.then()` to access the value.
6. **Fragile selectors:** auto-generated class names (Google) or `nth-child` break easily. Prefer ids, `data-cy`/`data-test` attributes.
7. **Public demo sites change** (OrangeHRM's user name is dynamic), so expected values like "manda user" / "Automation QE" may stop matching.
8. **Local app required:** `MouseElements` (hover) and `paginition` tests need an OpenCart site running on `localhost:8080`.
9. **`{cmd+a}` is Mac;** use `{ctrl+a}` on Windows.
10. **Cypress limitations:** no multi-tab support (use removeAttr('target') trick), iframes need special handling, Shadow DOM needs `includeShadowDom`.
11. **Never commit `node_modules`.** It's listed in `.gitignore`; `npm install` rebuilds it.
12. **Dependency sync:** Cypress plugin imports in `support/` need to match what's installed in `package.json`.

---

*End of notes. Add new topics below as I learn them (API testing with `cy.request`, `cy.intercept`, Page Object Model, reporting with Mochawesome, CI/CD with GitHub Actions).*
