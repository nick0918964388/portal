# 🔧 修复首页不显示文章的问题

## 问题诊断

如果首页没有显示文章，最常见的原因是：

### ✅ 文章是草稿状态（最可能）

首页只显示 `published = true` 的文章。如果你创建文章时没有勾选"Publish immediately"，文章会保存为草稿（`published = false`），不会在首页显示。

## 快速修复

### 方案 1: 一键发布所有文章（推荐）

```bash
npm run db:publish
```

这会自动将所有草稿文章设置为已发布状态。

### 方案 2: 检查数据库状态

```bash
npm run db:check
```

这会显示：
- 总文章数
- 已发布文章数
- 草稿文章数
- 每篇文章的详细状态

### 方案 3: 手动在管理页面发布

1. 访问 http://localhost:3000/admin
2. 找到草稿文章（状态显示为黄色"Draft"）
3. 点击 "Edit" 按钮
4. 勾选 ✅ "Publish immediately"
5. 点击 "Update Post"
6. 刷新首页查看

### 方案 4: 直接使用 SQL（高级）

如果你能直接访问数据库：

```sql
-- 查看所有文章状态
SELECT id, title, published FROM posts;

-- 发布所有文章
UPDATE posts SET published = true;

-- 发布特定文章（替换 1,2,3 为实际的文章 ID）
UPDATE posts SET published = true WHERE id IN (1,2,3);
```

## 详细步骤

### 步骤 1: 检查问题

```bash
npm run db:check
```

**看到这个？**
```
Total posts: 5
Published posts: 0  ← 这是问题！
Draft posts: 5
```

说明所有文章都是草稿状态。

### 步骤 2: 发布文章

```bash
npm run db:publish
```

**应该看到：**
```
✅ Successfully published 5 post(s):
  ✓ [1] Welcome to My Portfolio Blog
  ✓ [2] Building Modern Web Applications with Next.js
  ...

🎉 Done! Visit http://localhost:3000 to see your posts!
```

### 步骤 3: 验证

访问 http://localhost:3000，应该能看到所有文章了！

## 其他可能的问题

### 问题：数据库中没有文章

**症状：**
```bash
npm run db:check
```
显示：`Total posts: 0`

**解决方案：**
```bash
npm run db:init
```

这会插入 4 篇示例文章（3 篇已发布 + 1 篇草稿）。

### 问题：数据库连接失败

**症状：**
运行命令时看到连接错误。

**解决方案：**
查看 [DATABASE_SETUP.md](./DATABASE_SETUP.md) 获取详细的数据库连接指南。

### 问题：首页有错误

**检查：**
1. 打开浏览器的开发者工具（F12）
2. 查看 Console 是否有错误
3. 查看 Network 标签，检查 API 请求

## 常用命令总结

```bash
# 检查文章状态
npm run db:check

# 发布所有草稿文章
npm run db:publish

# 初始化数据库和示例数据
npm run db:init

# 测试数据库连接
npm run db:test

# 启动开发服务器
npm run dev
```

## 创建新文章时的注意事项

在管理页面创建文章时：

1. ✅ **记得勾选** "Publish immediately" 复选框
2. 如果不勾选，文章会保存为草稿
3. 草稿文章不会在首页显示
4. 可以稍后在管理页面编辑并发布

## 调试技巧

### 查看 Next.js 日志

运行开发服务器时注意终端输出：

```bash
npm run dev
```

如果首页加载时有数据库错误，会在终端显示：
```
Error fetching posts: ...
```

### 检查 API 响应

访问 http://localhost:3000/api/posts 应该返回 JSON 格式的文章列表。

如果返回空数组 `[]`，说明没有已发布的文章。

## 成功标志

修复后，你应该看到：

### 首页
- ✅ 显示文章卡片
- ✅ 有标题、摘要、封面图片
- ✅ 点击文章可以进入详情页

### 管理页面
- ✅ 可以看到所有文章列表
- ✅ 已发布文章显示绿色 "Published"
- ✅ 草稿文章显示黄色 "Draft"

## 还是不行？

如果按照以上步骤还是不行，请检查：

1. **开发服务器是否正在运行？**
   ```bash
   npm run dev
   ```

2. **数据库连接是否正常？**
   ```bash
   npm run db:test
   ```

3. **端口是否被占用？**
   - 尝试访问不同的端口
   - 或者关闭占用 3000 端口的其他应用

4. **浏览器缓存**
   - 按 Ctrl+Shift+R (Windows/Linux) 或 Cmd+Shift+R (Mac) 强制刷新
   - 或者在无痕/隐私模式下打开

5. **检查 .env.local 文件**
   - 确保数据库配置正确
   - 文件名必须是 `.env.local`（不是 `.env`）

需要更多帮助？提供以下信息：
- `npm run db:check` 的完整输出
- 浏览器控制台的错误信息
- 终端的错误日志
