export class FileGroup {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly createdBy: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  canBeEditedBy(userId: string): boolean {
    return this.createdBy === userId;
  }

  canBeViewedBy(userId: string): boolean {
    // Базовая логика - создатель может просматривать
    // Может быть расширена в будущем для проверки доступа к entityType/entityId
    return this.createdBy === userId;
  }

  updateName(newName: string): FileGroup {
    return new FileGroup(
      this.id,
      newName,
      this.description,
      this.entityType,
      this.entityId,
      this.createdBy,
      this.createdAt,
      new Date(),
    );
  }

  updateDescription(newDescription: string): FileGroup {
    return new FileGroup(
      this.id,
      this.name,
      newDescription,
      this.entityType,
      this.entityId,
      this.createdBy,
      this.createdAt,
      new Date(),
    );
  }
}
