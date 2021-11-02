export class ReservableInfo {
    reservable: boolean;
    optionDate: Date | null | undefined;
}

export class Reservation {
    bookingNumber: string;
    reservableInfo: ReservableInfo;
    beginDate: Date;
    endDate: Date;
    leaderName: string;
    serviceName: string;
    confirmationStatus: number;
}