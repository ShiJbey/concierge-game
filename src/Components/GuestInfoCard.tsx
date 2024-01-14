import React from 'react';
import { Guest, RoomQualityLevel, RoomQualityLevelNames } from '../concierge';

type GuestInfoCardProps = {
    className?: string;
    guest: Guest;
};

const GuestInfoCard: React.FC<GuestInfoCardProps> = (props) => {
    const classNames = props.className ? props.className : '';

    const getRoomQualityName = (quality: RoomQualityLevel): string => {
        return RoomQualityLevelNames[quality];
    };

    return (
        <div className={`guest-info-card ${classNames}`}>
            <div className="row p-3">
                <div className="col col-3 request-profile-pic-container">
                    <img
                        // src="./assets/characters/placeholder.png"
                        src={`/assets/characters/${props.guest.UID}.png`}
                        alt="guest profile pic"
                        className="w-100"
                    ></img>
                </div>
                <div className="col request-text-container">
                    <div className="request-guest">
                        <h3>{props.guest.Name}</h3>
                    </div>
                    <div>
                        <b>Membership: </b>
                        {props.guest.MembershipLevelName}
                    </div>
                    <div>
                        <b>Stays: </b>
                        {props.guest.TimesStayed}
                    </div>
                    <div>
                        <b>Room: </b>
                        {props.guest.Room !== null
                            ? props.guest.Room.RoomNumber
                            : 'N/A'}
                    </div>
                    <div>
                        <b>Reservation: </b>
                        {props.guest.Reservation !== null
                            ? `${getRoomQualityName(
                                  props.guest.Reservation.RoomQuality
                              )} room from ${
                                  props.guest.Reservation.CheckInDay
                              } to ${props.guest.Reservation.CheckOutDay}`
                            : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestInfoCard;
