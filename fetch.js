const fs = require('fs');
const got = require('got');
const pLimit = require('p-limit');

// 直播间列表页 翻页参数 page=1
const urlList = 'https://api.live.bilibili.com/room/v1/room/get_user_recommend';
// 模型json地址 参数 roomid=1
const urlModel = 'https://api.live.bilibili.com/live/getRoomKanBanModel';

// ua referer 模拟
const referer = 'https://live.bilibili.com/';
// 自定义 ua + 来源页
const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
  'Referer': referer,
};

const dict = new Set(); // 用于去重
const limit = pLimit(30); // 并发控制

(async () => {
  // 抓取100页
  for (let i = 1; i <= 100; i++) {
    console.log(`fetch page: ${i}`);
    // 抓取列表
    const { body: { data: list } } = await got.get(urlList, { headers, query: { page: i }, json: true, timeout: 2000 });
    // 抓房间模型json
    await Promise.all(list.map(item => limit(async () => {
      console.log(`fetch roomid: ${item.roomid}`);
      headers.Referer = `${referer}${item.roomid}`; // 修改来源，房间页地址
      // 抓取模型json
      const { body } = await got.get(urlModel, { headers, query: { roomid: item.roomid }, json: true, timeout: 2000 });
      const png = body.textures[3].replace(/\?.+$/, ''); // 得到干净的 png 地址
      dict.add(png.match(/[^\/]+\/\w+\.png/)[0]); // 得到类型 (忽略 22，33 娘类地址)
      // fs.appendFileSync('tmp.txt', png + '\n'); // 记录到文本，防止跑崩从新开始
    }).catch((err) => console.error(err.message))));
  }

  // 输出结果
  fs.writeFileSync('list.json', JSON.stringify(Array.from(dict), null, 2), 'utf8');
  console.log('done!');
})().catch((err) => console.error(err.message));
