---
title: 可读代码编写炸鸡七 - 表达式太长就拆
date: 2020-05-24 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---
大家好，我是多选参数的一员 —— 大炮。

上一篇炸鸡中，提到了可读代码编写的第二层分为三个方面：

* 控制流易读
* 拆分表达式
* 变量与可读性

同时上一篇炸鸡大致讲了 **控制流易读** 这一优化方向。

那么今天就说一说 **拆分表达式**

![公众号后台发送 「表达式」获得源文件](http://img.multiparam.com/dapao/code/20200524152321.png)

# 写在前头

写在前头其实主要讲讲本篇炸鸡的中心思想。

在 《可读代码编写的艺术》中，提到了一个很有趣的例子：

```
巨型乌贼身体设计有一个致命的弱点：在它的试管附近围绕着大脑。

所以它如果一次吞太多食物，它的大脑会受到伤害。
```

所以我们类比一下：
```
代码编写中，暂且拿一行代码来说。想要过多的语句或者表达式塞进一行中，阅读者的脑袋的确也会受到伤害。

再将这些代码在放到一起，对于阅读者来说，便是大段大段的 「 难以消化的食物 」
```

取上一篇的例子的部分内容：

```lua
if questionConfig.nextType == NEXT_TYPE.ANY
    or (isAnswerCorrect
    and questionConfig.nextType == NEXT_TYPE.RIGHT) then
    ...
end
```

这么一大串，其实已经是一个超长的表达式了，而当时我们就利用了一些方法将这个表达式拆分了。

所以本篇炸鸡的核心，便是 **拆分过长的表达式**


# 变量的拆分妙用

在 《可读代码编写的艺术》中，提出了两种概念

* 总结变量
* 解释变量

其实我个人更偏向将两个混为一谈：其实就是使用 **变量命名** 让阅读者更好了解这个表达式的作用与意图。

## 解释变量
如果还是分开讲的话，解释变量更针对表达式过长导致无法快速意图的情况。

继续鞭尸上一篇的例子：

```lua
if questionConfig.nextType == NEXT_TYPE.ANY
    or (isAnswerCorrect
    and questionConfig.nextType == NEXT_TYPE.RIGHT) then
    ...
end
```

我们将这个条件表达式，利用一个变量解释，让阅读者直接通过变量命名就了解意图：
```lua
local needJumpForAnswerCorrect = (questionJumpCondition == JUMP_TYPE.Right and isAnswerCorrect)
if needJumpForAnswerCorrect then ... end
```

或者再拿另一个例子：
```python
line.split(",")[1].split(':').strip
```

这段 ```python``` 代码，只知道 ```line``` 变量有字符串 ```split```，```strip``` 操作，但是已经构成了较长的表达式，同时还不太明白其意图。

如果增加一个解释性变量：
```python
username = line.split(",")[1].split(':').strip()
```

便很直观地知道，哦吼，这个是为了得到用户名。
## 总结变量
那么还有一种情况，表达式本身不复杂，能看懂但是需要一个变量给予一个意图说明。这样的变量叫做总结变量。

举个最简单的例子，```resourceNum``` 从一个函数传入，由于函数通用性，这样命名是更恰当的。
```lua
function shellNumCb(shellNum)
    ...
end

function getResourceNumHandle(resouceNum)
    local shellNum = resouceNum
    shellNumCb(shellNum)
end
```
但是 ```shellNumCb``` 需要的是 ```shellNum```，所以利用 ```local shellNum = resouceNum``` 来赋予一个意图，告诉阅读者，```resource``` 就是 ```shellNumCb``` 需要的 ```shellNum```。

如果实在区分不出这两个变量的区别，其实就不用区分了，大道至简，融会贯通，随机应变就好。

# 逻辑关系之变化
上一节大致是 **使用变量** 拆分简化解释表达式。

而从上一节的例子可以看出，长表达式多发处是在条件判断中，条件判断与逻辑关系运算息息相关。

所以这一节主要是讲利用 **逻辑关系运算** 的特性来拆分简化解释表达式。

## 德摩根律
说实话，在上离散的时候，教授这门课的老师讲这四个字的时候，语调是带着些洋气的，和他朴素的外表冲撞起来，惹得人欢乐。

关于德摩根律，就利用一下搜索引擎：
```
奥古斯都·德·摩根首先发现了在命题逻辑中存在着下面这些关系：

非(P 且 Q) = (非 P) 或 (非 Q)
非(P 或 Q) = (非 P) 且 (非 Q)
```

如果一个逻辑表达式，利用德摩根律会更加易懂，那就用。

```lua
if not (not kid and uid == 0) then
    do something...
end
```

将如上逻辑转换一下：

```lua
if kid or uid ~= 0 then
    do something...
end
```

的确明朗了一些。

## 短路逻辑不要滥用

短路逻辑有时候是很好用的。如下代码就会先判断 ```kid is nil or not```，如果为 ```nil```，后续判断不会走。这样保护了判断语句和执行代码。

```lua
if (kid and kid >= 1000) then
    ...
end
```

但是好用的东西也经不起滥用。

```lua
if (kid and kid >= 1000) or (uid and (uid > 1000 or uid == ROOT_ID)) then
    ...
end
```

这连读的欲望都没有。

## 取反

取反其实就是德摩根律的应用，但为什么需要单拎出来说呢？

主要是取反的动机。

**当发现一个判断条件参数过多，就要考虑它的反逻辑，也许更加简洁**。

这里我们直接看《可读代码编写的艺术》一书中提供的很好的例子。

有一个左闭右开的区间类 ```Range```

```
loca Range = {
    left = 0,
    right = 0,
}
```
如何判断两个区间有重叠？
```lua
function Range:isOverlapWith(rangeObj)
    return (self.left < rangeObj.left 
            and self.right > rangeObj.left) 
        or (self.left >= rangeObj.left 
        and self.left < rangeObj.right)
end
```

这样的条件，想起来繁杂，写起来难受，读起来犯难。
```lua
function Range:isOverlapWith(rangeObj)
    return (self.left <= rangeObj.left 
            and self.right > rangeObj.left) 
        or (self.left >= rangeObj.left 
        and self.left < rangeObj.right)
end
```



那么如果我们考虑，**不重叠** 这个情况呢？

```lua
function Range:isOverlapWith(rangeObj)
    return not (self.right <= rangeObj.left
    or self.left >= rangeObj.right)
end
```

所以当逻辑过于复杂时，考虑一下取反。

# 总结
感谢各位能看到这里，这里先剧透一下，

**在一段时间后，多选参数会搞一个抽奖福利，其中是有《可读代码编写的艺术》以及其他书籍(可能还有别的) 的福利。可以先关注「 多选参数 」，以方便第一时间参与抽奖**。

小结一下吧，本篇炸鸡主要针对表达式过长的问题提供一些建议

* 利用变量简化，解释与总结变量。
* 利用逻辑关系运算。主要是德摩根律，慎用短路逻辑，还有取反的动机。

本篇炸鸡就到这里了，多谢各位的阅读，希望读者能多提出意见，多多支持多选参数。