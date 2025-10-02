# 🐳 Automatic Docker Rebuild on Git Pull

This system automatically rebuilds Docker containers when you run `git pull` and there are changes in Docker files in the project.

## 📋 What's Installed

### 1. Git Hook (post-merge)
- **File**: `.git/hooks/post-merge`
- **Function**: Automatically runs after each `git pull`
- **Logic**: Checks for changes in Docker files and triggers rebuild only when necessary

### 2. Rebuild Scripts
- **`scripts/docker-rebuild.sh`** - Full rebuild of all containers
- **`scripts/docker-smart-rebuild.sh`** - Smart rebuild of only changed services

### 3. Makefile
- **File**: `Makefile`
- **Function**: Convenient commands for Docker management

## 🚀 How It Works

1. **Run `git pull`**
2. **Git hook automatically starts**
3. **Changes are checked in files:**
   - `Dockerfile`
   - `docker-compose.yml` 
   - `.dockerignore`
4. **If there are changes** - automatic rebuild starts
5. **If no changes** - rebuild is skipped

## 📝 Available Commands

### Main commands via Makefile:
```bash
make help              # Show all available commands
make docker-build      # Build images
make docker-up         # Start containers
make docker-down       # Stop containers
make docker-rebuild    # Full rebuild
make docker-status     # Container status
make docker-logs       # Show logs
make docker-clean      # Clean unused resources
```

### Direct commands:
```bash
# Full rebuild
./scripts/docker-rebuild.sh

# Smart rebuild (only changed services)
./scripts/docker-smart-rebuild.sh
```

## 🎯 Monitored Services

- **split_trip_web** - on changes in `docker/web/`
- **split_trip_swoole** - on changes in `docker/swoole/` or `project/`
- **split_trip_node** - on changes in `docker/node/` or `socket-server/`
- **split_trip_db_pg** - on changes in `docker/pg/`

## ⚙️ Setup

The system is already configured and ready to use! Git hook will automatically activate on the next `git pull`.

## 🔧 Manual Control

To disable automatic rebuild:
```bash
# Temporarily disable
chmod -x .git/hooks/post-merge

# Enable back
chmod +x .git/hooks/post-merge

# Remove completely
rm .git/hooks/post-merge
```

## 📊 Logging

All actions are logged to console with colorful emojis for easy process tracking.

## 🆘 Troubleshooting

If something goes wrong:
```bash
# Check container status
make docker-status

# View logs
make docker-logs

# Force rebuild
make docker-rebuild-force
```

## 💡 Tips

- Use `make docker-status` to check container state
- Try `make docker-clean` first when having issues
- Logs help find problems: `make docker-logs`
- For emergency cases use `make docker-rebuild-force`
