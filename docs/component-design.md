# 组件设计文档

## 概述

本文档描述了基于Cocos Creator和OOPS Framework的游戏项目中组件的设计原则、架构和实现方式。项目采用ECS（实体-组件-系统）架构，通过组件化设计提高代码复用性和可维护性。

## ECS架构概述

### 实体(Entity)

实体是游戏中的基本对象，如玩家角色、NPC、道具等。在OOPS Framework中，实体通常是一个轻量级的对象，主要用于组织和管理组件。

### 组件(Component)

组件是实体的功能模块，包含数据和状态。每个组件专注于特定功能，如位置、外观、物理属性等。

### 系统(System)

系统负责处理游戏逻辑，操作组件数据。系统通常关注特定类型的组件，并对这些组件进行处理。

## 组件设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **高内聚低耦合**: 组件内部高内聚，组件之间低耦合
3. **可复用性**: 组件设计应考虑复用性
4. **可测试性**: 组件应易于测试

## 核心组件类型

### 数据组件

数据组件主要存储实体的数据和状态，不包含业务逻辑。

```typescript
// 示例：账号数据组件
export class AccountModelComp extends ModelComp {
    /** 用户ID */
    uid: string = "";
    /** 用户名 */
    username: string = "";
    /** 等级 */
    level: number = 1;
    /** 经验值 */
    exp: number = 0;
    /** 金币 */
    coin: number = 0;
}
```

### 视图组件

视图组件负责UI显示和用户交互，通常与Cocos Creator的节点和组件关联。

```typescript
// 示例：加载界面视图组件
export class LoadingViewComp extends UIComp {
    @property(Label)
    private labelProgress: Label = null!;
    
    @property(ProgressBar)
    private progressBar: ProgressBar = null!;
    
    // 更新进度显示
    public updateProgress(progress: number) {
        this.labelProgress.string = `${Math.floor(progress * 100)}%`;
        this.progressBar.progress = progress;
    }
}
```

### 行为组件

行为组件实现实体的行为逻辑，如移动、攻击、交互等。

```typescript
// 示例：角色移动组件
export class CharacterMoveComp extends Component {
    /** 移动速度 */
    @property
    speed: number = 5;
    
    /** 当前移动方向 */
    direction: Vec2 = new Vec2(0, 0);
    
    /** 设置移动方向 */
    setDirection(x: number, y: number) {
        this.direction.x = x;
        this.direction.y = y;
    }
    
    update(dt: number) {
        // 根据方向和速度更新位置
        if (!this.direction.equals(Vec2.ZERO)) {
            let pos = this.node.position;
            pos.x += this.direction.x * this.speed * dt;
            pos.y += this.direction.y * this.speed * dt;
            this.node.position = pos;
        }
    }
}
```

## 组件通信机制

### 直接引用

组件可以直接引用其他组件，适用于紧密耦合的组件。

```typescript
// 获取同一节点上的其他组件
let moveComp = this.getComponent(CharacterMoveComp);
moveComp.setDirection(1, 0);
```

### 事件机制

使用事件系统进行组件间通信，适用于松散耦合的组件。

```typescript
// 发送事件
EventManager.instance.emit(EventName.PLAYER_MOVE, { x: 1, y: 0 });

// 监听事件
EventManager.instance.on(EventName.PLAYER_MOVE, this.onPlayerMove, this);
```

### 依赖注入

OOPS Framework支持依赖注入，可以在组件中注入其他组件或服务。

```typescript
// 注入服务
@inject("userService")
private userService: UserService;
```

## 组件生命周期

组件生命周期与Cocos Creator的组件生命周期一致，主要包括：

1. **onLoad**: 组件加载时调用
2. **start**: 组件启动时调用
3. **update**: 每帧调用
4. **lateUpdate**: 在所有update调用后调用
5. **onDestroy**: 组件销毁时调用

## 组件复用策略

### 组件继承

通过继承基类组件实现功能扩展。

```typescript
// 基础移动组件
export class BaseMoveComp extends Component {
    // 基础移动功能
}

// 扩展的角色移动组件
export class CharacterMoveComp extends BaseMoveComp {
    // 角色特有的移动功能
}
```

### 组件组合

通过组合多个组件实现复杂功能。

```typescript
// 角色实体包含多个组件
let character = new Entity();
character.addComponent(CharacterMoveComp);
character.addComponent(CharacterAnimComp);
character.addComponent(CharacterHealthComp);
```

## 组件测试

### 单元测试

对组件进行单元测试，验证组件功能的正确性。

```typescript
// 测试账号数据组件
describe("AccountModelComp", () => {
    it("should initialize with default values", () => {
        let comp = new AccountModelComp();
        expect(comp.uid).toBe("");
        expect(comp.level).toBe(1);
        expect(comp.coin).toBe(0);
    });
});
```

### 集成测试

测试多个组件的协同工作，验证组件间交互的正确性。

## 最佳实践

1. **组件粒度**: 保持组件粒度适中，既不过大也不过小
2. **命名规范**: 遵循统一的命名规范，如数据组件以ModelComp结尾，视图组件以ViewComp结尾
3. **文档注释**: 为组件添加详细的文档注释，说明组件的功能、参数和使用方式
4. **性能优化**: 注意组件的性能影响，避免在update中执行耗时操作
5. **错误处理**: 完善组件的错误处理机制，提高游戏的稳定性