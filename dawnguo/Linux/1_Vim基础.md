---
title: Vim 基础和常用命令整理
date: 2020-08-27 22:30:00
tags:
- 程序锅
category:
- 计算机
---

## 0. 前言

大家好，我是多选参数的程序锅，一个正在”捣鼓“操作系统、学数据结构和算法以及 Java 的硬核菜鸡。

由于自己比较喜欢 Vim（VSCode 下都在使用 Vim 的插件），并且 Vim 操作起来也比较方便，所以整理了一下 Vim 的基础和常用命令的整理（PS：说到 Linux ，大炮是我心中的 Linux 大佬）。

![](https://img.dawnguo.cn/Linux/vim/Vim%20%E5%9F%BA%E7%A1%80%E5%92%8C%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4.png)

另外，程序锅整了一个关于算法的 github 仓库：https://github.com/DawnGuoDev/algorithm，该仓库除包含基础的数据结构和算法实现之外，还会有数据结构和算法的知识内容整理、LeetCode 刷题记录（多种解法、Java 实现） 、一些优质书籍整理。

## 1. Vim 的模式

Vim 相比其他编辑器最特别的地方应该是它的模式。进入 Vim 后，在缺省状态下，你键入的字符并不会插入到所编辑的文件中。下面来介绍以下 Vim 的四种模式：

- 正常模式（normal mode，也被称为普通模式）：缺省状态下的编辑模式，一般用到的命令都是在这个模式下的。另外，**在任何其他模式中，都可以通过 `<ESC>` 键位返回到正常模式。**

- 插入模式（insert mode）：这个模式主要用来输入文本使用。在正常模式下按下 i(insert) 或 a(append) 之后，即可进入插入模式。

- 可视模式（visual mode）：这个模式主要用来选定文本块。在正常模式下，按下 v 或者 V 之后进行可视化模式，前者是进入按字符方式选定的，后者是进入按行的方式选定的。

- 命令行模式（command-line mode）：用于执行一些较复杂的命令。在正常模式下键入冒号（:）即可进入命令行模式，除了使用 `<ESC>` 键回到正常模式之外，还可以将命令行的内容（包括冒号）都删除之后也可以回到正常模式。命令行模式中输入命令之后，记得再按回车键（Enter）才能执行输入的命令。

  另外，使用斜杠（/）和问号（?）开始搜索也算是命令行模式。

Vim 还会有个选择模式，但是这个选择模式并不是 Vim 的主要用法，一般提到的话都是提上述几个模式。在这些模式中最重要的是正常模式，我个人相当于把正常模式当成中间过渡的模式。

![](https://img.dawnguo.cn/Linux/vim/image-20200817162544672.png)

## 2. Vim 的基本使用

![](https://img.dawnguo.cn/Linux/vim/image-20200817162917548.png)

### 2.1. bash 下的操作

```bash
vim <FILENAME>					   # 使用 vim 打开个文件
vim	-o	<FILENAME1> <FILENAME2>		# 水平分割（默认）
vim -O <FILENAME1> <FILENAME2>		# 垂直分割
vim -On	<FILENAME1> <FILENAME2>		# n 表示分几个屏，可不填，不填时按照需要打开的文件个数来
```

### 2.2. 正常模式

```bash
###### 进入其他模式 ######
i 				# 光标前面插入并进入插入模式
a 				# 光标后面插入并进入插入模式
I 				# 行首插入并进入插入模式
A 				# 行末插入并进入插入模式
o 				# 在光标的下一行刚开始插入并进入插入模式
O 				# 在光标的上一行插入并进入插入模式

:				# 进入命令行模式
/ 				# 进入命令行模式开始搜索，从光标处开始向下搜索。使用 n 是向下查找搜索内容，N 是反方向
? 				# 进入命令行模式开始搜索，从光标处向上搜索。使用 n 是向上查找搜索内容，N 是反方向
# 在使用 / 或者 ？ 搜索之前，使用 set ic(:set ic) 表示忽略大小写;
# set noic(:set noic) 表示不忽略大小写;
# set hls(:set hls) 那么在搜索的时候会高亮,set nohlsearch
# set is(:set is) 那么表示会自动跳转,set noincsearch 表示取消
# 假如就想一次搜索的时候忽略大小，那么使用\c，比如使用 /ignore\c
#（set xxx 表示设置 xxx 选项，上述的选项分别对应的是 ic(ignorecase)、is(incsearch)、hls(hlsearch)，你可以输入缩写也可以全输进去，在前面加上 no 就表示关闭这个选项）

v				# 进入 visual 模式，按字符来选择
V				# 进入 visual 模式，按行来选择
```



```bash
###### 光标移动 ######
hjkl			# 左下上右

w(word)			# 移到下一个 word 之前,可在前面加数字
2w				# 移过两个 word，并在第三个 word 之前

e				# 移动到当前 word 的最后,可在前面加数字
3e				# 移到第三个词的最后

$				# 移动到当前 line 的最后,可在前面加数字
2$				# 当前行的下一行的行末

0				# 移动到当前 line 的开始

[line number] G		# 跳转到文件底部（:$也可以）；假如有加 line number 的话，那么跳转到相应行数
gg				# 文件顶部

%				# 停留在 ([{}]) 处, 那么会跳转到另一个匹配的括号处;不停留的在括号处的话，那么会跳转到离光标最近的那个括号相匹配的括号处

CTRL-O	 		# 跳转到更旧的光标所处（可结合搜索）
CTRL-I 			# 跳转到更新一点的光标所在处（可结合搜索）
```



```bash
###### 文本操作 ######
# 正常模式下改变文本内容的命令，通常由 opeartor、number 和 motion 组成。
# operator   [number]   motion
# operator 是要执行的操作命令
# number 是可选的，用于表示重复的 motion 次数；
# motion 是 opeartor 操作的内容

# 常见的 opeartor
d(delete)	# 单个 d 无作用（在 normal mode 中），但是在 visual mode 中有用
c(change)	# 单个 c 无作用（在 normal mode 中），但是在 visual mode 中有用，删除所选并进入 insert mode
y(yank)		# 单个 y 无作用（在 normal mode 中），但是在 visual mode 中有用

# 常见的 motion
w(word)  	 # 移到下一个 word 之前
e			# 移动到当前 word 的最后
$ 			# 移动到当前 line 的最后
0			# 移动到当前 line 的开始

# number 和 motion 组合示例
2w			# 移过两个 word，并在第三个 word 之前
3e			# 移到第三个词的最后
2$			# 当前行的下一行的行末

# 常用示例
dw 			# 删除一个单词
de			# 删除从光标处到 word 末的内容
d$ 			# 删除从光标处到行末的内容
d2w			# 删除两个单词
dd 			# 删除一行
2dd			# 删除两行

ce			# 效果其实就是删除从光标处 word 最后字符的内容并进入 insert mode
cc			# 删除整行，并进入 insert mode

yw			# 复制一个 word
yy			# 复制当前行的数据
2yy			# 复制两行数据


#######################################
D			# 删除整行
C			# 删除整行，并进入 inser mode
Y			# 复制光标所在的一整行内容

s			# 删除光标所在字符，并进入 insert mode
S			# 删除光标所在行，并进入 insert mode

p			# 粘贴文本，比如 dd 删除的内容或者 y 复制的内容。dd 的内容如果是一行的话，那么会被粘贴到光标的下一行
P			# 内容是一行的话，那么会被粘贴到光标的上一行

x			# 删除光标处的文字
X			# 删除光标前的文字（backspace）

r			# 移到要替换的字母， r 之后后面紧跟要替换的字母，只能替换一个
R			# 进入替换模式，用之后输入的内容依次替换掉光标之后的内容，相当于进入了 replace mode， esc 退出，replace mode 类似于 insert mode。
```



```bash
###### 其他操作 ######
u			# 撤销前一个的操作
U			# 将整行的改变撤销
CTRL-R		# 撤销撤销所做的事（U 所做的事情不相当于撤销）

.(小数点)		# 重复前一个操作

CTRL-G/g	# 显示光标在文件的第几行和文件的信息
```



### 2.3. 命令行模式

```bash
:q!						# 不做修改的退出

:wq						# 保存退出
:w <Filename>  			# 将当前的文件内容写入到 Filename 中。在 visual mode 下输入 :，并在出现的内容后面输出 w Filename 那么会将选择的内容保存到 Filename 的文件中。


:! <命令> 			  # 执行 Linux 下的命令

:n						# 跳转到第 n 行
:$						# 跳转到最后一行

:s/old/new 	 			# 替换到第一个 old
:s/old/new/g 			# 将光标所在行的 old 全都替换为 new，g 表示整行都进行替换
:%s/old/new/g 			# 整个文件进行替换
:%s/old/new/gc 			# 整个文件进行替换并提示
:#, #s/old/new/g 		# 表示行号，那么意思是 # 和 # 之间

:r <FILENAME> 			# 将一个文件的内容插入到打开的文件所在光标的下面
:r !ls				   # 把 ls 命令的执行结果插入到打开的文件中

:set number				# 设置行号
:set nocp				# 设置不兼容模式

:set ic					# 搜索时，忽略大小写，需要在搜索之前设置
:set noic				# 搜索时，不忽略大小写;
:set hls				# 搜索时，匹配的内容会高亮
:set nohlsearch			# 取消高亮效果
:set is				    # 搜索时，会自动跳转到第一个匹配的内容
:set noincsearch 		# 表示取消跳转效果
# 假如就想一次搜索的时候忽略大小，那么使用\c，比如使用 /ignore\c
#（set xxx 表示设置 xxx 选项，上述的选项分别对应的是 ic(ignorecase)、is(incsearch)、hls(hlsearch)，你可以输入缩写也可以全输进去，在前面加上 no 就表示关闭这个选项）

:e					   # 命令行中直接打开编辑一个文件

:s	[FILENAME]			# 水平切分窗口，有跟文件名的话，这个文件的内容就在新的窗口
:vs	[FILENAME]			# 垂直切分窗口，有跟文件名的话，这个文件的内容就在新的窗口
:sp						
:split
:vsplit     			 
# Ctrl + w + 方向键 -- 切换到前／下／上／后一个窗格
# Ctrl + w + h/j/k/l -- 同上
# Ctrl + ww  -- 依次向后切换到下一个窗格中
# Crtl + w + +  扩大窗口
# Ctrl + w + -  缩小窗口
# :q 是退出光标所在的分屏

:help 					# 查看帮助
:help w  				# 查看 w 的帮助
:help c_CTRL-D			
:help insert-index
:help user-manual		# 查看用户手册


CTRL-D 					# 会显示全部的提示内容
<Tab>					# 自动补齐
```



### 2.4. 可视化模式

```bash
hjkl		# 选中内容移动

y			# 复制选中的内容
d			# 删除选中的内容
c			# 删除选中的内容，并进入 insert mode
```



### 2.5. 插入模式

```bash
<ESC> 		# 返回正常模式
```



### 2.6. 其他

```bash
vim 相比 vi 引入了很多特性，但是他们的大部分都是被禁止的。你可以编辑 vimrc （Unix：.vimrc）来打开某些功能，可使用 $VIMRUNTIME/vimrc_example.vim 中的内容。
```

## 3. 巨人的肩膀

1. http://justcode.ikeepstudying.com/2018/03/linux-vi-vim多标签和多窗口-tab页浏览目录-多tab页编辑

3. vi 多窗口同步滚动--适用于人工文件比较

   https://blog.csdn.net/JoeBlackzqq/article/details/46454701

   [vim打开多个文件（文件切换,窗口切换）](https://blog.csdn.net/CleverCode/article/details/51330414)

