---
title: 可读代码编写炸鸡十 - 保持单纯
date: 2020-08-01 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---

大家好，我是多选参数的大炮。

难以置信，我用了一个月的时间重新捡起了这个炸鸡。很惭愧，我很长的时间没有阅读相关的东西了。但是感谢当时的我留下了宝贵的思维导图，保留了我当时的思路。

这篇炸鸡也是属于可读代码编写的第三层的内容，说实话我也有些生疏了，所以重新看一遍第三层的概览：

![后台回复 「第三层」获取源文件](http://img.multiparam.com/dapao/code/20200602070447.png)

所以上一篇是 **针对已经出现不好代码** 的一种处理方法，本篇炸鸡会先尝试说一下另一种处理方法 —— **一次只做一件事**。

![](http://img.multiparam.com/dapao/code/20200729121503.png)

当然我们也可以翻译成让代码 **保持单纯**。因为一次只做一件事的执著与质朴，已经被许多人放弃去了，但放弃的人不愿承认一两分，只好恼羞说着 **这是傻子** 之类的惹人哂笑的话。

# 难理解的「三心二意」

就不说写代码这么宽泛的，就单单说实现一个接口，很容易因为 **校验**，**判断** 等需求，增加了许多非直接服务于目标的代码。这个上一篇炸鸡便提到了，这叫做**不相干的子问题**，需要抽取。(可以看一下，给我加点业绩也是极好的。) 

但是抽取子问题会遇到一种情况，如果这些不相干的子问题 **被打散了散落在一个接口** 中呢？这就好像一段代码同时在做很多件事情，你以为你在玩并发，阅读者却以为你在玩他。其实这件事情，在上一篇炸鸡中也有提到解决方法，就是让相关的代码逻辑与相关变量，尽量放在一块。

在《编写可读代码艺术》第十一章中提供的一张图就能很形象地描述这类情况。

![截图自《编写可读代码艺术》第十一章](http://img.multiparam.com/dapao/code/20200729122909.png)

这就是可视化的三心二意呵，很明显，这样对可读性是有很大的伤害。而且这样的三心二意一定伴随着多变的数据流动，光这样的跟踪，就足够占据阅读者的精力了，谈何快速理解代码。

# 保持单纯与执着

虽然前文提到，上篇炸鸡提到的方法基本都与本篇炸鸡的思想沾边重叠了。因为 **上一篇讲的是直接服务于代码目标和非直接服务于代码目标中间的冲突与调和，那么其实这两段代码交织在一块，就是一种同时想做多件事情的三心二意**。

但是毕竟上篇的侧重点是**子问题的抽取**，而本篇炸鸡侧重一整段代码中分散的逻辑。毕竟提高代码的可读性的方法，本质上都是类似的。

那么就让代码保持单纯与执着，一次尽量只做一件事。我们有这样一段代码(我承认看起来有点蠢，但为了说明例子而为之)：

```lua
function sendMail2Aid(aid, content)
  local db 					 = getDb('u_xxx')
  db.send2aid        = aid
  local mailParam    = {}
  local info         = getAidInfo(aid)
  mailParam.content  = content
  mailParam.target   = aid
  if db.remainSendCount <= 0 then return end
  mailParam.tag      = info.tag
  db.lastTime        = os.time()
  sendMail2Aid(aid, mailParam)
 	db.remainSendCount = db.remainSendCount - 1
end
```

乍一看非常工整，审美上是说得过去的。但是读下去这段代码，发现逻辑上很跳脱。这一段代码主要是 `sendMail2Aid`，发送一封邮件给一个 `aid`。

但是分析下来，这段代码做了起码两件事，但却是交替进行的。先是读取数据，要对 `db` 做一些数据变动操作。

```lua
local db 					 = getDb('u_xxx')
db.send2aid        = aid
```

但是马上就变成邮件参数的构造了：

```lua
local mailParam    = {}
```

但马上又请求了 `aid` 相关的数据，你以为打算开始做一些校验判断了，但是又开始构造邮件参数数据了:

```lua
mailParam.content  = content
mailParam.target   = aid
```

就这样左右横跳，辗转反侧，阅读者会被这样的三心二意所累。所以我们将他们整合一下，让一段代码只做一件事：

```lua
function sendMail2Aid(aid, content)
  -- 获取数据，并且做一些校验
  local db 					 = getDb('u_xxx')
  local info         = getAidInfo(aid)
  if db.remainSendCount <= 0 then return end
  
  -- 发送邮件
  local mailParam    = {}
  mailParam.content  = content
  mailParam.target   = aid
  mailParam.tag      = info.tag
  sendMail2Aid(aid, mailParam)
  
  -- 相关记录
  db.send2aid        = aid
  db.lastTime        = os.time()
 	db.remainSendCount = db.remainSendCount - 1
end
```

所以，完全可以先理清自己的代码要做什么，**列成一个个任务**：`校验`，`发邮件`，`相关记录`。然后将他们各自归于一件事，一件事一件事做下去。

如果这件事体量太大，那我就抽函数嘛。

```lua
function sendMail2Aid(aid, content)
  -- 获取数据，并且做一些校验
  if not _check(aid) then return end
  
  -- 发送邮件
  _sendMail(aid, content)

  -- 相关记录
  _afterSendMail(aid)
end
```



# 小结

其实本篇炸鸡主要就强调了代码段中，尽量不要 「三心二意」，要保持「单纯与执着」。本篇炸鸡的内容其实不是很大，因为这个系列到了快结篇的时候了，你会发现很多的建议与方法，都是有本质上的相通点。

可读代码炸鸡的系列从第一层到现在的第三层，可读性提升的方法从小范围到大范围，提供了许多方法与建议。但是他们是各自有侧重点的，当你知道的越多，**你就需要更多的实践**，因为项目代码是 **复杂** 的，不可能是几个例子就能穷举。只有更多的实践，你才能权衡该怎么去写代码。

`talk is cheap, show me the code`.

