# 职业探索：本地使用与GitHub Pages发布说明

这是面向中国劳动力市场的纯静态网站：背景填写、本地规则建议、市场来源、问卷/访谈证据与本地反馈均已加入。没有后端、框架、npm、构建步骤或AI/LLM调用，不需要密钥。

本文供接手发布的人使用。准备工作没有创建GitHub账号或仓库，没有发布网站，没有运行git。以下注册和上传由发布者本人操作，全程可使用浏览器和Windows文件资源管理器。

## 一、先在本地检查

1. 如果收到`github-pages-ready.zip`，右键选择“全部解压缩”。不要在压缩包预览里直接打开网页，也不要把ZIP文件本身上传当作网站。
2. 进入解压后的目录，找到与`css`、`js`、`data`、`docs`文件夹同级的`index.html`，双击打开。也可直接打开项目目录中的`index.html`。
3. 填写少量不敏感的背景，刷新确认草稿恢复；点击“确认背景信息”只做表单校验。点击“生成探索建议”才生成四个方向，留空也能探索。
4. 检查“市场信息”“劳动者调查”“访谈发现”页面；点击结果中的依据链接、调查题号、访谈段落，展开原文并返回。
5. 修改背景后旧结果应撤下。重新生成，检查调查学习路径、访谈练习、结果末尾反馈的预览/下载/清空；下载只生成本地JSON，不发送给网站。
6. 缩窄窗口、用手机或键盘Tab检查阅读、焦点、下拉框及折叠内容。文件协议下的草稿保存受浏览器限制；若提示保存失败，勿声称已保存。

## 二、哪些内容将公开

公开仓库中的文件可以被任何人查看和下载；即使网页没有链接某个文件，上传到仓库也不等于私密。发布包只包含下方21个明确列出的文件。不要把整个开发文件夹直接拖到GitHub。

问卷和访谈的资料（`survey.html`、`interviews.html`及对应的`css`、`js`、`data`文件）按研究团队要求不在网站上公开，不要上传。

### 必须上传：完整清单

保持相对路径、大小写和文件名不变。这个清单既是上传清单，也是公开文件清单：

```text
.nojekyll
README.md
index.html
market.html
css/style.css
css/market.css
css/recommendation.css
js/app.js
js/market-audit.js
js/market.js
js/recommendation-engine.js
js/recommendation-ui.js
js/site-nav.js
js/result-evidence.js
js/beta.js
js/result-code.js
js/feedback.js
data/market-snapshot.js
data/recommendation-catalog.js
data/recommendation-profile-schema.js
docs/recommendation-logic.md
```

### 不要上传

- `config.js`、`config.example.js`、`.env`及任何密钥、口令或账号配置；本站不读取这些配置，不要填写密钥。
- `feedback/`整个目录（包括`.gitkeep`与任何JSON）、下载的`career-guidance-feedback.json`或其他用户反馈文件。
- 浏览器导出的背景、localStorage备份、填写过真实资料的截图、个人简历及录音、逐字稿或逐人答卷；这些不在上传包中。
- `AGENTS.md`、`docs/changelog.md`、`docs/decision-log.md`、`tools/`全部文件及`tools/pages-manifest.json`：这些是本地开发/维护材料。
- `.gitignore`、`.git/`（若存在）、`.agents/`、`.codex/`、`work/`、`outputs/`、临时文件、日志、备份、ZIP压缩包、`Thumbs.db`、`.DS_Store`。
- 问卷和访谈相关文件：`survey.html`、`interviews.html`、`css/survey.css`、`css/interview.css`、`js/survey-*.js`、`js/interview-*.js`、`data/survey-*.js`、`data/interview-findings.js`。
- 清单以外的任何文件，包括以后新增的文件；不要因为放在同一个文件夹就顺手上传。网页手动上传时不能依赖`.gitignore`替你保护文件。

本发布包的`docs`文件夹只应有`recommendation-logic.md`，它解释公开规则，其他本地日志不上传。站点中的背景只在浏览器保存；反馈只在当前页面暂存，用户主动下载后才成为本地文件，这些内容不是站点源码。

## 三、注册GitHub账号

1. 在浏览器打开[GitHub注册页](https://github.com/signup)，按页面提示选择用户名并设置登录方式。
2. 完成GitHub要求的验证，并验证邮箱。此过程属于GitHub账户注册，不要把账户资料填进职业探索网站或发给维护者。
3. 登录后进入个人首页。账户注册流程如有变化，参考[GitHub官方账号说明](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github)。

## 四、用网页创建仓库

1. 点击GitHub右上角“+”→ **New repository**；也可打开[创建仓库页面](https://github.com/new)。Owner选择自己的账号。
2. Repository name填写`ai-career-guidance`。这是项目网站仓库，不需要命名为`用户名.github.io`。
3. 选择 **Public**（公开）。本说明按GitHub Free公开仓库路径编写；不要为了保密而误以为发布后的网页一定私密。
4. 开启 **Add README**，让仓库先有一个初始文件和默认分支。不要选择模板、额外`.gitignore`或许可证文件；本次已有明确上传清单。
5. 点击 **Create repository**。进入仓库的 **Code** 页面，确认默认分支叫`main`。若实际名称不同，后面Pages必须选择实际有文件的分支，不要选空分支。

仓库选项以[官方创建仓库说明](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)为准。

## 五、从GitHub网页上传文件

1. 在仓库Code页选择`main`分支，点 **Add file → Upload files**。
2. 打开已解压的发布包。在文件资源管理器中进入含`index.html`的那一层，选中该层内的文件与`css`、`js`、`data`、`docs`文件夹，拖到网页上传区域。**上传包里面的内容，不要拖包的外层文件夹**，否则首页会多嵌套一层。
3. 等待列表显示所有文件，逐一对照21项清单。目录应显示为`css/style.css`、`js/app.js`等，不能把文件夹中的文件全部摊到根目录。README同名文件应被本项目版本更新。
4. 检查`.nojekyll`也在根目录。它是空的标记文件，关闭Jekyll内容处理。若网页没有接受空文件，可用 **Add file → Create new file**，文件名填写`.nojekyll`，内容写一行`# Static site`并保存；标记文件不要误命名为`.nojekyll.txt`。
5. 在 **Commit changes** 区域输入说明，例如“上传职业探索静态网站”。自己新建的仓库如提供直接保存到`main`选项，可选择后点击 **Commit changes**。这是GitHub网页保存操作，不需要安装或运行git。
6. 如果界面只提供 **Propose changes** 或要求新分支，按提示创建分支，点 **Create pull request**，检查文件清单，然后由仓库所有者点 **Merge pull request → Confirm merge**，让文件进入`main`。不要在未合入的分支上直接开启本文的发布配置。
7. 返回Code页的`main`，确认根目录直接有`index.html`和`.nojekyll`，以及market.html和css、js、data、docs四个目录；点进目录抽查文件完整。不要上传本地维护目录。

当前网页上传每次最多100个文件、单个文件不超过25 MiB；本清单在这些范围内。上传按钮与分支流程参考[GitHub官方网页上传说明](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。

## 六、开启GitHub Pages

1. 在仓库中点击 **Settings**（仓库设置，不是账号设置）；在左侧 **Code and automation** 下进入 **Pages**。窄屏可能先需要展开菜单。
2. 在 **Build and deployment → Source** 选择 **Deploy from a branch**。
3. 在 **Branch** 选择 **main**，文件夹选择 **/ (root)**，点 **Save**。不要选`/docs`；网站首页在根目录，`docs`仅存规则说明。
4. 等待GitHub处理，刷新Pages页面，查看站点地址/ **Visit site**。GitHub可能显示内置的“pages build and deployment”运行，这是托管平台发布过程，不是要求你安装构建工具。
5. 这个项目网站通常位于`https://你的用户名.github.io/ai-career-guidance/`。以Settings → Pages给出的实际地址为准；仓库Code页面的`github.com`地址不是网站地址。
6. 不设置自定义域名，不上传CNAME，不额外创建工作流。页面一直未就绪时，检查仓库 **Actions** 中Pages运行的错误、分支、根目录和文件名，修正后等待重新部署。

公开仓库与入口文件说明见[创建Pages网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)；分支和目录设置见[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。操作路径按2026-09-26查阅的官方文档整理，界面文字可能变化。

## 七、检查线上网站（不要只看首页）

1. 打开Pages给出的HTTPS地址，确认样式与本地相同。直接访问该地址下的`market.html`、`survey.html`、`interviews.html`，刷新各页，不能出现404。
2. 重做第一节的背景、推荐、证据跳转、调查分支、访谈展开及反馈下载检查。反馈不是发给网站；GitHub页面请求会到托管服务，但本程序不会把表单内容发出。
3. 本地文件与线上地址是不同的浏览器存储环境，本地背景草稿不会自动转到线上。先用少量不敏感内容确认线上刷新恢复，再检查清除草稿。不要把浏览器存储文件上传来“迁移”。同一GitHub账号下的多个项目共享站点域名，不应把浏览器存储视为各项目之间的强隐私隔离。
4. 在手机上检查长表格、折叠内容、菜单和表单；试用键盘Tab。脚本未加载、样式丢失时，核对相对目录、文件大小写和上传完整性；Windows上看似正常的大小写错误可能在线上失败。
5. **请实际在中国大陆网络检查**：让当地测试者用手机移动网络和家庭/办公网络分别打开站点及各子页，记录测试日期、运营商/网络类型、能否完整加载和主要功能是否可用。无需收集测试者身份。不要用站点在本机或境外能打开来推断大陆可用；本次没有大陆网络测试结果。
6. 把“网站本身打不开”和“某条外部证据链接打不开”分开记录；外部页面可能变化、限制访问或要求登录，不绕过限制，不编造验证成功。站点无需远程脚本/字体，页面载入后主要交互只用已加载的本地资源。若目标网络无法稳定访问，可先分发解压后的本地版本，另行评估获准的托管方式，本次不代为迁移。
7. 更新时只上传新一版核对过的公开清单文件，保持路径。已有不该公开的文件不会因再次上传而自动消失；应先停止继续上传并让维护者处理。不要把关闭Pages误认为仓库文件也变成了私密。

## 八、维护者说明与验证边界

公开规则见[推荐逻辑](docs/recommendation-logic.md)。完整开发副本还有AGENTS、决策日志及可选Node检查脚本，按本清单它们不在发布包中；站点运行不需要安装Node。

完整开发副本可运行`node tools/check-pages.cjs`检查公开清单、相对路径在file://和项目子路径下的解析、大小写、本地依赖、常见密钥/个人信息模式和清单外文件。发布准备还运行既有背景相关推荐、问卷、访谈、市场与反馈模拟检查。静态/DOM模拟不等于真实浏览器验收，也不能自动判定研究材料的公开许可或排除所有可识别信息。

市场研究日期仍为原快照日期；问卷统计和团队访谈原文件未改动。没有新建账号、仓库、线上地址或进行实际发布。实际桌面/手机浏览器、线上托管与中国大陆可访问性由发布者按上述步骤检查。
