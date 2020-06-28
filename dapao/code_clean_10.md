---
title: 可读代码编写炸鸡八 - 变量兜兜转转像是一场梦
date: 2020-05-31 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---

大家好，我是多选参数的一员 —— 大炮。

这里先剧透一下，

**在一段时间后，多选参数会搞一个抽奖福利，其中是有《可读代码编写的艺术》以及其他书籍(可能还有别的) 的福利。可以先关注「 多选参数 」，以方便第一时间参与抽奖。**

感谢各位，希望各位多多支持多选参数。

# 写在前头

[上一篇炸鸡](https://multiparam.com/2020/05/24/dapao/code_clean_9/) 中，提到了利用 **变量** 来简化表达式，以提升代码可读性。

在最早的炸鸡中，当知道了命名可以加入更多的信息时，会造成的一个潜在问题是，不知道加多少，怎么加合适，导致命名过长。

```
顺带一提，可以点击专辑看看之前的炸鸡哦。
```

这个情况放到这里也是一样的，为了利用变量简化一些代码，使用不当导致一些问题：

* 变量多，难跟踪
* 作用域变大，跟踪动向要花更多时间
* 改变频繁，难追踪当前值


这个炸鸡从三个方面来阐述草率的变量对代码可读性的影响和大致的应对方法吧。

![后台回复 「变量」获得源 pdf 文](http://img.multiparam.com/dapao/code/20200531074147.png)

# 变量多，那就减少
当一段代码，变量过多，就意味着你脑子要记住的变量也增多了。同时你还要面多复杂的逻辑，很快你就迷路了。

所以尽量减少变量是需要的，但是我们需要减少的是值得减少的变量。

所以看一下哪些变量值得被砍掉。

## 无价值的临时变量

我们看一段代码：
```python
now = datetime.datetime.now()
root_message.last_view_time = now
```

这个 ```now``` 变量
1. 没有分解复杂表达式。
2. 没有增加解释的作用。
3. 这个变量只用了一次，并没有压缩冗余代码。

这便是一个**无价值的临时变量**。

清理掉这个 ```now```，其实代码可读性更好:
```python
root_message.last_view_time = datetime.datetime.now()
```

## 过多的中间变量
这是一个将数组中指定的一个数值假删除的代码。
```c++

void delAnElement(int *array, int value_to_remove)
{
    int target_index = -1;
    for(int i = 0; i < len; i++)
    {
        if(array[i] == value_to_remove)
        {
            target_index = i;
            break;
        }
    }
    
    if (target_index != -1)
    {
        // 假删除
        array[target_index] = 0;
    }
}
```

这个 ```target_index``` 就是中间结果，还要为下文使用。但是我们完全可以再循环中就解决这件事，完全可以清除这个中间变量。

通过提早结束循环，返回函数结果的方法，去除中间变量，简化了代码。
```c++
void delAnElement(int *array, int value_to_remove)
{
    for(int i = 0; i < len; i++)
    {
        if(array[i] == value_to_remove)
        {
            array[i] = 0;
            break;
        }
    }
}
```

总之，越快完成代码越好，方便你自己，方便阅读者，岂不美哉？


## 别了，flag
我以前在写硬件端代码，是最反感 ```flag``` 这个东西的。这个东西只要有两个，代码就显得很混乱。

```c++
bool isInterruptFlag = true;
while(isOk() && !isInterruptFlag)
{
    ...
    
    if(...)
    {
        isInterruptFlag = true;
        ...
    }
}
```

这个 ```isInterruptFlag``` 就是 **控制变量**。经常被用来判断是否进一个代码块区域。

但是一般说来，如上的代码是可以通过更改结构来消除这个控制变量。

修改后大概结构如下：
```c++
while(isOk())
{
    ...
    
    if(...)
    {
        break;
    }
}
```

但是如果是如下代码呢？像这种多重嵌套循环的代码块，上述的办法是没有办法解决的。
```c++
bool flag1 = true;
while(isOk() && !flag1)
{
    ...
    // inner - while
    while(... && !flag2)
    {
        if (...)
        {
            flag2 = true;
        }
    }
    
    if(...)
    {
        flag1 = true;
        ...
    }
}
```

一般说来，出现这种代码，就要使用封装的办法，将 ```innner - while``` 的逻辑抽出，封装为一个函数。
```c++
void innerWhile()
{
    // inner - while
    while(... && !flag2)
    {
        if (...)
        {
            flag2 = true;
        }
    }
}

bool flag1 = true;
while(isOk() && !flag1)
{
    ...
    if (innerWhile())
    {
        ...
    }
    
    
    if(...)
    {
        flag1 = true;
        ...
    }
}
```
想来也搞笑，我项目组中有个策划天天嚷着他的功能需要抽出一个函数，他都懂这些，有些人却懒得去懂。


# 作用域太大，那就缩小
以前写 C 程序的时候，老师就禁止我们使用 **全局变量**。其实我觉得这是个好规矩，如果一个文件的顶部，放着一大堆全局变量，程序难以维护。

而且对于阅读者来说，要同时注意许多的全局变量，而全局变量的作用范围太广，导致许多函数都有可能与此变量交互，这个对于阅读理解和 **追踪变量的变化** 造成很大困难。

所以，对于变量要  **变量对尽量少的代码可见**，这样做的好处就是，减少了阅读者在脑中需要关注的变量数。

**所以我们要压缩变量的作用范围**。

所以接下来介绍一些场景下的应对方法来 **限制变量的作用范围**，抛砖引玉，如果还有更多的方法，欢迎交流。

## 类中的变量
我们来特别提一下**类**。类中的变量，对于整个类来说，都是可见可使用的。

所以类成员变量算做一个 **小型全局变量**。但许多人包括我，往往会把一到两个函数都会用到的变量上升至类成员变量。

### 让成员变量变成局部变量吧
是我们想象一下，一个庞大的类：
```c++
class LargeClass {
    string odd_str_;
    Obj obj;
    ...
    ...
    string hex_str_;
    
    void check()
    {
        hex_str_ = ...
        for(...)
        {
            hex_str_[i] += 'm';
        }
        show();
    }
    
    void show()
    {
        for(...)
        {
            cout << hex_str_[i] << endl;
        }
    }
    
    ...
    ...
    ...
};
```

只有 ```check``` 和 ```show``` 使用到了 ```hex_str_```。但是成员变量数量一大，阅读者仍要去注意 ```hex_str_``` 是否还会出现在其他方法里头。

我们可以将这个变量弄成函数内的变量，变成参数传值的变量。这样就让 ```hex_str_``` 只在这两个函数中使用，并且阅读者一看便知道这个变量不会再出现别的地方。
```c++
void check()
{
    string hex_str_ = ...
    for(...)
    {
        hex_str_[i] += 'm';
    }
    show(hex_str_);
}

void show(string hex_str_)
{
    for(...)
    {
        cout << hex_str_[i] << endl;
    }
}
```

这就是 **变量对尽量少的代码可见** 其中的一个应用。

### 静态
当然，我们还可以使用 **静态方法** 来隔离成员变量，告诉阅读者，这个方法中的变量，它们的作用域仅限于此。

或者我们可以大化小，大类划分成小类：
```c++
class HexStrClass {
    string hex_str_;
    
    void check()
    {
        hex_str_ = ...
        for(...)
        {
            hex_str_[i] += 'm';
        }
        show();
    }
    
    void show()
    {
        for(...)
        {
            cout << hex_str_[i] << endl;
        }
    }
};

class LargeClass {
    string odd_str_;
    Obj obj;
    ...
    ...
    HexStrClass hex_str_obj_;
    
    ...
    ...
    ...
};
```

## 利用语言的作用域管理

我们可以利用 if 的作用范围，来限制变量的作用范围。

### c++
我们看一下如下代码：
```c++
void GlodenSkyline(Enemy enemy)
{
    GlodenSkyline * gloden_skyline = new GlodenSkyline(enemy);
    if (gloden_skyline && enemy.hp <= gloden_skyline->damageValue())
    {
        enemy.hp = 0;
        cout << "敌无不斩，斩无不断，金色天际线。" << endl;
    }
    
    ...
    ...
    
    return;
}
```

关于金色天际线是做啥的，你可以理解我我比较中二，善用搜索好吧。

我们可以看到，其实只有程序前部分使用到了 ```gloden_skyline``` 这个变量，但是在函数前部 定义了这个变量，会让阅读者认为后头可能使用到，就需要记住这个变量，但其实，后头根本没有用到。

那么我们只要限制这个变量的作用范围，就会让阅读者知道，这个变量只在这一部分有用，后头用不到。这时候我们就可以使用 ```if```。

```c++
if (GlodenSkyline * gloden_skyline = new GlodenSkyline(enemy) && enemy.hp <= gloden_skyline->damageValue())
{
    enemy.hp = 0;
    cout << "敌无不斩，斩无不断，金色天际线。" << endl;
}

```

我们看到 ```gloden_skyline``` 只存在于 ```if``` 的范围中。阅读者往下阅读的时候，就不会再去在意这个 ```gloden_skyline```。

### 闭包
接触脚本语言的朋友不会不晓得这个概念，利用闭包将一些变量的可见范围锁死在其中。

我们直接来看如下代码：
```lua
local isOk = true

function check(name)
    if isOk then
        print("多选参数w")
        isOk = false
        return
    end
    
    isOK = true
end
```

其实对脚本语言，使用全局变量还是比较宽容的。但是还是会增加阅读者负担，如上代码使用 ```isOk```，但是这个其实只需要 ```check``` 使用，但是将 ```isOk``` 放在外头，增加阅读者负担的同时，编写者的维护也会存在难度。

我们利用闭包修改：
```lua
function check(name)
    local isOk = true
    
    return function(name)
        if isOk then
            print("okokokokok")
            isOk = false
            return
        end
        
        isOK = true
    end
end
```

这样外头的 ```isOk``` 便被消除，它的作用域也只在闭包之中。

## 声明定义下移
不要所有变量都在函数顶部，**相关的逻辑配相关的变量**，变量定义在逻辑前，让你的目力可及。

一般很早的 C 程序，要求声明必须写在函数体的开头，受此影响，我还有这样的习惯。

如果声明变量都必须在开头，函数内容再多一些的话，就又会出现先前提到的，阅读者需要记住多个变量以应对函数逻辑对这些变量的使用。

如下代码就是一个例子。一次性记住三个变量，若是函数篇幅稍微加长，**等于拉长了变量的作用域**，对代码阅读造成一定困难。
```python
def ViewFilteredReplies(original_id):
    filtered_replies = []
    root_message = Messages.objects.get(original_id)
    all_replies = Messages.objects.select(root_id=original_id)
    
    ...
    ...
    
    root_message.view_count += 1
    root_message.last_view_time = datetime.datetime.now()
    root_message.save()
    for reply in all_replies:
        if reply.spam_votes <= MAX_SPAM_VOTES:
            filtered_replies.append(reply)
    return filtered_replies
```

所以为了压缩变量作用域，我们可以在使用变量的逻辑前，再声明变量，将变量的作用域就固定在变量被使用的几行代码内：
```python
def ViewFilteredReplies(original_id):
    ...
    ...
    
    root_message = Messages.objects.get(original_id)
    root_message.view_count += 1
    root_message.last_view_time = datetime.datetime.now()
    root_message.save()

    filtered_replies = []
    all_replies = Messages.objects.select(root_id=original_id)
    for reply in all_replies:
        if reply.spam_votes <= MAX_SPAM_VOTES:
            filtered_replies.append(reply)
    return filtered_replies
```

# 变量值改变太多，那就降低频率

首先我们想到的就是利用常量，常量通常是初始化就定死了它的值，之后再不会被修改。

> 变量在越少 **不同** 的地方被使用、赋值，定位它的变化就越容易。

所以常量的好处便体现出来了。

但是我们知道，不可能什么变量都能用常量去代替，变量的值总会变化，所以我们只能将其 **变动的频率缩小**，或者是 **对变量的修改的代码放在一处**。

我们再拿这个例子来鞭尸：
```
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

我们会发现，此代码排除之前提到过的 **控制流不易读**, **表达式过长** 这两个问题外，还存在 **变量改变不好追踪** 的问题。很显然，这个 ```question``` 变量是最难追踪的，根据不同的逻辑赋值不同，那么我们只能将其的修改减小或者是 **修改其值得代码在一处**。

那么这样的 **一处** 应该是哪里，才可以集中管理这个变量的修改？

我的做法是抽象出一个 ```Question``` 类，```isEnd```、```nextQuestionId``` 等变量都变为其属性，需要给上层返回一个 ```question``` 的变量的话，完全可以封装一个抽象方法即可。

顺带一提，这代码还真是我写的，还真的把第二层的问题都囊括进来了，我还真是个下水道 bug 师。

# 总结
好了，难得又写完了一篇炸鸡，我们来稍微总结一下这篇炸鸡讲了啥。

* 清除不必要的变量。例如一些无意义的暂存变量、中间结果和控制变量。
* 压缩变量的作用域。
* 最好使用只需要赋值一次的变量。

# 写在后头

其实完全没有想过这系列炸鸡能写这么久，所以还是很感谢那些增长的阅读数与贡献者的读者们。

随着本篇的结束，可读代码编写的第二层其实也差不多结束了。如果没有看过之前的几篇炸鸡，欢迎各位点击专辑查看，了解一下第二层主要是什么，做了什么。当然我这里也提供了一份回顾的思维导图：

![后台回复 「第二层」获得源 pdf 文件](http://img.multiparam.com/dapao/code/20200531072516.png)

接下来的计划呢，便是第三层的内容了，这也是最后一层了，也许在不远的时间内，我就能把这系列的炸鸡写完了，也算个小成就吧。

如果第二层讲的是对代码逻辑的优化，也只是对部分代码的结构修改，那么第三层便是对代码组织有着较大的改动以达到提升代码可读的目的，希望我能稳当写完吧。