package com.github.tachesimazzoca.selenium.htmlunit;

import com.gargoylesoftware.htmlunit.WebClient;
import java.util.Optional;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

public class Main {

  public static void main(String[] args) {
    // Disable both JavaScript and CSS.
    WebDriver webDriver = new HtmlUnitDriver(false) {
      @Override
      protected WebClient modifyWebClient(WebClient client) {
        final WebClient webClient = super.modifyWebClient(client);
        webClient.getOptions().setCssEnabled(false);
        return webClient;
      }
    };
    // Check if Microsoft Xbox Series X is available on Rakuten Books.
    webDriver.get("https://books.rakuten.co.jp/rb/16465627/?bkts=1");
    Optional<String> status = Optional.of(webDriver.findElement(By.id("purchaseBox")))
        .flatMap(el -> findBy(el, By.className("status-heading")))
        .flatMap(el -> findBy(el, By.className("status")))
        .map(el -> el.getText());
    System.out.println(status);
    webDriver.quit();
  }

  private static Optional<WebElement> findBy(WebElement el, By by) {
    try {
      return Optional.of(el.findElement(by));
    } catch (NoSuchElementException e) {
      return Optional.empty();
    }
  }
}
