---
title: 可读代码编写炸鸡三 - 审美
date: 2020-03-09 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---

大家好，我是多选参数的一员 —— 大炮。

在上一篇 [可读代码炸鸡二(下篇) - 命名的歧义](https://multiparam.com/2020/02/29/dapao/code_clean_3/) 的结尾处，提到了接下来的炸鸡会围绕 **多行代码，多个函数** 的代码范围来讨论代码可读性的优化。

由这个思路走的话，那么接下来的炸鸡大致会分成两个内容：

* 代码审美
* 代码注释

所以本篇炸鸡将讨论 **代码审美** 对于可读性的作用。

## 原则
* 一致布局，让读者很快习惯。
* 相似代码看起来要相似。
* 相关代码分组分块。

## 需要区分于设计
这只是代码外观组织上的优化，并非代码内部逻辑结构的重构优化。

但是审美上的要求在一定程度上会影响到代码内部逻辑结构。

## 为啥审美重要
喏，实践出真知。明显如下代码就是很差劲的代码编写。
```c++
class hamBurgerShop {
    public:
    // 敌无不斩，斩无不断
void Add(double d); // 增加一个东西
    private: int count; /* 多少
    */ public:
double Average();
    private: double minimum;
    list<double>
    past_items
    ;double maximum;
};
```

然后做一点审美层面的修改，你再看看，可读性瞬间提高。
```c++
// 汉堡店类 - 其实这个注释不用加。
class hamBurgerShop {
    public:
    void Add(double d);
    double Average();
    private:
    
    list<double> past_items;
    int count; // 多少个汉堡
    
    double minimum;
    double maximum;
};
```

代码中提到了一件事，也作为一个问题抛给大家。

> 为什么汉堡店类不需要注释？

这个问题会留到下一篇或者下下一篇炸鸡给出一些见解。

## 换行要一致且紧凑

首先我们设想一下这样的代码，生成两个 ```Fort``` 对象。但由于代码过长，可能会让你不断地使光标向右来查看完整代码(当然即使使用 ```vim``` 也得不断地按键)，不能让阅读者同屏阅读代码，增加阅读者负担。
```lua
local fort1 = Fort.new("k1", 2222, 300, 4000, true, true)
local fort2 = Fort.new("super kingdom fort", 22256, 300, 4400, true， false, ...) -- 更加地长
if xxx then
    Log("xxx", shellNum)
end
```

还有《The Art of Readable Code》中提到的例子，同样是代码过长造成的阅读负担。
```java
public class PerformanceTester {
    public static final TcpConnectionSimulator wifi = new TcpConnectionSimulator(500,80, 200, 1);
    public static final TcpConnectionSimulator t3_fiber = new TcpConnectionSimulator(500,80, 0, 0);
}
```

所以这时候换行就体现出作用了。

```lua
local fort1 = Fort.new("k1", 2222, 300, 4000, true, true)
local fort2 = Fort.new("super kingdom fort", 22256,
                        300, 4400, true， false, ...)
```

```java
//一种换行
public class PerformanceTester {
    public static final TcpConnectionSimulator wifi = new TcpConnectionSimulator(500,
                                                            80, 200, 1);
    public static final TcpConnectionSimulator t3_fiber = new TcpConnectionSimulator(500,
                                                            80, 0, 0);
}

//又一种换行
public class PerformanceTester {
    public static final TcpConnectionSimulator wifi
    = new TcpConnectionSimulator(500,80, 200, 1);
    public static final TcpConnectionSimulator t3_fiber
    = new TcpConnectionSimulator(500,80, 0, 0);
}
```

这样便将代码长度控制在可视范围内。但是相同作用的两行代码，却不一定能体现相同的参数位置，这样也会对阅读者造成一定影响。所以我们可以将换行变得**一致且紧凑**。

```lua
local fort1 =
    Fort.new(
    "k1",
    2222,
    300,
    4000,
    true,
    true)
local fort2 =
    Fort.new(
    "super kingdom fort",
    22256,
    300,
    4400,
    true
    false,
    ...)
```

```java
public class PerformanceTester {
    public static final TcpConnectionSimulator wifi =
        new TcpConnectionSimulator(
            500,    /* Kbps */
            80,     /* millisecs latency */
            200,    /* jitter */
            1       /* packet loss % */);
    public static final TcpConnectionSimulator t3_fiber =
        new TcpConnectionSimulator(
            45000,  /* Kbps */
            10,     /* millisecs latency */
            0,      /* jitter */
            0       /* packet loss % */);
    public static final TcpConnectionSimulator cell =
        new TcpConnectionSimulator(
            100,    /* Kbps */
            400,    /* millisecs latency */
            250,    /* jitter */
            5       /* packet loss % */);
}
```
当然，这在一定程度上增加了代码行数，所以不要过度使用这样的规则。同时如果需要多次使用这样的方法，是否需要思考一下，你的代码内部是否需要优化？是不是代码内部成为了庞大的**超级工厂**？

你可以选择优化代码结构，抽出更多的函数，或者可能需要一定的设计模式的内容，感兴趣的朋友可以自行查阅相关书籍与资料。

回想一下开头的原则，相似的相似，一致的布局。

同时需要提一嘴的是:

> 这个注释存在的意义是为参数加入更多的信息，例如上述代码是为了告诉阅读者参数的单位值。**若参数命名表达的信息足够完整，不用增加这样的注释**。当然这个问题在后头的炸鸡中我会详细说明。

但是这个注释和换行过于重复。我们可以将说明信息放到顶部，具体的如下所示。将函数名和参数列出，同时还列出参数具体意思。
```java
public class PerformanceTester {
    // TcpConnectionSimulator(throughput, latency, jitter, packet_loss)
    //                          [Kbps]      [ms]    [ms]    [percent]
    
    public static final TcpConnectionSimulator wifi =
        new TcpConnectionSimulator(500, 80, 200, 1);
    public static final TcpConnectionSimulator t3_fiber =
        new TcpConnectionSimulator(45000, 10, 0, 0);
    public static final TcpConnectionSimulator cell =
        new TcpConnectionSimulator(100, 400, 250, 5);
}
```


## 用封装方法来清除不太好看的东西
什么叫做不太好看？

例如四处使用重复的代码。
```lua
function giveItem(itemId, amount, srcUserUid, destUserUid, needSync)
end

function Map:addNeedFood2user(uid)
    local count = 0
    for _, city in pairs(self._cities) do
        if exp1 then count = count + 1 end
    end
    
    local needFood = self:baseFood() * 0.8 + count ^ 2 *0.12
    call2User(uid, "addFood", needFood)
end

function Map:isNeedExpand()
    local count = 0
    for _, city in pairs(self._cities) do
        if exp1 then count = count + 1 end
    end
    if count > 400 then
        return true
    else
        return false
    end
end
```
我们可以看到，这一个逻辑是都有用到的。
```lua
local count = 0
for _, city in pairs(self._cities) do
    if exp1 then count = count + 1 end
end
```
所以我们将这个逻辑封装和抽象，方便阅读者理解，同时方便了复用。
```lua
function Map:fetchCityNum()
    local count = 0
    for _, city in pairs(self._cities) do
        if exp1 then count = count + 1 end
    end
    return count
end

function Map:addNeedFood2user(uid)
    local count = self:fetchCityNum()
    local needFood = self:baseFood() * 0.8 + count ^ 2 *0.12
    call2User(uid, "addFood", needFood)
end

function Map:isNeedExpand()
    local count = self:fetchCityNum()
    if count > 400 then
        return true
    else
        return false
    end
end

```

我们再举一个例子。

如果多个相同函数执行，但是由于参数长短问题，使得代码整体，有的换行，有的太短，参差不齐。

我直接使用《The Art of Readable Code》的示例：
```c++
DatabaseConnection database_connection;
string error;
assert(ExpandFullName(database_connection, "Doug Adams", &error)
== "Mr. Douglas Adams");
assert(error == "");
assert(ExpandFullName(database_connection, " Jake Brown ", &error)
== "Mr. Jacob Brown III");
assert(error == "");
assert(ExpandFullName(database_connection, "No Such Guy", &error) == "");
assert(error == "no match found");
assert(ExpandFullName(database_connection, "John", &error) == "");
assert(error == "more than one result");
```

所以可以多封装一层函数，将代码规整。
```c++
void CheckFullName(string partial_name,
                   string expected_full_name,
                   string expected_error) {
    // database_connection is now a class member
    string error;
    string full_name = ExpandFullName(database_connection, partial_name, &error);
    assert(error == expected_error);
    assert(full_name == expected_full_name);
}
```
这样先前繁杂代码可以变成如下清爽的代码。
```c++
CheckFullName("Doug Adams", "Mr. Douglas Adams", "");
CheckFullName(" Jake Brown ", "Mr. Jake Brown III", "");
CheckFullName("No Such Guy", "", "no match found");
CheckFullName("John", "", "more than one result");
```

这样不仅去除了重复的代码，而且阅读代码的时候一目了然，增加新的一行代码只要如法炮制即可。

所以上述例子或多或少证明了如果编写者对于代码审美做了要求，那么在**一定程度上会优化代码的组织**。

## 善用列对齐
列对齐针对多个重复的函数的参数列表，可以起到代码规整的作用。如上文的多行 ```CheckFullName``` 函数，经过列对齐的修饰，会更加清楚：
```c++
CheckFullName("Doug Adams"  , "Mr. Douglas Adams"   , "");
CheckFullName(" Jake Brown ", "Mr. Jake Brown III"  , "");
CheckFullName("No Such Guy" , ""                    , "no match found");
CheckFullName("John"        , ""                    , "more than one result");
```
或者多列赋值的时候，也可以起到同样作用。
```python
details     = request.POST.get('details')
location    = request.POST.get('location')
phone       = request.POST.get('phone')
```

当然，一些复杂数据结构的赋值，也可以利用。
```lua
local t = {
    {"timeout",     1,      "shshshsh"},
    {"timeout",     2,      "hsh"},
    {"ti",          3,      "shshshsh"},
    {"tries",       4,      "shsh"},
    ...
}
```

## 用一个顺序来写代码

1. 最重要的语句最上，然后依次根据重要性的递减来排列语句。
2. 按照字母顺序来排列
3. 如果代码中提到了 A, B, C 三种命名，如果在同一个范围内(例如函数)再次使用了它们，调用顺序也保持一致。

第三种个人觉得较为普遍。我来解释一下。

假如一个代码需要三个步骤执行:
```lua
function test()
    
    ...
    ...
    firstStep:start()
    secondStep:start()
    thirdStep:start()
end
```

那么他们的相关变量的声明也根据这个顺序进行声明。
```lua
function test()
    local firstStep  = first:new()
    local secondStep = second:new()
    local thirdStep  = third:new()
    
    ...
    ...
    
    firstStep:start()
    secondStep:start()
    thirdStep:start()
end
```

## 分层或者分组思想
人更接受好的分组和层次，代码的过分堆砌，会使得阅读理解不太方便。例如下方列出的代码，看着难免有点费力：
```c++
class FrontendServer {
public:
    FrontendServer();
    void ViewProfile(HttpRequest* request);
    void OpenDatabase(string location, string user);
    void SaveProfile(HttpRequest* request);
    string ExtractQueryParam(HttpRequest* request, string param);
    void ReplyOK(HttpRequest* request, string html);
    void FindFriends(HttpRequest* request);
    void ReplyNotFound(HttpRequest* request, string error);
    void CloseDatabase(string location);
    ~FrontendServer();
};
```

许多人编写程序都有一个**模块化的习惯**，封装的方式取决于多次出现或者说可复用的代码量。

代码量|小|中|大
--|--|--|--
封装方式|函数|类|模块

所以分层分组的思想，这其实就是将代码的编写逻辑分模块。是在代码量更小的情况下，不至于上升至封装为函数的时候，对代码逻辑的的一个模块化，让 A 块代码做的事情为一组，B 块代码做的事情为一组。

这个思想主要体现在多个变量声明，函数定义的时候，例如类的定义。利用注释和分段，将不同组或者说不同层次的声明分开。
```c++
class FrontendServer {
public:
    FrontendServer();
    ~FrontendServer();
    
    // Handlers
    void ViewProfile(HttpRequest* request);
    void SaveProfile(HttpRequest* request);
    void FindFriends(HttpRequest* request);
    
    // Request/Reply Utilities
    string ExtractQueryParam(HttpRequest* request, string param);
    void ReplyOK(HttpRequest* request, string html);
    void ReplyNotFound(HttpRequest* request, string error);

    // Database Helpers
    void OpenDatabase(string location, string user);
    void CloseDatabase(string location);
};
```

同样，利用**注释和分段**，对一段逻辑代码进行总结和分段。

一开始代码如下：
```python
def make_a_hamburg():
    vegetable = Vegetables()
    meat      = Meat()
    bread     = Bread()
    kitchen   = Kitchen()
    kitchen.wash(vegetable)
    kitchen.cook(bread)
    kitchen.cook(meat)
    return kitchen.get_a_hamburg()
```

修改的代码如下，找的例子的确有点好玩，但是就是讲的这个分层次和总结的意思。
```python
def make_a_hamburg():
    # 准备食材
    vegetable = Vegetables()
    meat      = Meat()
    bread     = Bread()
    
    # 找好厨房
    kitchen   = Kitchen()
    
    # 开始制作
    kitchen.wash(vegetable)
    kitchen.cook(bread)
    kitchen.cook(meat)
    
    # 做好一个汉堡
    return kitchen.get_a_hamburg()
```

当然，这个方法容易使得空行比较多。我主程就要求我们尽量不要有空行，保持紧凑。

我个人觉得，如果能够很好地将代码有层次性地分开，多加空行是可以的；但如果加空行并不能达到这个效果，那只是徒增阅读者麻烦。

所以最终还是就 **是否可读性，使得阅读者理解更快理解** 这一标准衡量。


## 个人风格和项目风格一致性
> Consistent style is more important than the 「 right 」 style.

当然，每个项目有都有自己规定的一套风格，即使可能不太正确，但是尽量和这个风格保持一致。

保持项目风格一致，比坚持个人风格更重要，不然杂乱在一起，看的更难受。


## 小结
* 如果相似代码多次出现，就要考虑封装它们。
* 代码中变量的声明顺序可以按照首字母顺序，重要程度来排列。当然，还有自定义的顺序，如果是自定义，这就需要声明的变量的顺序和调用变量的顺序尽量保持一致，体现出自定义顺序的严谨。
* 善用注释和空行来将代码依据逻辑，功能作用等，进行分层，是一种更微型的模块化。
* 哦对了，列对齐可以规整多行赋值语句，还可以说明函数作用和参数信息。
