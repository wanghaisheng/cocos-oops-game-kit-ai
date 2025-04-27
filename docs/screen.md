这是一个简单的界面描述文本：绘制类型：游戏UI界面；绘制要求：全屏界面；绘制风格：界面外框由红木材质制作，整体为红木类似材质；界面布局：左上角是一个金色花纹的退出按钮，按钮右边显示“关卡”文字，在按钮下方，是一个很细窄的竖直摆放贯通整个界面的红木样式木条，木条上两个个简易的扁平化设计的串在一起的两个灯笼样式的按钮，在两个灯笼按钮上分别显示“普通”和“精英”文字。木条右边是一个平铺展开的奏折样式的关卡列表，在奏折封面顶部写着“完成度：2/10”，中间是0.5毫米细窄边框包裹的“第一章”，下面是棕红底纹白色文字“已获得”，最下面的文字“3/30”后面接着一个星星；在奏折封面右边是3页展开的奏折内容页，每页上都会显示一个平成年代的日系古风二次元立绘，底部显示三颗星星，并且顶部显示“第1节”“出入大荒”

---

## Prefab节点树结构示例
- Root（cc.Node，UITransform，Widget）
  - TopBar（cc.Node）
    - Btn_Exit（cc.Node，Button，Sprite）
    - Lbl_Level（cc.Node，Label）
  - LeftBar（cc.Node）
    - WoodLine（cc.Node，Sprite）
      - Btn_Lantern_Normal（cc.Node，Button，Sprite，Label）
      - Btn_Lantern_Elite（cc.Node，Button，Sprite，Label）
  - LevelList（cc.Node）
    - ZouzheCover（cc.Node，Sprite）
      - Lbl_Progress（cc.Node，Label）
      - Lbl_Chapter（cc.Node，Label）
      - Lbl_Obtained（cc.Node，Label）
      - Lbl_StarCount（cc.Node，Label，Sprite）
    - ZouzhePage1（cc.Node，Sprite）
      - Img_Character（cc.Node，Sprite）
      - Lbl_Section（cc.Node，Label）
      - Lbl_Title（cc.Node，Label）
      - StarGroup（cc.Node，Sprite*3）
    - ZouzhePage2（同上）
    - ZouzhePage3（同上）

## Prefab JSON结构片段示例
```json
{
  "__type__": "cc.Prefab",
  "_name": "LevelScreen",
  "data": {
    "__type__": "cc.Node",
    "_name": "Root",
    "_components": [ { "__type__": "cc.UITransform" }, { "__type__": "cc.Widget" } ],
    "_children": [
      { "__type__": "cc.Node", "_name": "TopBar", "_children": [
        { "__type__": "cc.Node", "_name": "Btn_Exit", "_components": [ { "__type__": "cc.Button" }, { "__type__": "cc.Sprite", "_spriteFrame": { "__uuid__": "gold_exit_btn_uuid" } } ] },
        { "__type__": "cc.Node", "_name": "Lbl_Level", "_components": [ { "__type__": "cc.Label", "string": "关卡" } ] }
      ] },
      // ... 省略其余节点 ...
    ]
  }
}
```

## 关键组件属性说明
- 按钮(Button)：`transition`、`normalSprite`、`pressedSprite`、`hoverSprite`等需绑定资源
- 文本(Label)：`string`为显示内容，`color`、`fontSize`等
- 图片(Sprite)：`_spriteFrame`需绑定资源UUID
- UITransform/Widget：用于布局适配

## 资源路径与命名规范
- 图像资源放于`assets/bundle/gui/level/images/`，如`btn_exit.png`、`lantern_normal.png`等
- 预制体JSON放于`assets/bundle/gui/level/LevelScreen.prefab`
- 资源引用格式：`gui/level/images/btn_exit`
- 命名建议：`btn_`（按钮）、`img_`（图片）、`lbl_`（文本）

## PSD资源与Prefab节点绑定示例
1. PSD导出资源命名与Prefab节点一致，如`Btn_Exit`对应`btn_exit.png`
2. 在Prefab JSON中，`cc.Sprite`组件的`_spriteFrame`字段填写对应资源的UUID
3. 在Cocos Creator资源管理器中，将图片拖拽到节点的SpriteFrame属性上，自动生成UUID引用
4. 代码引用：
```ts
@property(cc.Button)
btnExit: cc.Button = null!;
// ...
this.btnExit.node.on('click', this.onExitClick, this);
```

---

通过上述结构和规范，团队成员可快速将美术资源和界面描述落地为可用Prefab，便于后续开发和维护。