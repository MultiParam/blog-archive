---
title: 可读代码编写炸鸡十一 - 小黄鸭从你的心里游到脑子里
date: 2020-08-09 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---

大家好，我是多选参数的大炮。

可读代码编写的炸鸡很快要写到头了，从一开始的尝试到现在的倒计时，还是有一些成就感的。当然，这不是炸鸡篇幅缩短的托词。而是 **越到后头，其实内容越少，越需要代码的实践**。在上一篇炸鸡的结尾，我也提到了这一点，所以各位勿怪。

我们已经了解了，**抽取不相干子问题**，**让代码段尽量一次只做一件事** 对于代码可读性的优化，但是这些都是针对已经 **出现不好代码** 的情况。

而很多情况下，你要面对不少前人留下来的你不愿面对的糟糕代码，并且修改他，从此背上这口大锅。不过如果他们能 **在写之前** 就能想清楚该怎么写能尽量使代码通顺可读干净，你也少背锅，岂不美哉。

更何况，在编码前就要提醒自己尽量写出可读性高的代码，这也是对于自身的要求，与项目垃圾与否无关，不是吗。(当然，这句话是从我同事那里偷来的，他叫 pickline。)

再回顾一下可读代码编写的第三层：

![后台回复 「第三层」获取源文件](http://img.multiparam.com/dapao/code/20200602070447.png)

所以接下来两篇炸鸡，都是站在 **编码前就考虑如何减少不好代码** 的角度而提供的建议。

# 小黄鸭

各位或许都听说过，小黄鸭调试法吧，所谓的小黄鸭调试法就是：

```
当程序员面对 bug 却不可自查，陷入困顿时。在电脑旁放一只小黄鸭，一边抚摸它一边讲述自己的代码思路与流程，希望借此找到代码的漏洞。
```

所以这只小黄鸭完全可以用在编码，也可以称作 **小黄鸭编码法**。小黄鸭编码法就是 **面对一段需要实现的功能，先自己想一遍，说一遍功能的大致流程与细节，然后再对应地编码**。

# 编码前的大脑

《编写可读代码艺术》第十二章中也提到，其实写程序，就是人利用计算机语言来向计算机解释一件事情，就好像我们跟朋友讲述一个故事。所以自己说一遍自己要写的东西，是有帮助的。

小黄鸭编码法对可读性的提高有所帮助，尤其是一些较为复杂的逻辑判断，这个在业务中也是常见的校验流程。

如果发现自己代码整体有点复杂冗长，就更应该先小黄鸭一下，理清楚思路，而不是盲目上手。提高可读性的方法是很多，但是从一开始就规范起来，可以少走弯路。

假设我们一个 **依据配置提供下一题** 这样的业务需求。在编码前，我们的大脑可能不太清醒，认为的步骤是这样的：

```
返回一个 next question。

question 有跳转类型，any 和 right 才有 next question 的数据，如果是 right, 需要答对才能继续。

同时回答题目没有结束。(not isEnd)

没结束需要看 nextQuestionId, -1 的是随机，不然就是固定。
```

好了 ，如果依据这样的想法，我们写出了之前炸鸡中出现的例子来了。

```lua
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

写出的代码可读性较差，也反映了你的脑子里，还是稍显混乱的。

# 小黄鸭的游动

那么这时候，我们完全可以利用小黄鸭编码法，重新在讲述一遍业务需求和代码思路，将刚才稍显混乱的想法重新梳理。小黄鸭在你的心里出生，而它随着你的思绪游动到脑海。

```
我觉得刚才的思路需要重新梳理。

回答结束了，就直接结束了，不搞太多东西。

如果回答没结束需要看跳转类型，不符合就没数据返回。

确定有下一题，下一题需要确定随机还是固定生成。
```

接着把想法倾泻到代码中：

```lua
function QuestionSystem:giveNextQuestion(questionId, isAnswerCorrect)
    local question = {
        isEnd           = false,
        maxAnswerTime   = 11,
        nextQuestionId  = 0,
    }
    if self:isEnd() then
        question.isEnd = true
        return question
    end
  
    local questionConfig = Config.getConfById(questionId)
  	local nextAnyway     = questionConfig.nextType == NEXT_TYPE.ANY
  	local nextNeedRight  = (isAnswerCorrect and questionConfig.nextType == NEXT_TYPE.RIGHT)
    if not nextAnyway
    and not nextNeedRight then
    	return question
    end
  
  	self._count    = self._count + 1
    question.isEnd = false
    if questionConfig.nextQuestionId == -1 then
      question.nextQuestionId = math.random(1, questionConfig.maxNum)
    else
      question.nextQuestionId = questionConfig.nextQuestionId
    end
    question.maxAnswerTime = Config.getConfById(question.nextQuestionId).maxAnswerTime
    return question
end
```

嵌套减少了，思路清晰了，可读性也提高了。

# 小结

全篇炸鸡其实都在讲一件事情：小黄鸭编码。其实小黄鸭编码就是给自己一个 **同自己的想法对话的机会**。

其实从事编码相关的工作也有一年了，个人感觉编码过程中最冒失的事情便是 —— 直接下手去写。倒不是反对实践，是反对盲目下手。因为这个时候那只小黄鸭还未振翅游来，你的思路是没有打开的，不仅可读性可能受到破坏，而且很可能达不到所需。

如果在编码之前，先同自己对话，找到一只小黄鸭，慢慢地梳理思路，势必会比莽撞敲键盘来得好。而且这也花不去多少时间，着什么急呢。