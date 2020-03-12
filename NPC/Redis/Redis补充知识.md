# 新手村：Redis补充知识

### 前言
新手村的第一篇文章(Redis基础)是村民的处女作，在之后的学习中回看这篇文章，觉得有一些纰漏之处，甚是惭愧，这也是本篇文章的由来和内容。今后本村民会努力做得更好些，还请大家多多支持多选参数。

### Key的命名建议
虽然Redis单个key最多可以存入512M大小，但这并不意味这我们就可以乱存。我们编写程序代码时，对变量的命名往往有所要求，对于Redis中key的命名有以下三条建议：
1. key的命名不要太长，尽量不要超过1024字节，否则对于内存的消耗和查找的效率而言，无疑是一场噩梦。
2. key的命名也不要太短，太短的命名往往无法清晰表达key的含义。
3. 在一个项目中，使用统一的命名模式去规范key。例如user:1:nickname，user:2:nickname。

### Redis键(key)命令
Redis基础篇中直接收录了Redis的五种数据类型及其常用的一些命令，而对于Redis中对key的一些常用基本命令却没有介绍，在此补上，这些命令对所有数据类型的key都适用。
1. del key：当key存在时删除key，返回值为被删除key的数量。
    ```
    > del mykey1	# 键mykey1未设置
    (integer) 0
    > set mykey1 "redis"	# 设置键mykey1
    OK
    > del mykey1	# 删除键mykey1
    (integer) 1
    ```
2. exists key：检查key是否存在，存在返回1，否则返回0。
    ```
    > exists mykey1		# 键mykey1已经用del命令删除
    (integer) 0
    > set mykey1 "redis"	# 重新设置mykey1
    OK
    > exists mykey1		# 在此检查键mykey1是否存在
    (integer) 1
    ```
3. expire key seconds：设置key的过期时间，过期后自动删除，以秒为单位。设置成功返回1，当key不存在或不能设置时返回0。
    ```
    > expire time1 2	# 为不存在的键time1设置过期时间
    (integer) 0
    > set time1 "2s"	# 设置键time1
    OK
    > expire time1 2
    (integer) 1
    ```
4. expireat key timestamp：以秒级时间戳设置key的过期时间。
    ```
    > set time2 "2020年3月10日20时过期"
    OK
    >expireat time2 1583841600
    (integer) 1
    ```
5. pexpire key milliseconds：设置key的过期时间，以毫秒为单位。
    ```
    > set time3 "3000ms"
    OK
    > pexire time3 3000
    (integer) 1
    ```
6. pexpireat key milliseconds-timestamp：以毫秒级时间戳设置key的过期时间。
    ```
    > set time4 "2020年3月10日21时过期"
    OK
    > pexireat time4 1583845200000
    (integer) 1
    ```
> - expire、expireat、pexpire和pexpireat命令都是设置成功时返回1，当key不存在或无法设置时返回0。
> - 时间戳是指格林威治时间1970年01月01日00时00分00秒(北京时间1970年01月01日08时00分00秒)起至现在的总毫秒数。在实际应用中时间戳有秒级和毫秒级，一般我们常用秒级。 
7. ttl key：当key不存在时，返回-2；当key存在但没有设置过期时间时，返回-1；否则，以秒为单位返回key的剩余过期时间。
    ```
    > ttl time5		# time5不存在
    (integer) -2
    > set time5 "5s"	#设置time5但不设置过期时间
    OK
    > ttl time5
    (integer) -1	# time5永久保持有效
    >expire time5 5		# 设置5秒后过期
    (integer) 1
    > ttl time5
    (integer) 2
    > ttl time5
    (integer) -2
    ```
8. pttl key:当key不存在时，返回-2；当key存在但没有设置过期时间时，返回-1；否则，以毫秒秒为单位返回key的剩余过期时间。
    ```
    > ttl time6		# time6不存在
    (integer) -2
    > set time5 "6s"	#设置time6但不设置过期时间
    OK
    > ttl time6
    (integer) -1	# time6永久保持有效
    >expire time6 6		# 设置6秒后过期
    (integer) 1
    > ttl time6
    (integer) 2
    > ttl time6
    (integer) -2
    ```
9. persist key：移除key的过期时间，使其永久保持有效。移除成功返回1，若key不存在或未设置过期时间时返回0。
    ```
    > persist time7
    (integer) 0
    > set time7 "7s"
    OK
    > expire time7 7
    (integer) 1
    > ttl time7
    (integer) 4
    > persist time7
    (integer) 1
    > ttl time7
    (integer) -1	# ttl命令返回值-1表示time7永久有效
    ```
10. keys pattern：查找所有符合给定模式pattern的key
    ```
    >mset NPC1 "NO.1" NPC2 "NO.2" NPC3 "NO.3" NPC4 "NO.4"
    OK
    > keys NPC*
    1) "NPC3"
    2) "NPC4"
    3) "NPC1"
    4) "NPC2"
    ```
11. randomkey：随机返回一个key
    ```
    > randomkey
    "NPC2"
    > randomkey
    "NPC4"
    ```
12. renamenx key newkey：当newkey不存在时修改key的名称。修改成功返回1，当newkey存在时返回0。
    ```
    >renamenx NPC1 NPC2
    (integer) 0
    >renamenx NPC1 NPC
    (integer) 1
    ```
13. type key：返回key所存储的value的类型。none(key不存在)、string、list、hash、set、zset。
    ```
    > type NPC
    string
    > type NPC5
    none
    ```

### String类型应用场景
1. String通常用于保存单个字符串或JSON字符串数据
2. String类型是二进制安全的，因此可以把常被调取的图片文件的内容作为字符串来存储
3. 利用incr、incrby、decr、decrby命令作常规计数，例如记录点击数、粉丝数等。

### Hash类型应用场景
Hash类型常用于存储一个对象，比如存储用户的个人信息，存储用户的购物车信息等等。

### 为什么不用String存储一个对象？
当我们用String类型的key-value结构存储一个对象，比如说存储用户的id、姓名、年龄、住址等信息时，主要有2种存储结构：
    ```
    # 第一种
    key：id		value：序列化的其他信息
    ```
第一种方式将用户ID作为key，其他信息封装成一个对象并序列化作为value的方式存储。这种方式有几点缺陷：

- 存取信息时增加了序列化/反序列化的开销。
- 若需要修改用户的一个信息时，要取出一整个对象。
- 修改操作必须保持原子性，需要对并发情况进行保护。

    ```
    # 第二种
    key：user:1:name		value：姓名值
    key：user:1:age		value：年龄值
    key：user:1:address	value：地址值
    key：user:2:name		value：姓名值
    ······
    ```

第二种方式将对应用户id:属性名作为key，属性值作为value的方式进行存储。这种方式虽然解决了第一种方式中序列化/反序列化的问题和并发问题，但是以这种方式存储，用户id信息会重复存储，且一个用户的信息就使用了好几个key-value对，当用户数量较大时，占用大量内存空间，造成内存浪费。
Hash是最接近关系数据库结构的数据类型，可以将数据库的一条记录或程序中的一个对象转换成HashMap存放在Redis中。使用Hash类型存储一个对象不仅节省空间，对信息进行操作也有相应的命令，比较安全。

### List类型应用场景
List类型很适合实现多种数据结构，比如栈、队列等等。使用rpush和rpop命令可实现栈，使用rpush和lpop可实现队列。

### Set类型应用场景
Set类型常用于对两个集合之间的数据求交集、并集、差集。比如说我们可以求出两个用户的共同好友、共同喜欢的歌曲，求当日首次登陆的新用户等等。

### Zset类型应用场景
由于Zset类型相对于Set类型多存储了分数以进行排序，因此Zset类型常用于各种排行榜。比如说班级中考试成绩的排行，热搜榜的排行等等。除此之外，我们还可以利用分数做权重，形成可变优先级的队列，将重要的操作权重增加，这样就可以保证先执行这些操作。

### Redis的内存维护策略
Redis把数据存在内存中以保证较高的存取性能，然而相比于磁盘空间大小，内存的容量是相当有限的。如果Redis一直存入，不对数据进行淘汰，必然会占用大量内存空间，最终将导致内存溢出并影响CPU的执行效率，造成服务器宕机等严重后果。因此，Redis作为优秀的中间缓存件，即使采取了集群部署来动态扩容，也应该即时整理内存，维持较高的系统性能。在Redis中有两种解决方案：
一为数据设置超时时间：Redis中提供了几个设置数据过期时间的命令
    ```
    expire key seconds		# 以秒为单位，是最常用的方式
    setex key seconds value		# 在设置key-value对的同时设置过期时间，string类型专用
    ```

> - 只有string类型有专用命令，其他数据类型都要依靠key基本命令expire等设置过期时间
> - 如果没有设置过期时间，那么key永久保持有效
> - 如果设置了过期时间之后想让key再次永久保持有效，使用persist key命令

二为使用Redis提供的淘汰策略：在生产环境中，我们使用配置参数maxmemory来限制内存的大小，使用配置参数maxmemory-policy来选择淘汰策略。在默认情况下，maxmemory为0，表示内存使用不受限制，而maxmemorey-policy为noeviction。
1. volatile-lru：设定过期时间的数据中，删除最不常用的数据。
2. allkeys-lru：优先删除最近没有被使用的key，应用最为广泛
3. volatile-random：在设定了过期时间的数据中随机删除。
4. allkeys-random：在所有数据中随机删除某个key。
5. volatile-ttl：查询全部设定了过期时间的数据，并进行排序，删除马上将要过期的数据。
6. noeviction：对内存没有限制，只有当内存使用达到阈值时，新申请内存的命令会报错。

上述是Redis的6种淘汰策略，但是我们该如何选择哪一种策略来提高性能呢？答案是因地制宜，我们必须根据自身系统特征来选择合适的策略。
- 根据数据访问频率：如果有一部分数据的访问频率较高，其余部分普遍较低，或者我们也不知道数据的访问频率时，可以使用allkeys-lru；如果数据的访问频率都基本差不多时，我们可以选择allkeys-random。
- 如果我们需要设置过期时间来判断数据过期的先后顺序，让Redis知晓应该先淘汰哪些数据时，可以使用volatile-ttl。
- 当我们希望一些数据可以被长期保存，用于持久化，而一些数据只用于缓存，使用后能被淘汰掉时，我们可以选用volatile-lru或者volatile-random。
- 在我们为数据设置过期时间时会消耗额外的内存，如果需要减少这一部分的浪费，那么可以选用allkeys-lru策略，这样就可以更加高效的利用内存了。