/**
 * Concierge JS
 *
 * This file contains simulation code for the Concierge hotel management simulation
 * game. Concierge is an browser game where the player manages a hotel and has to
 * address incoming requests from guests.
 *
 */

export const HOTEL_REPUTATION_MAX = 100;
export const HOTEL_REPUTATION_MIN = 0;
export const GUEST_HAPPINESS_MAX = 100;
export const GUEST_HAPPINESS_MIN = 0;

export type GameConfig = {
    numRooms?: number;
};

/** The entry class the manages a game of Concierge */
export class ConciergeGame {
    private m_currentDay: number;
    private m_hotel: Hotel;
    private m_guests: Guest[];
    private m_requestQueue: GuestRequest[];
    private m_futureReservations: Reservation[];

    constructor(gameConfig?: GameConfig) {
        this.m_currentDay = 0;
        this.m_hotel = new Hotel('Hotel', gameConfig?.numRooms ?? 25);
        this.m_guests = [];
        this.m_requestQueue = [];
        this.m_futureReservations = [];

        let guestGenerator = new GuestGenerator();

        for (let i = 0; i < 100; i++) {
            let guest = guestGenerator.GenerateGuest(i, this);
            this.m_guests.push(guest);
        }
    }

    /**
     * Get the game's hotel instance
     */
    get Hotel(): Hotel {
        return this.m_hotel;
    }

    /**
     * Get the current day
     */
    get CurrentDay(): number {
        return this.m_currentDay;
    }

    /**
     * Get the requests for this day.
     */
    GetRequests(): GuestRequest[] {
        return this.m_requestQueue;
    }

    GetGuest(uid: number): Guest {
        for (const guest of this.m_guests) {
            if (guest.UID === uid) {
                return guest;
            }
        }
        throw new Error(`No guest found with uid: ${uid}.`);
    }

    /**
     * Add a new request
     * @param request
     */
    AddRequest(request: GuestRequest): void {
        this.m_requestQueue.push(request);
    }

    AddFutureReservation(reservation: Reservation): void {
        this.m_futureReservations.push(reservation);
    }

    /** Tick the game simulation by one time step */
    Tick() {
        this.m_currentDay += 1;
        this.m_requestQueue = [];

        for (let guest of this.m_guests) {
            guest.Tick();
        }

        // Convert reservations that start on the current day to check-in requests
        for (let i = this.m_futureReservations.length - 1; i >= 0; i--) {
            const reservation = this.m_futureReservations[i];
            if (reservation.CheckInDay === this.CurrentDay) {
                this.m_requestQueue.push(
                    new CheckInRequest(
                        reservation.Guest,
                        reservation.RoomQuality,
                        reservation.CheckInDay,
                        reservation.CheckOutDay,
                        true
                    )
                );
            }
        }
    }
}

export class Hotel {
    private m_name: string;
    private m_numRooms: number;
    private m_rooms: Array<Room>;
    private m_reputation: number;

    constructor(name: string, numRooms: number) {
        this.m_name = name;
        this.m_numRooms = numRooms;
        this.m_rooms = new Array(numRooms);
        for (let i = 0; i < numRooms; i++) {
            this.m_rooms.push(new Room(i + 1, RoomQualityLevel.BASIC));
        }
        this.m_reputation = 50;
    }

    /**
     * Get the hotel's names
     */
    get Name(): string {
        return this.m_name;
    }

    /**
     * The number of rooms in the hotel
     */
    get NumRooms(): number {
        return this.m_numRooms;
    }

    /**
     * The hotel reputation score
     */
    get Reputation(): number {
        return this.m_reputation;
    }

    /**
     * Set the hotel's name
     */
    set Name(value: string) {
        this.m_name = value;
    }

    /**
     * Set the hotel reputation score
     */
    set Reputation(value: number) {
        this.m_reputation = Math.max(
            HOTEL_REPUTATION_MIN,
            Math.min(HOTEL_REPUTATION_MAX, value)
        );
    }

    /**
     * Get the room with the given number
     */
    GetRoom(roomNumber: number): Room {
        return this.m_rooms[roomNumber - 1];
    }

    /**
     * Check if there are any vacant rooms of a given quality or better
     * @param roomQuality
     * @returns
     */
    HasVacantRoom(roomQuality: RoomQualityLevel): boolean {
        for (const room of this.m_rooms) {
            if (room.Quality >= roomQuality && !room.IsOccupied) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get a vacant rooms of a given type
     * @param roomQuality
     */
    GetVacantRooms(roomQuality: RoomQualityLevel): Room[] {
        const rooms: Room[] = [];

        for (const room of this.m_rooms) {
            if (room.Quality >= roomQuality && !room.IsOccupied) {
                rooms.push(room);
            }
        }

        return rooms;
    }

    /**
     * Check a guest out of the hotel
     */
    CheckOutGuest(guest: Guest): void {
        if (guest.Room === null)
            throw new Error('Cannot check-out guest who does not have a room.');

        guest.Room.Guest = null;
        guest.Room = null;
        guest.Reservation = null;
    }

    /**
     * Check a guest out of the hotel
     */
    CheckInGuest(guest: Guest, room: Room): void {
        room.Guest = guest;
        guest.Room = room;
    }

    EvictGuest(guest: Guest): void {
        this.CheckOutGuest(guest);
        this.Reputation -= 3;
    }
}

/**
 * An enumeration of the various room quality levels
 */
export enum RoomQualityLevel {
    BASIC,
    PLUS,
    DELUXE,
}

/**
 * The names of the room quality levels
 */
export const RoomQualityLevelNames = Object.freeze(['Basic', 'Plus', 'Deluxe']);

/**
 * Choose a random room quality
 * @returns
 */
function ChooseRandomRoomQuality(): RoomQualityLevel {
    const levels = [
        RoomQualityLevel.BASIC,
        RoomQualityLevel.PLUS,
        RoomQualityLevel.DELUXE,
    ];
    return levels[Math.floor(Math.random() * levels.length)];
}

/**
 * Characters staying in the hotel are assigned to rooms
 */
export class Room {
    private m_roomNumber: number;
    private m_quality: RoomQualityLevel;
    private m_guest: Guest | null;

    constructor(roomNumber: number, roomQuality: RoomQualityLevel) {
        this.m_roomNumber = roomNumber;
        this.m_quality = roomQuality;
        this.m_guest = null;
    }

    /**
     * The room number
     */
    get RoomNumber(): number {
        return this.m_roomNumber;
    }

    /**
     * The quality level of the room
     */
    get Quality(): RoomQualityLevel {
        return this.m_quality;
    }

    /**
     * The name of the current room quality
     */
    get QualityName(): string {
        return RoomQualityLevelNames[this.m_quality];
    }

    /**
     * Is the room occupied
     */
    get IsOccupied(): boolean {
        return this.m_guest != null;
    }

    /**
     * The guest assigned to this room
     */
    get Guest(): Guest | null {
        return this.m_guest;
    }

    /**
     * Set the guest for the room
     */
    set Guest(guest: Guest | null) {
        this.m_guest = guest;
    }
}

/**
 * An enumeration of the various guest membership levels
 */
export enum MembershipLevel {
    NOT_REGISTERED,
    BASIC,
    PLUS,
    ELITE,
}

/**
 * The names of the guest membership levels
 */
export const MembershipLevelNames = Object.freeze([
    'Not Registered',
    'Basic',
    'Plus',
    'Elite',
]);

/**
 * Choose a random membership level
 * @returns
 */
function ChooseRandomRoomMembershipLevel(): MembershipLevel {
    const levels = [
        MembershipLevel.NOT_REGISTERED,
        MembershipLevel.BASIC,
        MembershipLevel.PLUS,
        MembershipLevel.ELITE,
    ];
    return levels[Math.floor(Math.random() * levels.length)];
}

/**
 * Information about someone current or past guest of the hotel
 */
export class Guest {
    private m_uid: number;
    private m_name: string;
    private m_membershipLevel: MembershipLevel;
    private m_timesStayed: number;
    private m_room: Room | null;
    private m_game: ConciergeGame;
    private m_reservation: Reservation | null;
    private m_reappearanceCooldown: number;

    constructor(
        uid: number,
        name: string,
        membershipLevel: MembershipLevel,
        timesStayed: number,
        game: ConciergeGame
    ) {
        this.m_uid = uid;
        this.m_name = name;
        this.m_membershipLevel = membershipLevel;
        this.m_timesStayed = timesStayed;
        this.m_room = null;
        this.m_game = game;
        this.m_reservation = null;
        this.m_reappearanceCooldown = Math.floor(Math.random() * 10);
    }

    /**
     * The guest's UID
     */
    get UID(): number {
        return this.m_uid;
    }

    /**
     * The guest's name
     */
    get Name(): string {
        return this.m_name;
    }

    /**
     * The guest's current membership level
     */
    get MembershipLevel(): MembershipLevel {
        return this.m_membershipLevel;
    }

    /**
     * The name of the guest's membership level
     */
    get MembershipLevelName(): string {
        return MembershipLevelNames[this.m_membershipLevel];
    }

    /**
     * How many times has this guest stayed at the hotel
     */
    get TimesStayed(): number {
        return this.m_timesStayed;
    }

    /**
     * Is this guest currently staying at the hotel
     */
    get IsCurrentGuest(): boolean {
        return this.m_room != null;
    }

    /**
     * Get the room this guest is staying in
     */
    get Room(): Room | null {
        return this.m_room;
    }

    /**
     * Get the game teh guest belongs to
     */
    get Game(): ConciergeGame {
        return this.m_game;
    }

    /**
     * The guests reservation
     */
    get Reservation(): Reservation | null {
        return this.m_reservation;
    }

    /**
     * Set the guest's room
     */
    set Room(room: Room | null) {
        this.m_room = room;
    }

    /**
     * Set the guests reservation
     */
    set Reservation(value: Reservation | null) {
        this.m_reservation = value;
    }

    /**
     * Increment the number of times this guest has stayed at the hotel
     */
    IncrementTimesStayed(): void {
        this.m_timesStayed += 1;
    }

    /**
     * Upgrade the guests membership level
     */
    UpgradeMembership(): void {
        if (this.m_membershipLevel < MembershipLevel.ELITE) {
            this.m_membershipLevel += 1;
        }
    }

    /**
     * Tick this guest (add requests to the request queue)
     */
    Tick(): void {
        if (
            this.m_room != null &&
            this.m_reservation != null &&
            this.m_game.CurrentDay === this.m_reservation.CheckOutDay
        ) {
            // Check this guest out of their room
            this.m_reappearanceCooldown = 5 + Math.floor(Math.random() * 10);

            this.m_game.Hotel.CheckOutGuest(this);
        }

        // Collection of requests to choose from
        const requestChoices: GuestRequest[] = [];

        // This character is not an active guest and does not have a reservation.
        // They can either create a new reservation for a future date or
        // Attempt to check-into the hotel without one
        if (this.m_room === null && this.m_reservation === null) {
            // Decrement cooldown
            if (this.m_reappearanceCooldown > 0) {
                this.m_reappearanceCooldown -= 1;
            }

            if (this.m_reappearanceCooldown > 0) return;

            // Request to check in
            if (Math.random() < 0.4) {
                // choose a date 3 days to 2 weeks in the future
                const checkInDay =
                    this.m_game.CurrentDay + 3 + Math.floor(Math.random() * 15);

                // checkout between 1 - 7 days
                const checkOutDay =
                    checkInDay + 1 + Math.floor(Math.random() * 7);

                requestChoices.push(
                    new ReservationRequest(
                        this,
                        ChooseRandomRoomQuality(),
                        checkInDay,
                        checkOutDay
                    )
                );
            }

            if (Math.random() < 0.4) {
                // try check in today
                const checkInDay = this.m_game.CurrentDay;

                // checkout between 1 - 7 days
                const checkOutDay =
                    checkInDay + 1 + Math.floor(Math.random() * 7);

                requestChoices.push(
                    new CheckInRequest(
                        this,
                        ChooseRandomRoomQuality(),
                        checkInDay,
                        checkOutDay,
                        false
                    )
                );
            }
        }

        if (
            this.m_membershipLevel >= MembershipLevel.ELITE &&
            this.m_room != null &&
            this.m_room.Quality === RoomQualityLevel.BASIC
        ) {
            // Request an upgrade
        }

        if (
            this.m_room != null &&
            this.m_room.Quality === RoomQualityLevel.BASIC
        ) {
            // Ask for something to get fixed
        }

        if (
            this.m_room != null &&
            this.m_room.Quality === RoomQualityLevel.DELUXE
        ) {
            // Ask for spa service
        }

        if (this.m_membershipLevel === MembershipLevel.ELITE) {
            // Ask for something outrageous
        }

        if (requestChoices.length > 0) {
            const chosenRequest =
                requestChoices[
                    Math.floor(Math.random() * requestChoices.length)
                ];

            this.m_game.AddRequest(chosenRequest);
        }
    }
}

export class Reservation {
    protected m_guest: Guest;
    protected m_roomQuality: RoomQualityLevel;
    protected m_checkInDay: number;
    protected m_checkOutDay: number;

    constructor(
        guest: Guest,
        roomQuality: RoomQualityLevel,
        checkInDay: number,
        checkOutDay: number
    ) {
        this.m_guest = guest;
        this.m_roomQuality = roomQuality;
        this.m_checkInDay = checkInDay;
        this.m_checkOutDay = checkOutDay;
    }

    get Guest(): Guest {
        return this.m_guest;
    }

    get RoomQuality(): RoomQualityLevel {
        return this.m_roomQuality;
    }

    get CheckInDay(): number {
        return this.m_checkInDay;
    }

    get CheckOutDay(): number {
        return this.CheckOutDay;
    }
}

/**
 * A request made by a guest/customer
 *
 * During the game the player has to decide to accept or reject various requests.
 * This class encapsulates all the information about an instance of a request and
 * provides a common interface for interacting with requests.
 */
export abstract class GuestRequest {
    protected m_guest: Guest;
    protected m_requestType: string;
    protected m_requestText: string;
    protected m_acceptText: string;
    protected m_declineText: string;

    constructor(
        guest: Guest,
        requestType: string,
        requestText: string,
        acceptText: string,
        declineText: string
    ) {
        this.m_guest = guest;
        this.m_requestType = requestType;
        this.m_requestText = requestText;
        this.m_acceptText = acceptText;
        this.m_declineText = declineText;
    }

    /** The guest that initiated the request */
    get Guest(): Guest {
        return this.m_guest;
    }

    /**
     * Get the type of request
     */
    get RequestType(): string {
        return this.m_requestType;
    }

    /**
     * Get the text explaining this request
     */
    get RequestText(): string {
        return this.m_requestText;
    }

    /**
     * Get the text to display on the accept button
     */
    get AcceptText(): string {
        return this.m_acceptText;
    }

    /**
     * Get the text to display on the decline button
     */
    get DeclineText(): string {
        return this.m_declineText;
    }

    /**
     * Check if the player can accept this request
     */
    abstract CanAccept(): boolean;

    /**
     * Accept the request
     */
    abstract Accept(): void;

    /**
     * Decline the request
     */
    abstract Decline(): void;
}

/**
 * Built in surnames for guests
 */
export const GUEST_SURNAMES = Object.freeze([
    'Dorning',
    'Lampkins',
    'Rockwood',
    'Vice',
    'Lyness',
    'Bludworth',
    'Gooder',
    'Pattison',
    'Speller',
    'Alkins',
    'Claytor',
    'Wand',
    'Safford',
    'Shute',
    'Beeton',
    'Hendrickson',
    'Rouse',
    'Clymer',
    'Willmott',
    'Bankes',
    'Higley',
    'Bowne',
    'Northway',
    'Seller',
    'Holway',
    'Shackleton',
    'Lemmond',
    'Pallett',
    'Leamons',
    'Roderick',
    'Pennings',
    'Gibbon',
    'Shattuck',
    'Wooldridge',
    'Sumter',
    'Trainer',
    'Huntington',
    'Haxby',
    'Hutt',
    'Colman',
    'Boord',
    'Jefferys',
    'Holeman',
    'Pringle',
    'Southwood',
    'Moak',
    'Rawley',
    'Fly',
    'Mugge',
    'Bellus',
    'Trevett',
    'Atwell',
    'Arnott',
    'Hipkins',
    'Heddings',
    'Yeatman',
    'Haggett',
    'Tew',
    'Coxey',
    'Downham',
    'Titley',
    'Ernest',
    'Pilgram',
    'Buzzard',
    'Broadaway',
    'Noe',
    'Dexter',
    'Hunnicutt',
    'Lester',
    'Pullen',
    'Rutland',
    'Dickman',
    'Pride',
    'Godel',
    'Birkes',
    'Kimm',
    'Liggett',
    'Meachum',
    'Allsup',
    'Havis',
    'Cleaton',
    'Neave',
    'Spray',
    'Tuck',
    'Flair',
    'Carpenter',
    'Boram',
    'Flesher',
    'Iams',
    'Devereux',
    'Bayman',
    'Goodwill',
    'Odham',
    'Duckett',
    'Hulse',
    'Rhoades',
    'Claypole',
    'Harsha',
    'Braddy',
    'Masser',
    'Marking',
    'Durall',
    'Throop',
    'Henton',
    'Crutcher',
    'Stanwick',
    'Harlan',
    'Ayling',
    'Thatch',
    'Weaks',
    'Purington',
    'Gaskin',
    'Grimmett',
    'Crow',
    'Gorrell',
    'Wayland',
    'Harlowe',
    'Lyford',
    'Letcher',
    'Howden',
    'Dison',
    'Knuckles',
    'Gibb',
    'Teel',
    'Haseley',
    'Paske',
    'Britcher',
    'Theodore',
    'Angel',
    'Keller',
    'Fugit',
    'Fleeman',
    'Mitchelson',
    'Grand',
    'Ryals',
    'Fall',
    'Clement',
    'Grahm',
    'Stokely',
    'Farrer',
    'Swindlehurst',
    'Harlin',
    'Prim',
    'Eddings',
    'Scarbro',
    'Musto',
    'Hodgins',
    'Flemmings',
    'Cornett',
    'Rover',
]);

/**
 * Cache of the number of surnames
 */
export const GUEST_SURNAMES_LENGTH = GUEST_SURNAMES.length;

/** Generates new guests to join the game */
export class GuestGenerator {
    /**
     * Create a new guest
     */
    GenerateGuest(uid: number, game: ConciergeGame) {
        return new Guest(
            uid,
            `${this.GenerateFirstInitial()}. ${this.GenerateLastName()}`,
            ChooseRandomRoomMembershipLevel(),
            Math.floor(Math.random() * 30),
            game
        );
    }

    /**
     * Generate the first initial for a character's name
     * @return {string}
     */
    GenerateFirstInitial() {
        const options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const firstInitial = options.charAt(
            Math.floor(Math.random() * options.length)
        );

        return firstInitial;
    }

    /**
     * Generate a last name for the character
     * @returns {string}
     */
    GenerateLastName() {
        const last_name =
            GUEST_SURNAMES[Math.floor(Math.random() * GUEST_SURNAMES_LENGTH)];

        return last_name;
    }
}

export class CheckInRequest extends GuestRequest {
    protected m_roomQuality: RoomQualityLevel;
    protected m_checkInDay: number;
    protected m_checkOutDay: number;
    protected m_hasReservation: boolean;

    constructor(
        guest: Guest,
        roomQuality: RoomQualityLevel,
        checkInDay: number,
        checkOutDay: number,
        hasReservation: boolean
    ) {
        super(
            guest,
            'Check-In',
            `${guest.Name} would like to check into a ` +
                `${RoomQualityLevelNames[roomQuality]} room ` +
                `from day ${checkInDay} to ${checkOutDay}.`,
            'Accept',
            'Decline'
        );
        this.m_roomQuality = roomQuality;
        this.m_checkInDay = checkInDay;
        this.m_checkOutDay = checkOutDay;
        this.m_hasReservation = hasReservation;
    }

    CanAccept(): boolean {
        return false;
    }

    Accept(): void {
        const game = this.m_guest.Game;

        if (!this.m_hasReservation) {
            game.Hotel.Reputation = game.Hotel.Reputation + 8;

            const roomQuality =
                this.m_guest.Reservation?.RoomQuality ?? RoomQualityLevel.BASIC;

            this.m_guest.Reservation = new Reservation(
                this.m_guest,
                roomQuality,
                this.m_checkInDay,
                this.m_checkOutDay
            );
        } else {
            game.Hotel.Reputation = game.Hotel.Reputation + 2;
        }

        const reservation = this.m_guest.Reservation;

        if (reservation === null)
            throw new Error('Guest missing reservation for checkin');

        const rooms = game.Hotel.GetVacantRooms(reservation.RoomQuality);

        game.Hotel.CheckInGuest(
            this.m_guest,
            rooms[Math.floor(Math.random() * rooms.length)]
        );
    }

    Decline(): void {
        const game = this.m_guest.Game;

        if (this.m_hasReservation) {
            game.Hotel.Reputation = game.Hotel.Reputation - 8;

            switch (this.m_guest.MembershipLevel) {
                case MembershipLevel.BASIC:
                    game.Hotel.Reputation = game.Hotel.Reputation - 3;
                    break;
                case MembershipLevel.PLUS:
                    game.Hotel.Reputation = game.Hotel.Reputation - 5;
                    break;
                case MembershipLevel.ELITE:
                    game.Hotel.Reputation = game.Hotel.Reputation - 9;
                    break;
                default:
                    break;
            }
        }
    }
}

export class ReservationRequest extends GuestRequest {
    protected m_roomQuality: RoomQualityLevel;
    protected m_checkInDay: number;
    protected m_checkOutDay: number;

    constructor(
        guest: Guest,
        roomQuality: RoomQualityLevel,
        checkInDay: number,
        checkOutDay: number
    ) {
        super(
            guest,
            'Reservation',
            `${guest.Name} would like to make a reservation for a ` +
                `${RoomQualityLevelNames[roomQuality]} room ` +
                `from day ${checkInDay} to ${checkOutDay}.`,
            'Accept',
            'Decline'
        );
        this.m_roomQuality = roomQuality;
        this.m_checkInDay = checkInDay;
        this.m_checkOutDay = checkOutDay;
    }

    CanAccept(): boolean {
        // Check if the hotel has a vacant room with the
        return false;
    }

    Accept(): void {
        // Create a new reservation and add it to the game and guest
        const reservation = new Reservation(
            this.m_guest,
            this.m_roomQuality,
            this.m_checkInDay,
            this.m_checkOutDay
        );

        this.m_guest.Game.AddFutureReservation(reservation);
        this.m_guest.Reservation = reservation;
    }

    Decline(): void {
        const game = this.m_guest.Game;
        game.Hotel.Reputation = game.Hotel.Reputation - 3;
    }
}
