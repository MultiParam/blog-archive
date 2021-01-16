---
title: python 代码加速考
date: 2021-01-16 12:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---
本笔记来自==**极客时间王然老师的机器学习训练营，再次感谢王然老师的教学与指导**==，这里务必给极客时间王然老师的机器学习训练营打个广告。

这段时间的学习主要围绕着优化 python 代码性能来展开的。鉴于个人学习程度与本文的记录初衷，难免有纰漏处，望读者能多多批评指正。

那么如何提升 py 代码的性能，首先需要一套指导思想，然后才能有方法论。 

但是在这之前，先实践一个例子，来真正体验如何优化性能，例子运行平台为 ```colab```。

# 代码原生之初
给出一套代码。

```python
# 算出排除当前数据的平均，再取这个类别的平均
def target_mean_v1(data, y_name, x_name):
    result = np.zeros(data.shape[0])
    for i in range(data.shape[0]):
        # group by 就有内在循环了
        groupby_result = data[data.index != i].groupby([x_name], as_index=False).agg(['mean', 'count'])
        # 当前样本的 x 类别(根据 x 分类)
        result[i] = groupby_result.loc[groupby_result.index == data.loc[i, x_name], (y_name, 'mean')]
    return result
```
同时给出数据集 `data`：

```python
y 	 = np.random.randint(2, size=(5000, 1)) # 两个
x 	 = np.random.randint(10, size=(5000, 1))
data = pd.DataFrame(np.concatenate([y, x], axis=1), columns=['y', 'x'])
```
所以 `data` 存在 `x` `y` 两个东西，`x` 代表特征值，理解为自己的属性的值(职业？)，`y` 代表他对应的判定(是否可以发信用卡？)。假设属性有两个类别：程序员和保安，那么根据前期的调查，90% 程序员可以发信用卡，10% 保安可以发，那么我们可以利用 0.9 和 0.1 去编码这两个类别。这是对应类别自己的数据进行编码。

但是这里出现了 target leakage 问题，本质上就是数据泄露，这样的编码把 `y` 的信息包含了进来，就比如每一个样本都是一个新的类别。

所以我们再计算每个类别的数据，例如平均数的时候，需要把当前样本剔除计算，然后再把当前样本编码。

# 开始发现问题
我们跑一下原生之初，发现耗时 **24.2s**，这完全不能接受。

我们可以直观的发现，循环中不断地 groupby 肯定是一个拖慢点，groupby 可以猜测又是一个循环，等于不断地二重循环。所以我们先把这个改了，同时不要想太多别的优化，保证正确性为先。

其实统计每个类别的数量和 y 值总数，之后剔除自己就行了，于是根据这个核心思想同时考虑一些代码可读上的建议，我们有了如下代码：

```python
def target_mean_v2(data, y_name, x_name):
  nums      = data.shape[0]
  result     = np.zeros(nums)
  # 那么我自己统计总数不也行嘛，一次循环
  type_2_sum_dict  = {}
  type_2_count_dict = {}
  for i in range(nums):
    x = data.loc[i, x_name]
    y = data.loc[i, y_name]
    type_2_sum_dict[x]  = type_2_sum_dict.get(x, 0) + y
    type_2_count_dict[x] = type_2_count_dict.get(x, 0) + 1
  for i in range(nums):
    x      = data.loc[i, x_name]
    y      = data.loc[i, y_name]
    result[i]  = (type_2_sum_dict[x] - y) / (type_2_count_dict[x] - 1)
  return result
```
跑了一下，耗时是 **155ms**。实现算法的改进和复杂度的下降对于性能提升是很显著的。

# 无头苍蝇还是有头苍蝇
这个时候我会很高兴，因为性能已经爆炸提升，但是我想乘兴接着优化，该往那里入手？这种时候明显已经不能直观地发现瓶颈了，所以要先分析瓶颈点在哪，这个就需要 profiler。

profiler 分为 function profiler 和 line profiler，他们就好像调试中的 step over 和 step into，具体的不展开讲，这里我想使用 line profiler 去研究每一行的消耗。

在 colab 上可以如下方式调用 py 的 line_profiler：
```python
!pip install line_profiler
%load_ext line_profiler
%lprun -f target_mean_v2 target_mean_v2(data, 'y', 'x')
```

我们可以发现，对于 data 的索引上存在较多的时间消耗。

![target_mean_v2 分析结果](http://img.multiparam.com/dapao/code/20210112032849.png)

那么我便去查询了一下 pandas 的官方文档，发现了索引方式还有 iloc/at 这两种方式，我替换了一下发现 `at` 的速度是最快的，速度是有一点提升，耗时来到了 95.5ms。

```python
x = data.at[i, x_name] # 这样牺牲了一些可读性
y = data.at[i, y_name]
```

`比对性能的过程中，促使了你查阅文档，是一件积极的事情。`

但是我们再 line profiler 一次，发现在 x，y 的索引上依旧是有大量的时间消耗。那么如果像数组那样下标索引会不会更快？

那么类似数组的东西就是 numpy，那么我们就利用 numpy 来索引。

```python
def target_mean_v4(data, y_name, x_name):
  nums      = data.shape[0]
  result     = np.zeros(nums)
  # 那么我自己统计总数不也行嘛，一次循环
  type_2_sum_dict  = {}
  type_2_count_dict = {}
  x_numpy = data[x_name].values
  y_numpy = data[y_name].values
  for i in range(nums):
    x = x_numpy[i]
    y = y_numpy[i]
    type_2_sum_dict[x]  = type_2_sum_dict.get(x, 0) + y
    type_2_count_dict[x] = type_2_count_dict.get(x, 0) + 1
  for i in range(nums):
    x = x_numpy[i]
    y = y_numpy[i]
    result[i]  = (type_2_sum_dict[x] - y) / (type_2_count_dict[x] - 1)
  return result
```

耗时已经来到了 **8.73ms**。通过 line profiler 也发现在索引方面的耗时相比之前有很多下降。


# cython 介入
我又看了一下 `target_mean_v4` 的分析，可以发现主要瓶颈还是在 numpy 索引，dict 的索引上。

![target_mean_v4 line profiler 分析](http://img.multiparam.com/dapao/code/20210113014914.png)

但是我已经没有办法对这两个瓶颈做出调优，这个时候，就考虑**换一种底层语言去加速**，cython 便是下一步优化的利器。

## cython
cython 可以理解为是 python 的超集，利用 cython 可以加速 py 代码，同时也能识别 py 代码。一般有两种方式：
1. cython 当做 c/c++ 来写，但是这样静态类需要自己定义头文件预先定义
2. cython 预处理数据，再将内存分配好，传入 c/c++

同时在各类文档中，推荐的方式时将 pyx 文件写成一个模块，通过 setup.py install 方式，也就是自定义第三方包的方式编译成包供外部调用。

具体的语法可以查阅[官方文档](https://cython.readthedocs.io/en/latest/)，其实把他当做 c 就差不多了，本篇只打算梳理 py 代码加速的思路，故这些可查阅的东西就简略说明，以后或许可以细讲一下。

**同时官方文档未必就是正确的，多注重实践比对**。

## cython 介入开始
直接上代码吧。同时注意注释的语句其实也是可以使用的，你可以比对一下他们速度上的差异，虽然可能差别是不大的。
```python
%%cython -a --cplus
import numpy as np
cimport numpy as cnp 
cimport cython
from libcpp.map cimport map as mapcpp



@cython.boundscheck(False)
@cython.wraparound(False)
cpdef target_mean_cy_v3(data, str y_name, str x_name):
  cdef mapcpp[int, int] type_2_sum_dict   = mapcpp[int, int]()
  cdef mapcpp[int, int] type_2_count_dict = mapcpp[int, int]()
  cdef mapcpp[int, int].iterator it

  cdef Py_ssize_t i
  cdef Py_ssize_t x, y # 不得放到 for 里头用 cdef
  # cdef cnp.ndarray[Py_ssize_t] n_y = data[y_name].values # values faster than to_numpy
  # cdef cnp.ndarray[Py_ssize_t] n_x = data[x_name].values
  cdef Py_ssize_t[:] n_y = data[y_name].values # values faster than to_numpy
  cdef Py_ssize_t[:] n_x = data[x_name].values

  cdef Py_ssize_t nums  = n_x.shape[0] # 这个 2us 优化，一般
  # cdef cnp.ndarray[double] result = np.zeros(nums)
  cdef float[:] result = np.zeros(nums, np.float32)
  for i from 0 <= i < nums by 1: 
  # for i in range(nums):
    x = n_x[i]
    y = n_y[i]
    it = type_2_sum_dict.find(x)
    if it != type_2_sum_dict.end():
      type_2_sum_dict[x]   += y
      type_2_count_dict[x] += 1
    else:
      type_2_sum_dict[x]   = y
      type_2_count_dict[x] = 1
  # for i in range(nums):
  for i from 0 <= i < nums by 1: 
    x = n_x[i]
    y = n_y[i]
    result[i]  = (type_2_sum_dict[x] - y) / (type_2_count_dict[x] - 1)
  return result
```

cython 加速后，运行耗时为 **486us**。又是一次显著提升。

由于运行平台是 colab，所以其实如上代码要是使用第三方包编译方式，是有一些不同的，这里我就不赘述了。

代码中几个点可以拎出来：

cimport 是引入一些 python 库的 c 底层实现的引入机制。

```python
cimport numpy as cnp 
```

这两个装饰器用于取消负索引和边界检查，既然写 cython 了，就肯定要保证不越界和不适用负索引(这两个会带来较大的消耗，也是一种瓶颈)
```python
@cython.boundscheck(False)
@cython.wraparound(False)
```

同时可以发现全篇对于变量都使用了类似如下的语法。这种方式其实就是声明了变量类型，减少类型检查带来的消耗。

```python
cdef Py_ssize_t x, y
```

更多的可以查阅[这个文档](https://cython.readthedocs.io/en/latest/src/userguide/numpy_tutorial.html)，一种是变量声明方式，一种是声明了 numpy 数组的 memoryView，某种意义上是「事情做得比较多的指针」。

同时简单说明一下 mode，这个代表这个数组以 `row major` 排列还是 `col major` 排列，所以如果以相悖于数据排列方式的读取方式读取，这也是一个瓶颈点。
```python
# cdef cnp.ndarray[Py_ssize_t, ndim = 1, mode = 'c'] n_x = data[x_name].values
cdef Py_ssize_t[:] n_y = data[y_name].values
```

## cython hotspots 分析
使用 cython 便出现一个问题，我们之前的 line_profiler 便不能用了，这个我目前的办法是利用 cython 输出的分析报告，尽量把与 py 交互的代码改成与 py 没有或者少交互的代码。(例如 numpy 中对 long 类型的检查其实就比 int 要多)

![cython 分析报告](http://img.multiparam.com/dapao/code/20210113024944.png)

同时听说还要 cython 的 gdb，但是没有实操过，希望有使用的大佬多多指教一波。

# 并行
并行对于这个例子来说，其实提升不大。

一种是多线程多进程。多线程且不说 GIL 存在导致的伪并发和不控制线程申请导致的占用资源；多进程其实坑也不少，使用 ray 是简单，但是 ray 不支持写，这就很不方便。

一种是实现 SIMD，利用多处理器并行计算。主要使用了 openmp，但是 cython 对于 openmp 的支持只有 `prange`。同时使用 `prange` 的区域和子调用**不得使用 py 语法**。

我就放个代码以供查阅，主要关注 prange 区域就可以了。不用去看 `write_2_map` 的内容。

```python
%%cython --cplus -a
import numpy as np
cimport numpy as cnp 
cimport cython
from libcpp.map cimport map as mapcpp
from cython.parallel import prange

@cython.boundscheck(False)
@cython.wraparound(False)
# 要采取一致的类型，不能 Py_ssize_t n long[:] x_array[] -> x_array[n] -> 段错误
cdef void write_2_map(Py_ssize_t[:]  x_array,
            Py_ssize_t[:]  y_array,
            const Py_ssize_t n,
            mapcpp[int, int] &sum_map,
            mapcpp[int, int] &count_map) nogil:
  # start here
  cdef mapcpp[int, int].iterator it
  cdef Py_ssize_t x = x_array[n]
  cdef Py_ssize_t y = y_array[n]
  it = sum_map.find(x)
  if it != sum_map.end():
    sum_map[x]  += y
    count_map[x] += 1
  else:
    sum_map[x]  = y
    count_map[x] = 1

@cython.boundscheck(False)
@cython.wraparound(False)
cpdef double[:] target_mean_cy_v4(data, str y_name, str x_name):
  cdef mapcpp[int, int] type_2_sum_dict  = mapcpp[int, int]()
  cdef mapcpp[int, int] type_2_count_dict = mapcpp[int, int]()
  cdef mapcpp[int, int].iterator it

  cdef Py_ssize_t i
  cdef Py_ssize_t x, y # 不得放到 for 里头用 cdef
  # cdef cnp.ndarray[Py_ssize_t] n_y = data[y_name].values # values faster than to_numpy
  # cdef cnp.ndarray[Py_ssize_t] n_x = data[x_name].values
  cdef Py_ssize_t[:] n_y = data[y_name].values
  cdef Py_ssize_t[:] n_x = data[x_name].values
  cdef Py_ssize_t nums  = n_x.shape[0]
  cdef double[:] result = np.zeros(nums, np.float64)
  for i in prange(nums, nogil = True):
    # write_2_map(n_x, n_y, i, type_2_sum_dict, type_2_count_dict)
    x = n_x[i]
    y = n_y[i]
    it = type_2_sum_dict.find(x)
    if it != type_2_sum_dict.end():
      type_2_sum_dict[x]  += y
      type_2_count_dict[x] += 1
    else:
      type_2_sum_dict[x]  = y
      type_2_count_dict[x] = 1
  for i in prange(nums, nogil = True):
    x = n_x[i]
    y = n_y[i]
    result[i]  = (type_2_sum_dict[x] - y) / (type_2_count_dict[x] - 1)
  return result
```

# 总结一套方法论
其实刚才的过程就演示了代码加速的过程，首先先写出一套**正确但可能不太完美**的代码。

接着我们就这么干：
1. 算法上的选择与复杂的改进。想想 `groupby` 的改进。
2. 实现细节的改进。内存的初始化，内存的排列顺序与读取顺序的相悖与否。想想刚才的 `loc -> at/pandas -> numpy`
3. 使用底层语言改写功能加速。`cython -> c/c++(Eigen::Map)`
4. 并行加速。`openmp/ray`

以上步骤进行时，需要配合 `profiler` 分析代码瓶颈，有 `line/function profiler`。这样才能有的放矢地进行优化。

其实这里涉及了一些知识，例如为什么瓶颈往往出现在内存上，尤其是 `cache` 上？

`SIMD` 是什么？除了 `prange` 还有更多的方法实现吗？如果你有自己的答案可以留言区留下你宝贵的意见和建议。