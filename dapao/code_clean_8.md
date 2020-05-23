---
title: 可读代码编写炸鸡六 - 控制流尽量向前奔涌就好，不要分心
date: 2020-05-23 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---
大家好，我是多选参数的一员 —— 大炮。

目前我还没想好该怎么写，多谢之前不嫌麻烦画的思维导图。

在 [上一篇](https://multiparam.com/2020/05/11/dapao/code_clean_7/) 作为引子的炸鸡中，我们知道接下来的可读代码的优化方向来到了 **开始接触代码逻辑上的优化** 的第二层。

而第二层分成如下几个方面：

* 控制流易读
* 拆分表达式
* 变量与可读性

所以很自然，本篇炸鸡是针对 **控制流易读** 这一方面写一些东西。

所以本篇炸鸡依照如图所示，分为两个大块来提供，针对于控制流的代码优化。
![回复 「 控制流 」即可获得思维导图源文件](http://img.multiparam.com/dapao/code/20200523073902.png)

# 写在前头
首先我们得知道控制流这个概念是什么。控制流其实就是 ```if/while/for``` 这样的改变代码运行走向的语句。

那么使用控制流不当，就自然会产生一个问题：

**代码逻辑走向变得复杂繁琐，让人需要大量的精力去追踪，从而产生思想包袱**

所以我们需要做的就是：

**让控制流更加地自然，让阅读者能够尽量从上至下阅读完，能有基本的理解，而不需要来来回回反复横跳来观看。**


# 条件语句

众所周知，```if/else``` 算是程序员的老朋友了。值得一提的事，我的项目中，有些功能硬是用 ```if/else``` 分支支撑起来。

那么 ```if/else``` 分支容易造成什么问题？
## 条件语句参数

其实这个细节在看书前，我还真没有注意到，其实这个细节更适合放到第一层来讲。

我们试想一下，假设我们接收到了一些数据，需要判断字节数是否超出发送缓冲区长度，超出则将缓冲区数据发送，没有则将数据存入。

其中判断是否超出长度时，缓冲区长度通常会用一个常量 ```MAX_BUFFER_LENGTH``` 定义，那么条件语句应该是：

```lua
if receiveByte <= MAX_BUFFER_LENGTH then
    ...
end
```

还是：

```lua
if MAX_BUFFER_LENGTH <= receiveByte then
    ...
end
```

回想一下，为了控制流语句 **更加自然** ，我们可以想象一下我们平常是怎么说一个判断的：

```
接受的字节数比缓冲区长度少的话，我们就 ...
```

所以 **左边是变化的值，右边是尽量被比较的，固定的值**。

## 条件语句组织顺序
使用 ```if/else/elseif``` 这样的代码组织终究是很普遍的，那么多种条件下，会产生多行条件语句，那么这时候，怎么样给这些条件罗列下来比较方便阅读呢？

我们可以看一个例子？

```lua
if id ~= ROOT_ID 
and self:isInBlockList(id)
and id ~= MGR_ID then
...
...
...
...
...
...
elseif id == ROOT_ID then
...
...
elseif not id then
...
...
...
...

```

例子中的省略号其实就代表了代码行数的多少，我们可以发现一开始就花精力其记住三个条件接着往下看代码，已经带着一定的思想包袱了。

所以 **简单先行**。将简单的条件放在前头判断，减轻负担。

```lua
if id == ROOT_ID then
    ...
elseif not id then
    ...
elseif self:isInBlockList(id)
and id ~= MGR_ID then
    ...
end
```

而且我们可以发现，由于条件语句顺序的对换，原本 ```id ~= ROOT_ID and self:isInBlockList(id) and id ~= MGR_ID``` 这样较大的条件语句也被缩减了。

但是如上的判断语句也可以这么修改。

```lua
if not id then return end
if id == ROOT_ID then
    ...
elseif self:isInBlockList(id)
and id ~= MGR_ID then
    ...
end
```
这便是又一种顺序：**有错误或者非预期情况，放置在前头。**

这样的写法通常就是用来降低代码出错的可能性。同时提前 return 还减少不必要的代码运行，也减少了后续条件语句的分支。

这样的写法还有一个帮助，便是 **减少代码嵌套**。这个我们下文会提到，便不再赘述。

那么为什么不这么调整呢？

```lua
if not id then
    ...
elseif id == ROOT_ID then
    ...
elseif self:isInBlockList(id)
and id ~= MGR_ID then
    ...
end
```
其实这样也是可以的，但是个人更建议将 ```not id``` 作为一种错误情况提前返回，而不是放在具体的条件分支中。

如果看过之前的炸鸡的朋友们应该对布尔型变量的命名有所印象，其中一条建议是：**不要用否定意味的词来修饰**，会导致意思很绕，反而增加阅读障碍。

放诸条件语句也是类似的，不仅影响理解，而且人对否定有更强烈的逆反心思，这样就不是自然的阅读顺序。

所以，条件语句组织顺序大致三种：

* 简单先行
* 错误先抛
* 正先否后

当然，当你写代码的时候，可以灵活选择这几个顺序，不用过于死板。

# 三目运算符 / do .. while / goto

因为这三者的内容不多，就放一起了。对他们的结论便是：

**尽量少用吧。**

## 三目

我们先说三目运算符。一般三目运算符可以替代简单的条件判断，从而简化代码。

```lua
local ret = byte < 10 and true or false
```

```c++
int ret = byte < 10 ? true : false
```

重点就是 **简单**。如果比较复杂的条件判断，用三目运算符是反而增加阅读难度的，并不能起到代码简化的作用。

```lua
local ret = (self:isInBlockList(id) and id ~= MGR_ID) and print(... ) or ....
```

这样的代码是变成了一行了，但在脑子里不还是拆成分支了，无疑是徒增烦恼。

## do .. while
那么接下来是 ```do .. while```。

这个语句不建议用有两个原因。第一个是因为顺序不够自然。要执行到底部，然后再看判断条件，然后再回头，这样其实比较奇怪。

第二个原因其实也是因为代码要先执行到底部，然后再看判断条件。因为我们知道，循环语句中的条件判断 ```while(...)``` 其实是 **起到了一种保护作用**，让伤害循环体代码的数据不会被执行。

但是 ```do .. while``` 是 **不管对错都要执行一遍**，这样当循环体中接收的数据有问题，无疑是伤害代码运行的。

## goto

目前我遇到的人中，谈 ```goto``` 必建议不要用。其实关键在于 **是否破坏了自然顺序**，让人不是自上而下阅读，而是反复横跳地看。

```c
for(..)
{
    if ( ! ... ) {goto _exit}
}

_exit:
    print("多选参数 886")
```
可以看到，所示代码其实没有什么问题，也不会增加什么思想包袱。

但是这样的话就是破坏顺序了：
```c
_second:

_first:
    ...

for(..)
{
    if ( ! ... ) {goto _exit;}
    if (...) {goto _second;}
    if (...) {goto _first;}
}

_exit:
    printf("多选参数 886");
```

所以还是少用吧。

# 嵌套

代码不可能都是一两个循环，条件判断就会解决的。

正是这些循环，条件判断的交织组合，造就了 **代码嵌套**。

代码嵌套很容易导致思想包袱，而且还是 **思想入栈**。你的脑子会一直想着：

```
在这个情况下，进入 ...，同时记住这个情况下，再进入 ...
```

像不像把你当前记着的条件入栈，但是你要知道，你的脑子不是计算机，没有保护现场。

那么为啥容易出现这种嵌套？

## 嵌套积累的原因

需求的变动。需求的变动。需求的变动。需求的变动。

这个是不少程序员深恶痛绝的东西，当周期截止时，突然告诉你

```
朋友，需求改了。

辛苦辛苦加加班。

我先回去了，你们加油。
```

直接喷脏话，不走程序。所以一开始这样的代码：

```lua
...
for _, kid in ipairs(kids) do
    if kid == SELF_KID then
        ...
    end
end
```
很容易就变成了：
```lua
...
for _, kid in ipairs(kids) do
    if kid == SELF_KID then
        ...
        if kid % 1000 ~= 0 then
            ...
        else
            ...
        end
    else
        ...
        if kid == 0 then ... end
    end
end
```
## 提前 return
我们可以拿 [上一篇炸鸡](https://multiparam.com/2020/05/11/dapao/code_clean_7/) 的例子开刀子，如下代码其实就是嵌套的一灾区。

```lua
-- QuestionSystem 为一个类

local Config = require "Config"
function QuestionSystem:isEnd()
    return self.hasAnswerdCount == Config.MaxQuestionCount
end

-- 题目系统，提供下一题
function QuestionSystem:giveNextQuestion(questionId, isAnswerCorrect)
    local question = {
        isEnd           = false,
        maxAnswerTime   = 11,
        nextQuestionId  = 0,
    }
    
    local questionConfig = Config.getConfById(questionId)
    if questionConfig.nextType == NEXT_TYPE.ANY
    or (isAnswerCorrect
    and questionConfig.nextType == NEXT_TYPE.RIGHT) then
        if not self:isEnd() then
            self._count = self._count + 1
            question.isEnd = false
            -- 随机一个
            if questionConfig.nextQuestionId == -1 then
                question.nextQuestionId = math.random(1, questionConfig.maxNum)
            else
                question.nextQuestionId = questionConfig.nextQuestionId
            end
            question.maxAnswerTime = Config.getConfById(question.nextQuestionId).maxAnswerTime
            return question
        else
            question.isEnd = true
            return question
        end
    end
end
```

我们阅读到判断语句时，我饿们需要先 「 入栈 」一个判断

```lua
questionConfig.nextType == NEXT_TYPE.ANY
or (isAnswerCorrect and questionConfig.nextType == NEXT_TYPE.RIGHT) 
```

当我们记住的时候，又遇到一个判断

```lua
not self:isEnd()
```

再将这个判断记住，思维入栈，我们又遇到了一个：
```lua
questionConfig.nextQuestionId == -1
```

好了，你的脑子里的思维栈已经是这样了：

你的大脑 |
--|
questionConfig.nextQuestionId == -1 |
not self:isEnd()|
questionConfig.nextType == NEXT_TYPE.ANY or (isAnswerCorrect and questionConfig.nextType == NEXT_TYPE.RIGHT) |

但你发现，还有其他情况，你得将这些情况一个个出栈再入栈。一通操作后，如上所示的思维栈说不定又印象不深了。于是又要在读一遍，周而复始，套娃行为。

我们知道，函数调用就是一次入栈，**我们把思维入栈就当做一个函数**，而阅读这样的嵌套代码，等于不断地传入不同判断条件的不断调用此函数的递归操作。那么我们不要那么多次入栈，就少调用它就好了，也就是 **提前 return**。

对的，前文提到的条件判断利用提前 return 来减少判断分支，其实已经是在尽量避免嵌套。

所以我们可以尝试着将一些情况先提前 return：
```lua
local questionConfig            = Config.getConfById(questionId)
local needJumpForAnyway         = (questionJumpCondition == QUESTION_JUMP_CONDITION_TYPE.Anyway)
local needJumpForAnswerCorrect  = (questionJumpCondition == QUESTION_JUMP_CONDITION_TYPE.Right and isAnswerCorrect)

if (not needJumpForAnyway) and (not needJumpForAnswerCorrect) then return question end

if self.isEnd() then
    question.isEnd = true
    return question
end


if questionConfig.nextQuestionId == -1 then
    question.nextQuestionId = math.random(1, questionConfig.maxNum)
else
    question.nextQuestionId = questionConfig.nextQuestionId
end
question.maxAnswerTime = Config.getConfById(question.nextQuestionId).maxAnswerTime
return question
```
可以对比之前的多嵌套代码，将一些特殊情况提前抛出，代码不仅清爽了不少，阅读起来思维入栈也不多。

而且这里已经使用了 **解释性变量** 来简化条件表达式，而这个内容，后几篇炸鸡会提到的，这里就看个效果图个乐。

## 循环中嵌套

嵌套的情况不光是 ```if/else``` 这样的嵌套，还有循环中的嵌套。例如前文的例子：
```lua
...
for _, kid in ipairs(kids) do
    if kid == SELF_KID then
        ...
        if kid % 1000 ~= 0 then
            ...
        else
            ...
        end
    else
        ...
        if kid == 0 then ... end
    end
end
```
解决这样的嵌套其实核心思想没有变，就是提前 return。

不过对于循环语句来说，挺多情况没法 return，那么就需要 **对于循环来说的提前 return**

就好比 ```continue```。如下代码所示，利用 ```continue``` 在遇到特殊情况提前停止当前循环，进入下一轮循环。

这样也会给阅读者一个印象，需要 ```continue``` 的条件是不被这个代码需要的。

```lua
for _, kid in ipairs(kids) do
    -- lua 没有 continue，所以用这个词来模拟。
    if kid ~= SELF_KID or kid == 0 then _continue end
    if kid % 1000 ~= 0 then
            ...
    else
        ...
    end
end
```


当然，提前 return 这样的方法有时候也能试用，例如从一个 ```table``` 找到指定的值：

```lua
for _, kid in ipairs(kids) do
    if kid == SELF_KID and kid % 1000 ~= 0 then return kid end
end
```

# 总结
好了，说了这么多，也不知道多少人能看到这里，还是做一个小小的总结吧。

本篇炸鸡是可读代码编写的第二层的第一个方面 —— 控制流易读。而控制流易读的核心便是

```
阅读起来自然，不需要重复回头看，少量的思维包袱。
```

所以围绕这个核心，提出了一些优化方法：

* 条件语句参数的顺序，左变化，右固定。
* if/else 的条件放置顺序大致有三个讲究，**简单先行，错误先抛，正先否后**。
* 一些语句 ```do .. while```、```goto``` 还有三目运算符尽量少用。
* 为减少代码嵌套的副作用，导致思维入栈，尽量使用 **提前 return** 的思想。

好了，本篇炸鸡暂时到这里，谢谢各位的阅读，如果觉得本篇炸鸡不错的朋友，可以点个 **在看** 或者将此篇炸鸡 **转发给你的朋友**，谢谢各位的支持。

再次感谢各位对多选参数的支持。