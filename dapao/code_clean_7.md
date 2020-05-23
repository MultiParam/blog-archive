---
title: 可读代码编写炸鸡五 - 教练，我想要来到第二层
date: 2020-05-11 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---
大家好，我是多选参数的一员 —— 大炮。

前几篇的炸鸡 (查看专辑即可，可读代码编写炸鸡一 - 可读代码编写炸鸡四)，都是针对 **命名**，**注释** 等代码范围较小的，针对语法词句上的情况进行优化，而且并不涉及很强的程序逻辑性。

所以这是可读代码编写的第一层。

而第二层开始接触 **代码逻辑** 上的优化，例如 **控制流**，**逻辑表达式** 等等。

我们可以试想一下，阅读代码如下代码的时候会有什么感觉？

```lua
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

是的，我们发现，阅读这段代码，我们需要同时间记住许多 **变量** 及其**数据的变化**、许多 **过繁的逻辑**、杂乱的 **控制流与表达式**，这很容易让人苦不堪言。

顺带一提，我的小组一位大哥写了一个功能，**几百行一个函数**，自行体会一下。

**如果你还要帮他修改 bug，你就不得不阅读这些代码，然后再体会一下**。

所以，当我们需要过多的精力去注意这些变量逻辑时，就已经背上了 **「 思想包袱 」**

这已经背离了代码可读性的初衷，使得 **代码理解难度攀珠峰**。

同时回头看看如上的代码，其实已经存在了一些 bug。

1. 可能 ```question``` 没有被返回。
2. 当 ```isEnd``` 为 ```true``` 时，其实已经多执行了一次。

这些 bug 藏匿在冗长的代码与复杂的逻辑中难以被诊疗，而这样的代码却真实地一直在生病。

本篇炸鸡只是接下来几篇炸鸡的一个药引子，所以我这里就举个例子便可以收尾了。