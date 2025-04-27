const fs = require('fs');
const path = require('path');

// 项目根目录
const projectRoot = path.dirname(__dirname);

// 资源目录
const assetsDir = path.join(projectRoot, 'assets');
const bundleDir = path.join(assetsDir, 'bundle');
const guiDir = path.join(bundleDir, 'gui');

// 日志颜色
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * 打印彩色日志
 * @param {string} message 消息内容
 * @param {string} color 颜色
 */
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 验证JSON文件是否有效
 * @param {string} filePath JSON文件路径
 * @returns {object|null} 解析后的JSON对象，如果无效则返回null
 */
function validateJsonFormat(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Cocos Creator的预制体文件是一个JSON数组
        const prefab = JSON.parse(content);
        
        // 检查是否为数组格式
        if (!Array.isArray(prefab)) {
            log(`预制体文件格式错误，应为JSON数组: ${filePath}`, 'red');
            return null;
        }
        
        return prefab;
    } catch (error) {
        log(`无效的JSON文件: ${filePath}`, 'red');
        log(`错误信息: ${error.message}`, 'red');
        return null;
    }
}

/**
 * 验证Prefab的基本结构
 * @param {object} prefab Prefab对象
 * @param {string} filePath Prefab文件路径
 * @returns {boolean} 是否有效
 */
function validatePrefabStructure(prefab, filePath) {
    let isValid = true;
    const fileName = path.basename(filePath);

    // 在Cocos Creator中，预制体是一个数组，第一个元素通常是预制体信息
    if (prefab.length === 0) {
        log(`[${fileName}] 预制体数组为空`, 'red');
        return false;
    }

    const prefabInfo = prefab[0];
    
    // 检查基本字段
    if (prefabInfo.__type__ !== 'cc.Prefab') {
        log(`[${fileName}] 第一个元素的 __type__ 字段无效，应为 'cc.Prefab'`, 'red');
        isValid = false;
    }

    if (!prefabInfo._name) {
        log(`[${fileName}] 第一个元素缺少 _name 字段`, 'red');
        isValid = false;
    }

    if (!prefabInfo.data) {
        log(`[${fileName}] 第一个元素缺少 data 字段`, 'red');
        isValid = false;
        return isValid; // 如果没有data字段，无法继续验证
    }

    // 检查根节点引用
    const rootNodeId = prefabInfo.data.__id__;
    if (rootNodeId === undefined) {
        log(`[${fileName}] data.__id__ 无效`, 'red');
        isValid = false;
        return isValid;
    }
    
    // 检查根节点是否存在
    if (rootNodeId >= prefab.length) {
        log(`[${fileName}] 根节点引用无效: ${rootNodeId}`, 'red');
        isValid = false;
        return isValid;
    }

    return isValid;
}

/**
 * 验证节点结构
 * @param {object} prefab Prefab对象
 * @param {string} filePath Prefab文件路径
 * @returns {boolean} 是否有效
 */
function validateNodeStructure(prefab, filePath) {
    let isValid = true;
    const fileName = path.basename(filePath);
    const nodeIds = new Set();

    // 遍历所有对象，检查节点结构
    for (let i = 0; i < prefab.length; i++) {
        const obj = prefab[i];
        
        // 只检查节点类型的对象
        if (obj.__type__ === 'cc.Node') {
            // 检查节点ID唯一性
            if (obj._id !== undefined) {
                if (nodeIds.has(obj._id)) {
                    log(`[${fileName}] 节点ID重复: ${obj._id}`, 'red');
                    isValid = false;
                } else {
                    nodeIds.add(obj._id);
                }
            }

            // 检查必要字段
            if (!obj._name) {
                log(`[${fileName}] 节点缺少 _name 字段`, 'red');
                isValid = false;
            }

            // 检查组件数组
            if (!Array.isArray(obj._components)) {
                log(`[${fileName}] 节点 ${obj._name || '未命名'} 缺少 _components 数组`, 'red');
                isValid = false;
            }

            // 检查根节点是否有UITransform组件
            if (i === 1) { // 通常第二个对象(索引1)是根节点
                const hasUITransform = obj._components.some(comp => {
                    const compRef = prefab[comp.__id__];
                    return compRef && compRef.__type__ === 'cc.UITransform';
                });

                if (!hasUITransform) {
                    log(`[${fileName}] 根节点缺少 UITransform 组件`, 'yellow');
                }
            }
        }
    }

    return isValid;
}

/**
 * 验证资源引用
 * @param {object} prefab Prefab对象
 * @param {string} filePath Prefab文件路径
 * @returns {boolean} 是否有效
 */
function validateResourceReferences(prefab, filePath) {
    let isValid = true;
    const fileName = path.basename(filePath);
    const prefabDir = path.dirname(filePath);
    const resourceRefs = [];

    // 遍历所有对象，查找资源引用
    for (let i = 0; i < prefab.length; i++) {
        const obj = prefab[i];
        
        // 检查Sprite组件的spriteFrame引用
        if (obj.__type__ === 'cc.Sprite' && obj._spriteFrame) {
            if (obj._spriteFrame.__uuid__) {
                resourceRefs.push({
                    type: 'spriteFrame',
                    uuid: obj._spriteFrame.__uuid__,
                    nodeName: getNodeNameForComponent(prefab, obj),
                    componentIndex: i
                });
            } else {
                log(`[${fileName}] 节点 ${getNodeNameForComponent(prefab, obj)} 的 Sprite 组件缺少 spriteFrame UUID`, 'red');
                isValid = false;
            }
        }
        
        // 检查Label组件的font引用
        if (obj.__type__ === 'cc.Label' && obj._font && obj._font.__uuid__) {
            resourceRefs.push({
                type: 'font',
                uuid: obj._font.__uuid__,
                nodeName: getNodeNameForComponent(prefab, obj),
                componentIndex: i
            });
        }
        
        // 检查Button组件的spriteFrame引用
        if (obj.__type__ === 'cc.Button') {
            // 检查普通状态图片
            if (obj.normalSprite && obj.normalSprite.__uuid__) {
                resourceRefs.push({
                    type: 'buttonNormal',
                    uuid: obj.normalSprite.__uuid__,
                    nodeName: getNodeNameForComponent(prefab, obj),
                    componentIndex: i
                });
            }
            
            // 检查按下状态图片
            if (obj.pressedSprite && obj.pressedSprite.__uuid__) {
                resourceRefs.push({
                    type: 'buttonPressed',
                    uuid: obj.pressedSprite.__uuid__,
                    nodeName: getNodeNameForComponent(prefab, obj),
                    componentIndex: i
                });
            }
            
            // 检查悬停状态图片
            if (obj.hoverSprite && obj.hoverSprite.__uuid__) {
                resourceRefs.push({
                    type: 'buttonHover',
                    uuid: obj.hoverSprite.__uuid__,
                    nodeName: getNodeNameForComponent(prefab, obj),
                    componentIndex: i
                });
            }
            
            // 检查禁用状态图片
            if (obj.disabledSprite && obj.disabledSprite.__uuid__) {
                resourceRefs.push({
                    type: 'buttonDisabled',
                    uuid: obj.disabledSprite.__uuid__,
                    nodeName: getNodeNameForComponent(prefab, obj),
                    componentIndex: i
                });
            }
        }
    }

    // 验证资源引用
    if (resourceRefs.length > 0) {
        log(`[${fileName}] 发现 ${resourceRefs.length} 个资源引用`, 'cyan');
        
        // 检查UUID格式和资源路径
        for (const ref of resourceRefs) {
            // 检查UUID格式
            if (!isValidUUID(ref.uuid)) {
                log(`[${fileName}] 节点 ${ref.nodeName} 的 ${ref.type} 引用了无效的UUID: ${ref.uuid}`, 'red');
                isValid = false;
                continue;
            }
            
            // 尝试检查资源路径格式
            // 注意：这里只能做基本检查，因为无法直接从UUID映射到文件路径
            const resourcePath = extractResourcePathFromPrefab(prefab, ref.uuid);
            if (resourcePath) {
                // 检查资源路径是否符合规范
                if (!isValidResourcePath(resourcePath)) {
                    log(`[${fileName}] 节点 ${ref.nodeName} 的 ${ref.type} 引用了不规范的资源路径: ${resourcePath}`, 'yellow');
                }
                
                // 检查资源是否存在（如果路径可解析）
                if (resourcePath.startsWith('gui/')) {
                    const assetPath = path.join(bundleDir, resourcePath);
                    if (!fs.existsSync(assetPath) && !fs.existsSync(assetPath + '.meta')) {
                        log(`[${fileName}] 节点 ${ref.nodeName} 的 ${ref.type} 引用的资源不存在: ${resourcePath}`, 'red');
                        isValid = false;
                    }
                }
            }
        }
    }

    return isValid;
}

/**
 * 获取组件所属节点的名称
 * @param {object} prefab Prefab对象
 * @param {object} component 组件对象
 * @returns {string} 节点名称
 */
function getNodeNameForComponent(prefab, component) {
    // 查找引用此组件的节点
    for (const obj of prefab) {
        if (obj.__type__ === 'cc.Node' && Array.isArray(obj._components)) {
            for (const comp of obj._components) {
                if (comp.__id__ === prefab.indexOf(component)) {
                    return obj._name || '未命名';
                }
            }
        }
    }
    return '未知';
}

/**
 * 检查UUID格式是否有效
 * @param {string} uuid UUID字符串
 * @returns {boolean} 是否有效
 */
function isValidUUID(uuid) {
    // Cocos Creator的UUID通常是一个32位的十六进制字符串
    return typeof uuid === 'string' && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(uuid);
}

/**
 * 尝试从预制体中提取资源路径
 * @param {object} prefab Prefab对象
 * @param {string} uuid 资源UUID
 * @returns {string|null} 资源路径，如果无法提取则返回null
 */
function extractResourcePathFromPrefab(prefab, uuid) {
    // 在预制体中查找资源引用信息
    for (const obj of prefab) {
        // 查找资源信息对象
        if (obj.__type__ && obj.__type__.includes('cc.Asset') && obj._uuid === uuid) {
            return obj._name;
        }
        
        // 查找SpriteFrame对象
        if (obj.__type__ === 'cc.SpriteFrame' && obj._uuid === uuid) {
            // 如果有texture属性，可能包含路径信息
            if (obj._texture && obj._texture.__uuid__) {
                // 递归查找texture的路径
                return extractResourcePathFromPrefab(prefab, obj._texture.__uuid__);
            }
            return obj._name;
        }
        
        // 查找资源路径信息
        if (obj._uuid === uuid && obj._path) {
            return obj._path;
        }
    }
    
    // 在预制体的其他属性中查找路径信息
    for (const obj of prefab) {
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (key === '_path' && obj._uuid === uuid) {
                    return obj._path;
                }
            }
        }
    }
    
    return null;
}

/**
 * 检查资源路径是否符合OOPS框架规范
 * @param {string} resourcePath 资源路径
 * @returns {boolean} 是否符合规范
 */
function isValidResourcePath(resourcePath) {
    if (!resourcePath) return false;
    
    // 检查是否以bundle名称开头
    if (!resourcePath.startsWith('gui/') && 
        !resourcePath.startsWith('common/') && 
        !resourcePath.startsWith('game/')) {
        return false;
    }
    
    // 检查路径格式
    const parts = resourcePath.split('/');
    
    // 至少应该有bundle名称、模块名称和资源名称
    if (parts.length < 3) {
        return false;
    }
    
    // 检查图像资源是否在images目录下
    if (resourcePath.endsWith('.png') || 
        resourcePath.endsWith('.jpg') || 
        resourcePath.endsWith('.jpeg') || 
        resourcePath.endsWith('.webp')) {
        
        // 检查是否包含images目录
        if (!resourcePath.includes('/images/')) {
            return false;
        }
    }
    
    // 检查资源命名规范
    const fileName = parts[parts.length - 1];
    
    // 检查是否使用小写字母和下划线
    if (!/^[a-z0-9_]+\.[a-z]+$/.test(fileName)) {
        return false;
    }
    
    return true;
}

/**
 * 验证预制体是否符合OOPS框架规范
 * @param {object} prefab Prefab对象
 * @param {string} filePath Prefab文件路径
 * @returns {boolean} 是否符合规范
 */
function validateOOPSCompliance(prefab, filePath) {
    let isValid = true;
    const fileName = path.basename(filePath);
    const relativePath = path.relative(guiDir, filePath);
    const pathParts = relativePath.split(path.sep);
    
    // 检查预制体路径是否符合规范
    if (pathParts.length < 2) {
        log(`[${fileName}] 预制体路径不符合OOPS框架规范，应放在模块子目录中`, 'yellow');
    }
    
    // 检查节点命名规范
    let hasNamingIssue = false;
    for (const obj of prefab) {
        if (obj.__type__ === 'cc.Node') {
            const name = obj._name;
            if (name && name !== 'demo') { // 排除根节点和demo节点
                // 检查是否使用了推荐的前缀
                const hasPrefix = /^(btn_|img_|lbl_|node_|scroll_|layout_)/i.test(name);
                if (!hasPrefix && !hasNamingIssue) {
                    hasNamingIssue = true;
                    log(`[${fileName}] 发现节点命名不符合推荐规范 (如 btn_, img_, lbl_ 前缀): ${name}`, 'yellow');
                }
            }
        }
    }
    
    return isValid;
}

/**
 * 生成预制体验证报告
 * @param {string} filePath 预制体文件路径
 * @param {object} prefab 预制体对象
 * @param {object} results 验证结果
 * @returns {object} 详细报告
 */
function generatePrefabReport(filePath, prefab, results) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(projectRoot, filePath);
    
    // 统计节点和组件数量
    let nodeCount = 0;
    let componentCounts = {};
    let resourceRefs = [];
    
    for (const obj of prefab) {
        if (obj.__type__ === 'cc.Node') {
            nodeCount++;
        } else if (obj.__type__ && obj.__type__.startsWith('cc.')) {
            const compType = obj.__type__.replace('cc.', '');
            componentCounts[compType] = (componentCounts[compType] || 0) + 1;
            
            // 收集资源引用
            if (compType === 'Sprite' && obj._spriteFrame && obj._spriteFrame.__uuid__) {
                resourceRefs.push({
                    type: 'spriteFrame',
                    uuid: obj._spriteFrame.__uuid__
                });
            } else if (compType === 'Label' && obj._font && obj._font.__uuid__) {
                resourceRefs.push({
                    type: 'font',
                    uuid: obj._font.__uuid__
                });
            } else if (compType === 'Button') {
                if (obj.normalSprite && obj.normalSprite.__uuid__) {
                    resourceRefs.push({
                        type: 'buttonNormal',
                        uuid: obj.normalSprite.__uuid__
                    });
                }
            }
        }
    }
    
    // 生成报告
    const report = {
        fileName,
        relativePath,
        timestamp: new Date().toISOString(),
        valid: results.isValid,
        stats: {
            nodeCount,
            componentCounts,
            resourceRefCount: resourceRefs.length
        },
        validations: {
            jsonFormat: results.jsonFormat,
            structure: results.structure,
            nodeStructure: results.nodeStructure,
            resourceRefs: results.resourceRefs,
            oopsCompliance: results.oopsCompliance
        },
        issues: results.issues || []
    };
    
    return report;
}

/**
 * 保存验证报告到文件
 * @param {object} report 验证报告
 * @param {string} outputDir 输出目录
 */
function saveReport(report, outputDir = path.join(projectRoot, 'reports')) {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `${report.fileName.replace('.prefab', '')}_report.json`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8');
    log(`报告已保存至: ${filePath}`, 'green');
}

/**
 * 验证单个Prefab文件
 * @param {string} filePath Prefab文件路径
 * @param {boolean} generateReport 是否生成报告
 * @returns {boolean} 验证是否通过
 */
function validatePrefab(filePath, generateReport = true) {
    log(`\n验证预制体: ${path.relative(projectRoot, filePath)}`, 'cyan');
    
    const results = {
        issues: []
    };
    
    // 验证JSON格式
    const prefab = validateJsonFormat(filePath);
    results.jsonFormat = !!prefab;
    if (!prefab) {
        results.issues.push({
            type: 'error',
            category: 'jsonFormat',
            message: '无效的JSON格式'
        });
        return false;
    }
    
    // 验证Prefab基本结构
    results.structure = validatePrefabStructure(prefab, filePath);
    if (!results.structure) {
        results.issues.push({
            type: 'error',
            category: 'structure',
            message: 'Prefab基本结构无效'
        });
        return false;
    }
    
    // 验证节点结构
    results.nodeStructure = validateNodeStructure(prefab, filePath);
    if (!results.nodeStructure) {
        results.issues.push({
            type: 'error',
            category: 'nodeStructure',
            message: '节点结构无效'
        });
    }
    
    // 验证资源引用
    results.resourceRefs = validateResourceReferences(prefab, filePath);
    if (!results.resourceRefs) {
        results.issues.push({
            type: 'error',
            category: 'resourceRefs',
            message: '资源引用无效'
        });
    }
    
    // 验证OOPS框架规范
    results.oopsCompliance = validateOOPSCompliance(prefab, filePath);
    if (!results.oopsCompliance) {
        results.issues.push({
            type: 'warning',
            category: 'oopsCompliance',
            message: '不完全符合OOPS框架规范'
        });
    }
    
    results.isValid = results.nodeStructure && results.resourceRefs;
    
    if (results.isValid) {
        log(`预制体验证通过: ${path.basename(filePath)}`, 'green');
    } else {
        log(`预制体验证失败: ${path.basename(filePath)}`, 'red');
    }
    
    // 生成详细报告
    if (generateReport) {
        const report = generatePrefabReport(filePath, prefab, results);
        saveReport(report);
    }
    
    return results.isValid;
}

/**
 * 查找并验证所有Prefab文件
 * @param {string} directory 要搜索的目录
 * @param {boolean} generateReports 是否生成报告
 * @returns {object} 验证结果统计
 */
function validateAllPrefabs(directory = guiDir, generateReports = true) {
    const stats = {
        total: 0,
        valid: 0,
        invalid: 0,
        prefabs: []
    };
    
    // 创建汇总报告目录
    const reportsDir = path.join(projectRoot, 'reports');
    if (generateReports && !fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // 递归查找所有.prefab文件
    function findPrefabs(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                findPrefabs(filePath);
            } else if (file.endsWith('.prefab')) {
                stats.total++;
                const isValid = validatePrefab(filePath, generateReports);
                if (isValid) {
                    stats.valid++;
                } else {
                    stats.invalid++;
                }
                
                stats.prefabs.push({
                    path: path.relative(projectRoot, filePath),
                    valid: isValid
                });
            }
        }
    }
    
    log('开始验证预制体...', 'blue');
    findPrefabs(directory);
    
    // 生成汇总报告
    if (generateReports) {
        const summaryReport = {
            timestamp: new Date().toISOString(),
            stats: {
                total: stats.total,
                valid: stats.valid,
                invalid: stats.invalid
            },
            prefabs: stats.prefabs
        };
        
        const summaryPath = path.join(reportsDir, 'prefab_validation_summary.json');
        fs.writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2), 'utf8');
        log(`汇总报告已保存至: ${summaryPath}`, 'green');
    }
    
    log('\n验证完成!', 'blue');
    log(`总计: ${stats.total} 个预制体`, 'cyan');
    log(`有效: ${stats.valid} 个`, 'green');
    log(`无效: ${stats.invalid} 个`, 'red');
    
    return stats;
}

/**
 * 验证单个指定的Prefab文件
 * @param {string} filePath Prefab文件路径
 * @returns {boolean} 验证是否通过
 */
function validateSinglePrefab(filePath) {
    if (!fs.existsSync(filePath)) {
        log(`文件不存在: ${filePath}`, 'red');
        return false;
    }
    
    if (!filePath.endsWith('.prefab')) {
        log(`不是有效的预制体文件: ${filePath}`, 'red');
        return false;
    }
    
    return validatePrefab(filePath, true);
}

// 处理命令行参数
const args = process.argv.slice(2);
if (args.length > 0) {
    // 如果提供了文件路径，验证单个文件
    const filePath = path.resolve(args[0]);
    validateSinglePrefab(filePath);
} else {
    // 否则验证所有预制体
    validateAllPrefabs();
}