/* eslint-disable @typescript-eslint/no-unused-expressions */
// import {describe, expect, test} from '@jest/globals';
import {
  MouseButton,
  OpenFinHome,
  OpenFinNotifications,
  OpenFinProxy,
  OpenFinSystem,
  WebDriver,
  WebDriverKeys,
  NodeWebDriverWindow
} from "@openfin/automation-helpers";
import { NativeDriver, NativeDriverKeys } from "@openfin/automation-native";
import { By } from "selenium-webdriver";

let providerWindowUrl: string;
declare const globalThis: any;
declare const fin: any;

describe('Create a Window', () => {
  it("The runtime is ready", async () => {
    console.log("Tests Started", globalThis?.automation?.globalVars['startTime']);

    const isReady = await OpenFinSystem.waitForReady(10000);
    expect(isReady).toBe(true);
  });

  it('The title should be set', async () => {
    const title = await WebDriver.getTitle();
    expect(title).toBe('OpenfinAutomation');
  });

  it('The runtime version is formatted correctly', async () => {
    const fin = await OpenFinProxy.fin();
    const version: any = await fin?.System.getVersion();
    let i;
    let countOfDots;
    countOfDots = 0;
    for (i = 0; i < version?.length; i++) {
      if (version[i] === '.') {
        countOfDots++;
      }
    }
    expect(countOfDots).toBe(3); // xx.xx.xx.xx
  });

  it('The runtime version should be set', async () => {
    const fin = await OpenFinProxy.fin();
    const app = await fin?.Application.getCurrent();
    const manifest = await app?.getManifest();
    const manifestVersion = manifest?.runtime?.version;
    const version = await fin?.System.getVersion();
    expect(version).toBe(manifestVersion);
  });

  it('Can get a list of windows', async () => {
    const windows = await WebDriver.getWindows();
    expect(windows.length).toBeGreaterThan(0);
  });

  it("Can perform a conditional Node Webdriver specific test", async () => {
    if (globalThis.seleniumWebDriver) {
      await WebDriver.sleep(1000);
      const elem = await globalThis.seleniumWebDriver.findElement(By.xpath("//*[@id='pricing-grid']"));
      const title = await globalThis.seleniumWebDriver.executeScript("return document.title;");
      const AppComponent = await globalThis.seleniumWebDriver.executeScript("return window.AppComponent;");
      console.log('title, AppComponent: ', title, AppComponent, AppComponent.title);
      expect(elem).toBeDefined();
    }
  });

  it('Should render pricing grid button', async () => {
    
    const elem = await WebDriver.findElementByPath("//*[@id='pricing-grid']");
    expect(elem).toBeDefined();
  });

  it('Should render trading blotter button', async () => {
    const elem = await WebDriver.findElementByPath("//*[@id='trading-blotter']");
    // console.log('globalThis: ', globalThis?.AppComponent);
    expect(elem).toBeDefined();
  });

  it('Can exit the runtime', async () => {
    const fin = await OpenFinProxy.fin();
    await fin?.System.exit();
  });
});