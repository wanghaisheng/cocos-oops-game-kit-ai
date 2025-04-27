# API参考文档

## 概述

本文档提供了基于Cocos Creator和OOPS Framework开发的游戏项目中核心API的详细说明和使用方法。这些API按功能模块进行分类，方便开发者查阅和使用。

## 核心API

### oops 全局对象

`oops`是框架的全局对象，提供了对各个模块的访问入口。

```typescript
// 游戏实例
oops.game

// 资源管理
oops.res

// GUI管理
oops.gui

// 音频管理
oops.audio

// 网络管理
oops.network

// 本地化管理
oops.language

// 定时器管理
oops.timer
```

## 游戏管理API

### oops.game

游戏管理模块，负责游戏的初始化、运行和管理。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `startup` | 启动游戏 | `config: GameConfig` | `void` |
| `exit` | 退出游戏 | 无 | `void` |
| `pause` | 暂停游戏 | 无 | `void` |
| `resume` | 恢复游戏 | 无 | `void` |
| `restart` | 重启游戏 | 无 | `void` |

#### 属性

| 属性名 | 类型 | 描述 |
| --- | --- | --- |
| `account` | `Entity` | 账号实体 |
| `initialize` | `Entity` | 初始化实体 |
| `config` | `GameConfig` | 游戏配置 |
| `isPaused` | `boolean` | 游戏是否暂停 |

#### 示例

```typescript
// 启动游戏
oops.game.startup({
    gameId: "my-game",
    version: "1.0.0",
    debug: true
});

// 获取账号数据
let accountComp = oops.game.account.getComp(AccountModelComp);
```

## 资源管理API

### oops.res

资源管理模块，负责游戏资源的加载、缓存和释放。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `load` | 加载单个资源 | `bundleName: string, path: string, type: Constructor<T>, callback: ResCallback<T>` | `void` |
| `loadDir` | 加载目录资源 | `bundleName: string, path: string, type: Constructor<T>, callback: ResArrayCallback<T>` | `void` |
| `loadBundle` | 加载资源包 | `bundleName: string, callback: BundleCallback` | `void` |
| `release` | 释放单个资源 | `bundleName: string, path: string` | `void` |
| `releaseDir` | 释放目录资源 | `bundleName: string, path: string` | `void` |
| `releaseBundle` | 释放资源包 | `bundleName: string` | `void` |

#### 示例

```typescript
// 加载预制体
oops.res.load("bundle", "prefabs/enemy", Prefab, (err, prefab) => {
    if (!err) {
        let node = instantiate(prefab);
        this.node.addChild(node);
    }
});

// 加载目录下的所有精灵帧
oops.res.loadDir("bundle", "textures/items", SpriteFrame, (err, assets) => {
    if (!err) {
        // 使用加载的精灵帧
    }
});
```

## UI管理API

### oops.gui

UI管理模块，负责游戏界面的显示和交互。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `open` | 打开界面 | `uiId: number, options?: any` | `void` |
| `close` | 关闭界面 | `uiId: number` | `void` |
| `closeAll` | 关闭所有界面 | 无 | `void` |
| `get` | 获取界面实例 | `uiId: number` | `UIView` |
| `preload` | 预加载界面 | `uiId: number, callback?: Function` | `void` |
| `has` | 检查界面是否打开 | `uiId: number` | `boolean` |

#### 示例

```typescript
// 打开主菜单
oops.gui.open(UIID.MainMenu);

// 打开商店并传递参数
oops.gui.open(UIID.Shop, { tabIndex: 2 });

// 关闭主菜单
oops.gui.close(UIID.MainMenu);
```

## 音频管理API

### oops.audio

音频管理模块，负责游戏音效和背景音乐的播放和控制。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `playMusic` | 播放背景音乐 | `path: string, loop?: boolean` | `void` |
| `stopMusic` | 停止背景音乐 | 无 | `void` |
| `pauseMusic` | 暂停背景音乐 | 无 | `void` |
| `resumeMusic` | 恢复背景音乐 | 无 | `void` |
| `playEffect` | 播放音效 | `path: string, loop?: boolean` | `number` |
| `stopEffect` | 停止音效 | `audioId: number` | `void` |
| `setMusicVolume` | 设置音乐音量 | `volume: number` | `void` |
| `setEffectVolume` | 设置音效音量 | `volume: number` | `void` |

#### 示例

```typescript
// 播放背景音乐
oops.audio.playMusic("audio/bgm_main");

// 播放音效
let audioId = oops.audio.playEffect("audio/click");

// 停止音效
oops.audio.stopEffect(audioId);
```

## 网络管理API

### oops.network

网络管理模块，负责客户端与服务器之间的数据交换。

#### HTTP方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `get` | 发送GET请求 | `url: string, callback: HttpCallback` | `void` |
| `post` | 发送POST请求 | `url: string, data: any, callback: HttpCallback` | `void` |
| `put` | 发送PUT请求 | `url: string, data: any, callback: HttpCallback` | `void` |
| `delete` | 发送DELETE请求 | `url: string, callback: HttpCallback` | `void` |

#### WebSocket方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `connect` | 连接WebSocket服务器 | `url: string, protocols?: string[]` | `void` |
| `disconnect` | 断开WebSocket连接 | 无 | `void` |
| `send` | 发送WebSocket消息 | `event: string, data: any` | `void` |
| `on` | 监听WebSocket消息 | `event: string, callback: Function, target?: any` | `void` |
| `off` | 移除WebSocket消息监听 | `event: string, callback: Function, target?: any` | `void` |

#### 示例

```typescript
// 发送HTTP GET请求
oops.network.get("https://api.example.com/users", (err, data) => {
    if (!err) {
        console.log("用户数据:", data);
    }
});

// 连接WebSocket服务器
oops.network.connect("wss://game.example.com/ws");

// 发送WebSocket消息
oops.network.send("chat", { message: "Hello" });
```

## 本地化API

### oops.language

本地化模块，负责游戏多语言支持和文本翻译。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `setLanguage` | 设置当前语言 | `lang: string` | `void` |
| `getLanguage` | 获取当前语言 | 无 | `string` |
| `getText` | 获取翻译文本 | `key: string, params?: any` | `string` |
| `hasText` | 检查是否存在翻译 | `key: string` | `boolean` |

#### 示例

```typescript
// 切换到英文
oops.language.setLanguage("en");

// 获取翻译文本
let welcomeText = oops.language.getText("welcome");

// 带参数的翻译文本
let levelUpText = oops.language.getText("level_up", { level: 5 });
```

## 定时器API

### oops.timer

定时器模块，提供了游戏中定时执行和延迟执行的功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `once` | 延迟执行一次 | `delay: number, callback: Function, target?: any` | `number` |
| `loop` | 定时重复执行 | `interval: number, callback: Function, target?: any, count?: number` | `number` |
| `clear` | 清除定时器 | `id: number` | `void` |
| `clearAll` | 清除所有定时器 | 无 | `void` |
| `pause` | 暂停定时器 | `id: number` | `void` |
| `resume` | 恢复定时器 | `id: number` | `void` |

#### 示例

```typescript
// 延迟2秒执行
let timerId1 = oops.timer.once(2, () => {
    console.log("2秒后执行一次");
});

// 每1秒执行一次，共执行5次
let timerId2 = oops.timer.loop(1, () => {
    console.log("每秒执行一次");
}, this, 5);

// 取消定时器
oops.timer.clear(timerId1);
```

## 事件API

### EventManager

事件管理器，用于游戏中不同模块间的通信。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `on` | 监听事件 | `event: string, callback: Function, target?: any` | `void` |
| `once` | 监听一次事件 | `event: string, callback: Function, target?: any` | `void` |
| `off` | 移除事件监听 | `event: string, callback: Function, target?: any` | `void` |
| `targetOff` | 移除目标所有事件监听 | `target: any` | `void` |
| `emit` | 触发事件 | `event: string, ...args: any[]` | `void` |

#### 示例

```typescript
// 获取事件管理器实例
let eventManager = EventManager.instance;

// 监听事件
eventManager.on("game_start", this.onGameStart, this);

// 触发事件
eventManager.emit("game_start", { level: 1 });

// 移除事件监听
eventManager.off("game_start", this.onGameStart, this);
```

## 存储API

### StorageManager

存储管理器，负责游戏数据的本地存储和读取。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `set` | 存储数据 | `key: string, value: any` | `void` |
| `get` | 读取数据 | `key: string, defaultValue?: any` | `any` |
| `remove` | 删除数据 | `key: string` | `void` |
| `clear` | 清空所有数据 | 无 | `void` |
| `has` | 检查是否存在数据 | `key: string` | `boolean` |

#### 示例

```typescript
// 获取存储管理器实例
let storageManager = StorageManager.instance;

// 存储数据
storageManager.set("settings.sound", true);

// 读取数据
let soundEnabled = storageManager.get("settings.sound", true);

// 删除数据
storageManager.remove("settings.sound");
```

## 日志API

### Logger

日志工具，提供了游戏中日志记录和输出的功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `log` | 输出普通日志 | `...args: any[]` | `void` |
| `info` | 输出信息日志 | `...args: any[]` | `void` |
| `warn` | 输出警告日志 | `...args: any[]` | `void` |
| `error` | 输出错误日志 | `...args: any[]` | `void` |
| `setLevel` | 设置日志级别 | `level: LogLevel` | `void` |

#### 示例

```typescript
// 输出普通日志
Logger.log("游戏初始化完成");

// 输出警告日志
Logger.warn("资源加载超时");

// 输出错误日志
Logger.error("网络连接失败");

// 设置日志级别
Logger.setLevel(LogLevel.INFO);
```

## 工具API

### RandomUtil

随机数工具，提供了生成随机数和随机选择的功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `randomInt` | 生成随机整数 | `min: number, max: number` | `number` |
| `randomFloat` | 生成随机浮点数 | `min: number, max: number` | `number` |
| `randomElement` | 随机选择元素 | `array: T[]` | `T` |
| `shuffle` | 打乱数组 | `array: T[]` | `T[]` |
| `randomBool` | 生成随机布尔值 | `probability?: number` | `boolean` |

#### 示例

```typescript
// 生成1到10之间的随机整数
let randomInt = RandomUtil.randomInt(1, 10);

// 随机从数组中选择一个元素
let items = ["剑", "盾", "药水", "金币"];
let randomItem = RandomUtil.randomElement(items);

// 打乱数组
RandomUtil.shuffle(items);
```

### MathUtil

数学工具，提供了常用的数学计算功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `clamp` | 限制数值在指定范围内 | `value: number, min: number, max: number` | `number` |
| `lerp` | 线性插值 | `start: number, end: number, t: number` | `number` |
| `distance` | 计算两点之间的距离 | `x1: number, y1: number, x2: number, y2: number` | `number` |
| `angle` | 计算两点之间的角度 | `x1: number, y1: number, x2: number, y2: number` | `number` |

#### 示例

```typescript
// 限制数值在0到100之间
let clampedValue = MathUtil.clamp(value, 0, 100);

// 线性插值
let lerpValue = MathUtil.lerp(0, 100, 0.5); // 返回50

// 计算两点之间的距离
let distance = MathUtil.distance(0, 0, 3, 4); // 返回5
```

### StringUtil

字符串工具，提供了字符串处理和格式化的功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `format` | 格式化字符串 | `format: string, ...args: any[]` | `string` |
| `uuid` | 生成UUID | 无 | `string` |
| `isNullOrEmpty` | 检查字符串是否为空 | `str: string` | `boolean` |
| `padLeft` | 左侧填充字符 | `str: string, length: number, padChar: string` | `string` |
| `padRight` | 右侧填充字符 | `str: string, length: number, padChar: string` | `string` |

#### 示例

```typescript
// 格式化字符串
let formattedStr = StringUtil.format("你好，{0}！你有{1}个未读消息。", "玩家", 5);

// 生成UUID
let uuid = StringUtil.uuid();

// 左侧填充字符
let paddedStr = StringUtil.padLeft("123", 5, "0"); // 返回"00123"
```

## 调试API

### DebugConsole

调试控制台，提供了游戏调试和命令执行的功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `show` | 显示调试控制台 | 无 | `void` |
| `hide` | 隐藏调试控制台 | 无 | `void` |
| `toggle` | 切换调试控制台显示状态 | 无 | `void` |
| `addCommand` | 添加调试命令 | `name: string, callback: Function, description?: string` | `void` |
| `removeCommand` | 移除调试命令 | `name: string` | `void` |
| `executeCommand` | 执行调试命令 | `command: string` | `string` |

#### 示例

```typescript
// 获取调试控制台实例
let debugConsole = DebugConsole.instance;

// 显示调试控制台
debugConsole.show();

// 添加调试命令
debugConsole.addCommand("addCoin", (params) => {
    let amount = parseInt(params[0]) || 100;
    // 添加金币
    let accountComp = oops.game.account.getComp(AccountModelComp);
    accountComp.coin += amount;
    return `添加了${amount}金币`;
}, "添加金币，用法：addCoin [数量]");

// 执行调试命令
let result = debugConsole.executeCommand("addCoin 500");
```

### PerformanceMonitor

性能监控工具，提供了游戏性能监控和分析的功能。

#### 方法

| 方法名 | 描述 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `start` | 开始性能监控 | 无 | `void` |
| `stop` | 停止性能监控 | 无 | `void` |
| `getFPS` | 获取当前FPS | 无 | `number` |
| `getMemoryUsage` | 获取内存使用情况 | 无 | `MemoryInfo` |
| `getDrawCalls` | 获取DrawCall数量 | 无 | `number` |

#### 示例

```typescript
// 获取性能监控实例
let performanceMonitor = PerformanceMonitor.instance;

// 开始性能监控
performanceMonitor.start();

// 获取当前FPS
let fps = performanceMonitor.getFPS();
console.log(`当前FPS: ${fps}`);

// 停止性能监控
performanceMonitor.stop();
```

## 常量定义

### UIID

UI界面ID常量，用于标识不同的UI界面。

```typescript
export enum UIID {
    Loading = 1,       // 加载界面
    MainMenu = 2,      // 主菜单
    Settings = 3,      // 设置界面
    Shop = 4,          // 商店界面
    Battle = 5,        // 战斗界面
    Result = 6,        // 结算界面
    // 更多界面...
}
```

### EventName

事件名称常量，用于标识不同的事件。

```typescript
export enum EventName {
    // 账号相关事件
    ACCOUNT_LOGIN = "account_login",
    ACCOUNT_LOGOUT = "account_logout",
    ACCOUNT_DATA_CHANGE = "account_data_change",
    
    // 游戏相关事件
    GAME_START = "game_start",
    GAME_PAUSE = "game_pause",
    GAME_RESUME = "game_resume",
    GAME_OVER = "game_over",
    
    // 更多事件...
}
```

### LogLevel

日志级别常量，用于控制日志输出级别。

```typescript
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}
```

### UILayer

UI层级常量，用于控制UI界面的显示层级。

```typescript
export enum UILayer {
    SCENE = 1,      // 场景层
    UI_2D = 2,       // 2D界面层
    UI_3D = 3,       // 3D界面层
    POPUP = 4,       // 弹窗层
    TIPS = 5,        // 提示层
    LOADING = 6      // 加载层
}
```

## 错误码定义

### ErrorCode

错误码常量，用于标识不同的错误类型。

```typescript
export enum ErrorCode {
    // 通用错误
    UNKNOWN = 10000,           // 未知错误
    NETWORK_ERROR = 10001,     // 网络错误
    SERVER_ERROR = 10002,      // 服务器错误
    TIMEOUT = 10003,           // 超时错误
    
    // 资源错误
    RESOURCE_NOT_FOUND = 20001,    // 资源未找到
    RESOURCE_LOAD_FAILED = 20002,  // 资源加载失败
    
    // 账号错误
    ACCOUNT_NOT_LOGIN = 30001,     // 账号未登录
    ACCOUNT_LOGIN_FAILED = 30002,  // 账号登录失败
    
    // 更多错误码...
}
```

## 配置定义

### GameConfig

游戏配置接口，用于定义游戏的基本配置。

```typescript
export interface GameConfig {
    /** 游戏ID */
    gameId: string;
    /** 游戏版本 */
    version: string;
    /** 是否开启调试模式 */
    debug?: boolean;
    /** 默认语言 */
    defaultLanguage?: string;
    /** 资源服务器地址 */
    resourceServer?: string;
    /** 游戏服务器地址 */
    gameServer?: string;
    /** 日志级别 */
    logLevel?: LogLevel;
}
```

### UIConfig

UI配置接口，用于定义UI界面的配置。

```typescript
export interface UIConfig {
    /** 预制体路径 */
    prefab: string;
    /** UI层级 */
    layer: UILayer;
    /** 视图模型类 */
    model?: Constructor<UIViewModel>;
    /** 是否常驻 */
    persistent?: boolean;
    /** 是否单例 */
    singleton?: boolean;
    /** 是否预加载 */
    preload?: boolean;
}
```