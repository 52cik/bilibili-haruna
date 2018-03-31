const fs = require('fs');
const got = require('got');

const urlList = 'https://api.live.bilibili.com/room/v1/room/get_user_recommend';
const urlModel = 'https://api.live.bilibili.com/live/getRoomKanBanModel?roomid=8016907';

// ua referer 模拟
const host = 'https://live.bilibili.com/';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
  'Referer': host,
};

const dict = new Set(); // 用于去重

(async () => {
  for (let i = 1; i <= 100; i++) {
    console.log(`fetch page: ${i}`);
    try {
      // 抓取列表
      const { body: { data: list } } = await got.get(urlList, { headers, query: { page: i }, json: true });
      for (let item of list) {
        console.log(`fetch roomid: ${item.roomid}`);
        headers.Referer = `${host}${item.roomid}`;
        // 抓取模型
        const { body } = await got.get(urlModel, { headers, query: { roomid: item.roomid }, json: true });
        const png = body.textures[3].replace(/\?.+$/, ''); // 得到干净的 png 地址
        dict.add(png.match(/[^\/]+\/\w+\.png/)[0]); // 得到类型 (忽略 22，33 娘类地址)
        fs.appendFileSync('tmp.txt', png + '\n'); // 记录到文本防止跑崩
      }
    } catch ({ message }) {
      console.log(`page ${i}: ${message}`);
    }
  }

  // 输出结果
  fs.writeFileSync('list.json', JSON.stringify(Array.from(dict), null, 2), 'utf8');
  console.log('done!');
})();
