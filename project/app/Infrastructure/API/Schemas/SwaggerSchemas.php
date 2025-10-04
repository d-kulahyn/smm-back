<?php

namespace App\Infrastructure\API\Schemas;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="Project",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Marketing Campaign Q4"),
 *     @OA\Property(property="description", type="string", example="Social media marketing campaign for Q4 2025"),
 *     @OA\Property(property="status", type="string", enum={"active", "on_hold", "on_hold"}, example="active"),
 *     @OA\Property(property="customer_id", type="integer", example=1),
 *     @OA\Property(property="start_date", type="string", format="date", example="2025-09-21"),
 *     @OA\Property(property="end_date", type="string", format="date", example="2025-12-31"),
 *     @OA\Property(property="budget", type="number", format="float", example=15000.50),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="is_completed", type="boolean", example=false),
 *     @OA\Property(property="tasks", type="array", @OA\Items(ref="#/components/schemas/Task")),
 *     @OA\Property(property="members", type="array", @OA\Items(ref="#/components/schemas/ProjectMember")),
 *     @OA\Property(property="invitations", type="array", @OA\Items(ref="#/components/schemas/ProjectInvitation")),
 *     @OA\Property(property="chats", type="array", @OA\Items(ref="#/components/schemas/Chat")),
 *     @OA\Property(property="stats", ref="#/components/schemas/ProjectStats"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-09-21T10:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-09-21T10:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="Task",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="project_id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Create social media posts"),
 *     @OA\Property(property="description", type="string", example="Design and create posts for Instagram and Facebook"),
 *     @OA\Property(property="status", type="string", enum={"pending", "in_progress", "on_hold", "cancelled"}, example="pending"),
 *     @OA\Property(property="priority", type="string", enum={"low", "medium", "high", "urgent"}, example="high"),
 *     @OA\Property(property="assigned_to", type="integer", example=2),
 *     @OA\Property(property="due_date", type="string", format="date", example="2025-09-30"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-09-21T10:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="ProjectMember",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="project_id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="role", type="string", enum={"owner", "manager", "member", "viewer"}, example="manager"),
 *     @OA\Property(property="permissions", type="array", @OA\Items(type="string"), example={"read", "write", "manage_members"}),
 *     @OA\Property(property="joined_at", type="string", format="date-time", example="2025-09-21T10:00:00Z"),
 *     @OA\Property(property="user", ref="#/components/schemas/User")
 * )
 *
 * @OA\Schema(
 *     schema="ProjectInvitation",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="project_id", type="integer", example=1),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="role", type="string", enum={"manager", "member", "viewer"}, example="member"),
 *     @OA\Property(property="status", type="string", enum={"pending", "accepted", "declined", "expired"}, example="pending"),
 *     @OA\Property(property="token", type="string", example="abc123..."),
 *     @OA\Property(property="expires_at", type="string", format="date-time", example="2025-09-28T10:00:00Z"),
 *     @OA\Property(property="invited_by_user", ref="#/components/schemas/User")
 * )
 *
 * @OA\Schema(
 *     schema="Chat",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="project_id", type="integer", example=1),
 *     @OA\Property(property="customer_id", type="integer", example=2),
 *     @OA\Property(property="message", type="string", example="Hello team! Let's discuss the project requirements."),
 *     @OA\Property(property="message_type", type="string", enum={"text", "voice", "file", "image"}, example="text"),
 *     @OA\Property(property="sender_type", type="string", enum={"customer", "admin"}, example="customer"),
 *     @OA\Property(property="file_path", type="string", example="http://localhost/storage/files/document.pdf"),
 *     @OA\Property(property="is_voice_message", type="boolean", example=false),
 *     @OA\Property(property="customer", ref="#/components/schemas/User"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-09-21T10:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="avatar", type="string", example="http://localhost/storage/avatars/avatar.jpg"),
 *     @OA\Property(property="role", type="string", example="project_manager")
 * )
 *
 * @OA\Schema(
 *     schema="ProjectStats",
 *     type="object",
 *     @OA\Property(property="total_tasks", type="integer", example=15),
 *     @OA\Property(property="completed_tasks", type="integer", example=8),
 *     @OA\Property(property="pending_tasks", type="integer", example=5),
 *     @OA\Property(property="overdue_tasks", type="integer", example=2),
 *     @OA\Property(property="completion_percentage", type="number", format="float", example=53.33)
 * )
 *
 * @OA\Schema(
 *     schema="PaginationMeta",
 *     type="object",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="last_page", type="integer", example=5),
 *     @OA\Property(property="per_page", type="integer", example=10),
 *     @OA\Property(property="total", type="integer", example=50),
 *     @OA\Property(property="from", type="integer", example=1),
 *     @OA\Property(property="to", type="integer", example=10),
 *     @OA\Property(property="has_more_pages", type="boolean", example=true)
 * )
 *
 * @OA\Schema(
 *     schema="Activity",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="type", type="string", example="task_created"),
 *     @OA\Property(property="description", type="string", example="New task was created"),
 *     @OA\Property(property="status", type="string", enum={"pending", "read", "archived"}, example="pending"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-09-21T10:00:00Z")
 * )
 *
 * @OA\Schema(
 *     schema="ChatMember",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="chat_id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="role", type="string", enum={"admin", "member", "viewer"}, example="member"),
 *     @OA\Property(property="permissions", type="array", @OA\Items(type="string"), example={"read", "write"}),
 *     @OA\Property(property="joined_at", type="string", format="date-time", example="2025-09-27T10:00:00Z"),
 *     @OA\Property(property="user", ref="#/components/schemas/User"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-09-27T10:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-09-27T10:00:00Z")
 * )
 */
class SwaggerSchemas
{
}
