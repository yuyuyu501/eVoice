# eVoice

语音交互应用，基于 FastAPI 后端与 React 前端。

## 项目结构

```
eVoice/
├── backend/          # FastAPI 后端
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/         # React + Vite 前端
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── start.ps1         # Windows 启动脚本
├── start.sh          # Linux/macOS 启动脚本
└── README.md
```

## 启动方式

### 安装依赖

```bash
# 后端
pip install -r backend/requirements.txt

# 前端
cd frontend && npm install && cd ..
```

### 运行

**Windows:**
```powershell
.\start.ps1
```

**Linux/macOS:**
```bash
./start.sh
```

或手动分别启动：

```bash
# 后端 (端口 8010)
uvicorn backend.main:app --reload --port 8010

# 前端 (端口 5173)
cd frontend && npm run dev
```

- 前端: http://localhost:5173
- 后端: http://localhost:8010
