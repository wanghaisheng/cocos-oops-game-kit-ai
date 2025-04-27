# 模块使用说明

## 概述

本文档提供了基于Cocos Creator和OOPS Framework开发的游戏项目中各核心模块的使用说明和示例代码，帮助开发者快速上手和使用这些模块。

## 账号模块

账号模块负责管理用户账号信息和状态。

### 基本使用

```typescript
// 获取账号数据
let accountComp = oops.game.account.getComp(AccountModelComp);

// 读取账号信息
console.log(`用户ID: ${accountComp.uid}`);
console.log(`用户名: ${accountComp.username}`);
console.log(`等级: ${accountComp.level}`);

// 修改账号信息
accountComp.coin += 100;
accountComp.exp += 50;

// 保存账号信息
oops.game.account.save();
```

### 账号事件监听

```typescript
// 监听账号登录事件
EventManager.instance.on(EventName.ACCOUNT_LOGIN, this.onAccountLogin, this);

// 监听账号数据变化事件
EventManager.instance.on(EventName.ACCOUNT_DATA_CHANGE, this.onAccountDataChange, this);
```

## UI模块

UI模块负责管理游戏界面的显示和交互。

### 打开和关闭界面

```typescript
// 打开界面
UIManager.instance.open(UIID.MainMenu);

// 打开界面并传递参数
UIManager.instance.open(UIID.ShopView, { tabIndex: 2 });

// 关闭界面
UIManager.instance.close(UIID.MainMenu);

// 关闭所有界面
UIManager.instance.closeAll();
```

### 预加载界面

```typescript
// 预加载界面
UIManager.instance.preload(UIID.BattleView, () => {
    console.log("战斗界面预加载完成");
});
```

### 获取界面实例

```typescript
// 获取当前打开的界面实例
let mainMenu = UIManager.instance.get(UIID.MainMenu);
if (mainMenu) {
    // 调用界面方法
    let viewModel = mainMenu.getViewModel() as MainMenuViewModel;
    viewModel.refreshData();
}
```

## 资源管理模块

资源管理模块负责游戏资源的加载、缓存和释放。

### 加载资源

```typescript
// 加载单个资源
ResManager.instance.load("prefabs/enemy", Prefab, (err, prefab) => {
    if (!err) {
        // 使用加载的预制体
        let node = instantiate(prefab);
        this.node.addChild(node);
    }
});

// 批量加载资源
ResManager.instance.loadDir("textures/items", SpriteFrame, (err, assets) => {
    if (!err) {
        // 使用加载的精灵帧
        for (let sf of assets) {
            console.log(`加载精灵帧: ${sf.name}`);
        }
    }
});
```

### 资源释放

```typescript
// 释放单个资源
ResManager.instance.release("prefabs/enemy");

// 释放目录下的资源
ResManager.instance.releaseDir("textures/items");

// 释放所有资源
ResManager.instance.releaseAll();
```

## 网络通信模块

网络通信模块负责客户端与服务器之间的数据交换。

### HTTP请求

```typescript
// 发送GET请求
HttpManager.instance.get("https://api.example.com/users", (err, data) => {
    if (!err) {
        console.log("获取用户数据:", data);
    }
});

// 发送POST请求
HttpManager.instance.post("https://api.example.com/login", {
    username: "player1",
    password: "123456"
}, (err, data) => {
    if (!err) {
        console.log("登录结果:", data);
    }
});
```

### WebSocket通信

```typescript
// 连接WebSocket服务器
SocketManager.instance.connect("wss://game.example.com/ws");

// 发送消息
SocketManager.instance.send("chat", {
    message: "Hello, world!",
    roomId: "room1"
});

// 监听消息
SocketManager.instance.on("chat", (data) => {
    console.log(`收到聊天消息: ${data.message}`);
});

// 断开连接
SocketManager.instance.disconnect();
```

## 音频模块

音频模块负责游戏音效和背景音乐的播放和控制。

### 播放音效

```typescript
// 播放音效
AudioManager.instance.playEffect("audio/click");

// 播放音效并控制音量
AudioManager.instance.playEffect("audio/explosion", 0.8);
```

### 播放背景音乐

```typescript
// 播放背景音乐
AudioManager.instance.playMusic("audio/bgm_main");

// 停止背景音乐
AudioManager.instance.stopMusic();

// 暂停背景音乐
AudioManager.instance.pauseMusic();

// 恢复背景音乐
AudioManager.instance.resumeMusic();
```

### 音量控制

```typescript
// 设置音效音量
AudioManager.instance.setEffectVolume(0.5);

// 设置音乐音量
AudioManager.instance.setMusicVolume(0.8);

// 静音所有音频
AudioManager.instance.setMute(true);
```

## 本地化模块

本地化模块负责游戏多语言支持和文本翻译。

### 切换语言

```typescript
// 切换到英文
LanguageManager.instance.setLanguage("en");

// 切换到中文
LanguageManager.instance.setLanguage("zh");
```

### 获取翻译文本

```typescript
// 获取翻译文本
let welcomeText = LanguageManager.instance.getText("welcome");
console.log(welcomeText); // 输出当前语言的欢迎文本

// 带参数的翻译文本
let levelUpText = LanguageManager.instance.getText("level_up", { level: 5 });
console.log(levelUpText); // 输出类似"恭喜你升级到5级"的文本
```

## 数据存储模块

数据存储模块负责游戏数据的本地存储和读取。

### 存储数据

```typescript
// 存储简单数据
StorageManager.instance.set("settings.sound", true);
StorageManager.instance.set("settings.music", 0.8);

// 存储复杂数据
StorageManager.instance.set("player.inventory", {
    items: [
        { id: 1, count: 5 },
        { id: 2, count: 10 }
    ],
    capacity: 20
});
```

### 读取数据

```typescript
// 读取简单数据
let soundEnabled = StorageManager.instance.get("settings.sound", true); // 默认值为true
let musicVolume = StorageManager.instance.get("settings.music", 1.0); // 默认值为1.0

// 读取复杂数据
let inventory = StorageManager.instance.get("player.inventory", { items: [], capacity: 10 });
console.log(`物品数量: ${inventory.items.length}`);
console.log(`背包容量: ${inventory.capacity}`);
```

### 删除数据

```typescript
// 删除单个数据
StorageManager.instance.remove("settings.sound");

// 清空所有数据
StorageManager.instance.clear();
```

## 定时器模块

定时器模块提供了游戏中定时执行和延迟执行的功能。

### 延迟执行

```typescript
// 延迟2秒执行
TimerManager.instance.once(2, () => {
    console.log("2秒后执行一次");
});
```

### 定时重复执行

```typescript
// 每1秒执行一次，共执行5次
let timerId = TimerManager.instance.loop(1, () => {
    console.log("每秒执行一次");
}, 5);

// 取消定时器
TimerManager.instance.clear(timerId);
```

## 事件系统

事件系统用于游戏中不同模块间的通信。

### 事件监听和触发

```typescript
// 监听事件
EventManager.instance.on("game_start", this.onGameStart, this);

// 触发事件
EventManager.instance.emit("game_start", { level: 1, difficulty: "normal" });

// 移除事件监听
EventManager.instance.off("game_start", this.onGameStart, this);

// 移除特定对象的所有事件监听
EventManager.instance.targetOff(this);
```

### 一次性事件监听

```typescript
// 只监听一次事件
EventManager.instance.once("level_complete", (data) => {
    console.log(`关卡${data.level}完成，获得${data.stars}星`);
});
```

## 日志系统

日志系统提供了游戏中日志记录和输出的功能。

### 日志输出

```typescript
// 输出普通日志
Logger.log("游戏初始化完成");

// 输出警告日志
Logger.warn("资源加载超时");

// 输出错误日志
Logger.error("网络连接失败");

// 输出带标签的日志
Logger.log("[UI] 主界面创建成功");
```

### 日志级别控制

```typescript
// 设置日志级别
Logger.setLevel(LogLevel.INFO); // 只显示info及以上级别的日志
```

## 工具类

项目提供了一系列实用工具类，简化常见操作。

### 随机数工具

```typescript
// 生成指定范围内的随机整数
let randomInt = RandomUtil.randomInt(1, 10); // 1到10之间的随机整数

// 生成指定范围内的随机浮点数
let randomFloat = RandomUtil.randomFloat(0, 1); // 0到1之间的随机浮点数

// 随机从数组中选择一个元素
let items = ["剑", "盾", "药水", "金币"];
let randomItem = RandomUtil.randomElement(items);
```

### 数学工具

```typescript
// 限制数值在指定范围内
let clampedValue = MathUtil.clamp(value, 0, 100);

// 线性插值
let lerpValue = MathUtil.lerp(start, end, t); // t为0到1之间的值
```

### 字符串工具

```typescript
// 格式化字符串
let formattedStr = StringUtil.format("你好，{0}！你有{1}个未读消息。", "玩家", 5);

// 生成UUID
let uuid = StringUtil.uuid();
```

## 调试工具

项目提供了一系列调试工具，帮助开发者进行游戏调试。

### 性能监控

```typescript
// 开启性能监控
PerformanceMonitor.instance.start();

// 关闭性能监控
PerformanceMonitor.instance.stop();
```

### 调试控制台

```typescript
// 显示调试控制台
DebugConsole.instance.show();

// 隐藏调试控制台
DebugConsole.instance.hide();

// 添加调试命令
DebugConsole.instance.addCommand("addCoin", (params) => {
    let amount = parseInt(params[0]) || 100;
    // 添加金币
    let accountComp = oops.game.account.getComp(AccountModelComp);
    accountComp.coin += amount;
    return `添加了${amount}金币`;
});
```