import React from 'react';

type HotelStatusInfoProps = {
    className?: string;
    hotelName: string;
    day: number;
    reputation: number;
    maxReputation: number;
    basicRooms: number;
    maxBasicRooms: number;
    plusRooms: number;
    maxPlusRooms: number;
    deluxeRooms: number;
    maxDeluxeRooms: number;
};

const HotelStatusInfo: React.FC<HotelStatusInfoProps> = (props) => {
    const classNames = props.className ? props.className : '';

    return (
        <div className={`hotel-info ${classNames}`}>
            <h1>{props.hotelName}</h1>
            <div>Day: {props.day}</div>
            <div>
                Reputation: {props.reputation} / {props.maxReputation}
            </div>
            <hr></hr>
            <div>
                <h4>Vacant Rooms</h4>
                <div>
                    <b>Basic:</b> {props.basicRooms} / {props.maxBasicRooms}
                </div>
                <div>
                    <b>Plus:</b> {props.plusRooms} / {props.maxPlusRooms}
                </div>
                <div>
                    <b>Deluxe:</b> {props.deluxeRooms} / {props.maxDeluxeRooms}
                </div>
            </div>
        </div>
    );
};

export default HotelStatusInfo;
