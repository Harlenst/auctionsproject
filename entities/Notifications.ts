export class Notification {

    id: number;
    userId: number;
    message: string;
    createdAt: Date;
    read: boolean;

    constructor(
        id: number,
        userId: number,
        message: string,
        createdAt: Date,
        read: boolean
    ) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.createdAt = createdAt;
        this.read = read;
    }
}