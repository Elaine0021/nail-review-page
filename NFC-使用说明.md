# NFC 使用说明

这个网页已经整理成适合写入 NFC 的静态网页版本。

NFC 标签里不能直接存整个网页，它实际写入的是一个网址。正确流程是：

1. 先把本文件夹里的网页部署到线上。
2. 得到一个公网链接。
3. 把公网链接写入 NFC 标签。
4. 顾客手机碰 NFC 后打开网页。

## 推荐写入 NFC 的链接格式

如果你的网页部署后地址是：

```text
https://your-domain.com
```

建议写入 NFC 的地址是：

```text
https://your-domain.com/?code=8888
```

这样顾客碰 NFC 后会自动进入页面，不需要再手动输入访问码。

如果你想让顾客必须输入访问码，则写入：

```text
https://your-domain.com
```

默认访问码在 `data.js` 里：

```js
accessCode: "8888",
```

## 部署方式

这个项目是纯静态网页，不需要数据库，不需要后端。上传这些文件即可：

```text
index.html
styles.css
app.js
data.js
images/
```

推荐平台：Vercel、Netlify、Cloudflare Pages、腾讯云轻量服务器、阿里云服务器、宝塔面板静态站点。

## 图片怎么放

把你的店铺图片放到 `images` 文件夹，例如：

```text
images/shop-1.jpg
images/nail-1.jpg
images/nail-2.jpg
```

然后在 `data.js` 里改图片列表。

## 评价链接怎么改

在 `data.js` 里把这一行改成你的真实评价页：

```js
reviewUrl: "https://example.com/replace-with-your-review-link",
```

## 写入 NFC 的手机步骤

1. 准备 NFC 标签，建议 NTAG213 / NTAG215 / NTAG216。
2. 手机安装 NFC Tools。
3. 打开 NFC Tools，选择写入。
4. 添加记录，选择 URL。
5. 填入你的网页链接，例如 `https://your-domain.com/?code=8888`。
6. 点击写入。
7. 把 NFC 标签贴近手机 NFC 感应区。
8. 用另一台手机测试是否能打开网页。

不要写入本地电脑路径，例如 `C:\Users\...\index.html`。顾客手机打不开本地路径，必须写入 `https://` 开头的公网链接。
