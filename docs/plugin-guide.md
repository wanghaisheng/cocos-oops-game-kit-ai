# 插件使用指南

## 概述

本文档提供了OOPS Framework中各插件的详细使用说明，包括安装、配置和使用方法。这些插件扩展了Cocos Creator的功能，提高了游戏开发的效率和质量。

## Excel转JSON插件 (oops-plugin-excel-to-json)

### 简介

Excel转JSON插件用于将Excel表格数据转换为JSON格式，方便在游戏中使用。这对于游戏配置、本地化文本等数据非常有用。

### 安装

项目中已包含此插件，可以通过以下脚本更新插件：

- Windows: 运行 `update-oops-plugin-excel-to-json.bat`
- Mac/Linux: 运行 `update-oops-plugin-excel-to-json.sh`

### 配置

插件配置位于 `settings/v2/packages/oops-plugin-excel-to-json.json`，主要配置项包括：

```json
{
  "excelRoot": "excel",         // Excel文件根目录
  "outJson": "assets/resources/config",  // 输出JSON文件目录
  "outTs": "assets/script/game/common/config",  // 输出TypeScript定义文件目录
  "excelFilter": [".xlsx", ".xls"],  // Excel文件过滤器
  "jsonExtension": ".json",    // JSON文件扩展名
  "tsExtension": ".ts"        // TypeScript文件扩展名
}
```

### 使用方法

1. **创建Excel文件**

   在`excel`目录下创建Excel文件，例如`Language.xlsx`。

2. **定义数据结构**

   Excel文件的第一行为字段名，第二行为字段类型，第三行为字段描述，第四行开始为数据。

   示例：
   ```
   id    | name_zh | name_en | desc_zh | desc_en
   int   | string  | string  | string  | string
   ID    | 中文名称 | 英文名称 | 中文描述 | 英文描述
   1     | 剑      | Sword   | 锋利的剑 | A sharp sword
   2     | 盾      | Shield  | 坚固的盾 | A sturdy shield
   ```

3. **转换数据**

   在Cocos Creator中，点击菜单：`开发者 -> OOPS Framework -> Excel转Json`

4. **使用数据**

   转换后会在指定目录生成JSON文件和TypeScript定义文件，可以在代码中使用：

   ```typescript
   // 加载配置
   ResManager.instance.load("config/Language", JsonAsset, (err, asset) => {
       if (!err) {
           let config = asset.json;
           // 使用配置数据
           console.log(config[1].name_zh); // 输出: 剑
       }
   });
   ```

## 框架插件 (oops-plugin-framework)

### 简介

OOPS Framework插件是游戏开发的核心框架，提供了ECS架构、UI管理、资源管理等功能。

### 安装

项目中已包含此插件，可以通过以下脚本更新插件：

- Windows: 运行 `update-oops-plugin-framework.bat`
- Mac/Linux: 运行 `update-oops-plugin-framework.sh`

### 主要功能

1. **ECS架构**

   提供实体-组件-系统架构，使游戏逻辑更加清晰和可维护。

   ```typescript
   // 创建实体
   let entity = new Entity();
   
   // 添加组件
   entity.addComponent(PlayerModelComp);
   
   // 获取组件
   let comp = entity.getComponent(PlayerModelComp);
   ```

2. **UI管理**

   提供UI界面的创建、显示、隐藏和销毁功能。

   ```typescript
   // 注册UI
   UIManager.instance.register(UIID.MainMenu, {
       prefab: "prefabs/ui/main_menu",
       layer: UILayer.UI_2D,
       model: MainMenuViewModel
   });
   
   // 打开UI
   UIManager.instance.open(UIID.MainMenu);
   ```

3. **资源管理**

   提供资源的加载、缓存和释放功能。

   ```typescript
   // 加载资源
   ResManager.instance.load("prefabs/enemy", Prefab, (err, prefab) => {
       if (!err) {
           // 使用预制体
           let node = instantiate(prefab);
           this.node.addChild(node);
       }
   });
   ```

4. **事件系统**

   提供事件的发送和监听功能。

   ```typescript
   // 监听事件
   EventManager.instance.on("game_start", this.onGameStart, this);
   
   // 发送事件
   EventManager.instance.emit("game_start", { level: 1 });
   ```

### 配置

框架配置主要在游戏启动时进行：

```typescript
// 在Main.ts中初始化框架
oops.game.startup({
    gameId: "my-game",
    version: "1.0.0",
    debug: true,
    logLevel: LogLevel.DEBUG
});
```

## 热更新插件 (oops-plugin-hot-update)

### 简介

热更新插件用于实现游戏的热更新功能，允许在不重新安装游戏的情况下更新游戏内容。

### 安装

项目中已包含此插件，可以通过以下脚本更新插件：

- Windows: 运行 `update-oops-plugin-hot-update.bat`
- Mac/Linux: 运行 `update-oops-plugin-hot-update.sh`

### 配置

热更新配置主要包括：

1. **版本文件配置**

   在`resources/config.json`中配置热更新相关参数：

   ```json
   {
     "hot_update": {
       "version": "1.0.0",
       "remote_manifest_url": "http://example.com/remote-assets/project_manifest.json",
       "remote_version_url": "http://example.com/remote-assets/version.manifest"
     }
   }
   ```

2. **资源包配置**

   在`settings/v2/packages/builder.json`中配置资源包：

   ```json
   {
     "bundle": {
       "native": {
         "preferredOptions": {
           "compressionType": "merge_dep",
           "isRemote": false
         }
       },
       "web": {
         "preferredOptions": {
           "compressionType": "merge_dep",
           "isRemote": false
         }
       }
     }
   }
   ```

### 使用方法

1. **初始化热更新**

   ```typescript
   // 在游戏启动时初始化热更新
   HotUpdateManager.instance.init({
       manifestUrl: config.hot_update.remote_manifest_url,
       versionUrl: config.hot_update.remote_version_url,
       callback: this.onHotUpdateCallback.bind(this)
   });
   ```

2. **检查更新**

   ```typescript
   // 检查是否有更新
   HotUpdateManager.instance.checkUpdate();
   ```

3. **开始更新**

   ```typescript
   // 开始更新
   HotUpdateManager.instance.startUpdate();
   ```

4. **更新回调**

   ```typescript
   // 热更新回调
   private onHotUpdateCallback(event: HotUpdateEvent, param: any) {
       switch (event) {
           case HotUpdateEvent.CHECK_FINISHED:
               // 检查完成，param为是否有更新
               if (param) {
                   console.log("有新版本可用");
                   // 显示更新提示
               } else {
                   console.log("已是最新版本");
                   // 进入游戏
               }
               break;
               
           case HotUpdateEvent.UPDATE_PROGRESS:
               // 更新进度，param为进度值(0-1)
               console.log(`更新进度: ${Math.floor(param * 100)}%`);
               // 更新进度条
               break;
               
           case HotUpdateEvent.UPDATE_FINISHED:
               // 更新完成
               console.log("更新完成");
               // 重启游戏应用更新
               break;
               
           case HotUpdateEvent.UPDATE_FAILED:
               // 更新失败，param为错误信息
               console.error(`更新失败: ${param}`);
               // 显示错误提示
               break;
       }
   }
   ```

5. **生成热更新资源**

   在Cocos Creator中，点击菜单：`开发者 -> OOPS Framework -> 生成热更新资源`

   这将生成以下文件：
   - `version.manifest`: 版本信息文件
   - `project.manifest`: 项目资源清单文件
   - 资源文件

   将这些文件上传到服务器的指定目录。

## 最佳实践

### Excel转JSON插件

1. **命名规范**: Excel文件名应使用PascalCase命名法，如`ItemConfig.xlsx`
2. **字段类型**: 支持的字段类型包括int、float、string、boolean、array等
3. **多语言**: 对于多语言字段，建议使用后缀区分，如name_zh、name_en
4. **注释**: 使用第三行添加字段描述，提高代码可读性

### 框架插件

1. **组件设计**: 保持组件的单一职责，避免组件过于复杂
2. **资源管理**: 及时释放不需要的资源，避免内存泄漏
3. **事件通信**: 使用事件系统进行模块间通信，避免直接引用
4. **错误处理**: 完善错误处理机制，提高游戏稳定性

### 热更新插件

1. **资源分包**: 将不常变更的资源和常变更的资源分开打包
2. **增量更新**: 只更新变更的资源，减少更新流量
3. **更新策略**: 根据游戏类型选择合适的更新策略，如强制更新或可选更新
4. **版本控制**: 严格管理版本号，确保更新的连续性

## 常见问题

### Excel转JSON插件

1. **问题**: 转换后的JSON文件为空
   **解决**: 检查Excel文件格式是否正确，第一行必须是字段名，第二行必须是字段类型

2. **问题**: 转换时报错"类型不支持"
   **解决**: 检查字段类型是否为支持的类型，如int、float、string、boolean、array等

### 框架插件

1. **问题**: UI界面无法显示
   **解决**: 检查UI注册是否正确，预制体路径是否存在，层级是否正确

2. **问题**: 组件获取失败
   **解决**: 检查组件是否已添加到实体，组件类型是否正确

### 热更新插件

1. **问题**: 检查更新时报错
   **解决**: 检查网络连接，服务器地址是否正确，manifest文件是否存在

2. **问题**: 更新完成后游戏异常
   **解决**: 检查更新资源的完整性，确保所有依赖资源都已更新

## 插件更新

为了保持插件的最新功能和修复，建议定期更新插件：

1. **Excel转JSON插件**:
   - Windows: 运行 `update-oops-plugin-excel-to-json.bat`
   - Mac/Linux: 运行 `update-oops-plugin-excel-to-json.sh`

2. **框架插件**:
   - Windows: 运行 `update-oops-plugin-framework.bat`
   - Mac/Linux: 运行 `update-oops-plugin-framework.sh`

3. **热更新插件**:
   - Windows: 运行 `update-oops-plugin-hot-update.bat`
   - Mac/Linux: 运行 `update-oops-plugin-hot-update.sh`

更新后，重启Cocos Creator以应用更新。