# Prefab JSON生成标准化提示词模板

本模板用于指导AI或美术团队根据游戏界面渲染图，自动生成符合OOPS框架要求的Prefab JSON数据。请根据实际界面需求，补充具体内容。

---

## 0. 图像分析与识别阶段提示词模板
- **UI元素类型分类**：
  - 按钮(Button)、图片(Sprite)、文本(Label)、进度条(ProgressBar)、切换(Toggle)、滑块(Slider)、输入框(EditBox)、列表(ListView)等。
- **布局与层级关系表达**：
  - 层级关系采用节点树结构表达，建议缩进或列表形式，标明父子关系。
  - 布局可用绝对定位（如x、y坐标）或布局属性（如水平/垂直布局、对齐方式、间距）描述。
- **关键属性输出规范**：
  - 位置(Position)：用像素（px）或百分比（%）表示，如x:120px, y:80px或x:50%, y:10%
  - 尺寸(Size)：宽高均用px或%，如width:200px, height:60px
  - 颜色(Color)：用十六进制RGB或RGBA编码，如#FFAA00、#FFAA00FF
  - 文本内容(Text)：直接输出识别到的文本字符串
  - 图标/图片资源：输出资源文件名或路径，如img_icon.png
  - 透明度(Opacity)：0-255或0-1区间
  - 其他属性：如字体(font)、字号(fontSize)、描边(stroke)、阴影(shadow)等
- **输出示例**：
```
UI元素类型：按钮(Button)
名称：Btn_Exit
位置：x:32px, y:24px
尺寸：width:64px, height:64px
颜色：#FF0000
文本内容：退出
层级路径：Root/TopBar/Btn_Exit
布局属性：左上角绝对定位
资源引用：btn_exit.png
透明度：255
```
- **通用要求**：
  - 每个UI元素均需输出类型、名称、位置、尺寸、颜色、层级路径、资源引用、文本内容等关键属性。
  - 层级路径建议用“/”分隔，便于后续节点树还原。
  - 若为容器类节点（如Panel、ListView），需标明其子节点列表。
  - 若识别到特殊风格或材质，需补充说明。

---

## 1. 基本描述
- 绘制类型：如“游戏UI界面”/“弹窗”/“功能面板”
- 绘制要求：如“全屏界面”/“自适应分辨率”/“居中弹窗”
- 绘制风格：如“红木材质”“日系古风”“科技感蓝色”

## 2. 布局与层级结构
- 总体布局说明：如“顶部为操作栏，左侧为功能区，右侧为内容区”
- 节点树结构（建议以缩进或列表形式，标明每个节点类型及组件）：
  - Root（cc.Node，UITransform，Widget）
    - TopBar（cc.Node）
      - Btn_Exit（cc.Node，Button，Sprite）
      - Lbl_Title（cc.Node，Label）
    - LeftBar（cc.Node）
      - Btn_Menu（cc.Node，Button，Sprite，Label）
    - ContentArea（cc.Node）
      - Img_Background（cc.Node，Sprite）
      - ...

## 3. UI元素功能与命名规范
- 按钮(Button)：命名如btn_xxx，需描述功能（如“关闭界面”）
- 图片(Sprite)：命名如img_xxx，需描述内容（如“背景图”）
- 文本(Label)：命名如lbl_xxx，需描述显示内容（如“关卡标题”）
- 其他组件：如Toggle、Slider等，需说明用途

## 4. 资源引用与路径
- 图像资源路径：如assets/bundle/gui/level/images/xxx.png
- 资源命名规范：btn_（按钮）、img_（图片）、lbl_（文本）等
- 资源引用格式：如gui/level/images/btn_exit

## 5. 组件属性与交互
- 按钮(Button)：transition、normalSprite、pressedSprite、hoverSprite等
- 文本(Label)：string、color、fontSize等
- 图片(Sprite)：_spriteFrame需绑定资源UUID
- 交互说明：如“点击Btn_Exit关闭界面”、“Btn_Menu切换菜单”

## 6. 动画与特殊效果（如有）
- 节点/组件动画需求说明
- 特殊材质、粒子、遮罩等说明

## 7. 示例模板
```
界面名称：关卡选择界面
绘制类型：游戏UI界面
绘制要求：全屏，红木材质风格
布局：左上角为退出按钮，右侧为关卡列表，底部为进度条
节点树结构：
- Root（cc.Node，UITransform，Widget）
  - TopBar（cc.Node）
    - Btn_Exit（cc.Node，Button，Sprite）
    - Lbl_Level（cc.Node，Label）
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
资源路径与命名：btn_exit.png、img_bg.png等，放于assets/bundle/gui/level/images/
交互说明：Btn_Exit点击关闭界面，ZouzhePage1点击进入关卡详情
```

---

> 请严格按照上述结构描述界面，确保每个UI元素、资源、交互都清晰明了，便于自动化生成Prefab JSON。

## 3. 结构化界面描述生成
- 目标：将图像分析阶段得到的UI元素信息，转化为结构化、标准化的界面描述文本，便于后续自动生成Prefab JSON。
- 输出要求：
  1. 每个UI元素需独立描述，包含以下字段：
     - 节点名称（如Btn_Exit）
     - 类型（如Button、Sprite、Label等）
     - 属性（位置、尺寸、颜色、透明度、文本内容等，详见下方示例）
     - 层级路径（如Root/TopBar/Btn_Exit）
     - 资源引用（如btn_exit.png）
     - 交互说明（如“点击关闭界面”）
  2. 层级结构建议以缩进或列表形式表达，便于还原节点树。
  3. 命名规范需统一，按钮用btn_，图片用img_，文本用lbl_等。
  4. 属性值建议用标准格式（如x:120px, y:80px，color:#FFAA00，opacity:255等）。
  5. 若为容器节点，需列出其子节点。
  6. 若有特殊风格、材质、动画等，需补充说明。
- 输出示例：
```
- 节点名称：Btn_Exit
  类型：Button
  属性：
    - 位置：x:32px, y:24px
    - 尺寸：width:64px, height:64px
    - 颜色：#FF0000
    - 透明度：255
    - 文本内容：退出
  层级路径：Root/TopBar/Btn_Exit
  资源引用：btn_exit.png
  交互说明：点击关闭界面
- 节点名称：Lbl_Title
  类型：Label
  属性：
    - 位置：x:120px, y:24px
    - 尺寸：width:200px, height:60px
    - 颜色：#FFFFFF
    - 字体：微软雅黑
    - 字号：32
    - 文本内容：关卡选择
  层级路径：Root/TopBar/Lbl_Title
  资源引用：无
  交互说明：无
```
- 建议：所有UI元素均需结构化输出，字段齐全，格式统一，便于自动解析与Prefab生成。