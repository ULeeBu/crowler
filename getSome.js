
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const url = 'https://www.dishen.com';
const fs = require('fs');
// 爬取主站链接
let links = [];
request(url, (error, response, html) => {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);
    // console.log(html);
    
    $('a').each((i, el) => {
      const link = $(el).attr('href');
      const reg = /^https:/;
      if (!reg.test(link) && link !== '/') {
        links.push(url+link);
      }
      // console.log(link);
    });
    // console.log(links);
    // fs.writeFileSync('test.txt', links);
  }
  crowler(links)
});

//爬取子站数据
const crowler = (url) => {
  url.forEach(el => {

    request({url:el,encoding:null}, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(iconv.decode(html, 'gb2312'));
        // console.log(html);
        let text = '';
// 爬取页面中的h3和p标签内容
    $('h3').each((i, el) => {
      text += $(el).text() + '\n\n';
    });

    $('p').each((i, el) => {
      text += $(el).text() + '\n\n';
    });

    fs.appendFile('output.txt', text, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
      }
    });
  });
};



