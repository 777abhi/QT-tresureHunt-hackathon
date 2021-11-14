//tresure-flow.spec.ts
const { test, expect } = require("@playwright/test");
var settings = require("../settings.json");

let up = "text=arrow_upward";
let down = "text=arrow_downward";
let left = "text=arrow_back";
let right = "text=arrow_forward";
let lastConsoleLog: any;
let socketToken: any;

test("Automation Bot should complete the treseure hunt", async ({
  page,
  browser,
}) => {
  await test.step("Navigate to Tresure hunt application", async () => {
    await page.goto(settings.baseURL);
    await page.click(
      "text=Qualithon is a field day organized by the Test Automation QTribe. This event req >> img"
    );
    await expect(page).toHaveURL(settings.baseURL + "/intro");
  });

  await test.step("START - Ahoy Matey!", async () => {
    await page.click('button:has-text("Start")');
  });

  await test.step(
    "Random access - Click the correct proceed button below to go to next level.",
    async () => {
      await clickOnTheCorrectProceedButton(page);
    }
  );

  await test.step(
    "A Video Player - 1. Play video 2. When Talk Starts 3. Then Mute the video 4. And proceed to go to next clue",
    async () => {
      await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
      await page
        .frame({
          url: settings.youtubeURL,
        })
        .click('[aria-label="Play"]');
      await page.evaluate(() => {
        return new Promise((resolve) => setTimeout(resolve, 10000));
      });
      await page
        .frame({
          url: settings.youtubeURL,
        })
        .click('[aria-label="Mute (m)"]');
      await page.click('button:has-text("Proceed")');
      await expect(page).toHaveURL(settings.baseURL + "/c/crystal_maze");
    }
  );

  await test.step("Crystal Maze - Solve", async () => {
    let locator = "//td[contains(@class, 'deep-purple')]";
    let firstxLocationAndColorAsArray = await getLocationDetails(
      page,
      locator,
      "Array"
    );
    if (
      firstxLocationAndColorAsArray[1] == 0 &&
      firstxLocationAndColorAsArray[4] == 8
    ) {
      await solveCM1(page);
    } else if (
      firstxLocationAndColorAsArray[1] == 0 &&
      firstxLocationAndColorAsArray[4] == 2
    ) {
      await solveCM4(page);
    }
  });

  await test.step("Map - Select India", async () => {
    await selectIndiaOnMap(page);
  });

  await test.step("Not a Bot! - Hack captcha", async () => {
    await solveNotABot(page);
  });

  await test.step("Socket Gate - Generate Token", async () => {
    await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
    let messageLocator = page.locator("//div[@class='yellow lighten-3']");
    let message = await messageLocator.innerText();
    //console.log(message);
    socketToken = await getTokenFromSocketGateWebsite(browser, message);
    await page.fill("//input[@id='socketGateMessage']", socketToken);
    await page.click("//button[normalize-space()='Submit']");
    await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
  });
});


//All Business functions
async function clickOnTheCorrectProceedButton(page: any) {
  await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
  let btnProceedList = await page.$$('button:has-text("Proceed")');
  try {
    for await (const btnProceed of btnProceedList) {
      await btnProceed.click();
    }
  } catch (e) {}
}

async function getLocationDetails(page, locator, asArrayOrString) {
  let alt = await page.getAttribute(locator, "class");
  if (asArrayOrString === "Array") {
    return Array.from(alt);
  } else if (asArrayOrString === "String") {
    return alt;
  }
}

async function solveCM1(page: any) {
  console.log("solveCM1");
  await page.click(right);
  await page.click(right);
  await page.click(down);
  await page.click(right);
  await page.click(right);
  await page.click(up);
  await page.click(up);
  await page.click(up);
  await page.click(left);
  await page.click(left);
  await page.click(up);
  await page.click(up);
  await page.click(right);
  await page.click(up);
  await page.click(up);
  await page.click(right);
  await page.click(right);
  await page.click(down);
  await page.click(down);
  await page.click(down);
  await page.click(right);
  await page.click(right);
  await page.click(down);
  await page.click(down);
  await page.click(down);
  await page.click(down);
  await page.click(right);
  await page.click(down);
  await page.click(right);
  await page.click(right);
  await page.click(right);

  // Click button:has-text("Submit")
  await page.click('button:has-text("Submit")');
  await expect(page).toHaveURL("http://54.80.137.197:5000/c/maps");
}

async function solveCM4(page: any) {
  console.log("solveCM4");
  await page.click(right);
  await page.click(right);
  await page.dblclick(down);
  await page.click(right);
  await page.click(right);
  await page.click(up);
  await page.click(right);
  await page.click(right);
  await page.click(right);
  await page.click(down);
  await page.dblclick(down);
  await page.click(left);
  await page.click(down);
  await page.dblclick(left);
  await page.click(left);
  await page.click(down);
  await page.click(left);
  await page.click(down);
  await page.click(down);
  await page.click(right);
  await page.click(right, {
    clickCount: 3,
  });
  await page.dblclick(up);
  await page.click(right);
  await page.click(up);
  await page.dblclick(right);
  await page.click(left);
  await page.click(up);
  await page.click(up);
  await page.click(right);
  await page.click(up);
  await page.click(right);
  await page.click(right);
  await page.click('button:has-text("Submit")');
  await expect(page).toHaveURL(settings.baseURL + "/c/maps");
}

async function selectIndiaOnMap(page: any) {
  await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
  await page.click("#OpenLayers_Layer_WMS_4 img");
  await page.click(":nth-match(img, 3)");
  await page.press("#map", "i");
  for (let i = 0; i < 36; i++) {
    await page.press("#map", "ArrowRight");
  }
  for (let i = 0; i < 11; i++) {
    await page.press("#map", "ArrowUp");
  }
  page.on("console", (msg) => (lastConsoleLog = msg.text()));
  await page.click('button:has-text("Proceed")');
  await expect(page).toHaveURL(settings.baseURL+"/c/not_a_bot");
}

async function solveNotABot(page: any) {
  await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
  await page.fill('[placeholder="Captcha Text"]', lastConsoleLog);
  await page.click('button:has-text("Submit Captcha")');
}

async function getTokenFromSocketGateWebsite(browser: any, message) {
  const page = await browser.newPage();
  await page.goto(settings.webSoketClient);
  await page.fill("//input[@id='serverSelected']", settings.webSocketURL);
  await page.click("//button[normalize-space()='Connect']");
  await page.waitForLoadState("networkidle"); // This resolves after 'networkidle'
  await page.fill("//textarea[@id='msgToServer']", message);
  await page.click("//button[normalize-space()='Send Message']");
  await page.evaluate(() => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  });
  let tokenLocator = page.locator(".list-group .list-group-item");

  let token = await tokenLocator.last().innerText();
  token = token.substring(10);
  await page.close();
  return token;
}
