export class AuctionStatus {

    private value: string;

    constructor(value: string) {

        const validStatuses = [
            'open',
            'closed',
            'cancelled',
            'deserted'
        ];

        if (!validStatuses.includes(value)) {
            throw new Error('Invalid auction status');
        }

        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}