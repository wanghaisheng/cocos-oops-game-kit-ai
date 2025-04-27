# 架构总览

## 项目简介

本项目是基于Cocos Creator和OOPS Framework开发的游戏项目。OOPS Framework提供了一套完整的游戏开发框架，包括ECS架构、UI管理、资源管理、网络通信等功能。

## 核心架构

项目采用ECS（实体-组件-系统）架构模式，主要包含以下部分：

1. **实体(Entity)**: 如Account、Initialize等，代表游戏中的对象
2. **组件(Component)**: 如AccountModelComp等，包含实体的数据和状态
3. **系统(System)**: 处理游戏逻辑，操作组件数据

## 项目结构

```typescript
assets/
├── script/            // 游戏脚本
│   ├── Main.ts        // 游戏入口
│   └── game/          // 游戏逻辑
│       ├── account/   // 账号模块
│       ├── common/    // 公共模块
│       └── initialize/ // 初始化模块
├── resources/         // 游戏资源
│   └── config.json    // 配置文件
└── bundle/            // 资源包
```

## 插件系统

项目使用多个OOPS插件来扩展功能，这些插件位于`extensions`目录下：

### 框架插件 (oops-plugin-framework)

框架插件是项目的核心，提供了ECS架构、UI管理、资源管理等基础功能。

- **安装方式**: 执行`update-oops-plugin-framework.bat`(Windows)或`update-oops-plugin-framework.sh`(Mac/Linux)
- **主要功能**: 
  - ECS架构实现
  - UI管理系统
  - 资源加载与管理
  - 事件系统

### 热更新插件 (oops-plugin-hot-update)

热更新插件用于实现游戏内容的动态更新，无需重新安装游戏应用。

- **安装方式**: 执行`update-oops-plugin-hot-update.bat`(Windows)或`update-oops-plugin-hot-update.sh`(Mac/Linux)
- **主要功能**:
  - 版本检查与比对
  - 资源增量下载
  - 热更新流程管理
  - 更新进度通知

- **配置方式**: 在`resources/config.json`中配置热更新参数：
  ```json
  {
    "hot_update": {
      "version": "1.0.0",
      "remote_manifest_url": "http://example.com/remote-assets/project_manifest.json",
      "remote_version_url": "http://example.com/remote-assets/version.manifest"
    }
  }
  ```

- **使用流程**:
  1. 初始化热更新模块
  2. 检查版本并下载更新
  3. 应用更新并重启游戏
  4. 通过回调处理更新进度和结果

### Excel转JSON插件 (oops-plugin-excel-to-json)

用于将Excel表格数据转换为JSON格式，方便在游戏中使用配置数据。

- **安装方式**: 执行`update-oops-plugin-excel-to-json.bat`(Windows)或`update-oops-plugin-excel-to-json.sh`(Mac/Linux)
- **主要功能**:
  - Excel数据转换为JSON
  - 自动生成TypeScript类型定义
  - 支持多种数据类型和格式