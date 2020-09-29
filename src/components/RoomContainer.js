import React, { useContext } from 'react'
import RoomFilter from './RoomFilter';
import RoomList from './RoomList';
import Loading from './Loading';
import { RoomContext } from '../context';

function RoomContainer() {
    const { loading, sortedRooms } = useContext(RoomContext);

    if (loading) {
        return <Loading />
    }
    return (
        <div>
            <RoomFilter />
            <RoomList rooms={sortedRooms} />
        </div>
    )
}

export default RoomContainer;
