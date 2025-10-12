# Архитектурная карта проекта SMM

## 📋 Общая архитектура
Проект построен на Clean Architecture с использованием NestJS и следует принципам DDD (Domain-Driven Design).

### Структура слоев:
- **Domain Layer** - бизнес-логика, сущности, репозитории
- **Application Layer** - use cases, сервисы приложения
- **Infrastructure Layer** - реализация репозиториев, API, база данных
- **Shared Layer** - общие компоненты, утилиты, guards, pipes

---

## 🔧 Технологический стек
- **Backend**: NestJS, TypeScript
- **Databases**: MongoDB (чаты, сообщения), PostgreSQL (пользователи, проекты, задачи, группы файлов)
- **ORM**: Prisma (PostgreSQL), Mongoose (MongoDB)
- **Authentication**: JWT
- **File Storage**: Локальное хранилище с chunked upload и группировкой файлов
- **WebSockets**: Socket.io для real-time коммуникации
- **Broadcasting**: Redis для масштабирования WebSocket

---

## 📝 Доменные сущности (Domain Entities)

### 1. User Entity
```typescript
class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private _password: string,
    public readonly name: string,
    public readonly role: string,
    public readonly avatar?: string,
    public readonly isActive: boolean = true,
    public readonly emailVerifiedAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  )

  // Методы
  updatePassword(newPassword: string): void
  isEmailVerified(): boolean
  deactivate(): User
  get permissions(): Permission[]
  hasPermission(permission: Permission): boolean
}
```

### 2. Project Entity
```typescript
class Project {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly ownerId: string,
    public readonly status: ProjectStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly completedAt?: Date
  )

  // Методы
  complete(): Project
  isCompleted(): boolean
  canBeEditedBy(userId: string): boolean
}
```

### 3. Task Entity
```typescript
class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly projectId: string,
    public readonly assigneeId: string,
    public readonly createdBy: string,
    public readonly status: TaskStatus,
    public readonly priority: TaskPriority,
    public readonly dueDate?: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly completedAt?: Date
  )

  // Методы
  complete(): Task
  isCompleted(): boolean
  isOverdue(): boolean
  canBeEditedBy(userId: string): boolean
}
```

### 4. Chat Entity
```typescript
class Chat {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly projectId: string,
    public readonly createdBy: string,
    public readonly status: ChatStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  )

  // Методы
  archive(): Chat
  isArchived(): boolean
}
```

### 5. Message Entity
```typescript
class Message {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly type: MessageType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly fileUrl?: string | null,
    public readonly readBy: string[] = []
  )

  // Методы
  isReadBy(userId: string): boolean
  markAsReadBy(userId: string): Message
}
```

### 6. ChatMember Entity
```typescript
class ChatMember {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly userId: string,
    public readonly role: ChatMemberRole,
    public readonly addedBy: string,
    public readonly joinedAt: Date
  )

  // Методы
  isAdmin(): boolean
  canModerate(): boolean
}
```

### 7. File Entity
```typescript
class FileEntity {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly uploadPath: string,
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly uploadedBy: string,
    public readonly fileGroupId?: string, // Поддержка групп файлов
    public readonly isComplete: boolean = false,
    public readonly chunks: number = 0,
    public readonly totalChunks?: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  )

  // Методы
  markChunkUploaded(): FileEntity
  markComplete(): FileEntity
  belongsToGroup(): boolean
  assignToGroup(fileGroupId: string): FileEntity
  removeFromGroup(): FileEntity
}
```

### 8. FileGroup Entity (НОВАЯ)
```typescript
class FileGroup {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly createdBy: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  )

  // Методы
  canBeEditedBy(userId: string): boolean
  canBeViewedBy(userId: string): boolean
  updateName(newName: string): FileGroup
  updateDescription(newDescription: string): FileGroup
}
```

---

## 🔄 Enums и константы

### Domain Enums
```typescript
enum TaskStatus {
  pending = 'pending',
  on_hold = 'on_hold',
  completed = 'completed'
}

enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  URGENT = 'urgent'
}

enum ProjectRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

enum ChatStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file'
}

enum ChatMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  MODERATOR = 'moderator'
}
```

### Shared Enums
```typescript
enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  CHAT_MEMBER = 'chat_member'
}

enum Permission {
  // Project permissions
  MANAGE_ALL_PROJECTS = 'manage_all_projects',
  MANAGE_ASSIGNED_PROJECTS = 'manage_assigned_projects',
  VIEW_OWN_PROJECTS = 'view_own_projects',
  VIEW_ASSIGNED_PROJECTS = 'view_assigned_projects',
  CREATE_PROJECTS = 'create_projects',
  UPDATE_OWN_PROJECTS = 'update_own_projects',
  DELETE_OWN_PROJECTS = 'delete_own_projects',
  DELETE_PROJECTS = 'delete_projects',

  // Task permissions
  MANAGE_ALL_TASKS = 'manage_all_tasks',
  MANAGE_PROJECT_TASKS = 'manage_project_tasks',
  VIEW_ASSIGNED_TASKS = 'view_assigned_tasks',
  CREATE_TASKS = 'create_tasks',
  UPDATE_TASK_STATUS = 'update_task_status',
  DELETE_TASKS = 'delete_tasks',

  // Chat permissions
  MANAGE_ALL_CHATS = 'manage_all_chats',
  VIEW_PROJECT_CHATS = 'view_project_chats',
  SEND_MESSAGES = 'send_messages',
  DELETE_MESSAGES = 'delete_messages',
  CREATE_CHATS = 'create_chats',
  UPDATE_CHATS = 'update_chats',

  // Media permissions
  VIEW_ALL_MEDIA = 'view_all_media',
  UPLOAD_MEDIA = 'upload_media',
  DELETE_ANY_MEDIA = 'delete_any_media'
}
```

---

## 🗃️ Repository Interfaces

### 1. UserRepository
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: User): Promise<User>
  update(id: string, updates: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
  findByRole(role: string): Promise<User[]>
  findActive(): Promise<User[]>
}
```

### 2. ProjectRepository
```typescript
interface ProjectRepository {
  findById(id: string): Promise<Project | null>
  findByOwnerId(ownerId: string): Promise<Project[]>
  create(project: Project): Promise<Project>
  update(id: string, updates: Partial<Project>): Promise<Project>
  delete(id: string): Promise<void>
  findByStatus(status: ProjectStatus): Promise<Project[]>
  findByMemberId(userId: string): Promise<Project[]>
}
```

### 3. TaskRepository
```typescript
interface TaskRepository {
  findById(id: string): Promise<Task | null>
  findByProjectId(projectId: string): Promise<Task[]>
  findByAssigneeId(assigneeId: string): Promise<Task[]>
  create(task: Task): Promise<Task>
  update(id: string, updates: Partial<Task>): Promise<Task>
  delete(id: string): Promise<void>
  findOverdue(): Promise<Task[]>
  findByStatus(status: TaskStatus): Promise<Task[]>
}
```

### 4. ChatRepository
```typescript
interface ChatRepository {
  findById(id: string): Promise<Chat | null>
  findByProjectId(projectId: string): Promise<Chat[]>
  create(chat: Chat): Promise<Chat>
  update(id: string, updates: Partial<Chat>): Promise<Chat>
  delete(id: string): Promise<void>
  findByMemberId(userId: string): Promise<Chat[]>
}
```

### 5. MessageRepository
```typescript
interface MessageRepository {
  findById(id: string): Promise<Message | null>
  findByChatId(chatId: string, userId?: string, createdAt?: string, sort?: 'asc' | 'desc', per_page?: number): Promise<{
    data: Message[]
    total: number
  }>
  create(message: Message): Promise<Message>
  update(id: string, updates: Partial<Message>): Promise<Message>
  delete(id: string): Promise<void>
  markAsRead(messageId: string, userId: string, chatId: string): Promise<void>
  markAllAsRead(chatId: string, userId: string): Promise<void>
  markMultipleAsRead(messages: Message[], userId: string, chatId: string): Promise<void>
  findUnreadMessages(userId: string): Promise<Message[]>
  countUnreadMessages(chatId: string, userId: string): Promise<number>
  findByIdIn(ids: string[]): Promise<Message[]>
  deleteManyByChatId(chatId: string): Promise<void>
  findLastMessageByChatId(chatId: string): Promise<Message | null>
}
```

### 6. ChatMemberRepository
```typescript
interface ChatMemberRepository {
  findById(id: string): Promise<ChatMember | null>
  findByChatId(chatId: string): Promise<ChatMember[]>
  findByUserId(userId: string): Promise<ChatMember[]>
  create(chatMember: ChatMember): Promise<ChatMember>
  delete(chatId: string, userId: string): Promise<void>
  findByUserAndChat(userId: string, chatId: string): Promise<ChatMember | null>
}
```

### 7. FileRepository (ОБНОВЛЕН)
```typescript
interface FileRepository {
  create(file: FileEntity): Promise<FileEntity>
  findById(id: string): Promise<FileEntity | null>
  findByEntityId(entityType: string, entityId: string): Promise<FileEntity[]>
  findByFileGroupId(fileGroupId: string): Promise<FileEntity[]> // НОВЫЙ
  findByEntityIdWithGroups(entityType: string, entityId: string): Promise<FileEntity[]> // НОВЫЙ
  update(id: string, updates: Partial<FileEntity>): Promise<FileEntity>
  delete(id: string): Promise<void>
  markChunkUploaded(id: string, chunkIndex?: number): Promise<FileEntity>
  markComplete(id: string): Promise<FileEntity>
  assignToGroup(fileId: string, fileGroupId: string): Promise<FileEntity> // НОВЫЙ
  removeFromGroup(fileId: string): Promise<FileEntity> // НОВЫЙ

  getUploadedChunks(id: string): Promise<number[]>
  getMissingChunks(id: string): Promise<number[]>
  isChunkUploaded(id: string, chunkIndex: number): Promise<boolean>
}
```

### 8. FileGroupRepository (НОВЫЙ)
```typescript
interface FileGroupRepository {
  findById(id: string): Promise<FileGroup | null>
  findByEntity(entityType: string, entityId: string): Promise<FileGroup[]>
  findByCreatedBy(createdBy: string): Promise<FileGroup[]>
  create(fileGroup: FileGroup): Promise<FileGroup>
  update(id: string, updates: Partial<FileGroup>): Promise<FileGroup>
  delete(id: string): Promise<void>
  findByName(name: string, entityType: string, entityId: string): Promise<FileGroup | null>
}
```

---

## 🎯 Use Cases (Application Layer)

### Authentication Use Cases
1. **LoginUserUseCase** - аутентификация пользователя
2. **CreateUserUseCase** - регистрация нового пользователя
3. **LogoutUserUseCase** - выход из системы
4. **SocialAuthUseCase** - социальная аутентификация
5. **ConfirmEmailUseCase** - подтверждение email
6. **SendConfirmationCodeUseCase** - отправка кода подтверждения
7. **ResetPasswordUseCase** - сброс пароля

### Project Use Cases
1. **CreateProjectUseCase** - создание проекта
2. **CompleteProjectUseCase** - завершение проекта
3. **GetProjectStatsUseCase** - получение статистики проекта
4. **SendProjectInvitationUseCase** - отправка приглашения в проект
5. **AcceptProjectInvitationUseCase** - принятие приглашения
6. **DeclineProjectInvitationUseCase** - отклонение приглашения

### Task Use Cases
1. **CreateTaskUseCase** - создание задачи
2. **CompleteTaskUseCase** - завершение задачи

### Chat Use Cases
1. **CreateChatUseCase** - создание чата
2. **SendMessageUseCase** - отправка сообщения
3. **AddUserToChatUseCase** - добавление пользователя в чат
4. **RemoveUserFromChatUseCase** - удаление пользователя из чата
5. **MarkMessageAsReadUseCase** - отметка сообщения как прочитанного
6. **MarkAllMessagesAsReadUseCase** - отметка всех сообщений как прочитанных
7. **MarkMultipleMessagesAsReadUseCase** - отметка нескольких сообщений как прочитанных

### File Group Use Cases (НОВЫЕ)
1. **CreateFileGroupUseCase** - создание группы файлов
2. **UpdateFileGroupUseCase** - обновление группы файлов
3. **DeleteFileGroupUseCase** - удаление группы файлов
4. **AssignFileToGroupUseCase** - назначение файла в группу
5. **RemoveFileFromGroupUseCase** - удаление файла из группы

---

## 🌐 API Controllers

### 1. AuthController
```typescript
POST /auth/login - вход в систему
POST /auth/register - регистрация
POST /auth/logout - выход
POST /auth/social - социальная авторизация
POST /auth/confirm-email - подтверждение email
POST /auth/reset-password - сброс пароля
```

### 2. ProjectController
```typescript
GET /projects - список проектов
POST /projects - создание проекта
GET /projects/:id - получение проекта
PUT /projects/:id - обновление проекта
DELETE /projects/:id - удаление проекта
POST /projects/:id/complete - завершение проекта
GET /projects/:id/stats - статистика проекта
```

### 3. TaskController
```typescript
GET /projects/:projectId/tasks - список задач проекта
POST /projects/:projectId/tasks - создание задачи
GET /projects/:projectId/tasks/:id - получение задачи
PUT /projects/:projectId/tasks/:id - обновление задачи
DELETE /projects/:projectId/tasks/:id - удаление задачи
POST /projects/:projectId/tasks/:id/complete - завершение задачи
```

### 4. ChatController
```typescript
GET /projects/:projectId/chats - список чатов проекта
POST /projects/:projectId/chats - создание чата
GET /projects/:projectId/chats/:id - получение чата
GET /projects/:projectId/chats/:id/messages - сообщения чата
POST /projects/:projectId/chats/:id/messages - отправка сообщения
POST /projects/:projectId/chats/:id/members - добавление участника
DELETE /projects/:projectId/chats/:id/members/:userId - удаление участника
GET /projects/:projectId/chats/:id/members - список участников
PUT /projects/:projectId/chats/:id/messages/:messageId/read - отметка как прочитанного
PUT /projects/:projectId/chats/:id/messages/read-all - отметка всех как прочитанных
PUT /projects/:projectId/chats/:id/messages/read-multiple - отметка нескольких как прочитанных
```

### 5. ProjectInvitationController
```typescript
POST /project-invitations - отправка приглашения
GET /project-invitations - список приглашений
POST /project-invitations/:id/accept - принятие приглашения
POST /project-invitations/:id/decline - отклонение приглашения
```

### 6. StorageController (ОБНОВЛЕН)
```typescript
POST /storage/upload - загрузка файла
POST /storage/chunk-upload - загрузка части файла
POST /storage/complete-upload - завершение загрузки
GET /storage/files/:entityType/:entityId - файлы сущности
POST /storage/files/:fileId/assign-to-group - назначение файла в группу (НОВЫЙ)
DELETE /storage/files/:fileId/remove-from-group - удаление файла из группы (НОВЫЙ)
GET /storage/files/group/:groupId - получение файлов группы (НОВЫЙ)
```

### 7. FileGroupController (НОВЫЙ)
```typescript
POST /file-groups - создание группы файлов
GET /file-groups - список групп файлов по сущности
GET /file-groups/:id - получение группы файлов
PUT /file-groups/:id - обновление группы файлов
DELETE /file-groups/:id - удаление группы файлов
```

### 8. HealthController
```typescript
GET /health - проверка состояния системы
```

---

## 📦 DTOs & Resources

### Request DTOs
- **LoginDto**, **RegisterDto**, **SocialAuthDto**
- **CreateProjectDto**, **UpdateProjectDto**
- **CreateTaskDto**, **UpdateTaskDto**
- **CreateChatDto**, **SendMessageDto**, **AddUserToChatDto**
- **SendProjectInvitationDto**, **MarkMessagesAsReadDto**
- **CreateFileDto** (обновлен с поддержкой fileGroupId), **ChunkUploadDto**
- **CreateFileGroupDto**, **UpdateFileGroupDto** (НОВЫЕ)

### Response DTOs
- **LoginResponseDto**, **RegisterResponseDto**
- **ProjectResponseDto**, **ProjectListResponseDto**, **ProjectStatsResponseDto**
- **TaskResponseDto**, **TaskListResponseDto**
- **ChatResponseDto**, **ChatListResponseDto**, **MessageResponseDto**
- **FileCreateResponseDto** (обновлен с fileGroup), **ChunkUploadResponseDto**
- **FileGroupCreateResponseDto**, **FileGroupListResponseDto**, **FileGroupResponseDto** (НОВЫЕ)
- **ErrorResponseDto**

### Resource DTOs
- **ProjectResource**, **TaskResource**, **ChatResource**
- **MessageResource**, **ChatMemberResource**, **ProjectInvitationResource**
- **ProjectMemberResource**, **TaskReminderResource**
- **FileResource** (НОВЫЙ с поддержкой fileGroup), **FileGroupResource** (НОВЫЙ)

---

## 💾 Database Architecture

### MongoDB Collections
- **chats** - основная информация о чатах
- **messages** - сообщения чатов
- **messagereads** - информация о прочтении сообщений
- **chatmembers** - участники чатов
- **projectinvitations** - приглашения в проекты

### PostgreSQL Tables (через Prisma)
- **users** - пользователи системы
- **projects** - проекты
- **tasks** - задачи
- **files** - файлы и медиа (обновлена с fileGroupId)
- **filegroups** - группы файлов (НОВАЯ ТАБЛИЦА)
- **project_members** - участники проектов

### Индексы
```typescript
// MongoDB индексы
MessageSchema.index({ chatId: 1, createdAt: -1 })
MessageReadSchema.index({ messageId: 1, userId: 1 }, { unique: true })
ChatMemberSchema.index({ chatId: 1, userId: 1 }, { unique: true })

// PostgreSQL индексы (через Prisma)
// filegroups.entityType_entityId для быстрого поиска групп по сущности
// files.fileGroupId для поиска файлов в группе
// files.entityType_entityId для поиска файлов по сущности
```

---

## 🔄 Data Flow Examples

### Создание группы файлов и добавление файлов
1. **Controller** получает запрос на создание группы
2. **CreateFileGroupUseCase** проверяет уникальность имени
3. **FileGroupRepository** сохраняет группу в PostgreSQL
4. При загрузке файла указывается fileGroupId в CreateFileDto
5. **ChunkedFileService** создает файл с привязкой к группе
6. **FileRepository** сохраняет файл с fileGroupId

### Получение файлов с информацией о группах
1. **Controller** запрашивает файлы сущности
2. **FileRepository** загружает файлы по entityType/entityId
3. **FileGroupRepository** загружает информацию о группах
4. **FileResource** объединяет данные файлов с информацией о группах
5. Возвращается список файлов с заполненной информацией о группах

---

## 🔑 Key Features

### File Grouping System (НОВАЯ ФУНКЦИОНАЛЬНОСТЬ)
- Организация файлов в логические группы
- Группы привязываются к конкретным сущностям (project, task, etc.)
- Уникальные имена групп в рамках одной сущности
- Управление файлами в группах через API
- Возможность назначать и удалять файлы из групп
- Поддержка в chunked upload системе

### Real-time чаты
- WebSocket соединения
- Broadcasting событий
- Масштабирование через Redis

### Chunked file upload с группировкой
- Загрузка больших файлов по частям
- Возобновляемая загрузка
- Прогресс загрузки
- Организация файлов в группы

### Permission-based access control
- Гибкая система ролей и разрешений
- Policy-based authorization
- Guards для защиты эндпоинтов

### Optimized message reading
- Эффективная загрузка readBy информации
- MongoDB aggregation для производительности
- Умная сортировка (непрочитанные сначала)

---

## 📚 Usage Guidelines

### При добавлении новой функциональности:

1. **Создайте доменную сущность** в `domain/entities/`
2. **Определите репозиторий** в `domain/repositories/`
3. **Реализуйте репозиторий** в `infrastructure/repositories/`
4. **Создайте Use Case** в `application/use-cases/`
5. **Добавьте контроллер** в `infrastructure/api/controllers/`
6. **Создайте DTOs** для запросов и ответов
7. **Добавьте политики безопасности** если нужно
8. **Создайте события** для интеграции

### При работе с группами файлов:
- Используйте уникальные имена групп в рамках одной сущности
- Проверяйте права доступа к группе при манипуляциях с файлами
- Используйте FileResource для включения информации о группе в ответы
- При создании файла указывайте fileGroupId если файл должен принадлежать группе

### При работе с permissions:
- Используйте `@RequireAnyPermission()` декоратор
- Проверяйте права через Policy классы
- Всегда валидируйте доступ в Use Cases

### При работе с чатами:
- Используйте оптимизированные запросы для сообщений
- Обрабатывайте MongoDB duplicate key errors
- Используйте broadcasting для real-time обновлений

### При работе с файлами:
- Используйте chunked upload для больших файлов
- Связывайте файлы с сущностями через entityType/entityId
- Организуйте файлы в группы для лучшего UX
- Очищайте файлы при удалении сущностей
