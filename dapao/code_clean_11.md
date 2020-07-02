---
title: 可读代码编写炸鸡九 - 抽取子问题
date: 2020-07-01 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---
大家好，我是多选参数的一员 —— 大炮。

原本想专门写个第三层的简介，但篇幅过短，也不会多少人看，就在本篇炸鸡简略提一下，然后便进入第三层的第一篇炸鸡就好。

我们回顾一下，可读代码编写第二层主要是讲了 **代码逻辑** 上的优化。

第三层便是更大的范围了，是关于代码组织，可以说是**函数级别的代码组织优化**。

其实第三层还是可以分成两个部分：

* 当你面对已经出现的不好代码该咋办
* 在你写代码前如何尽量避免不好代码

废话不多说，先上一个第三层的概览导图：

![后台回复 「第三层」获取源文件](http://img.multiparam.com/dapao/code/20200602070447.png)

所以本篇炸鸡从 **抽取不相关的子问题** 这一点入手可读代码编写。

# 写在前头

对于代码的编写，大事化小，小事化了。模块化是我们很需要的一个思想。

本篇炸鸡主要是讲 **提取无关的子问题**。

![公众号后台回复 「抽取」获得源 pdf 文件](http://img.multiparam.com/dapao/code/20200702062418.png)


为了达成这个目标，来个自问三连。



1. 看一下整个代码块或者一个函数，问一下自己，这个代码的 **最终目的** 是什么？
2. 对于代码的每一行，问一下自己，这样对这个目标有 **直接作用** 吗。还是这代码用于解决其他的**不相关的子问题**。
3. 如果解决不相关的子问题的代码开始变多，问一下自己，是不是**需要提取，封装为函数**。

本炸鸡主要关注：不相关的子问题的提取。所以本炸鸡需要提供不同条件下的例子，来阐述提取的技术。

而这个不相关的子问题，并不是和代码目的毫无干系的代码块，而是 **篇幅过大，但解决的问题只是很小一部分** 的代码块。



# 芜湖，如何抽取

首先要抽取不相关的子问题之前，得知道啥是不相关的子问题？

可以参考在上文的自问三连中的第一问：

```
这个代码的最终目的是什么
```

也就是与最终目的相关性不高的代码，都可以算作不相关的子问题，是附着代码。

我们看一段代码：
```lua
function wananDoA()
    -- do something about a
    ...
    -- do something about b
    ...
    ...
    ...
    ...
    ...
    -- do something about c
    ...
    ...
    ...
    ...
    ...
    
    -- do something about a
    ...
end
```

我用了一个比较抽象的代码，这段代码目标是 **wananDoA**，也就是做 ```A``` 相关的事情，但是函数里充斥着大量的解决其他子问题的附着代码 ```B``` 和 ```C```。

所以就需要将 ```B``` 和 ```C``` 相关代码抽取，比如这样：

```lua
function wananDoB()
    -- do something about b
    ...
    ...
    ...
    ...
    ...
end

function wananDoC()
    -- do something about c
    ...
    ...
    ...
    ...
    ...
end

function wananDoA()
    -- do something about a
    ...
    wananDoB()
    wananDoC()
    -- do something about a
    ...
end
```

我们可以发现，抽取完的代码整体：
* 不占用调用函数的篇幅
* 专注调用函数目标
* 被抽取代码拥有更好的拓展性，解耦合


其实抽取子问题的核心实现就是这样而已。今天的炸鸡到此结束，谢谢大家。

我开玩笑的兄弟，再接一些具体的抽取方法吧。

## 工具代码
大概各位的项目中都会有一个 「工具人」模块。就是存放一些工具代码，供各开发人员使用。

例如，字符串操作，日期操作等等，这些完全可以抽取为工具代码。

如下代码是游戏跨天要做的事情：
```lua
function onDayPass()
    -- 获取玩家数据
    ...
    ...
    
    -- 结算
    ...
    ...


    -- 数据落地
    ...
    ...
end
```

如果再结算的逻辑中，需要判断玩家的活跃时间是否在指定的时间区间内，同时需要知道玩家的最近上线时间与上一次离线时间是否在同一天。
```lua
function onDayPass()
    -- 获取玩家数据
    local user = getUser()
    ...
    ...
    
    -- 结算
    ...
    
    -- 指定区间    
    local beg, ending = readActiveIntervalConfig()
    local curTime = os.time()
    if curTime > ending then return false end
    if curTime < beg then return false end
    
    
    -- 上下线时间是否同一天
    local elapse = user.logoutTime - user.loginTime >= 0 and user.logoutTime - user.loginTime or user.loginTime - user.logoutTime
    if elapse > 86400 then
        return false
    end
    if os_date("%j",user.logoutTime ) != os_date("%j",user.loginTime) then
        return false
    end
    ...
    ...

    -- 数据落地
    ...
    ...
end
```

很明显，上述代码的结算逻辑中，判断时间区间，是否同一天等一系列逻辑都是 **篇幅大，但是解决的问题是很小的** 代码逻辑，也是复用性很强的代码，也就是前头说的 **实用工具代码**。

这些正是 **相关性较小的子问题**。

我们将其分出来。
```lua
-- 当前时间是否在一个区间内
function isInInterval(beg, ending)
    local curTime = os.time()
    if curTime > ending then return false end
    if curTime < beg then return false end
end

-- 绝对值
function mathAbs(t1, t2)
    return t1 - t2 >= 0 and t1 - t2 or t2 - t1
end

-- 是否在同一天
function isSameDay(t1, t2)
    if mathAbs(t1, t2) > 86400 then
        return false
    end
    
    if os_date("%j",t1 ) != os_date("%j", t2) then
        return false
    end
    
    return true
end
```

于是原本的代码被简化为：
```lua
function onDayPass()
    -- 获取玩家数据
    local user = getUser()
    ...
    ...
    
    -- 结算
    ...
    -- 指定区间    
    local beg, ending = readActiveIntervalConfig()
    if not isInInterval(beg, ending) then
        return false
    end
    
    -- 上下线时间是否同一天
    if not isSameDay() then
        return false
    end
    ...
    ...

    -- 数据落地
    ...
    ...
end
```

芜湖，多了几个工具代码，还缩小了函数篇幅，岂不美哉。

## 简化已有接口
什么是已有接口呢。其实这也有两个情况。

一个是语言层面已有的接口不能适应项目需求，导致一些函数体量得到不必要的增加。

我拿 ```lua``` 举例，```lua``` 中只有一个复杂的数据结构叫做 ```table```。```table``` 有相应的 ```table``` 库对其操作，但是不存在一个清空操作。如果在一串代码中，我需要清空一个 ```table```，那我得写这样的代码:

```lua
for key, _ in pairs(t) do
    t.key = nil
end
```

所以我还不如对 ```table``` 这个库再加一个 ```clear``` 方法。

```lua
table.clear = function(t)
    for key, _ in pairs(t) do
        t.key = nil
    end
end
```

还有一种情况，面对现有接口，参数过多的情况：

```lua
function interface(uid, aid, params, isSave, ...)
    ...
    ...
    ...
end
```

针对现有业务功能，完全可以在此接口上再封装一层接口：
```lua
function saveInterfaceWithRewardParams(uid, aid, ...)
    local params = {
        id     = 1001,
        type   = 1,
        amount = 3,
    }
    return interface(uid, aid, params, true, ...)
end
```

所以面对已有的接口，完全可以再进行包装。对于代码可读性来说，还是对调用的方便来说，都是有裨益的。

而且其实在调用方便这一层面，利用函数合适的命名，也是增强了代码的可读性。

# 不要过分抽取
看完前面的内容，最怕的情况是过度抽取。

看一下如下的抽象代码：
```lua
function _doA()
    ...
end

function _doB()
    ...
end

function _doC()
    ...
end

function _doD()
    ...
end

function _doE()
    ...
end

function wannaDoA()
    _doA()
    _doB()
    _doC()
    _doD()
    _doE()
end
```
我们可以看到，抽取了多个子问题，反而需要我们不断地跳转查看具体逻辑，反而增加了思想包袱，违背 **明确函数目标** 的初心。

# 总结
好了，这篇炸鸡算是到结尾了，其实这个炸鸡最关键的就是。

1. 阅读者注意力。
2. 函数的目的。
3. 篇幅。

所以为了使阅读者专注于函数的目的，我们需要将对于目的而言 **相关性较小的子问题** 抽取出来，变成一个独立的函数，甚至是库。这个取决于这个子问题使用的范围是一个文件，还是一整个项目。

本篇炸鸡基于此，罗列了许多抽取不同子问题的不同情况，但是总而言之，便是合理地将代码块抽取和封装。
