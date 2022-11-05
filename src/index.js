const puppeteer = require('puppeteer');
const devices = puppeteer.devices;

const iPhonex = devices['iPhone X'];

(async () => {

	let input_email = `input[id="username"]`;
	let input_senha = `input[type="password"]`;

	let button_submit_login = `button[type="submit"]`;

	let button_search = `button[class='search-global-typeahead__collapsed-search-button']`;
	const randomico = Math.ceil(Math.random() * (100 - 0) + 0);
	//186.248.89.6
	//177.139.194.62:3128
	debugger;

	const browser = await puppeteer.launch({
		openInExistingWindow: true, /// ? something like this?
		headless: false,
		devtools: true,
		slowMo: 5,
		timeout: 99999999,
		args: [
			// '--proxy-server=186.248.89.6:5005',
			'--start-maximized',
			'--disable-notifications',
			'--disable-infobars',
			'--disable-web-security'
		]
	});

	page = (await browser.pages())[0];

	await page.emulate(iPhonex);

	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36');
	await page.goto('https://www.linkedin.com/login/pt?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');

	await page.$(input_email);
	await page.type(input_email, 'contato@backofficesolucoes.io');

	await page.$(input_senha);
	await page.type(input_senha, '@Mcd345715');

	await page.$(button_submit_login);
	await page.$eval(button_submit_login, form => form.click());

	await page.waitForNavigation();
	let title = await page.title();
	if (title === 'Verificação de segurança | LinkedIn') {

		console.log('Verificação de segurança');

	}

	await page.waitForSelector(button_search);

	await page.type(button_search, 'programador PHP AWS e node');
	await page.keyboard.press('Enter'); // Enter Key

	await page.waitForSelector('.artdeco-pill--2', {
		visible: true
	});
	await page.waitForTimeout(5000);
	await page.$$eval('button', anchors => {

		anchors.forEach(anchor => {
			console.log(anchor.textContent.trim());
			if (anchor.textContent.trim() === 'Pessoas') {
				anchor.click();
			}
		});

	})

	//await page.goto("https://www.linkedin.com/search/results/people/?keywords=php%20developer&origin=SWITCH_SEARCH_VERTICAL&sid=hR%2C")

	await page.waitForSelector('.artdeco-card')

	// const h1 = await page.$eval('h1', ele => ele.textContent);
	// if(h1 === 'Vamos fazer uma verificação rápida de segurança'){
	//   await page.reload();
	// }

	let perfils = []
	let match = "https://www.linkedin.com/in/";

	for (let indice = 1; indice < 2; indice++) {

		console.log(indice)

		await page.goto(`https://www.linkedin.com/search/results/people/?keywords=developer&origin=SWITCH_SEARCH_VERTICAL&page=${indice}`, {
			waitUntil: 'networkidle2',
			timeout: 99999999
		})

		await page.waitForTimeout(randomico);

		await page.evaluate( (randomico) => {
			window.scrollBy(randomico, window.innerHeight);
		})

		const hrefs = await page.$$eval('a', as => as.map(a => a.href));
		console.log(hrefs)

		hrefs.forEach(async (url) => {

			let urls_perfil = String(url.split('?')[0]);

			console.log(url.indexOf(match) != -1)
			console.log(perfils.indexOf(urls_perfil) === -1)

			if (url.indexOf(match) != -1 && perfils.indexOf(urls_perfil) === -1) {

				perfils.push(urls_perfil);

				// await page.goto();
				// await page.bringToFront();

				// await page.waitForSelector("data-control-name['save_to_pdf']");
				// await page.$eval("data-control-name['save_to_pdf']", form => form.click() );

				// await page.waitFor(10000);
				// await browser.close();

			}

		});

	}

	const page2 = await browser.newPage();

	perfils.map(async (lnk) => {

		try {

			console.log(lnk)

			await page2.goto(lnk)
		
			await  page2.waitForSelector("div[data-control-name='save_to_pdf']");
			await page2.$eval("div[data-control-name='save_to_pdf']", form => form.click() );

		} catch (err) {
			console.error(err);
		}

	})

	// await page.waitForSelector("button[arial-label='Página 2']", { visible: true });
	// await page.click("button[arial-label='Página 2']");

	// await browser.newPage(url_perfil, { waitUntil: 'networkidle2', timeout: 90000 }).then(async (page) => {
	//     console.log(page);
	//     console.log('Page loaded');

	// });


	// try {
	//   await page.$(selector)
	//   // Does exist
	// } catch {
	//   // Does not
	// }

	//await page.screenshot({path: 'example.png'});
	//await browser.close();

})();