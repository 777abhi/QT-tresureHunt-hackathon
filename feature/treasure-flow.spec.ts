//treasure-flow.spec.ts
const { test, expect } = require("@playwright/test");
var settings = require("../settings.json");

let upW = "text=arrow_upward";
let downW = "text=arrow_downward";
let leftW = "text=arrow_back";
let rightW = "text=arrow_forward";
let lastConsoleLog: any;
let socketToken: any;
let twoWaytrackerPosition = [];
let allMoves = [];
let i = 1;

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
    let endloop = true;
    var backTrack = [];

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    while (endloop) {
      let locatorCurrentPosition = "//td[contains(@class, 'deep-purple')]";

      let MazePointer = await getLocationDetails(
        page,
        locatorCurrentPosition,
        "Array"
      );

      let valueX, valueY;

      if (MazePointer.length < 18) {
        valueX = MazePointer.substring(1, 2);
        valueY = MazePointer.substring(4, 5);
      } else if (MazePointer.length == 18) {
        if (Array.from(MazePointer.substring(1, 3))[1] == " ") {
          valueX = MazePointer.substring(1, 2);
          valueY = MazePointer.substring(4, 6);
        } else {
          valueX = MazePointer.substring(1, 3);
          valueY = MazePointer.substring(5, 6);
        }
      } else if (MazePointer.length > 18 && MazePointer.length < 100) {
        valueX = MazePointer.substring(1, 3);
        valueY = MazePointer.substring(5, 7);
      }

      let down = await observeAround(page, valueX, valueY, 0, 1);
      let right = await observeAround(page, valueX, valueY, 1, 0);
      let left = await observeAround(page, valueX, valueY, -1, 0);
      let up = await observeAround(page, valueX, valueY, 0, -1);

      backTrack.forEach((element) => {
        //check if the current position is in the backtrack array
        if (element == up) up = "0";
        else if (element == down) down = "0";
        else if (element == left) left = "0";
        else if (element == right) right = "0";
      });

      if (up.includes("grey") || up.includes("green")) {
        await page.click(upW);
        allMoves.push("up");
        backTrack.push(up);
        i = 1;
      } else if (right.includes("grey") || right.includes("green")) {
        await page.click(rightW);
        allMoves.push("right");
        backTrack.push(right);
        i = 1;
      } else if (left.includes("grey") || left.includes("green")) {
        await page.click(leftW);
        allMoves.push("left");
        backTrack.push(left);
        i = 1;
      } else if (down.includes("grey") || down.includes("green")) {
        await page.click(downW);
        allMoves.push("down");
        backTrack.push(down);
        i = 1;
      } else {
        if (allMoves[allMoves.length - i] == "right") {
          await page.click(leftW);
          i = i + 1;
        } else if (allMoves[allMoves.length - i] == "left") {
          await page.click(rightW);
          i = i + 1;
        } else if (allMoves[allMoves.length - i] == "up") {
          await page.click(downW);
          i = i + 1;
        } else if (allMoves[allMoves.length - i] == "down") {
          await page.click(upW);
          i = i + 1;
        }
      }

      let counter = 0;
      let twoWaytracker = [up, down, left, right];
      twoWaytracker.forEach((element) => {
        if (element.includes("grey")) {
          counter = counter + 1;
          if (counter == 2) {
            twoWaytrackerPosition.push(element);
          }
        }
      });

      let killLoop = [up, down, left, right];
      killLoop.forEach((element) => {
        if (element.includes("green")) {
          endloop = false;
        }
      });
    }
    await page.click('button:has-text("Submit")');
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
  try {
    return await page.getAttribute(locator, "class");
  } catch (e) {
    console.log(e);

    return "0";
  }
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
  await expect(page).toHaveURL(settings.baseURL + "/c/not_a_bot");
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

async function getLocator(xValue: unknown, yValue: number) {
  let locator =
    "//td[contains(@class, " + "'x" + xValue + " " + "y" + yValue + "'" + ")]";

  return locator;
}

async function observeAround(
  page,
  valueForlocatorCurrentPositionX,
  valueForlocatorCurrentPositionY,
  arg0: number,
  arg1: number
) {
  let xValue, yValue;
  if (arg0 < 0 && valueForlocatorCurrentPositionX == 0) {
    xValue = valueForlocatorCurrentPositionX;
  } else {
    xValue = +valueForlocatorCurrentPositionX + arg0;
  }
  if (arg1 < 0 && valueForlocatorCurrentPositionY == 0) {
    yValue = valueForlocatorCurrentPositionY;
  } else {
    yValue = +valueForlocatorCurrentPositionY + arg1;
  }

  let locator = await getLocator(xValue, yValue);
  let value = await getLocationDetails(page, locator, "Array");
  return value;
}
