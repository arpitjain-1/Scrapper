import * as cheerio from 'cheerio'; 
import axios from 'axios';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';

const baseUrl = "https://ww13.gogoanimes.fi/";

async function newSeason(page) {
    let anime_list = [];

    const res = await axios.get(`${baseUrl}/new-season.html?page=${page}`);
    const body = await res.data;
    const $ = cheerio.load(body);

    $('div.main_body div.last_episodes ul.items li').each((index, element) => {
        const $elements = $(element);
        const name = $elements.find('p').find('a').html();
        const img = $elements.find('div').find('a').find('img').attr('src');
        const link = $elements.find('div').find('a').attr('href');
        anime_list.push({ name, img_url: img, anime_id: link.slice(10) });
    });

    return anime_list;
}

async function popular(page) {
    let anime_list = [];

    const res = await axios.get(`${baseUrl}/popular.html?page=${page}`);
    const body = await res.data;
    const $ = cheerio.load(body);

    $('div.main_body div.last_episodes ul.items li').each((index, element) => {
        const $elements = $(element);
        const name = $elements.find('p').find('a').html();
        const img = $elements.find('div').find('a').find('img').attr('src');
        const link = $elements.find('div').find('a').attr('href');
        anime_list.push({ name, img_url: img, anime_id: link.slice(10) });
    });

    return anime_list;
}

async function search(query) {
    let anime_list = [];

    const res = await axios.get(`${baseUrl}/search.html?keyword=${query}`);
    const body = await res.data;
    const $ = cheerio.load(body);

    $('div.main_body div.last_episodes ul.items li').each((index, element) => {
        const $elements = $(element);
        const name = $elements.find('p').find('a').html();
        const img = $elements.find('div').find('a').find('img').attr('src');
        const link = $elements.find('div').find('a').attr('href');
        anime_list.push({ name, img_url: img, anime_id: link.slice(10) });
    });

    return anime_list;
}

async function anime(_anime_name) {
    let episode_array = [];

    const res = await axios.get(`${baseUrl}/category/${_anime_name}`);
    const body = await res.data;
    const $ = cheerio.load(body);

    const img_url = $('div.anime_info_body_bg img').attr('src');
    const anime_name = $('div.anime_info_body_bg h1').text();
    const anime_about = $('div.main_body div:nth-child(2) > div.anime_info_body_bg > p:nth-child(5)').text();

    const el = $('#episode_page');
    const ep_end = el.children().last().find('a').text().split("-")[1];

    for (let i = 1; i <= ep_end; i++) {
        episode_array.push(`${_anime_name}-episode-${i}`);
    }

    return { name: anime_name, img_url, about: anime_about, episode_id: episode_array };
}

async function watchAnime(episode_id) {
    const res = await axios.get(`${baseUrl}/${episode_id}`);
    const body = await res.data;
    const $ = cheerio.load(body);
    const episode_link = $('li.dowloads > a').attr('href');

    const ep = await getDownloadLink(episode_link);
    return ep;
}

async function getDownloadLink(episode_link) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(new UserAgent().toString());
    await page.goto(episode_link, { waitUntil: 'networkidle0' });

    const links = await page.evaluate(() => {
        let ep_links = [];
        const ep = document.querySelector(".mirror_link");
        ep.querySelectorAll('a').forEach((link) => {
            ep_links.push({ "name": link.innerText.split("D ")[1].replace(/[()]/g, ""), "link": link.href });
        });
        return ep_links;
    });

    await browser.close();
    return links;
}

export { popular, newSeason, search, anime, watchAnime };
