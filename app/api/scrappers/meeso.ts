import puppeteer, { Browser, Page } from 'puppeteer';

interface Product {
  title: string;
  price: string;
}

// Scrapes product data from a given Meesho URL
const scrapeMeeshoWithPuppeteer = async (url: string): Promise<Product[]> => {
  console.log(url);
  
  const browser: Browser = await puppeteer.launch({
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page: Page = await browser.newPage();

  try {
    // Go to the provided URL and wait for the DOM content to be loaded
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    console.log('Page loaded, waiting for product cards...');
    
    // Wait for the product elements to load, based on the selector
    await page.waitForSelector('.product-card', { timeout: 30000 }); // Adjust the selector if necessary

    // Extract the product data (title and price) from the page
    const products: Product[] = await page.evaluate(() => {
      // Debugging: Check if product elements are being found
      const productElements = Array.from(document.querySelectorAll('.product-card')); 
      console.log(`Found ${productElements.length} product cards`);

      return productElements.map((product) => {
        const title = product.querySelector('h4')?.textContent?.trim() || ''; 
        const price = product.querySelector('.price')?.textContent?.trim() || '';
        return { title, price };
      });
    });

    if (products.length === 0) {
      console.warn('No products found!');
    }

    return products; // Return the scraped products
  } catch (error) {
    console.error('Error scraping:', error);
    return []; // Return an empty array in case of error
  } finally {
    await browser.close(); // Always close the browser to free up resources
  }
};

export default scrapeMeeshoWithPuppeteer;
