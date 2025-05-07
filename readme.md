### backend folder structure

```
src/
├── auth/                           # Authentication module
│   ├── dto/                        # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   ├── guards/                     # Authentication/Authorization guards
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   ├── auth.controller.ts          # REST endpoints for auth
│   ├── auth.service.ts             # Auth business logic
│   ├── auth.module.ts              # Module definition
│   ├── jwt.strategy.ts             # JWT passport strategy
├── users/                          # User management module
│   ├── dto/                        # Data Transfer Objects
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   ├── entities/                   # TypeORM entities
│   │   ├── user.entity.ts
│   ├── repository/                 # Custom repository
│   │   ├── user.repository.ts
│   ├── users.controller.ts         # REST endpoints for users
│   ├── users.service.ts            # User business logic
│   ├── users.module.ts             # Module definition
├── channels/                       # Channel management module
│   ├── dto/                        # Data Transfer Objects
│   │   ├── create-channel.dto.ts
│   │   ├── join-channel.dto.ts
│   ├── entities/                   # TypeORM entities
│   │   ├── channel.entity.ts
│   │   ├── channel-member.entity.ts
│   ├── repository/                 # Custom repository
│   │   ├── channel.repository.ts
│   ├── channels.controller.ts      # REST endpoints for channels
│   ├── channels.service.ts         # Channel business logic
│   ├── channels.module.ts          # Module definition
├── messages/                       # Messaging module
│   ├── dto/                        # Data Transfer Objects
│   │   ├── create-message.dto.ts
│   ├── entities/                   # TypeORM entities
│   │   ├── message.entity.ts
│   ├── repository/                 # Custom repository
│   │   ├── message.repository.ts
│   ├── messages.controller.ts      # REST endpoints for messages
│   ├── messages.service.ts         # Messaging business logic
│   ├── messages.module.ts          # Module definition
├── notifications/                  # Notifications module
│   ├── dto/                        # Data Transfer Objects
│   │   ├── create-notification.dto.ts
│   ├── entities/                   # TypeORM entities
│   │   ├── notification.entity.ts
│   ├── repository/                 # Custom repository
│   │   ├── notification.repository.ts
│   ├── notifications.controller.ts # REST endpoints for notifications
│   ├── notifications.service.ts    # Notification business logic
│   ├── notifications.module.ts     # Module definition
├── websocket/                      # WebSocket module for real-time
│   ├── websocket.gateway.ts        # WebSocket event handlers
│   ├── websocket.service.ts        # WebSocket business logic
│   ├── websocket.module.ts         # Module definition
├── common/                         # Shared utilities and enums
│   ├── enums/                      # Application-wide enums
│   │   ├── role.enum.ts
│   │   ├── channel-type.enum.ts
│   │   ├── message-status.enum.ts
│   │   ├── notification-type.enum.ts
│   ├── interfaces/                 # Shared interfaces
│   │   ├── socket-user.interface.ts
│   ├── decorators/                 # Custom decorators
│   │   ├── roles.decorator.ts
│   ├── config/                     # Configuration files
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
├── app.module.ts                   # Root module
├── main.ts                         # Application bootstrap
.env                                # Environment variables
.env.example                        # Example env file
tsconfig.json                       # TypeScript configuration
```