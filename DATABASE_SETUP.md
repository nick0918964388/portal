# 数据库设置指南

## 当前状态

⚠️ **数据库连接问题检测到**

无法连接到 `postgres.mas4dev.xyz:5434`，错误：DNS 解析失败 (EAI_AGAIN)

## 可能的原因

1. **DNS 解析问题**
   - 域名 `postgres.mas4dev.xyz` 无法解析
   - DNS 服务器配置问题

2. **网络连接问题**
   - 当前环境无法访问外部数据库
   - 防火墙限制

3. **数据库配置错误**
   - 主机地址、端口、用户名或密码不正确
   - 数据库不存在或未启动

## 解决方案

### 选项 1: 验证数据库连接信息

请确认以下信息是否正确：

```env
DATABASE_HOST=postgres.mas4dev.xyz
DATABASE_PORT=5434
DATABASE_USER=admin
DATABASE_PASSWORD=admin
DATABASE_NAME=postgres
```

**检查清单：**
- [ ] 数据库服务器正在运行
- [ ] 主机地址和端口正确
- [ ] 用户名和密码正确
- [ ] 数据库已创建
- [ ] 允许远程连接
- [ ] 防火墙规则允许从当前 IP 连接

### 选项 2: 使用本地 PostgreSQL

如果你想使用本地数据库，修改 `.env.local`：

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=portal_blog
```

**安装 PostgreSQL（如果未安装）：**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**
下载并安装：https://www.postgresql.org/download/windows/

**创建数据库：**
```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 在 psql 中运行
CREATE DATABASE portal_blog;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portal_blog TO your_username;
\q
```

### 选项 3: 使用云端 PostgreSQL

**免费选项：**

1. **Supabase** (推荐)
   - 访问：https://supabase.com
   - 创建免费项目
   - 获取数据库连接信息

2. **Neon**
   - 访问：https://neon.tech
   - 免费额度慷慨
   - Serverless PostgreSQL

3. **Railway**
   - 访问：https://railway.app
   - 简单易用
   - 免费试用额度

## 测试数据库连接

配置好数据库后，运行测试脚本：

```bash
npm run db:test
```

成功输出示例：
```
=== Database Connection Test ===

Configuration:
  Host: your-host
  Port: 5432
  Database: your-db

✓ Successfully connected to PostgreSQL!
✓ Database initialized!
```

## 初始化数据库

一旦连接成功，初始化数据库并插入示例数据：

```bash
npm run db:init
```

这会：
1. 创建 `posts` 表
2. 创建必要的索引
3. 插入 4 篇示例文章

## 手动初始化（可选）

如果你想手动创建表，使用以下 SQL：

```sql
CREATE TABLE IF NOT EXISTS posts (
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

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
```

## 验证数据库

使用 psql 或其他数据库工具连接并验证：

```bash
psql -h your-host -p your-port -U your-user -d your-db
```

在 psql 中：
```sql
-- 查看表
\dt

-- 查看文章
SELECT id, title, published FROM posts;

-- 查看文章数量
SELECT COUNT(*) FROM posts;
```

## 运行应用

数据库配置完成后：

```bash
# 开发模式
npm run dev

# 访问应用
# 首页: http://localhost:3000
# 管理: http://localhost:3000/admin
```

## 常见错误

### Error: ECONNREFUSED
数据库服务器未运行或连接被拒绝
- 检查数据库是否启动
- 验证主机和端口

### Error: password authentication failed
用户名或密码错误
- 检查 .env.local 中的凭据
- 确认用户有权限访问数据库

### Error: database does not exist
数据库不存在
- 创建数据库
- 验证数据库名称

### Error: EAI_AGAIN
DNS 解析失败（当前问题）
- 检查主机名是否正确
- 尝试使用 IP 地址
- 检查网络连接

## 需要帮助？

如果仍有问题：

1. 检查数据库服务器日志
2. 验证网络连接
3. 确认防火墙设置
4. 联系数据库管理员

## 下一步

数据库连接成功后：
1. ✅ 运行 `npm run db:init` 初始化数据库
2. ✅ 运行 `npm run dev` 启动应用
3. ✅ 访问 http://localhost:3000
4. ✅ 在 /admin 创建你的第一篇文章
