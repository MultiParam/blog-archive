---
title: 一份 Numpy 小抄请查收
date: 2020-03-27 1:46:01
tags: 
- 程序锅 
category:
- AI
---

numpy的主要对象是多维数组，**数组中元素是同一种的（通常是数字）。numpy中的数组对象叫做ndarray**，通常称为数组。

> numpy.array和标准Python库类array.array并不相同，后者只处理一维数组和提供少量功能。

在numpy中维度（dimensions）叫做轴（axes），轴的个数叫做秩（rank）。如3D空间中一个点的坐标```[1,2,3]```是一个秩为1的数组，因为它只有一个轴，这个轴长度为3，在下面的例子中数组的秩为2（它有两个维度）,第一个维度为2，第二个维度为3。

```python
[[ 1., 0., 0.],
 [ 0., 1., 2.]]
```

### 1. ndarray对象属性

- ndarray.ndim

  数组轴的个数，在python的世界中，轴的个数被称作秩

- ndarray.shape

  数组的维度。这是一个指示数组在每个维度上大小的整数元组。例如一个n排m列的矩阵，它的shape属性将是(n,m)，这个元组的长度显然是秩，即维度或者ndim属性

- ndarray.size

  数组元素的总个数，等于shape属性中元组元素的乘积。

- ndarray.dtype

  一个用来描述数组中元素类型的对象，可以通过创造或指定dtype使用标准Python类型。另外NumPy提供它自己的数据类型。

- ndarray.itemsize

  数组中每个元素的字节大小。例如，一个元素类型为float64的数组itemsiz属性值为8(=64/8),又如，一个元素类型为complex32的数组item属性为4(=32/8).

- ndarray.data

  包含实际数组元素的缓冲区，通常我们不需要使用这个属性，因为我们总是通过索引来使用数组中的元素。

### 2. 创建ndarray

#### 2.1. np.array()

从常规的Python列表和元组创造数组。所创建的数组类型由原序列中的元素类型推导而来,数组将序列包含序列转化成二维的数组，序列包含序列包含序列转化成三维数组等等

```python
data1 = np.array([1, 2, 3, 4])
data2 = np.array((1, 2, 3, 4))
data3 = np.array([[1, 2, 3], [4, 5, 6]])
data4 = np.array([(1, 2, 3), (4, 5, 6)])
data5 = np.array([[1, 2], [3, 4]], dtype=complex)	# 数组类型可以在创建时显示指定
# np.array(1, 2, 3, 4)  # 不能这么创建
```



#### 2.2. np.zeros()&&np.ones()&&np.empty()&&np.eye()

函数`zeros`创建一个全是0的数组；函数`ones`创建一个全1的数组；函数`empty`创建一个内容随机并且依赖与内存状态的数组；`eye`创建对角都为1，其他元素为0的矩阵（单位矩阵）。

>默认创建的数组类型(dtype)都是float64。

```python
data1 = np.zeros(3)
data2 = np.zeros((3, 4))
data3 = np.ones(3)
data4 = np.ones((3, 4), dtype=np.int16)		# 也可以指定元素的类型
data5 = np.empty(3)
data6 = np.empty((2, 3))
data7 = np.eye(5)

```



#### 2.3. np.arange()---指定步长产生数组

开始值和步长都可以不指定，开始值默认为0，步长默认为1，**最终值取不到。**

```python
data1 = np.arange(10)		# 默认从0开始到10（10取不到），默认步长为1
data2 = np.arange(0, 18)	# 从0开始到18（18取不到），默认步长
data4 = np.arange(0, 18, 2)
```



#### 2.4. np.linspace()---指定个数产生数组

开始值和最终值都需要指定，产生个数可以不指定，默认产生50个，**最终值取得到。**

```python
data1 = np.linspace(0, 49)
data2 = np.linspace(0, 1, 10)
```



#### 2.5. np.full()

指定元素来提供指定大小的矩阵

```python
data = np.full((2, 3), 8)	# 2*3的矩阵里面的元素都是8
```



#### 2.6. np.random

```python
data1 = np.random.rand(5)		# 产生一个1*5的矩阵，里面的元素为0-1
data2 = np.random.rand(2, 3)	# 产生一个2*3的矩阵，里面的元素为0-1
data3 = np.random.rand(2, 3)*5	# 产生一个2*3的矩阵，里面的元素为0-5
data4 = np.random.randint(5, size=(2, 3))	# 产生一个2*3的矩阵，里面的元素为0-5
data5 = np.random.randint(5, 10, (2,3))		# 产生一个2*3的矩阵，里面的元素为5-10
```



### 3. 常用方法

下面中arr是指ndarray对象

#### 3.1. arr.astype(dtype)---把数组元素转为指定的dtype

```python
arr = np.random.randint(1, 5, (2, 3))
l1 = arr.astype(np.int16)
```

#### 3.2. arr.tolist()---把ndarray对象转化为python 列表

```python
arr = np.random.randint(1, 5, (2, 3))
l1 = arr.tolist()	
--------------
arr:
[[1 1 2]
 [4 2 3]]
l1:[[1, 1, 2], [4, 2, 3]]
```

#### 3.3. arr.T---转置

```python
arr = np.random.randint(1, 5, (2, 3))
arrT = arr.T
--------------
arr:
[[1 3 4]
 [3 1 4]]
arrT:
[[1 3]
 [3 1]
 [4 4]]    
```

#### 3.4. arr.reshape(3, 4)

转化矩阵shape为3*4，没有改变元素。**通过返回值实现**

```python
arr = np.random.randint(1, 5, (3, 4))
arrReshape = arr.reshape((2, 6))	# 等同于arr.reshape(2， 6)
--------------------------
arr:
[[2 1 4 4]
 [2 3 4 3]
 [3 2 2 4]]
arrReshape:
[[2 1 4 4 2 3]
 [4 3 3 2 2 4]]
```

#### 3.5. arr.resize((3, 5))

转为矩阵shape3*5，多余的值用0填充。**直接修改原ndarray对象，引用需要为创建出来的引用**

```python
arr = np.random.randint(1, 5, (3, 4))
arr.resize((3, 5))
------------------------
arr:
[[3 1 4 2 1]
 [1 1 4 1 2]
 [1 3 0 0 0]]
```

```python
'''
下面的这段也会报错
'''
arr = np.random.randint(1, 5, (3, 4))
arr1 = arr.reshape(2, 6)
arr.resize((3, 5))
'''
下面的这段也会报错
'''
arr = np.random.randint(1, 5, (3, 4))
arr1 = arr.reshape(2, 6)
arr1.resize((3, 5))
```



#### 3.6. arr.sum()&&arr.min()/arr.max()

```python
>>> arr
array([[ 1.,  2.,  3.,  4.],
       [ 5.,  6.,  7.,  8.],
       [ 9., 10., 11., 12.]])
>>> arr.sum()
78.0
>>> arr.max()
12.0
>>> arr.min()
1.0
```



#### 3.7. np.mean(arr)

```python
>>> arr
array([[ 1.,  2.,  3.,  4.],
       [ 5.,  6.,  7.,  8.],
       [ 9., 10., 11., 12.]])
>>> np.mean(arr)
6.5
```



#### 3.8. np.array_equal(arr1, arr2)

比较值是否相等，若每个元素的值相等，并且ndarray的shape一样那么就是True

```python
>>> arr
array([[ 1.,  2.,  3.,  4.],
       [ 5.,  6.,  7.,  8.],
       [ 9., 10., 11., 12.]])
>>> arr2
array([[ 1.,  2.,  3.,  4.],
       [ 5.,  6.,  7.,  8.],
       [ 9., 10., 11., 12.]])
>>> np.array_equal(arr, arr2)
True
```





### 4. 对ndarray的元素操作

arr[a, b,...]依次取第一维、第二维，如a就代表第一个维度的取值，b代表第二维度的取值

#### 4.1. 取值

```python
>>> import numpy as np
>>> arr = np.linspace(1, 12, 12, dtype=np.int16).reshape(3, 4)
>>> arr
array([[ 1,  2,  3,  4],
       [ 5,  6,  7,  8],
       [ 9, 10, 11, 12]], dtype=int16)
>>> arr[2]	# 对于秩为1来说，取第index=2的元素，对于秩不为1的是在取第一维度index=2的值
array([ 9, 10, 11, 12], dtype=int16)
>>> arr[2, 3]	
12
>>> arr[2][3]
12
>>> arr[0:2]	# 依次取第一维度下index为0、1的值
array([[1, 2, 3, 4],
       [5, 6, 7, 8]], dtype=int16)
>>> arr[0:2, 3]	# 依次取第一维度下index为0、1，第二维度下index为3的值
array([4, 8], dtype=int16)
>>> arr[:2]		# 从index=0开始
array([[1, 2, 3, 4],
       [5, 6, 7, 8]], dtype=int16)
>>> arr[:, 1]	# 第一维度下index全取，第二维度下index为1的值
array([ 2,  6, 10], dtype=int16)
```

#### 4.2. 赋值

在上面的取值操作后面加上赋值操作就好

```python
>>> arr
array([[ 1,  2,  3,  4],
       [ 5,  6,  7,  8],
       [ 9, 10, 11, 12]], dtype=int16)
>>> arr[2] = 20
>>> arr
array([[ 1,  2,  3,  4],
       [ 5,  6,  7,  8],
       [20, 20, 20, 20]], dtype=int16)
```

#### 4.3. 大小判断确定boolean

```python
>>> import numpy as np
>>> arr = np.linspace(1, 12, 12, dtype=np.int16).reshape(3, 4)
>>> arr
array([[ 1,  2,  3,  4],
       [ 5,  6,  7,  8],
       [ 9, 10, 11, 12]], dtype=int16)
>>> arr<5	# 以boolean矩阵的类型返回，小于5的值为True
array([[ True,  True,  True,  True],
       [False, False, False, False],
       [False, False, False, False]])
>>> (arr>5) & (arr<10)	# 以boolean矩阵的类型返回，大于5且小于10的值为True
array([[False, False, False, False],
       [False,  True,  True,  True],
       [ True, False, False, False]])
>>> arr[arr<5]	# 只取boolean值为True的值，即返回arr中小于5的值
array([1, 2, 3, 4], dtype=int16
```





### 5. 常用的数学方法

```python
np.add(arr, 1)			# 返回arr每个元素加1之后的结果
np.add(arr1, arr2)		# 返回arr1每个元素与arr2每个元素相加的结果

np.subtract(arr, 2)		# 返回arr每个元素减2之后的结果
np.subtract(arr1, arr2)	# 返回arr1每个元素减arr2每个元素之后的结果

np.multiply(arr, 2)		# 返回与一个标量相乘的结果
np.multiply(arr1, arr2)	# 返回arr1每个元素与arr2每个元素相乘之后的结果

np.divide(arr, 0.5)		# 返回与一个标量相除的结果
np.divide(arr1, arr2)	# 返回arr1每个元素除以arr2每个元素之后的结果

np.power(arr, 2)		# 返回与一个标量幂次方的结果
np.power(arr1, arr2)	# 返回arr1每个元素以对应位置的arr2元素为幂的结果

np.sqrt(arr)			# 返回每个元素平方根之后的结果
np.sin(arr)				# 返回每个元素取sin之后的结果
np.log(arr)				# 返回每个元素取对数（以e为底）之后的结果
np.abs(arr)				# 返回每个元素取绝对值之后的结果
np.ceil(arr)			# 返回每个元素向上取整之后的结果	
np.floor(arr)			# 返回每个元素向下取整之后的结果
np.round(arr)			# 返回每个元素取最近int值之后的结果
```

本文参考：
1. [官方文档](https://docs.scipy.org/doc/numpy/user/quickstart.html)
2. [NumPy的详细教程(官网手册翻译)](https://blog.csdn.net/xiaoxiangzi222/article/details/53084336)



