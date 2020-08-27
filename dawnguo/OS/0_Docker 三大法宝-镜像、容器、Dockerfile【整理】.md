---
title: 三天肝了两本书，先整一份 1.5w 字 + 20 张图的高级 Docker 入门来学习一下
date: 2020-08-27 00:00:00
tags:
- 程序锅
category:
- 计算机
---

## 0. 前言

大家好，我是多选参数的程序锅，一个正在捣鼓操作系统、学数据结构和算法以及 Java 的失业人员。

这是我肝了 3 天，参考了两本书和一些博客之后，整理的一份关于 Docker 的高级入门。为啥说是高级入门呢？因为它比入门要深，但是比深入又要浅。

很早之前，我就接触过 Docker，但是没怎么用，也似懂非懂。偶尔看看一些推文，发现我还是不太懂 Docker 到底是个啥？镜像又是什么玩意？可能看的推文都不怎么较为深入的去讲镜像和容器是啥，都只是停留在镜像和容器整体上。对于我来说，不了解一下镜像和容器的细节内容，我觉得我都懂不了。而最大的 motivation 是我最近看了一篇论文，是关于镜像裁剪的，为了更好地看懂论文，所以决定还是把 Docker 好好学习一下。也正好把之前看 Linux 内核学到的 namespace 和 cgroups 知识给揉进去。

主要参考的两本书是《深入浅出 Docker》和《第一本 Docker》。个人感觉，前者主要偏讲原理，讲 Docker 架构、镜像、容器的时候都很细节，也有一些 docker 命令的使用，但是讲原理比较多；而后者则偏向操作，讲实战类，教你怎么用 docker 的，所以命令的使用比较多。这两本书（电子版的），我都有，需要的话，可以关注公众号回复 ”docker学习“ 即可。

本文的图很多都是截图或者网上原图。为什么不重新画呢？其实我也想重新画，但是我比较懒，我觉得图能将自己要阐述的点解释清楚，或者说和自己整理过后的文字结合的不错，我觉得这个图就没必要重新画了，人家的画已经很好看了，也很清晰了，你将它重新画，其实也是差不多，可能就是换个样式而已，核心的东西还是没有变。但是，在有些地方，我觉得别人的图跟我阐述的内容不符合，或者不能很好地阐述我想表达的东西，又或者这个地方需要一个图，那么我会画一个。

![](https://img.dawnguo.cn/Docker/Dokcer%20%E5%85%A5%E9%97%A8.png)

> 附：程序锅整了一个关于算法的 github 仓库：https://github.com/DawnGuoDev/algorithm，该仓库除包含基础的数据结构和算法实现之外，还会有数据结构和算法的知识内容整理、LeetCode 刷题记录（多种解法、Java 实现） 、一些优质书籍整理。

## 1. Docker 是什么

简单来说，Docker 它可以将程序及其应用环境打包在一起，当程序执行的时候使用的是打包的应用环境，而不是运行系统的环境，所以这也是什么在看到 Docker 的地方总能拿集装箱来比喻，这里你就可以将 Docker 理解成一个“集装箱”，这个“集装箱”里面包含了程序执行和打包的应用环境，那么“集装箱”里面的程序在运行时使用的是“集装”内的应用环境，但是程序在运行时还是靠主机的内核来执行的。

稍微具体点，Docker 包含了镜像和容器技术。镜像是静态的，你也可以将镜像理解成一个包含了 OS 文件系统和应用的对象（不包含内核），也就是“集装箱”的内容。容器是动态的，是镜像的运行时态：从镜像中启动一个程序，这个程序使用的应用环境是镜像提供的，而运行的程序和镜像组合在一起就算是容器了。给你的感觉就是运行起来之后还是在一个“集装箱”内。

因此，容器和镜像这两者的使用实现了一次打包，到处使用，免去了对运行环境的依赖，简化了应用的部署过程。

## 2. Docker 基本架构

Docker 的核心组件有：

- Docker 客户端和服务器
- Docker 容器
- Docker 镜像和 Registry（镜像仓库服务）

整个 Docker 的基本架构如图所示（图来自菜鸟教程）

![](https://img.dawnguo.cn/Docker/576507-docker1.png)

Docker 是一个客户-服务器（C/S）架构的程序。Docker 客户端只需要向 Docker 服务器或守护进程发出请求，服务器或守护进程将完成所有工作并返回结果。Docker 提供了一个命令行工具和一整套 RESTful API。你可以在同一台宿主机上运行 Docker 守护进程和客户端，也可以从本地的 Docker 客户端连接到运行在另一台宿主机上的远程 Docker 守护进程。Docker 以 root 权限运行它的守护进程，来处理普通用户无法完成的操作（如挂载文件系统）。Docker 程序是 Docker 守护进程的客户端程序，同样也需要以 root 身份运行。

- Docker 客户端也就是我们的 docker 命令行工具，比如我们可以通过 `docker run` 准备运行一个容器，那么此时客户端会像服务端发送请求。它是我们和 Docker 进行交互的最主要的方式方法。

- Docker Daemon（或者Docker 服务器）用来监听 Docker API 的请求和管理 Docker 对象，比如镜像、容器、网络和卷。默认情况 docker 客户端和 docker daemon 位于同一主机，此时 daemon 监听 /var/run/docker.sock 这个 Unix 套接字文件，来获取来自客户端的 Docker 请求。当然通过配置，也可以借助网络来实现 Docker Client 和 daemon 之间的通信，默认非 TLS 端口为 2375，TLS 默认端口为 2376。

- Docker Registry 是用来存储 Docker 镜像的仓库。Docker Hub 是 Docker 官方提供的一个公共仓库，也是 Docker 默认查找的地方。当然，还有其他的 Docker Registry，比如自己上 Docker Hub 注册一个账号申请一个自己的 Registry，也可以使用像阿里云这些提供的 Registry。

  当使用 docker pull 的时候会先检查本地是否存在所需镜像，如果不存在就去 Docker Registry 中拉取镜像。类似的，docker push 会将镜像推送到对应的 Docker Registry 中。

- Docker 镜像是一个制作模板，带有 Docker 容器的说明。Docker 镜像是基于联合（Union）文件系统的一种层式结构，包含了应用程序和其运行所依赖的程序库和文件（不包含内核）。一般来说，用户都会基于一些基础镜像上面再安装一些程序来构建符合自己的需求的镜像。

- Docker 容器是镜像的一个运行实例，一个镜像可以启动多个容器，而一个容器中可以运行一个或多个进程。 Docker 一个容器内的一个或多个进程的运行是依靠宿主机的内核，但是这些进程属于自己的**独立的命名空间，拥有自己的 root 文件系统、自己的网络配置、自己的进程空间和自己的用户 ID 等等**，所以容器内的进程相当由于运行在一个隔离的环境里，就相当于运行在一个新的操作系统中一样。

> OCI 是一个规范组织，比如制定镜像规范、容器运行时规范。
>
> 可以通过浏览 /var/lib/docker 目录来深入了解 Dcoker 的工作原理。该目录存放着 Dokcer 镜像、容器以及容器的配置。所有的容器都保存在 /var/lib/docker/containers 目录下。

## 3. Docker 镜像

Docker 镜像是一种层式结构，包含了应用程序和其运行所依赖的程序库和文件（不包含内核）。镜像可以理解为一种构建时结构（制作模板），而容器可以理解为一种运行时结构，用户基于镜像来运行自己的容器。你可以将其类比为程序和进程的关系，或者说是类（class）和实例对象的关系。当从某个镜像启动一个或多个容器之后，容器和镜像就成了依赖关系。在镜像上启动的容器全部停止之前，镜像是无法删除的。

容器目的是运行应用或者服务，而容器运行时需要镜像的内容，也就是镜像中应该包含应用服务运行时所需要的 OS 文件系统和应用文件。但是，容器又追求快速和小巧，所以要裁剪掉镜像中不必要的部分，保持较小的体积。因此 Docker 镜像中一般不会包含 6 个不同 shell 让读者选择，通常只有一个 shell 或者没有 shell。

另外，镜像中是不包含内核，容器都是共享所在 Docker 主机的内核，这样也保证了镜像的体积足够小。有时说的容器包含必要的操作系统，其实通常只有操作系统文件和文件系统对象。

我们需要某个镜像时 Docker 会先检查本地是否存在所需要的镜像，如果本地没有镜像的话，那么 Docker 就会连接官方维护的 Docker Hub 镜像仓库服务（默认的是镜像仓库服务是 Docker hub），查看 Docker Hub 中是否存在该镜像，一旦找到该镜像则将其保存到本地宿主机。本地镜像保存在 Docker 宿主机的 `/var/lib/docker/Docker 所采用的存储驱动` 目录下，比如 `/var/lib/docker/overlay2` 。这里更细节的是下面会提到的镜像层，假如一个镜像层在本地了，那么这个镜像层就不会被拉取了。当把镜像拉取到本地之后，我们可以使用该镜像启动一个或者多个容器。

Docker 镜像采用了联合文件系统（Union File System）技术，它可以支持对文件系统的修改作为一次提交来一层层的叠加（PS：详细的介绍，过段时间就会有了）。

### 3.1. 镜像分层

**Docker 镜像由一些松耦合的只读镜像层组成。Docker 负责堆叠这些镜像层，并将它们表示为单个统一的对象。实际上，镜像本身就是一个配置对象，其中包含了镜像层的列表以及一些元数据信息**。而镜像层才是实际数据存储的地方（比如文件等），镜像层之间是完全独立的，镜像层没有从属于某个镜像集合的概念。每个镜像的唯一标识是一个加密 ID，即配置对象本身的散列值。而每个镜像层也由一个加密 ID 区别，其值是镜像层本身内容的散列值。这意味着修改镜像的内容或其中任意的镜像层，都会导致加密散列值的变换。所以，镜像和其镜像层都是不可变的，任何改动都能轻松地被辨别。



![](https://img.dawnguo.cn/Docker/image-20200818104152246.png)

镜像层 ID 在拉取镜像的时候会看到，SHA256 散列值可以通过 `docker image inspect <image>` 看到。	

![](https://img.dawnguo.cn/Docker/image-20200818145917915.png)

![](https://img.dawnguo.cn/Docker/image-20200821092000733.png)

**所有的 Docker 镜像都起始于一个基础镜像层，当进行修改或者增加新的内容时，就会在当前镜像层之上，创建新的镜像层**。举个例子，假如基于 Ubuntu 16.04 创建一个新的镜像，那么 Ubuntu 16.04 就是新镜像的第一层；如果在该镜像中添加 Python 包，就会在基础镜像层之上创建第二个镜像层；如果继续添加一个安全补丁，就会创建第三个镜像层，如图所示。

![](https://img.dawnguo.cn/Docker/image-20200818104545084.png)

**并且在添加额外的镜像层的时候，镜像始终保持当前所有镜像层的组合，即所有镜像层堆叠之后的结果**。如下图所示，每个镜像层包含 3 个文件，而镜像包含了来自两个镜像层的 6 个文件。再如下图所示，第三层镜像层的文件 7 是文件 5 的一个更新版本，但是在外部看来整个镜像还是只有 6 个文件，因为对外展示时相当于把所有镜像层堆叠合并。

![](https://img.dawnguo.cn/Docker/image-20200818105148798.png)

![](https://img.dawnguo.cn/Docker/image-20200818105206691.png)

**Docker 通过存储引擎（新版本采用快照机制）的方式来实现镜像层堆栈，并保证多镜像层对外展示为统一的文件系统**。

另外，多个镜像之间会共享镜像层，这样可以有效节省空间并提升性能。Docker 在拉取镜像时会识别出要拉取的镜像中有哪几层已经在本地了的，如果有些镜像层已经在本地了，那么这些镜像层就不会被拉取。

> Linux 上可用的存储引擎有 AUFS、Overlay2、Device Mapper 等等。每种引擎都基于 Linux 中对应的文件系统或者块设备技术，并且每种存储引擎都有其独有的性能特性，都有自己的镜像分层、镜像层共享以及写时复制（CoW）技术的具体实现。但是，最终效果和用户体验是完全一致的。

**含有引导文件系统的镜像**

Docker 镜像是分层的，这是毋庸置疑的，但是最底端的说法存在不一致。有一种说法 Docker 镜像最低端是一个引导文件系统，即 bootfs，这很像典型的 Linux/Unix 的引导文件系统。Docker 用户几乎永远不会和引导文件系统有什么交互。实际上，当一个容器启动后，它将会被移到内存中，而引导文件系统则会被卸载，以留出更多的内存 供 initrd 磁盘镜像使用。Docker 镜像的第二层是 root 文件系统 rootfs，它位于引导文件系统之上。rootfs 可以是一种或多种操作系统的文件系统，比如 Ubuntu 文件系统。

在 Linux 引导过程中，root 文件系统会最先以只读的方式加载，当引导结束并完成了完整性检查之后，它才会切换为读写模式。而在 Docker 中，root 文件系统只能是只读状态，并且 Docker 也只会在 root 文件系统层上加载更多的只读文件系统。之后利用联合加载一次同时加载多个文件系统，但是在外面看起来只能看到一个文件系统，这样最终的文件系统包含了所有底层的文件和目录。

那么到底哪个是底层呢？通多 `docker inspect` 命令查看只会看到 rootfs 层，所以相对来说，我比较喜欢把基础镜像层当成镜像的最底层，但是我们也要知道 bootfs 这个东西。

### 3.2. 镜像仓库服务和 pull 操作

Docker 镜像存储在镜像仓库服务（也就是之前提到的 Registry）中，镜像仓库服务包含多个镜像仓库，一个镜像仓库又包含多个镜像（比如 Ubuntu12.04、Ubuntu14.04 等等），除此之外仓库还会有层以及镜像的元数据。为了区分一个仓库中的不同镜像，Docker 提供了一种标签的功能。每个镜像都会有一个标签，如 12.04、v1、v2 。其实，每个标签是对组成特定镜像的一些镜像层进行标记，比如，标签 12.04 就是对组成 Ubuntu 12.04 镜像的镜像进行标记。

![](https://img.dawnguo.cn/Docker/image-20200813172444070.png)

在 pull 镜像的时候，需要给出镜像仓库服务的网络地址、仓库名称（镜像名）以及标签即可定位到某个镜像（名字和标签使用 `:` 分隔）。如下 `<Registry>` 就是上图中的镜像仓库服务，`<Repository>` 相当于上图中的仓库，`<Tag>` 相当于这个仓库中镜像的版本。先根据 `<Registry>` 定位到镜像仓库所在网络位置，之后再根据  `<Repository>` 定位到某个仓库，再根据 `<Tag>` 定位到某个具体的镜像。

```bash
# 完整命令
docker image pull <Registry>/<Repository>:<Tag>
```

由于 Docker 客户端的镜像仓库服务默认使用官方 Docker hub（默认镜像仓库服务是可配置的），所以默认情况下在 pull 镜像时可以省略 `<Registry>`，只需要给出镜像的名字和标签，就能在官方 Docker Hub 中定位到一个镜像（当然 Tag 也可以不填，默认情况下使用的是 latest）。

```bash
# 默认从 Docker Hub 上拉取镜像时
docker image pull <Repository>:<Tag>
```

除了官方仓库之外（官方 Docker Hub），还有非官方 Docker Hub。非官方的相当于用户注册了个 Docker ID，使用 Docker 提供的 Docker Hub 功能，可将自己的 Docker 镜像传到 Docker Hub 中自己的镜像仓库服务上。此时，仓库的命名是 `<YourDockerID>/<Repository>`，因为我们在这个二级仓库下我们才是有操作权限的。

```bash
# 从非官方的 Docker Hub 中拉取，仓库前面需要加上 Docker Hub 的用户名或者组织名。
docker image pull <YourDockerID>/<Repository>:<Tag>
```

另外还有第三方镜像仓库服务，比如阿里运镜像仓库服务这些，这个时候就需要在前面加上第三方镜像仓库服务的域名等，这样才能定位到相应的镜像文件。

```bash
# 从第三方仓库服务（非 docker hub）中拉取镜像
docker image pull gcr.io/demp/tu-demp:v2 
```

总的来说 pull 镜像的定位方式是，先根据给定的第一个斜杠前的内容定位到基本镜像仓库服务，这个可以不填，默认情况下不填写是官方 Docker Hub；之后再根据第一个斜杠后面和冒号前面的内容定位到位于该镜像仓库服务中的仓库；最后根据标签找到所需镜像，这个也可以不填，默认是 latest。

> 注意：
>
> 1.latest 标签的镜像不一定是最新，因为 latest 标签是一个非强制性标签，不保证指向仓库中最新的镜像。
>
> 2.一个镜像可以根据用户需要设置多个标签，因为标签是存放在镜像元数据中的任意数字或字符串（详见构建镜像一节的内容）。

除了根据镜像的名字和标签拉取镜像之外，还可以根据摘要拉取镜像。Docker 1.10 中引入了新的内容寻址存储模型。作为一个模型的一部分，每一个镜像现在都有一个基于其内容的密码散列值（digest，摘要）。摘要是镜像内容的一个散列值，所以镜像内容的变更一定会导致散列值的改变。

```bash
docker image pull apline@摘要值
```

> Docker Registry 的代码是开源的，我们也可以自己搭建一个 Registry。

**多架构镜像**

目前，Docker 镜像和镜像仓库服务支持多架构镜像。也就是说某个镜像仓库标签（repository:tag）下的镜像可以同时支持 64 位 Linux、PowerPC Linux、64 位 windows 和 ARM 等多种架构，就相当于一个标签下，可以支持多个平台和架构。

为了实现这个特性，镜像仓库服务 API 支持两种重要的结构：Manifest列表（新）和 Manifest。Manifest 列表是某个镜像标签支持的架构列表。其支持的每种架构，又都有自己的 Mainfest 定义，其中列举了该镜像的构成。如图所示，是 Golang 官方镜像的实例。左边是 Manifest 列表，其中包含了该镜像标签支持的每种架构，Manifest 列表中的每一项都有一个箭头指向具体的 Manifest，而这个 Manifest 包含了镜像配置和镜像层数据（Mainfest 列表是可选的，在没有 Manifest 列表的情况下，镜像仓库服务会返回普通的 Manifest）。

![](https://img.dawnguo.cn/Docker/image-20200818114424770.png)

假设我们在树莓派（基于 ARM 架构的）上运行 Docker，那么在拉取镜像的时候，所需要的平台和架构信息会被 Docker 默默地获取到了，Docker 客户端会调用 Docker Hub 镜像仓库服务相应的 API 。如果该镜像有 Mainfest 列表，并且存在 Linux on ARM 这一项，则 Docker Client 就会找到 ARM 架构对应的 Manifest 并解析出组成该镜像的镜像层加密 ID，然后从 Docker Hub 二进制存储中拉取每个镜像层。



### 3.3. 相关命令

**docker image pull 拉取镜像**

```bash
# 完整命令
docker image pull <Registry>/<Repository>:<Tag>

# 默认从 Docker Hub 上拉取镜像时
docker image pull <Repository>:<Repository>：<Tag>

# 从非官方的 Docker Hub 中拉取，仓库前面需要加上 Docker Hub 的用户名或者组织名。
docker image pull <YourDockerID>/<Repository>:<Tag>

# 从第三方仓库服务（非 docker hub）中拉取镜像
docker image pull gcr.io/demp/tu-demp:v2 

docker image pull alpine:latest	# 从官方 Docker Hub 的 alpine 仓库中拉取标有 latest 标签的镜像
docker image pull ubuntu:latest 
docker image pull redis:latest

docker image pull alpine 		# 默认拉取标签为 latest 的镜像

docker image pull mongo:3.3.11	# 拉取非 latest 标签的镜像

docker image pull dawnguo/docker-hexo:alpine  # 从非官方的 Docker Hub 中拉取，仓库前面需要加上 Docker Hub 的用户名或者组织名
```

**docker image rm/prune 删除镜像**

```bash
# 从 Docker 主机删除镜像，删除操作会在当前主机上删除该镜像以及相关的镜像层。但是，如果某个镜像层被多个镜像共享，那么只有当全部依赖该镜像层的镜像全都删除之后，该镜像层才会删除。
# 另外被删除的镜像上存在运行状态的容器，删除不会被允许，所以需要停止并删除该镜像相关的全部容器之后才能删除镜像。
# 输出内容中：每一个 Deleted：行都表示一个镜像层被删除
docker image rm <ImageID>	# 根据 image id 来删除镜像
docker rmi	# 也可以

docker image rm <ImageID1> <ImageID2> ...	# 删除多个

docker image rm <Repository>:<Tag>	# tag 同样可以省略

docker image rm $(docker image ls -q) -f # 删除本地系统中的全部镜像

docker image prune # 移除全部的 dangling 镜像

docker image prune -a # 额外移除没有被使用的镜像（没有被任何容器使用的镜像）
```

**docker image ls 查看镜像**

```bash
docker image ls
docker image ls <Repository>	# 显示名为 Repository 的镜像
docker image ls -a	# 显示所有镜像
docker image ls -q # 只返回系统本地拉取的全部镜像 ID 列表
docker image ls --digests # 查看镜像的 SHA256 签名

docker images # 等同于 docker image ls
```

可以使用 `--filter` 参数来过滤 `docker image ls` 命令返回的镜像列表内容，支持四种过滤器：

- dangling：可以指定为 true 或者 false，指定 true 仅返回悬虚镜像，指定 false 仅返回非悬虚镜像。
- before：需要镜像名称或者 ID 作为参数，返回在指定镜像之前被创建的全部镜像
- since：与 before 类似，不过返回的是指定镜像之后创建的全部镜像
- label：根据标注（label）的名称或者值，对镜像进行过滤。docker image ls 命令输出中将不显示标注内容。

```bash
docker image ls --filter dangling=true	# dangling 镜像是指那些没有标签的镜像，在列表中显示 <none>：<none>。通常出现这种情况是因为构建了一个新的镜像，并且为这个镜像打上了已经存在的标签。那么旧镜像就变成了悬虚（dangling）镜像了。
```

还可以使用 `reference` 的方式过滤。

```bash
# 过滤并只显示标签带 latest 的
docker image ls --filter=reference="*:latest"
```

使用 `--format` 来通过 Go 模板对输出内容进行格式化

```bash
docker image ls --format "{{.Size}}"	# 只返回 Docker 主机上的镜像的大小属性
docker image ls --format "{{.Reposity}}:{{.Tag}}:{{.Size}}" # 只显示仓库、标签和大小
```

**docker search 查找镜像**

```bash
# docker search 命令允许通过 CLI 的方式搜索 Docker Hub。可通过 "Repository" 字段（仓库名称）的内容进行匹配，并且对返回内容中任意列的值进行过滤。返回的镜像中既有官方的也有非官方的。并且默认情况下只显示 25 行
docker search alpine	# 查找 Repository 字段中带有 alpine 的

docker search apline --filter "is-official=true"
docker search apline --filter "is-automated=true"

docker search apline --limit 30 # 增加返回内容的行数，最多 100 行
```

**docker image inspect**

```bash
# 查看镜像的组成情况
docker image inspect <ImageID>||<Repository>:<Tag>
```

## 4. Docker 容器

容器是基于镜像启动起来的，是镜像的一个运行实例，容器中可以运行一个或多个进程。同时，用户可以从单个镜像上启动一个或多个容器。

一个容器内的一个或多个进程的运行是依靠容器所在宿主机的内核，但是这些进程属于自己的**独立的命名空间，拥有自己的 root 文件系统、自己的网络配置、自己的进程空间和自己的用户 ID 等等**，所以容器内的进程相当由于运行在一个隔离的环境里，就相当于运行在一个新的操作系统中一样。容器使用 root 文件系统大部分是由镜像提供的，还有一些是由 Docker 为 Docker 容器生成的。

Docker 容器的底层技术采用了 Namespace 和 cgroups，Namespace 技术可以让容器内的进程拥有自己的命名空间，也就是上面提到的那些，而 cgroups 可以控制容器内的进程内使用的 CPU 和内存等资源（PS：详细的内容，后头有空会再写关于这个的）。

> 运行的容器是共享宿主机内核的，也就是相当于容器在执行时还是依靠主机的内核代码的。这也就意味着一个基于 Windows 的容器化应用在 Linux 主机上无法运行的。也可以简单地理解为 Windows 容器需要运行在 Windows 宿主机之上，Linux 容器需要运行在 Linux 宿主机上。
>
> Docker 推荐单个容器只运行一个应用程序或进程，但是其实也可以运行多个应用程序。

### 4.1. 容器周期

容器的生命周期大致可分为 4 个：创建、运行、休眠和销毁。

**创建和运行**

容器的创建和运行主要使用 `docker container run` 命名，比如下面的命令会从 Ubuntu:latest 这个镜像中启动 /bin/bash 这个程序。那么 /bin/bash 成为了容器中唯一运行的进程。

```bash
docker container run -it ubuntu:latest /bin/bash
```

>当运行上述的命令之后，Docker 客户端会选择合适的 API 来调用 Docker daemon 接收到命令并搜索 Docker 本地缓存，观察是否有命令所请求的镜像。如果没有，就去查询 Docker Hub 是否存在相应镜像。找到镜像后，就将其拉取到本地，并存储在本地。一旦镜像拉取到本地之后，Docker daemon 就会创建容器并在其中运行指定应用。

`ps -elf` 命令可以看到会显示两个，那么其中一个是运行 `ps -elf` 产生的。

![](https://img.dawnguo.cn/Docker/image-20200819111509296.png)

假如，此时输入 exit 退出 Bash Shell 之后，那么容器也会退出（休眠）。因为容器如果不运行任何进程则无法存在，上面将容器的唯一进程杀死之后，容器也就没了。其实，当把进程的 PID 为 1 的进程杀死就会杀死容器。

**休眠和销毁**

`docker container stop` 命令可以让容器进入休眠状态，使用 `docker container rm` 可以删除容器。删除容器的最佳方式就是先停止容器，然后再删除容器，这样可以给容器中运行的应用/进程一个停止运行并清理残留数据的机会。因为先 stop 的话，`docker container stop` 命令会像容器内的 PID 1 进程发送 SIGTERM 信号，这样会给进程预留一个清理并优雅停止的机会。如果进程在 10s 的时间内没有终止，那么会发送 SIGKILL 信号强制停止该容器。但是 `docker container rm` 命令不会友好地发送 SIGTERM ，而是直接发送 SIGKILL 信号。

**重启策略**

容器还可以配置重启策略，这是容器的一种自我修复能力，可以在指定事件或者错误后重启来完成自我修复。配置重启策略有两种方式，一种是命令中直接传入参数，另一种是在 Compose 文件中声明。下面阐述命令中传入参数的方式，也就是在命令中加入 `--restart` 标志，该标志会检查容器的退出代码，并根据退出码已经重启策略来决定。Docker 支持的重启策略包括 always、unless-stopped 和 on-failed 四种。

- always 策略会一直尝试重启处于停止状态的容器，除非通过 `docker container stop` 命令明确将容器停止。另外，当 daemon 重启的时候，被 `docker container stop` 停止的设置了 `always` 策略的容器也会被重启。

  ```bash
  $ docker container run --it --restart always apline sh 
  # 过几秒之后，在终端中输入 exit，过几秒之后再来看一下。照理来说应该会处于 stop 状态，但是你会发现又处于运行状态了。
  ```

- unless-stopped 策略和 always 策略是差不多的，最大的区别是，`docker container stop` 停止的容器在 daemon 重启之后不会被重启。

- on-failure 策略会在退出容器并且返回值不会 0 的时候，重启容器。如果容器处于 stopped 状态，那么 daemon 重启的时候也会被重启。另外，on-failure 还接受一个可选的重启次数参数，如`--restart=on-failure:5` 表示最多重启 5 次。

### 4.2. 容器的文件系统

容器会共享其所在主机的操作系统/内核（容器执行使用共享主机的内核代码），但是容器内运行的进程所使用的是容器自己的文件系统，也就是容器内部的进程访问数据时访问的是容器的文件系统。当从一个镜像启动容器的时候，除了把镜像当成容器的文件系统一部分之外，Docker 还会在该镜像的最顶层加载一个可读写文件系统，容器中运行的程序就是在这个读写层中执行的。

如图所示，图中的顶上两层，是 Docker 为 Docker 容器新建的内容，而这两层恰恰不属于镜像范畴。这两层分别为 Docker 容器的初始层（Init Layer）与可读写层（Read-Write Layer）：

- 初始层中大多是初始化容器环境时，与容器相关的环境信息，如容器主机名，主机 host 信息以及域名服务文件等。

- 再来看**可读写层，这一层的作用非常大，Docker 的镜像层以及顶上的两层加起来，Docker 容器内的进程只对可读写层拥有写权限，其他层对进程而言都是只读的（Read-Only）**。比如想修改一个文件，这个文件会从该读写层下面的只读层复制到该读写层，该文件的只读版本仍然存在，但是已经被读写层中的该文件副本所隐藏了。这种机制被称为写时复制（copy on write）（在 AUFS 等文件系统下，写下层镜像内容就会涉及 `COW` （Copy-on-Write）技术）。另外，关于 `VOLUME` 以及容器的 `hosts`、`hostname` 、`resolv.conf` 文件等都会挂载到这里。需要额外注意的是，虽然 Docker 容器有能力在可读写层看到 `VOLUME` 以及 `hosts` 文件等内容，但那都仅仅是挂载点，真实内容位于宿主机上。

  在运行阶段时，容器产生的新文件、文件的修改都会在可读写层上，当停止容器（stop）运行之后并不会被损毁，但是删除容器会丢弃其中的数据。

![](https://img.dawnguo.cn/Docker/%E4%B8%80%E5%9B%BE%E7%9C%8B%E5%B0%BDDocker%E5%AE%B9%E5%99%A8%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F.png)

### 4.3. 容器和虚拟机的根本性区别

在虚拟机模型中，首先要启动物理机和 Hypervisor 引导程序（这边略过了 BIOS 和 Bootloader 等阶段）。一旦 Hypervisor 启动之后，就会占用机器上的全部物理资源，如 CPU、RAM、存储和 NIC。Hypervisor 接下来就会将这些物理资源划分为虚拟资源，并且看起来与真实物理资源完全一致。然后 Hypervison 将这些资源打包进一个叫做虚拟机（VM）的软件结构中。之后在 VM 中安装操作系统，并在操作系统上安装应用。假如要运行 4 个应用，那么一般来说需要创建 4 个虚拟机并安装 4 个操作系统，然后分别安装应用。

![](https://img.dawnguo.cn/Docker/image-20200818171735242.png)

在容器模型中。服务器启动之后，所选择的操作系统会启动。那么启动的操作系统会占用了全部硬件资源。在 OS 层之上，需要安装容器引擎，比如 docker。容器引擎会获取系统资源，然后将这些资源分割成安全的互相隔离的资源结构，称之为容器。此时，每个容器在其内部运行应用。

![](https://img.dawnguo.cn/Docker/image-20200818171855078.png)

两者的区别，主要如下：

- 从高层面上来讲，Hypervisor 是硬件虚拟化，Hepervisor 将硬件物理资源划分为了虚拟资源，通过中间层将一层或多台独立的机器虚拟运行于物理硬件之上。而容器是操作系统虚拟化，将系统资源（软件和硬件资源）划分为了虚拟资源，是直接运行在操作系统内核之上的用户空间，使用的是操作系统的系统调用接口，不需要像传统的虚拟化和半虚拟化技术那样需要模拟层和管理层。除此之外，还可以让多个独立的用户空间运行在同一台宿主机上。

- 使用虚拟机的话，每个虚拟机都有自己的操作系统。但是，操作系统本身就有其额外开销。每个操作系统本身就会消耗一点 CPU、一点 ARM、一点存储空间。每个操作系统都需要打补丁升级，也都面临着被攻击的风险。这种现象被称为 OS Tax 或者 VM Tax，即表示每个 OS 都会额外占用一定的资源。

  而容器模型则只需要一个操作系统，因为所有的容器共享同一个内核。那么意味着只有一个操作系统消耗 CPU、RAM 和存储资源。

  那么相比之下容器模型的资源利用率会更高。当需要运行成百上千应用的时候，两者之间的区别会更明显。

- 另一个是启动时间的上的区别。

  虚拟机中需要启动内核，内核启动过程中需要对硬件进行遍历和初始化。

  而容器不是完整的操作系统，内部也不需要内核，因为是共享主机的内核，所以不需要上述遍历和初始化，所以启动要比虚拟机快。唯一对容器启动时间有影响的就是容器内应用启动所花费的时间。



### 4.4. 相关命令

**查看 Docker 情况**

```bash
docker version		# 当命令的输出包含 Client 和 Server 内容的时候，表示 daemon 已经启动

docker info	# 返回所有容器和镜像的数量、Docker 使用的执行驱动和存储驱动，以及 Docker 的基本配置

service docker status	# 查看 docker 的状态

systemctl is-active docker	# 查看 docker 的状态
```

**容器周期相关操作**

```bash
# 启动容器最基础的格式，指定了启动所需的镜像以及要运行的应用
# 省略了 <tag>,那么默认是 latest
docker container run <Options> <Repository>:<Tag> <App>	
docker run <Options> <Repository>:<Tag> <App>	# 这个命令也可以

# 启动某个 Ubuntu Linux 容器，并在其中运行 bash shell 作为其应用。
# -it 参数表示将当前 shell 连接到容器的 shell 终端之上，并且与容器具有交互。具体为：-i 表示容器中的 STDIN 是开启的，-t 为要创建的容器分配一个伪 tty 终端
# 在启动的容器中运行某些指令，可能无法正常工作，这是因为大部分容器镜像都是经过高度优化的，有些指令并没有被打包进去。
docker container run -it ubuntu:latest	/bin/bash	

# -d 表示后台模式，告知容器在后台运行
docker container run -d ubuntu sleep 1m	

# 设置容器名字为 percy（合法的名字是可包含：大小写字母、数字、下划线、圆点、横线）
docker container run --name percy -it ubuntu:latest /bin/bash	

# 配置重启策略，采用 always 策略，--restar 标志会检查容器的退出代码
docker container run --restart -it always ubuntu:latest /bin/bash

# -p 80:8080 将 Docker 主机的 80 端口映射到容器内的 8080 端口。当有流量访问主机的 80 端口时
# 流量会直接映射到容器内的 8080 端口。
docker container run -d -p 80:8080 <Repository>:<Tag> <App>

# 在宿主机上随便选择一个位于 49153~65535 之间的一个端口来映射到容器的 80 端口，之后可以通过 docker ps -l 或者 docker port 来查看端口映射情况
docker container run -d -p 80 <Repository>:<Tag> <App> 

# 将 Dockerfile 中 EXPOSE 指令的端口都随机映射到主机的端口上，注意是大写的 P
docker container run -d -P <Repository>:<Tag> <App> 

# 将容器内的 80 端口绑定到本地宿主机 127.0.0.1 这个 IP 地址的 80 端口上
docker container run -d -p 127.0.0.1:80:80 	

# 没有指定要绑定的宿主机端口号，随机绑定到宿主机 127.0.0.1 的一个端口上
docker container run -d -p 127.0.0.1::80	


# 有时不指定要运行的 app 也是可以的，这是因为构建镜像时指定了默认命令。可以通过 docker image inspect 查看，如果有设置了 Cmd 那么表示在基于该镜像启动容器时会默认运行 Cmd。当然，也可以自己指定，但是这种在构建时指定默认命令是一种很普遍的做法，可以简化容器的启动。
docker container run <Repository>:<Tag>

# 在这次运行时覆盖原 Dockerfile 中的 ENTRYPOINT 指令
docker container run --entrypoint <Command> <Repository>:<Tag> <Params> 
```

```bash
# 停止运行中的容器，并将状态设置为 Exited(0)，发送 SIGTERM 信号
docker container stop <ContainerName>||<ContainerID> 
docker stop <ContainerName>||<ContainerID> # 同理也可以

# 也可以使用 docker kill 命令停止容器，只是发出的是 SIGKILL 信号
docker kill <ContainerName>||<ContainerID>
```

```bash
# 重启处于停止（Exited）状态的容器
docker container start <ContainerName>||<ContainerID> 
docker start <ContainerName>||<ContainerID> 
```

```bash
# 删除停止运行的容器
docker container rm <ContainerName>||<ContainerID> 
docker rm <ContainerName>||<ContainerID> 

# 一次性删除运行中的容器，但是建议先停止之后再删除。
docker container rm <ContainerName>||<ContainerID> -f  

# 清理掉 Docker 主机上全部运行的容器
docker container rm $(docker container ls -aq) -f
```

```bash
# Docker 1.3 之后允许使用 docker container exec（或者 docker exec）命令在运行状态的容器中，启动一个新进程，也就是会创建新进程。在将 Docker 主机的 Shell 连到一个正在运行中容器的终端十分有用。
docker container exec <options> <ContainerName>/<ContainerID> <app>
docker container exec -it ubuntu bash	# 会在容器内部启动一个新的 Bash Shell，并连接到该 bash
docker exec 

# 重新附着到该容器的会话上，比如之前开了一个 shell，之后退出又重新 start 了，那么可以可以使用这个，重新连接之前的 shell
docker attach <ContainerName>||<ContainerID>
```

```bash
Ctrl-PQ 	# 退出容器，但并不终止容器运行。会切回 Docker 主机的 shell，并保持容器在后台运行
```

**查看容器**

```bash
docker container ls		# 观察当前系统正在运行(UP)状态的容器，如果有 port 选项的话，那么是 host-port:container-port 的格式
docker container ls -a	# 观察当前系统正在运行的容器容器，包括 stop 状态的
```

```bash
docker ps		# 查看当前系统中正在运行的容器
docker ps -a	# 查看当前系统中所有的容器（运行和停止）
dokcer ps -l	# 列出最后一次运行的容器（运行和停止）
docker ps -n x	# 显示最后 x 个容器（运行和停止）
```

```bash
# 查看指定容器的指定端口的映射情况
docker port <ContainerName>||<ContainerID> 80 
```



**其他**

```bash
docker inspect <ContainerName>||<ContainerID>
docker container inspect <ContainerName>||<ContainerID> # 显示容器的配置信息（名称、命令、网络配置等）和运行时信息
docker inspect --format '{{.NetworkSettings.IPAddress}}'	# 支持 -f 或者 --format 标志查看选定内容的结果，就跟 image ls 那个一样的

docker logs	# 获取守护式容器的日志
docker logs -f # 监控守护式容器的日志（跟 tail 命令使用差不多）
docker logs -t # 显示守护式容器日志的时间戳

docker top	# 查看容器内部运行的进程
```



## 5. Dockerfile && 构建 Docker 镜像

将应用整合到容器中并且运行起来的这个过程，称为“容器化”(Containerizing )。一般来说，完成的应用容器化过程主要分为以下几个步骤：

1. 编写应用代码；
2. 创建一个 Dockerfile，其中包括当前应用的描述、依赖以及该如何运行这个应用；
3. 对该 Dockerfile 执行 docker image build 命令
4. 等待 Docker 将应用程序和依赖等构建到 Docker 镜像中。

一旦应用及其依赖被打包成一个 Docker 镜像，就能以镜像的形式交付并以容器的方式运行了。当然你还可以将镜像推送到镜像仓库服务。

![](https://img.dawnguo.cn/Docker/image-20200820095944669.png)

### 5.1. Dockerfile

应用容器化过程中最基础的是创建一个 Dockerfile。**Dockerfile 是一个文件（必须要写成 Dockerfile），它主要有两个用途，一是对当前应用的描述，二是指导 Docker 完成镜像的构建**。Dockerfile 对当前的应用及其依赖有一个清晰准确的描述，并且非常容易阅读和理解。另外， Dockerfile 也通常被放在构建上下文的根目录下（在 Docker 当中，包含应用文件的目录通常被称为构建上下文（Build Context），在构建镜像时构建上下文和该上下文中的文件和目录都会被上传到 Docker daemon，这样 daemon 可以直接访问你想在镜像中存储的任何代码、文件或者其他数据）。

Dockerfile 中的注释行都是以 `#` 开始的，除注释之外，每一行都是一条指令（使用基本的基于 DSL 语法的指令），指令及其使用的参数格式如下。指令是不区分大小写的，但是通常都采用大写的方式（可读性会更高）。

```
INSTRCUTION arguments
```

下面以一个 Dockerfile 为例进行阐述，

```dockerfile
# Linux x64
FROM alpine

LABEL maintainer="multiparam@gmail.com"

# Install Node and NPM
RUN apk add --update nodejs nodejs-npm

# Copy app to /src
COPY . /src

WORKDIR /src

# Install dependencies
RUN  npm install

EXPOSE 8080

ENTRYPOINT ["node", "./app.js"]
```

- 每一个 Dockerfile 的第一行通常都是 `FROM` 指令，用于指定要构建的镜像的基础镜像。`FROM` 指令指定的镜像，会作为当前镜像的一个基础镜像层，当前应用的剩余内容会作为新增镜像层添加到基础镜像层之上。一般 `FROM` 指令引用官方基础镜像，因为官方基础镜像会遵循一些最佳实践。当这一步为止，镜像的结构如图所示

  ![](https://img.dawnguo.cn/Docker/image-20200820102038687.png)

- Dockerfile 通过标签（LABEL）的方式指定当前镜像的维护者。每个标签是一个键值对，可以指定多个不同的键值对，从而给镜像添加元数据。这些内容并不会构建镜像层，只会作为镜像的元数据记录到镜像的配置中。

- `RUN apk add --update nodejs nodejs-npm` 指令使用 apline 的 apk 包管理器将 nodejs 和 npm 安装到当前镜像中。`RUN` 指令会在 `FROM` 指定的基础镜像层之上，新建一个镜像层来存储这些安装内容。

  > RUN 会有两种格式，这种格式的话会在 shell 里使用命令包装器 `/bin/sh -c` 来执行，而另一种 exec 格式的话不会使用 shell 来执行。

  ![](https://img.dawnguo.cn/Docker/image-20200820102659216.png)

- `COPY . /src` 指令将应用相关的文件从构建上下文拷贝到当前镜像中，并且新建一个镜像层来存储。

  ![](https://img.dawnguo.cn/Docker/image-20200820102806459.png)

- `WORKDIR` 为 Dockerfile 中尚未执行的指令设置工作目录。PS：相当于切换接下去的指令的工作目录为 `/src` ，也就是接下去指令执行都是在 `/src` 目录中执行的。`WORKDIR` 指令不会构建镜像层，但是会作为元数据记录到镜像配置中。这边的 `WORKDIR` 指令不会构建镜像层，主要是因为 `COPY` 指令的时候已经创建了 /src 目录，`WORKDIR` 只是一个切换目录的重要。假如在 `WORKDIR` 指令执行的时候，`/src` 还没有创建，那么也会创建一个镜像层。

- `RUN npm install` 会根据 `/src` 中的 `package.json` 中的配置信息（因为我们已经切换到 `/src` 目录了），使用 npm 来安装当前应用的相关依赖包。该操作会构建新的镜像层。

  ![](https://img.dawnguo.cn/Docker/image-20200820103301924.png)

- 之后使用 `EXPOSE` 指令用于记录应用所使用的网络端口。PS：表示容器会开放 8080 端口。这个信息也会被当做镜像的元数据被添加到镜像的配置文件中。

- 最终，我们通过 `ENTRYPOINT` 指令用于指定镜像以容器方式启动后默认运行的程序，同样这个信息会被当做镜像的元数据被添加到镜像的配置文件中。

上述发现部分指令会在镜像层中构建新的镜像层，而其他指令只会增加或者修改镜像的元数据信息。如果指令的作用是向镜像中添加新的文件或者程序，那么这条指令会新建镜像层；如果只是告诉 Docker 如何完成构建或者如何运行应用程序的话，那么只会增加镜像的元数据。除上述这些指令之外，还有 ENV、ONBUILD、HEALTHCHECK、CMD 指令等，详细使用请移步 docker 官方文档。

> 如果使用的是 APT 包管理器的话，在执行 apt-get install 命令增加 no-install-recommends 参数，这能确保 APT 仅安装核心依赖包，而不是推荐和建议的包，这样能显著减少不必要包的下载数量，从而减少镜像的大小。

### 5.2. 构建过程

上述的 Dockerfile 编写完成之后，我们通过下面的命令即可构建出一个镜像。`docker image build` 指令会解析 Dockerfile 中的指令并顺序执行，构建过程是，运行临时容器->在该容器中运行 Dockerfile 中的指令->将指令运行结果保存为一个新的镜像层（执行类似 docker commit 的操作）->删除容器。

```bash
# 构建出一个叫 web:latest 的镜像，.（点）表示将当前目录作为构建上下文并且当前目录需要包含 Dockerfile
# 如果没有指定标签的话，那么会默认设置一个 latest 标签
docker image build -t web:latest . 
# 可以通过 docker image build 的输出内容了解镜像的构建过程，而构建过程的最终结果是返回了新镜像的 ID。其实，构建的每一步都会返回一个镜像的 ID。
```

>1. 可以使用 docker image history 来查看构建镜像的过程中都执行了哪些指令。也可以使用 docker image inspect 来确认一共创建了几层。
>
>2. 如果构建过程中失败了的话，也将会得到一个可以使用的镜像。可以基于这个镜像，执行失败的指令查看具体原因。
>3. 如果在构建上下文的根目录存在以 .dockerignore 命名的文件的话，那么该文件中匹配的文件不会被上传到构建上下文中去。该文件中模式匹配规则采用了 Go 语言的 filepath。



**构建镜像的过程中会利用缓存**

Docker 构建镜像的过程中会利用缓存机制。对于每一条指令，Docker 都会检查缓存中是否检查已经有与该指令对应的镜像层。如果有，即为缓存命中，并且使用这个镜像层；如果没有，则是缓存未命中，Docker 会基于该指令构建新的镜像层。缓存命中能显著加快构建过程。

比如，示例中使用的 Dockerfile。第一条指令告诉 Docker 使用 apline:latest 作为基础镜像。如果主机中已经存在这个镜像，那么构建时就会直接跳转到下一条指令；如果镜像不存在，则会从 Docker Hub 中拉取。

下一条指令 `RUN apk add --update nodejs nodejs-npm` ，如果缓存中存在基于同一基础镜像并且执行了相同指令的镜像层的话（本例就是缓存中存在一个基于 alpine:latest 镜像并且在它之上执行了 `RUN apk add --update nodejs nodejs-npm` 指令构建而成的镜像层的话），那么则跳过这条指令，并链接到这个已存在的镜像层，然后继续构建；如果没有找到该镜像层，则设置缓存无效并构建该镜像层。设置缓存无效之后，接下来的指令将全部执行而不用再去检查缓存是否存在了。

如果上一条指令击中了，并假设生成的镜像层 ID 是 AAA。那么在执行 `COPY . /src` 指令的时候，Docker 会检查缓存中是否存在一个镜像层也是基于 AAA 镜像层并执行了 `COPY . /src` 命令的。如果缓存中存在，那么则会链接到这个缓存的镜像层并继续执行后续指令；如果没有，则构建镜像层，并对后续的构建操作设置缓存无效。需要注意的是，这个阶段中，如果 `COPY . /src` 的指令没有变化，但是被复制的内容发生了变化，那么 Docker 会计算每一个被复制文件的 Checksum 值，并与缓存镜像层中同一个文件的 Checksum 值进行比较。如果不匹配同样设置缓存无效并构建新的镜像层。

以此类推，需要注意的是一旦有指令在缓存中未击中，也就是没有该指令对应的镜像层，则后续的整个构建过程都将不再使用缓存。因此，在编写 Dokcerfile 的时候需要将易于发生变化的指令至于 Dockerfile 文件的后方执行。这样缓存未命中的情况将直到构建的后期才会出现，从而能够从缓存中获得更大的收益。

> 如果在构建过程中，有一条指令使用了 apt-get update，结果缓存也有找到该指令执行过的镜像层，那么 Docker 不会刷新 APT 包的缓存，而是直接使用该缓存。此时，假如你需要每个包的最新版本的话，那么需要略过缓存的功能。比如缓存中有基于 Ubuntu16.04 并且执行了 apt-get update && apt-get install  nginx，那么当 Dockerfile 中也是基于 Ubuntu16.04 执行 apt-get update && apt-get install  nginx 的话，那么不会刷新 APT 包的缓存。想要禁止使用缓存，可使用 --no-cache 



**构建时可以合并镜像，即构建出只含一个镜像层的镜像**

合并镜像也就是将所有的镜像层合并到一个镜像层中。这种方式在利弊参半，但是当镜像中的层数太多时，合并是一个不错的优化方式。

比如，创建一个新的基础镜像时，以便基于这个基础镜像来构建其他镜像时，这个基础镜像最好是被合并为一层。但是合并之后的镜像将无法共享镜像层，在 push 和 pull 的时候镜像体积会更大。如图所示，原本在 push 的时候，左边的那个基础镜像层已经在 Docker Hub 中了，那么只需要 push 其他三层没有的镜像层即可。但是，合并的镜像却需要全都被 push。

![](https://img.dawnguo.cn/Docker/image-20200820171642837.png)



**多阶段构建---优化构建出来的镜像**

对于 Docker 镜像来说，过大的体积并不好。越大的体积意味着更难使用而且也容器遭受攻击，因此 Docker 镜像应该尽量小，将镜像缩小到仅包含应用所必须的内容即可。比如 `RUN` 指令被执行时，可能会拉取一些构建工具，这些工具其实也可以删除。这时候 Dockerfile 的写法对镜像的大小会产生显著影响，下面介绍一下多阶段构建的方式来优化产生的镜像大小。

多阶段构建的方式即使用一个 Dockerfile 文件，但其中包含多个 `FROM` 指令。每一个 `FROM` 指令都是一个新的构建阶段，并且可以后面的构建阶段可以复制之前构建阶段产生的内容。

![](https://img.dawnguo.cn/Docker/image-20200820142751533.png)

比如，一个 Dockerfile 文件的内容如上所示。上面的内容显示了 3 个 `FROM` 指令，每个 `FROM` 指令构成一个单独的构建阶段，各个阶段在内部从 0 开始编号。不过，示例中针对每个阶段都定义了一个名字。

- 阶段  0 叫做 storefront
- 阶段 1 叫做 appserver
- 阶段 2 叫做 production

阶段 0 即 storefront 阶段将会拉取大小超过 600MB 的 node:latest 镜像，然后设置工作目录，复制一些应用代码进去，然后使用 2 个 RUN 指令来执行 npm 操作，这会显著增加镜像大小，而其中包含了许多构建工具。

阶段 1 即 appserver 阶段将会拉取大小超过 700MB 的 maven:latest 镜像。然后设置工作目录等操作，这个阶段同样会构建出一个非常大的包含许多构建工具的镜像。

阶段 3 即 production 阶段拉取 java:8-jdk-alpine 镜像，这个镜像大约 150MB。这个阶段会先创建一个用户，然后设置工作目录并将 storefront 阶段生成的镜像中的一些应用代码复制过来；之后再设置工作目录，将 appserver 阶段生成的镜像中的一些应用代码复制过来。最后设置当前应用程序为容器启动时的主程序。这个阶段的重点在于 `COPY --from` 指令，这个执行将从之前阶段构建的镜像中仅仅复制生产环境相关的应用代码，或者说仅需的应用代码，而不会产生生产环境不需要的构建工具。

之后使用同样的命令（如`docker image build -t multi:stage`）构建镜像即可。当查看构建出来的镜像时，你会看到其他两个 `FROM` 阶段，即 storefront 阶段和 appserver 阶段构建出来的镜像，但是这些镜像是没有 REPO 和 TAG 的。

![](https://img.dawnguo.cn/Docker/image-20200820164503122.png)



### 5.3. 相关命令

**docker image build 构建镜像**

```bash
# 构建出一个叫 web:latest 的镜像（-t 参数是为镜像打标签），. 表示将当前目录作为构建上下文并且当前目录需要包含 Dockerfile（当然也可以通过 -f 参数可以指定位于任意路径下的任意名称的 Dockfile）
docker image build -t web:latest . 

# 强制忽略对缓存的使用。为什么需要这个功能呢？因为如果构建中有用到 apt-get update 的话，那么碰到了由带有 apt-get update 构建出来的缓存内容之后，Docker 将不会刷新 APT 包的缓存，但是此时你又需要每个包的最新版本。
docker image build --no-cache -t web:latest

docker image build -t web:latest --squash			# 创建一个合并的镜像

# 可以指定一个 git 仓库的源地址来指定 Dockerfile 的位置
docker image build -t web:latest git@github.com:test/test
```

**docker commit 构建镜像**

更加推荐 Dockerfile 的方式构建镜像，但是也加一下。`docker commit` 相当于往控制系统里提交变更。我们先创建一个容器，并在容器里做修改，最后再将修改提交为一个新镜像，其实就相当于把这次的修改提交为一个镜像层，然后增加在原来的镜像之上。

```bash
# 提交一个新的镜像层，增加在原来的镜像之上
docker commit <ContainerID>  <NewRepository>:<Tag>

# 提交时可以指定更多的数据
docker commit -m="A new custom image" --author="DawnGuo"  <ContainerID>  <NewRepository>:<Tag>
```

**推送镜像相关**

在构建一个镜像之后，可将其保存在一个镜像仓库服务中。Docker Hub 是一个开放的公共镜像镜像仓库服务，也是 `docker image push` 命令默认的推送地址。但是，你还可以选择其他 Docker 镜像仓库服务。

```bash
# 在推送之前，先使用 Docker ID 登录 Docker Hub。个人认证信息会保存到 $HOME/.docker/config.json
docker login

# 在推送之前，可能需要为镜像打上标签
docker imgae tag <CurrentRepositry>:<CurrentTag> <NewRepositry>:<NewTag>

# 下面这个例子会将镜像推送到 <Registry>/<Repositry> 这个仓库中
# 在推送过程中需要指定 Registry（镜像仓库服务）、Repository（镜像仓库）和 Tag（镜像标签）等信息
# 但是不指定 Registry 和 Tag 也可以，Docker 会默认 Registry 为 docker.io，Tag 为 latest，但是 Repository 没有默认值，而是从被推送的镜像的 Repositry 属性值获取（比如 web:latest 中的 web 值就作为 Repositry）
docker image push <Registry>/<Repositry>:<Tag>


# 下面展示如何向 Docker Hub 中推荐，在创建了自己的 Docker ID 并登录的前提下。
# 1. 首先是给镜像打上标签，因为假如直接将 web:latest 进行推送的话，其实是直接推送到 docker.io/web:latest 中，但是对于 docker.io/web 这个仓库我们是没有访问权限的，我们顶多是推送到 docker.io/<YourDockerID>/web 中，所以我们需要将其重新打标签，相当于将仓库重命名。
# 2. 之后推送打上新标签的仓库，那么将会将这个镜像 push 到 docker.io/<YourDockerID>/web 这个仓库中了
docker image tag web:latest <YourDockerID>/web:latest

docker image push <YourDockerID>/web:latest
```

**其他**

```bash
# 查看构建镜像的过程中都执行了哪些指令，每行显示一个指令，那些 SIZE 列对应的数值不为零的指令表示会新建镜像层
docekr image history <REPOSITORY>:<TAG>
docker history
docker inspect 
```



## 6. 巨人的肩膀

[1.Dockerfile RUN、CMD、ENTRYPOINT区别](https://aimuke.github.io/docker/2019/12/05/docker-cmd-entrypoint/)

2.《第一本 Docker 书》

3.《深入浅出 Docker》

