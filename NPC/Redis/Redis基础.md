---
title: 新手村：最适合新手的 Redis 基础
date: 2020-03-07 00:00:00
tags:
- 普通村民
category:
- 计算机
---

## 1. 什么是Redis

我们先看看[Redis官网](https://redis.io/)给的介绍：
> Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. Redis has built-in replication, Lua scripting, LRU eviction, transactions and different levels of on-disk persistence, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.

简而言之，Redis是一个开源的使用ANSI C语言编写、遵守BSD协议、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种数据类型，功能挺强。

## 2. Redis之父
Redis之父是Salvatore Sanfilippo，一名来自意大利西西里岛的程序员，大家更习惯称呼他Antirez。如果你对他感兴趣，可以去他的[博客](http://antirez.com)逛逛，或者去关注他的[github](http://github.com/antirez)。

## 3. Redis有什么优势
* **速度快**：Redis使用内存来存储数据集，且支持Pipelining命令，可以一次发送多条命令。
* **持久化**：可以把内存中的数据保存在磁盘中，在重启时可重新加载使用。
* **原子性**：所有操作都是原子性的，同时支持事务。
* **数据结构丰富**：支持字符串、列表、哈希、集合及有序集合，满足大多数使用需求。
* **支持多种语言**：Redis支持许多语言，如C、C++、C#、Go、Java、JavaScript、PHP等等。
* **多种特性**：Redis还支持publish/subscribe, 通知, key 过期等特性。

## 4. Redis能做什么
因为Redis交换数据速度快，所以常在服务器中被用于存储一些需要频繁调取的数据，相比于直接读取磁盘来获得数据，使用Redis可以节省大量时间，提升效率。
举个例子：

> 某视频网站每天有100万人访问首页推荐视频专栏，如果都从数据库查询读取，那么每天都至少要多出100万次数据库查询请求。若使用了Redis，将常被调取的数据存到内存中，每次节约0.1秒，100万次就有10万秒，极大程度提高了速度与开销。

总之，Redis的应用场景十分广泛，且价值极高，现在就开始学学基础。

## 5. 安装Redis
工欲善其事必先利其器，学习Redis的第一步肯定就是安装Redis。由于我的环境是Windows系统，就只演示Windows下安装Redis。如果你不想安装Redis，但想体验一番，可以去官网提供的[在线测试网站](http://try.redis.io/)，里面也附有简单的介绍和教程。
- Windows下安装Redis
**下载地址**：<https://github.com/microsoftarchive/redis/releases/tag/win-3.2.100>
这里我们下载**Redis-x64-3.2.100.zip**压缩包文件(如果有更新版本，可以下载最近更新的稳定版本)。

![download](http://img.multiparam.com/npc/redis/p1.png)

下载好之后解压到自己的文件夹中。例如我解压到D:\redis中。

![unzip](http://img.multiparam.com/npc/redis/p2.png)

打开一个**cmd**窗口，使用cd命令切换目录到解压后的文件夹路径（例如我切换目录到D:\redis），然后运行命令：
```
redis-server.exe redis.windows.conf。
```
输入之后会显示如下界面：

![redis-server](http://img.multiparam.com/npc/redis/p3.jpg)

这样我们就打开了一个redis服务端，从图中我们可以看到一些信息，比如端口号为6379。如果要使用redis服务端，我们需要**再打开一个cmd窗口，原来的不要关闭，不然就不能访问服务端了**。同样将路径切换到redis目录下，然后运行：

```
redis-cli.exe -h 127.0.0.1 -p 6379
```

存入一个键值对：
```
set firstkey "hello redis"
```
取出键值对：
```
get firstkey
```
关闭连接：
```
quit
```
![first_use](http://img.multiparam.com/npc/redis/p4.jpg)

这样我们就完成了Redis在Windows下的安装并初次体验了Redis的key-value存储方式。

## 6. Redis数据结构
Redis支持五种数据结构：**String(字符串)、Hash(哈希)、List(列表)、Set(集合)以及SortedSet(有序集合)**。下面我们简单介绍下每一种数据结构以及他们的基本命令。
1. **String**
String是Redis最基本的数据结构，也是任何存储系统都必备的数据类型。String类型是二进制安全的，简单来说，基本上你什么都能用字符串存储，你可以把图片文件的内容或者序列化的对象作为字符串来存储。String类型的值最大可以存512MB，确实基本什么都够存了。
    - set key value：设置指定键的值
    ```
    > set mykey "hello world"
    OK
    ```
   ***
    - get key：获取指定键的值
    ```
    > gey mykey
    "hello world"
    ```
   ***
    - getrange key start end：返回key中字符串的子串
    ```
    > getrange mykey 6 10
    "world"
    > getrange mykey 0 20
    "hello world"
    > getrange mykey 0 -1
    "hello world"
    ```
    > **Tips**：从上面几个实例，我们不难看出字符串起始从0开始；若end大于字符串长度时返回完整字符串；而当end为-1时，end为字符串最后一个字符。
   ***
    - getset key value：设置指定键的新值，并返回旧值
    ```
    > getset database "mysql"
    (nil)
    > get database
    "mysql"
    > getset database "redis"
    "mysql"
    > get database
    "redis"
    ```
    > **Tips**: 当键未设置时，会返回(nil)。
   ***
    - strlen key：返回键所存储的字符串值的长度
    ```
    > strlen mykey
    (integer) 11
    ```
   ***
    - append key value：如果可以已存在且是一个字符串，则将指定value添加到原值末尾,会返回操作后字符串长度
    ```
    > append mykey ", hello redis"
   24
    >get mykey
    "hello world, hello redis"
    ```
   ***
    - incr key：整数值+1
    ```
    > set incr_num 10
    OK
    >get incr_num
    "10"
    >incr incr_num
    (integer) 11
    ```
   ***
    - incrby key increment：整数值增加给定整数值(increment)
    ```
    > incrby incr_num 4
    (intrger) 15
    ```
   ***
    - incrbyfloat key increment：数字值增加给定浮点值(increment)
    ```
    > incrbyfloat incr_num 0.5
    15.5
    ```
    > **Tips**：整数值会显示为integer，当变为浮点型后并不会提示为float
   ***
     - decr key：整数值-1
    ```
    > set decr_num 10
    OK
    > get decr_num
    "10"
    > decr decr_num
    (integer) 9
    ```
   ***
    - decrby key decrement：整数值减少给定整数值(decrement)
    ```
    > decrby decr_num 4
    (integer) 5
    ```
    > **Tips**：redis并没有数字值减少给定浮点值的命令，如果我们想要decr_num减少2.5，可以用**incrbyfloat**命令执行**incrbyfloat decr_num -2.5**。
    > ```
    > > incrbyfloat decr_num -2.5
    > 2.5
    > ```
2. **Hash**
Hash存储的是field和value的映射关系，适合用户存储对象。比如要存储一个用户的姓名、年龄、地址等，就可以使用Hash。每个Hash可以存储2<sup>32</sup>>-1个field-value对(4294967295，40多亿)。
    - hset key field value：设置哈希表中key中field的值为value
    - hget key field：获取哈希表key中field对应的value
    ```
    > hset myhash name "test"
    (integer) 1
    > hget myhash name
    "NPC"
    > hset myhash name "NPC"
    (integer) 0
    ```
    > **Tips**：使用hset命令，新建字段并设置值成功后返回1，如果修改已有字段的值则返回0。
   ***
    - hmset key field1 value1 [field2 value2]：同时设置哈希表key中的多个field-value对。
    ```
    > hmset myhash age "20" country "China"
    OK
    ```
   ***
    - hexists key field：查看field是否存在于哈希表key中
    ```
    > hexists myhash name
    (integer) 1
    > hexists myhash phone
    (integer) 0
    ```
    > **Tips**：哈希表key中含有字段field返回1，不含有或对应key不存在返回0。
   ***
    - hmget key field1 [field2]：获取哈希表key中所有给定field的value
    ```
    > hmget myhash name age phone
    1) "NPC"
    2) "20"
    3) (nil)
    ```
   ***
    - hgetall key：获取哈希表key中所有field-value对
    ```
    > hgetall myhash
    1) "name"
    2) "NPC"
    3) "age"
    4) "20"
    5) "country"
    6) "China"
    ```
   ***
    - hkeys key：获取哈希表key中所有field
    ```
    > hkeys myhash
    1) "name"
    2) "age"
    3) "country"
    ```
   ***
    - hvals key：获取哈希表key中所有value
    ```
    > hvals myhash
    1) "NPC"
    2) "20"
    3) "China"
    ```
   ***
    - hlen key：获取哈希表key中字段的数量
    ```
    > hlen myhash
    3
    ```
   ***
    - hdel key field1：删除哈希表key中一个field
    ```
    > hdel myhash age
    (integer) 1
    ```
3. **List**
Redis的List类型是简单的字符串列表，在底层实现上相当于一个链表，我们可以在列表的头部(左边)或尾部(右边)添加值。列表最多可以存储2<sup>32</sup>>-1个元素(4294967295，40多亿)。
    - lpush key value1 [value2]：将一个或多个值插入到列表头部(左边)
    - rpush key value1 [value2]：将一个或多个值插入到列表尾部(右边)
    ```
    > lpush mylist "a" "b"
    (integer) 2
    > rpush mylist "c" "d"
    (integer) 4
    ```
    > **Tips**：执行lpush和rpush命令后返回列表的长度。
   ***
    - llen key：获取列表长度
    ```
    > llen mylist
    (integer) 4
    ```
   ***
    - lrange key start end：获取列表指定范围内的值
    ```
    > lrange mylist 0 -1
    1) "b"
    2) "a"
    3) "c"
    4) "d"
    > lrange mylist 1 -2
    1) "a"
    2) "c"
    ```
    > **Tips**：由上述例子我们不难看出lrange命令中的start和end参数都是索引值，其中0代表第一个元素，-1表示最后一个元素。
   ***
    - lindex key index：通过索引获取列表中元素
    ```
    > lindex mylist 0
    "b"
    ```
   ***
    - lpop key：移除并获取列表头部的值
    - rpop key：移除并获取列表尾部的值
    ```
    > lpop mylist
    "b"
    > rpop mylist
    "d"
    ```
   ***
    - lrem key count value：根据count的值，移除列表中与参数value相等的元素
    ```
    > rpush rem "hello" "hello" "redis" "hello"
    (integer) 4
    > lrange rem 0 -1
    1) "hello"
    2) "hello"
    3) "redis"
    4) "hello"
    > lrem rem -2 "hello"
    (integer) 2
    >lrange rem 0 -1
    1) "hello"
    2) "redis"
    ```
    > count>0：从左往右搜索列表，移除与value相等的元素，数量为count。
    > count<0：从右往左搜索列表，移除与value相等的元素，数量为count的绝对值。
    > count=0：移除列表中所有与value相等的元素。
4. **Set**
Set(集合)存储string类型的值，集合不允许重复元素，但集合里面的元素没有先后顺序。集合中最大的成员数为2<sup>32</sup>>-1(4294967295，40多亿)。
    - sadd key member1 [member2]：向集合添加一个或多个成员
    ```
    > sadd myset1 "hello" "redis"
    (integer) 2
    > sadd myset1 "hello"
    (integer) 0
    ```
    > **Tips**：当向集合添加重复成员时，返回0
   ***
    - scard key：获取集合成员数量
    ```
    > scard myset1
    2
    ```
   ***
    - smembers key：返回集合中的所有成员
    ```
    > smembers myset1
    1) "hello"
    2) "redis"
    ```
   ***
    - sdiff key1 [key2]：返回所有给定集合的差集
    ```
    > sadd myset2 "hello" "world"
    (integer) 2
    > sdiff myset1 myset2
    1) "redis"
    > sdiff myset2 myset1
    1) "world"
    ```
   ***
    - sinter key1 [key2]：返回所有给定集合的交集
    ```
    > sinter myset1 myset2
    1) "hello"
    ```
   ***
    - sunion key1 [key2]：返回所有给定集合的并集
    ```
    > sunion myset1 myset2
    1) "hello"
    2) "redis"
    3) "world"
    ```
   ***
    - spop key：移除并返回集合中的一个随机元素
    ```
    > sadd myset1 "NPC"
    (integer) 1
    >spop myset1
    "redis"
    >smembers myset1
    1) "NPC"
    2) "hello"
    ```
5. **SortedSet**
除了无序集合(Set)，Redis还提供了有序集合(SortedSet)，有序集合不允许重复的成员，且每个不同的成员都关联一个double类型的分数，redis通过这些分数对成员进行从小到大排序。有序集合有时也被称为ZSet，因为其命令都是以字母Z开头的。
    - zadd key score1 member1 [score2 member2]：向有序集合中添加一个或多个成员，或者更新已有成员分数
    ```
    > zadd myzset 10 "one" 20 "two" 30 "three"
    (integer) 3
    ```
   ***
    - zcard key：获取有序集合的成员数量
    ```
    > zcard myzset
    3
    ```
   ***
    - zscore key member：返回指定成员的分数
    ```
    > zscore myzset "one"
    10.0
    ```
    - zrange key start end [withscores]：通过索引start和end**从小到大**返回成员
    - zrevrange key start end [withscores]：通过索引start和end**从大到小**返回成员
    ```
    > zrange myzset 0 -1
    1) "one"
    2) "two"
    3) "three"
    > zrange myzset 0 -1 withscores
    1) "one"
    2) 10.0
    3) "two"
    4) 20.0
    5) "three"
    6) 30.0
    > zrevrange myzset 0 -1 withscores
    1) "three"
    2) 30.0
    3) "two"
    4) 20.0
    5) "one"
    6) 10.0
    ```
   ***
    - zrank key member：返回指定成员的排名，从小到大排序
    - zrevrank key member：返回指定成员的排名，从大到小排序
    ```
    > zrank myzset "one"
    0
    >zrank myzset "three"
    2
    > zrevrank myzset "one"
    2
    > zrevrank myzset "three"
    0
    ```
   ***
    - zcount key min max：返回分数在min和max之间的成员数量
    ```
    > zcount myzset 15 40
    2
    ```
   ***
    - zincrby key increment member：将指定成员的分数增加increment
    ```
    > zrange myzset 0 -1 withscores
    1) "one"
    2) 10.0
    3) "two"
    4) 20.0
    5) "three"
    6) 30.0
    > zincrby myzset 40 "one"
    50.0
    > zrange myzset 0 -1 withscores
    1) "two"
    2) 20.0
    3) "three"
    4) 30.0
    5) "one"
    6) 50.0
    ```