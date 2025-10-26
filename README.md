# Portfolio & Blog Platform

一个现代化的作品集博客平台，使用 Next.js 16 和 PostgreSQL 构建。

## 功能特色

- 📝 完整的博客文章管理系统（CRUD）
- 🎨 现代化、响应式的用户界面
- 🌓 支持深色模式
- 📱 移动端友好设计
- 🗄️ PostgreSQL 数据库集成
- ✏️ 内置管理后台编辑器
- 🖼️ 支持封面图片
- 📊 草稿/发布状态管理
- 🔗 自动生成 URL slug

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 3
- **数据库**: PostgreSQL
- **数据库客户端**: node-postgres (pg)

## ⚠️ 重要提示

**数据库连接问题？** 如果你在连接数据库时遇到问题，请查看 [DATABASE_SETUP.md](./DATABASE_SETUP.md) 获取详细的故障排除指南。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
DATABASE_HOST=postgres.mas4dev.xyz
DATABASE_PORT=5434
DATABASE_USER=admin
DATABASE_PASSWORD=admin
DATABASE_NAME=postgres
```

### 3. 测试数据库连接

在启动应用前，测试数据库连接：

```bash
npm run db:test
```

如果连接成功，你会看到数据库信息。如果失败，请查看 [DATABASE_SETUP.md](./DATABASE_SETUP.md)。

### 4. 初始化数据库（可选）

初始化数据库并插入示例文章：

```bash
npm run db:init
```

这会创建必要的表并插入 4 篇示例博客文章。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

**注意：** 数据库表也会在第一次调用 API 时自动创建（如果你跳过了步骤 4）。

## 页面结构

- **首页** (`/`): 展示所有已发布的博客文章
- **文章详情** (`/posts/[slug]`): 显示单篇文章的完整内容
- **管理后台** (`/admin`): 创建、编辑、删除博客文章

## API 路由

- `GET /api/posts` - 获取所有文章
- `POST /api/posts` - 创建新文章
- `GET /api/posts/[id]` - 获取单篇文章
- `PUT /api/posts/[id]` - 更新文章
- `DELETE /api/posts/[id]` - 删除文章

## 数据库结构

### posts 表

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  author VARCHAR(100) DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 使用说明

### 创建文章

1. 访问 `/admin` 管理页面
2. 点击 "New Post" 按钮
3. 填写文章标题、内容等信息
4. 勾选 "Publish immediately" 以立即发布
5. 点击 "Create Post" 保存

### 编辑文章

1. 在管理页面找到要编辑的文章
2. 点击 "Edit" 按钮
3. 修改内容
4. 点击 "Update Post" 保存

### 删除文章

1. 在管理页面找到要删除的文章
2. 点击 "Delete" 按钮
3. 确认删除

## 部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 开发命令

**应用命令：**
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查

**数据库命令：**
- `npm run db:test` - 测试数据库连接
- `npm run db:init` - 初始化数据库并插入示例数据

## 项目结构

```
portal/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   ├── api/               # API 路由
│   │   └── posts/        # 文章 API
│   ├── posts/            # 文章详情页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   ├── not-found.tsx     # 404 页面
│   └── globals.css       # 全局样式
├── lib/                   # 工具函数
│   ├── db.ts             # 数据库连接
│   └── init-db.ts        # 数据库初始化
├── .env.local            # 环境变量（不包含在 git 中）
├── next.config.mjs       # Next.js 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目依赖
```

## 特性说明

### 自动 Slug 生成

当你输入文章标题时，系统会自动生成 URL 友好的 slug。例如：
- "My First Blog Post" → "my-first-blog-post"
- "學習 Next.js" → "nextjs"

### 封面图片

支持通过 URL 添加封面图片。只需在 "Cover Image URL" 字段中输入图片地址。

### 草稿功能

创建文章时可以选择不勾选 "Publish immediately"，这样文章会保存为草稿，不会在首页显示。

## 注意事项

- 确保 PostgreSQL 数据库可访问
- `.env.local` 文件包含敏感信息，不要提交到 Git
- 生产环境建议添加身份认证保护管理页面

## License

ISC
