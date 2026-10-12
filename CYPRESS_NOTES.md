# Cypress Study Notes

My personal notes for learning and revising Cypress. This file only holds the **main ideas** (what Cypress is, why we use it, pros and cons, comparisons, project structure and the command cheat sheet).

The explanation of every test file lives in separate Word documents, one per spec, in the `docs/` folder (e.g. `docs/myFirstTest.docx`). Open the Word document next to the spec to follow along.

**Contents**
1. What is Cypress?
2. Why do we use it?
3. Pros and cons
4. Cypress vs Selenium vs Playwright
5. Types of testing and key concepts
6. Installing and running
7. Project directory structure
8. Commands cheat sheet
9. Common gotchas

---

# 1. What is Cypress?

Cypress is a **test automation tool** for **web applications**. Instead of a human opening a site, typing a username, clicking Login and checking that the dashboard appeared, we write a small JavaScript program that does all of that automatically. Cypress runs it in a real browser (Chrome, Edge, Firefox, Electron).

```js
cy.visit("https://www.saucedemo.com/")      // open the site
cy.title().should('eq','Swag Labs')         // check the page title
```

That is a complete automated test.

Cypress is open source (the test runner is free). Cypress also has a paid cloud service ("Cypress Cloud") for dashboards, parallel runs and test analytics, but it is optional.

---

# 2. Why do we use it?

| Reason | Explanation in simple words |
|---|---|
| **Saves time** | Re-testing 100 pages by hand after every change is slow and boring. A script does it in minutes. |
| **Fewer human mistakes** | A script checks the same thing the same way every time. |
| **Runs inside the browser** | Cypress runs in the same run loop as the app, so it sees the DOM, network calls and timers. Result: fast, accurate tests. |
| **Automatic waiting** | Most tools need "sleep 5 seconds" everywhere. Cypress waits (up to 4 s by default) for elements to exist and be actionable, which removes most flaky tests. |
| **Time-travel debugging** | Hover over a step in the runner and see a snapshot of the page at that moment. |
| **Easy setup** | `npm install cypress` and go. No driver downloads. |
| **Clear error messages** | Failures say what was expected vs what happened, with screenshots and videos. |
| **JavaScript** | Most web developers already know it. |
| **Network control** | `cy.intercept()` lets us spy on or fake API responses. |

---

# 3. Pros and cons

## Pros
- Very fast to set up and easy to learn.
- Automatic waiting and retrying of commands and assertions.
- Excellent interactive runner with time-travel snapshots.
- Built-in screenshots and videos on failure (in `cypress run`).
- Can test the front end and call APIs in the same test (`cy.request`).
- Can stub and mock network traffic and browser functions (`cy.intercept`, `cy.stub`, `cy.clock`).
- Big community, many plugins, good documentation.
- Same tool for E2E and component testing.
- Easy to plug into CI/CD (GitHub Actions, Jenkins, GitLab...).

## Cons
- **JavaScript / TypeScript only.** No Java, Python or C#.
- **Cannot control multiple browser tabs or windows.** Workarounds are needed (remove `target` attribute, or visit the `href`).
- **Same-origin limits.** A single test historically could not move across different domains; `cy.origin()` helps but is more awkward.
- **No native support for multiple browsers at once** in a single test (no two users in two browsers in the same test).
- iframes and Shadow DOM need extra handling (`its('0.contentDocument.body')`, `cypress-iframe`, `includeShadowDom`).
- No real mouse hover (`.trigger('mouseover')` is only a simulated event).
- Native browser dialogs and OS-level actions (real file dialogs, desktop apps) are not supported directly.
- Browser support is narrower than Selenium (Chrome family, Firefox, Edge, Electron; WebKit support is experimental).
- Parallel running of tests is easiest with the paid Cypress Cloud (free alternatives exist but need setup).
- Commands are asynchronous and queued, which confuses beginners (you cannot store `cy.get()` in a variable and use it as a value).

---

# 4. Cypress vs Selenium vs Playwright

| Feature | **Cypress** | **Selenium** | **Playwright** |
|---|---|---|---|
| Created by | Cypress.io (2014+) | Jason Huggins / community (2004) | Microsoft (2020) |
| Architecture | Runs **inside** the browser | WebDriver: sends commands **to** the browser from outside | Talks to the browser over a fast protocol (CDP / own protocol), out of process |
| Languages | JavaScript, TypeScript | Java, Python, C#, JS, Ruby, Kotlin... | JavaScript, TypeScript, Python, Java, C# |
| Browsers | Chrome, Edge, Firefox, Electron (WebKit experimental) | Chrome, Firefox, Edge, Safari, IE (legacy), others | Chromium, Firefox, WebKit (Safari engine) |
| Speed | Fast | Slower | Very fast |
| Auto-waiting | Yes | No (needs explicit / implicit waits) | Yes |
| Multiple tabs / windows | Not supported (workarounds) | Supported | Supported |
| Multiple domains in one test | Limited (`cy.origin`) | Supported | Supported |
| Multiple users / browser contexts in one test | No | Possible with extra work | Yes (browser contexts) |
| iframes | Needs special handling | Supported (`switchTo().frame`) | Supported (`frameLocator`) |
| Mobile | Viewport emulation only | Real devices through Appium | Emulation of devices |
| Debugging | Best interactive runner, time travel | Basic, depends on IDE | Trace viewer, inspector, codegen |
| Parallel runs | Via Cypress Cloud or custom setup | Selenium Grid | Built in |
| API testing | `cy.request` | Not built in | Built in (`request`) |
| Setup | Very easy | Hardest (drivers, bindings, grid) | Easy |
| Learning curve | Easy | Medium to hard | Easy to medium |
| Community / jobs | Large | Largest (most legacy projects) | Growing very fast |
| Best for | Front-end developers, quick feedback, single-tab web apps | Large legacy suites, many languages, real browser coverage, real devices with Appium | Modern cross-browser testing, multi-tab flows, speed |

## When to choose which
- **Cypress**: team knows JavaScript, app is a single-page web app, you value debugging and fast feedback.
- **Selenium**: you need Java/Python/C#, very wide browser/device coverage or must integrate with an existing Selenium grid.
- **Playwright**: you want modern speed, multi-tab/multi-user tests and true cross-browser (including Safari/WebKit).

---

# 5. Types of testing and key concepts

## Types
- **E2E (End-to-End)** – tests the whole app like a real user. *This project uses E2E.*
- **Component testing** – tests one UI component in isolation (React, Vue, Angular).
- **API testing** – hit backend endpoints directly with `cy.request()`.

## Key concepts
- **Mocha structure:** `describe` (suite), `it` (test), hooks `before`, `after`, `beforeEach`, `afterEach`. `it.only` runs just that test; `it.skip` skips it.
- **Chai assertions:** *implicit* (`.should()`, `.and()`, auto-retry) and *explicit* (`expect()` BDD style, `assert()` TDD style, used in `.then()`).
- **Selectors:** CSS (default), XPath (plugin), text (`cy.contains`).
- **Command queue:** `cy` commands are queued and run one after another, not at the line where written. Use `.then()` to access a value.
- **Retry-ability:** `cy.get()` and `.should()` retry until success or timeout (default 4 s).
- **`cy.wrap()`:** converts a plain value/jQuery object back into a Cypress chainable.
- **Fixtures:** test data files in `cypress/fixtures`, loaded with `cy.fixture()`.
- **Data-driven testing:** same test, many data sets.
- **Custom commands:** our own `cy.something()` in `cypress/support/commands.js`.
- **Plugins:** extra npm packages (`cypress-xpath`, `cypress-iframe`, `cypress-file-upload`, `@4tw/cypress-drag-drop`).
- **Page Object Model (POM):** one class per page holding its locators and actions; tests call the methods (`cypress/PageObjects`).
- **Config:** `cypress.config.js` holds settings (base URL, timeouts, viewport, browser launch tweaks).
- **Events and stubs:** `cy.on()` for alerts and uncaught errors, `cy.stub()` and `cy.spy()` for functions.

---

# 6. Installing and running

```bash
npm init -y                          # create package.json
npm install cypress --save-dev       # install Cypress
npx cypress open                     # interactive Test Runner (GUI)
npx cypress run                      # headless run in the terminal
npx cypress run --spec "cypress/e2e/alerts.cy.js"   # one file
npx cypress run --browser chrome     # choose browser
npx cypress run --headed             # show the browser window
```

- **Open mode** – for writing and debugging tests.
- **Run mode** – for CI/CD, headless, records videos and screenshots on failure.

---

# 7. Project directory structure

```
Cypress/
├── cypress/
│   ├── e2e/            <- test files (*.cy.js)
│   ├── PageObjects/    <- Page Object Model classes (LoginPage.js, LoginPage2.js)
│   ├── fixtures/       <- test data (json) and files used for upload
│   └── support/
│       ├── commands.js <- custom commands + plugin imports
│       └── e2e.js      <- global setup, runs before every spec
├── docs/               <- Word document for each spec in cypress/e2e
├── cypress.config.js   <- Cypress configuration
├── package.json        <- project info and dependencies
├── package-lock.json   <- exact installed versions (auto-generated)
├── image.png           <- screenshot of the runner showing a JS alert
├── node_modules/       <- installed packages (not pushed to GitHub)
└── CYPRESS_NOTES.md    <- this file
```

| Folder / file | Purpose |
|---|---|
| `cypress/e2e` | Test files. Cypress picks up any file ending in `.cy.js`. |
| `cypress/PageObjects` | Page classes (locators + actions per page) used by the POM specs. Kept outside `e2e` so Cypress does not run them as tests. |
| `cypress/fixtures` | Static data for tests (JSON, PDFs, images). |
| `cypress/support` | Loaded automatically before every spec: reusable commands and global setup. |
| `cypress.config.js` | Settings for Cypress. In this project it also adds a Chrome flag so alert popups are auto-dismissed on new Chrome versions. |
| `package.json` | Lists dependencies so `npm install` recreates the same setup. |
| `docs/` | One Word document per test file explaining what it does and which concepts it uses. |

Dependencies: `cypress` (main tool), `cypress-xpath` (`cy.xpath`), `cypress-iframe` (`cy.frameLoaded`, `cy.iframe`), `cypress-file-upload` (`.attachFile`), `@4tw/cypress-drag-drop` (`.drag`), `cypress-mochawesome-reporter` (HTML test report; enabled with `reporter` in `cypress.config.js`, registered in `support/e2e.js`, output in `cypress/reports/html` after `npx cypress run`).

---

# 8. Commands cheat sheet

## Navigation / page
| Command | What it does |
|---|---|
| `cy.visit(url)` | Opens the URL. Takes options like `{ auth: { username, password } }`. |
| `cy.url()` | Gets the current URL. |
| `cy.title()` | Gets the page title. |
| `cy.go('back')` / `cy.go('forward')` | Browser back / forward. |
| `cy.reload()` | Refreshes the page. |
| `cy.go(-1)` / `cy.go(1)` | Back / forward using numbers. |
| `cy.location('pathname')` | Gets part of the URL (pathname, hash, search...). |

## Finding elements
| Command | What it does |
|---|---|
| `cy.get(selector)` | Finds element(s) by CSS selector. Retries until found. |
| `cy.xpath(path)` | Finds by XPath (plugin). |
| `cy.contains(text)` / `.contains(text)` | Finds the element containing text. |
| `.find(selector)` | Finds descendants of the previous element. |
| `.first()`, `.last()`, `.eq(n)` | First, last or nth (starts from 0). |
| `.children()`, `.parent()`, `.siblings()`, `.next()`, `.prev()` | Move around the DOM tree. |
| `.within(fn)` | Limits every `cy.get` inside `fn` to this element. |
| `.filter(sel)` | Keeps only elements matching the selector. |
| `cy.get(sel, { includeShadowDom: true })` | Searches inside Shadow DOM. |

## Actions
| Command | What it does |
|---|---|
| `.click()` | Clicks. Options: `{ force: true }`, `{ multiple: true }`. |
| `.dblclick()` | Double click. |
| `.rightclick()` | Right click. |
| `.type('text')` | Types into an input. Special keys: `{enter}`, `{esc}`, `{backspace}`, `{ctrl+a}`, `{cmd+a}`. |
| `.clear()` | Empties an input. |
| `.check()` / `.uncheck()` | Ticks / unticks checkboxes or radios (uncheck only for checkboxes). |
| `.select('text or value')` | Chooses an option in a `<select>`. |
| `.trigger('event')` | Fires any DOM event (`mouseover`, `contextmenu`, `dblclick`...). |
| `.scrollIntoView()` | Scrolls until the element is in view. |
| `cy.scrollTo('bottom')` | Scrolls the window or an element. |
| `.focus()` / `.blur()` | Focus / remove focus. |
| `.submit()` | Submits a form. |
| `.selectFile('path')` | Built-in file upload (Cypress 9.3+). |
| `.attachFile('name')` | File upload with the `cypress-file-upload` plugin. |
| `.drag('selector')` | Drag and drop with `@4tw/cypress-drag-drop`. |

## Assertions
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

BDD vs TDD: `expect(a).to.equal(b)` ↔ `assert.equal(a, b)`; `expect(a).to.not.equal(b)` ↔ `assert.notEqual(a, b)`; `expect(a).to.be.true` ↔ `assert.isTrue(a)`.

## Getting values / working with results
| Command | What it does |
|---|---|
| `.then((x) => {...})` | Gets the previous result as a normal value (jQuery element). Assertions inside do not retry. |
| `.invoke('name')` | Calls a function on the subject (`invoke('text')`, `invoke('removeAttr','target')`). |
| `.its('property')` | Reads a property (`its('length')`, `its('0.contentDocument.body')`). |
| `.each(($el, index, $list) => {...})` | Loops through every matched element. |
| `cy.wrap(value)` | Turns a plain value/element into a Cypress chain. |
| `.as('alias')` | Saves a subject; use later with `cy.get('@alias')`. |
| `.prop('name')` | Reads a property of a jQuery element (e.g. `href`). |
| `.text()` | jQuery method: gets text from a jQuery element (inside `.then`). |

## Waiting and timing
| Command | What it does |
|---|---|
| `cy.wait(ms)` | Hard wait. Avoid when possible. |
| `cy.wait('@alias')` | Waits for a named network request. Smarter. |
| `cy.clock()` / `cy.tick(ms)` | Controls timers in the app. |
| `{ timeout: 10000 }` option | Lets one command wait longer than the 4 s default. |

## Test structure and control
| Command | What it does |
|---|---|
| `describe('name', fn)` / `context()` | Test suite (group). |
| `it('name', fn)` / `specify()` | A single test. |
| `it.only` / `describe.only` | Run only this. |
| `it.skip` / `describe.skip` | Skip this. |
| `before` / `after` | Once before / after all tests in the suite. |
| `beforeEach` / `afterEach` | Before / after each test. |
| `cy.log('message')` | Prints a message in the command log. |
| `cy.pause()` | Pauses the run so I can inspect. |
| `cy.debug()` | Prints the subject to the browser console. |
| `cy.screenshot(name)` | Takes a screenshot of the page (or of one element when chained). |

## Test data and files
| Command | What it does |
|---|---|
| `cy.fixture('name')` | Loads a file from `cypress/fixtures` (JSON is parsed). |
| `cy.readFile(path)` | Reads a file from disk. |
| `cy.writeFile(path, data)` | Writes a file. |
| `cy.task('name', arg)` | Runs Node.js code defined in `cypress.config.js`. |

## Browser events, stubs and spies
| Command | What it does |
|---|---|
| `cy.on('window:alert', fn)` | Listens for JS alerts. |
| `cy.on('window:confirm', fn)` | Listens for confirm popups; return true/false for OK/Cancel. |
| `cy.on('uncaught:exception', fn)` | Handles errors thrown by the app; `return false` ignores them. |
| `cy.window()` / `cy.document()` | Gets the `window` / `document` object. |
| `cy.stub(obj, 'method')` | Replaces a function with a fake (`.returns(value)`). |
| `cy.spy(obj, 'method')` | Watches a function without changing it. |

## Network / API
| Command | What it does |
|---|---|
| `cy.request(method, url, body)` | Sends an HTTP request directly (API testing). |
| `cy.intercept(method, url, response)` | Watches or mocks network calls. |

## Custom and plugin commands used in this project
| Command | Source | What it does |
|---|---|---|
| `cy.getIframe(selector)` | `support/commands.js` | Returns an iframe body, ready for typing. |
| `cy.frameLoaded(selector)` | `cypress-iframe` | Waits until an iframe has loaded. |
| `cy.iframe(selector)` | `cypress-iframe` | Gets the iframe body to chain on. |
| `cy.xpath(path)` | `cypress-xpath` | Find by XPath. |
| `.attachFile(file)` | `cypress-file-upload` | Upload a file. |
| `.drag(target)` | `@4tw/cypress-drag-drop` | Drag and drop. |
| `cy.clickLink(label)` | `support/commands.js` | Clicks a link by its text. |
| `cy.loginapp(email, password)` | `support/commands.js` | Fills and submits the nopCommerce login form. |
| `contains()` (overwritten) | `support/commands.js` | Now matches text case-insensitively. |

## Custom command types (for `commands.js`)
- **Parent** – starts a chain: `Cypress.Commands.add('login', (email, password) => {...})`.
- **Child** – needs a previous subject: `Cypress.Commands.add('drag', { prevSubject: 'element' }, (subject, options) => {...})`.
- **Dual** – works both ways: `{ prevSubject: 'optional' }`.
- **Overwrite** – change an existing command: `Cypress.Commands.overwrite('visit', (originalFn, url, options) => {...})`.

## Terminal (CLI) commands
| Command | What it does |
|---|---|
| `npm install` | Installs all packages from `package.json` (do after cloning). |
| `npx cypress open` | Opens the interactive Test Runner. |
| `npx cypress run` | Runs all tests headless. |
| `npx cypress run --spec "path"` | Runs a specific test file. |
| `npx cypress run --browser chrome` | Picks a browser. |
| `npx cypress run --headed` | Shows the browser while running. |
| `npx cypress verify` | Checks Cypress is installed correctly. |
| `npx cypress info` | Shows version and detected browsers. |

---

# 9. Common gotchas

1. **`it.only` hides other tests**, and `it.skip` disables tests. Check for them when a test "doesn't run".
2. **Avoid `cy.wait(ms)`.** Prefer assertions, which retry automatically.
3. **Cypress commands don't return values.** Use `.then()`.
4. **Fragile selectors:** auto-generated class names or long `nth-child` chains break easily. Prefer ids and `data-cy` / `data-test` attributes.
5. **Public demo sites change** (e.g. OrangeHRM's displayed user name), so expected values can stop matching.
6. **`{cmd+a}` is Mac;** use `{ctrl+a}` on Windows.
7. **Cypress limits:** no multi-tab support, iframes need special handling, Shadow DOM needs `includeShadowDom`.
8. **Never commit `node_modules`.** It is in `.gitignore`; `npm install` rebuilds it.
9. **`cy.skip()` is not a command.** Use `cy.visit()` to open a page.
10. **Code after `return config;` never runs** in `setupNodeEvents` (this hid the Chrome alert workaround once). Keep `return config` last.
11. **Screenshots and videos** are only produced by `npx cypress run`, not `cypress open`.
12. **Never commit real passwords** in specs; use fixtures or environment variables.

---

*Next topics to learn: API testing with `cy.request`, `cy.intercept`, Page Object Model, reporting with Mochawesome, CI/CD with GitHub Actions.*
