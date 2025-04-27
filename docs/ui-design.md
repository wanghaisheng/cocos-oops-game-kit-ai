# UI设计文档

## 概述

本文档描述了基于Cocos Creator和OOPS Framework的游戏项目中UI系统的设计原则、架构和实现方式。

## UI架构

项目采用MVVM（Model-View-ViewModel）设计模式，结合OOPS Framework的UI管理系统，实现了高效、可维护的UI架构。

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Model    │◄───┤  ViewModel  │◄───┤    View     │
│  (数据层)    │    │  (逻辑层)   │    │  (视图层)   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## UI管理系统

### 界面管理

游戏使用OOPS Framework提供的UI管理系统，主要特点包括：

1. **界面分层**: 将UI分为常驻层、普通层、弹窗层和提示层
2. **界面栈**: 维护界面打开和关闭的顺序
3. **预加载**: 支持UI预加载，减少打开界面时的卡顿
4. **资源管理**: 自动管理UI资源的加载和释放

### 界面生命周期

每个UI界面都遵循以下生命周期：

1. **onInit**: 界面初始化，只在首次创建时调用
2. **onShow**: 界面显示时调用
3. **onHide**: 界面隐藏时调用
4. **onDispose**: 界面销毁时调用

## UI组件设计

### 基础组件

项目包含以下基础UI组件：

1. **按钮 (Button)**: 支持点击、长按等交互效果
2. **文本 (Label)**: 支持多语言、富文本等功能
3. **图片 (Image)**: 支持九宫格、精灵图等功能
4. **输入框 (Input)**: 支持文本输入和验证
5. **列表 (List)**: 支持垂直、水平和网格布局

### 复合组件

基于基础组件封装的高级组件：

1. **对话框 (Dialog)**: 模态对话框，支持自定义内容和按钮
2. **提示框 (Toast)**: 临时提示信息
3. **加载指示器 (Loading)**: 显示加载进度
4. **滚动视图 (ScrollView)**: 支持内容滚动和回弹效果

## UI创建流程

### 1. 创建预制体

在Cocos Creator中创建UI预制体，设置好层级结构和基本样式。

### 2. 编写视图组件

```typescript
// 示例：LoadingViewComp.ts
export class LoadingViewComp extends UIComp {
    // UI组件引用
    @property(Label)
    private labelProgress: Label = null!;
    
    // 更新进度显示
    public updateProgress(progress: number) {
        this.labelProgress.string = `${Math.floor(progress * 100)}%`;
    }
}
```

### 3. 编写视图模型

```typescript
// 示例：LoadingViewModel.ts
export class LoadingViewModel extends UIViewModel {
    private progress: number = 0;
    
    // 设置加载进度
    public setProgress(value: number) {
        this.progress = value;
        // 更新视图
        let view = this.view as LoadingViewComp;
        view.updateProgress(this.progress);
    }
}
```

### 4. 注册和使用UI

```typescript
// 注册UI
UIManager.instance.register(UIID.Loading, {
    prefab: "loading",
    layer: UILayer.UI_2D,
    model: LoadingViewModel
});

// 打开UI
UIManager.instance.open(UIID.Loading);

// 关闭UI
UIManager.instance.close(UIID.Loading);
```

## UI适配策略

项目采用以下适配策略，确保在不同分辨率和屏幕比例的设备上有良好的显示效果：

1. **基准分辨率**: 设计UI时以1920x1080为基准分辨率
2. **缩放模式**: 使用适合的缩放模式（如fit-width或fit-height）
3. **安全区域**: 考虑不同设备的安全区域，避免重要内容被遮挡
4. **动态布局**: 使用Cocos Creator的布局组件实现动态布局

## UI性能优化

1. **合图**: 使用TextureAtlas减少DrawCall
2. **对象池**: 对频繁创建和销毁的UI元素使用对象池
3. **延迟加载**: 非关键UI采用延迟加载策略
4. **按需创建**: 列表项按需创建，避免一次性创建大量UI元素
5. **事件优化**: 合理使用事件监听，避免过多的事件回调

## 多语言支持

项目支持多语言切换功能，实现方式如下：

1. **语言配置**: 在excel/Language.xlsx中配置多语言文本
2. **语言管理器**: 使用LanguageManager管理语言切换和文本获取
3. **文本组件**: 使用支持多语言的文本组件自动更新文本

## 主题切换

支持明暗主题切换或其他主题样式切换：

1. **主题配置**: 定义不同主题的颜色和样式
2. **主题管理器**: 管理主题切换和样式应用
3. **样式组件**: 使用支持主题的样式组件自动更新外观