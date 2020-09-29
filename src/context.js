import React, { useState, createContext, useEffect } from 'react';
import items from './data';

const RoomContext = createContext();

function RoomProvider(props) {
    const formatData = (data) => {
        let tempData = data.map(item => {
            let id = item.sys.id
            let images = item.fields.images.map(image => image.fields.file.url)
            let room = {...item.fields, images, id}
            return room
        })
        return tempData
    }

    const [rooms, setRooms] = useState(formatData(items));
    const [sortedRooms, setSortedRooms] = useState(formatData(items));
    const [featuredRooms] = useState(formatData(items).filter(item => item.featured === true));
    const [loading, setLoading] = useState(false);
    const [filterInput, setFilterInput] = useState(
        {
            type: 'all',
            capacity: 1,
            price: Math.max(...rooms.map(item => item.price)),
            minPrice: 0,
            maxPrice: Math.max(...rooms.map(item => item.price)),
            minSize: 0,
            maxSize: Math.max(...rooms.map(item => item.size)),
            breakfast: false,
            pets: false
        }
    );

    const getRoom = (slug) => {
        const singleRoom = rooms.find(item => item.slug === slug);
        return singleRoom
    }
    
    const uniqueTypes = () => {
        const uniqueTypesList = [...new Set(rooms.map(item => item.type))]
        const newArr = ['all', ...uniqueTypesList].map((item,index) => {
            return <option value={item} key={index}>{item}</option>
        })
        return newArr;
    }

    const uniquePeople = () => {
        const uniqueTypesList = [...new Set(rooms.map(item => item.capacity))]
        const newArr = [...uniqueTypesList].map((item,index) => {
            return <option value={item} key={index}>{item}</option>
        })
        return newArr;
    }
    
    const filterRooms = () => {
        let tempRooms = [...rooms]
        if (filterInput.type !== 'all') {
            tempRooms = tempRooms.filter(room => room.type === filterInput.type);
        }
        if (+filterInput.capacity !== 1) {
            tempRooms = tempRooms.filter(room => room.capacity >= filterInput.capacity)
        }
        tempRooms = tempRooms.filter(room => room.price <= filterInput.price);
        tempRooms = tempRooms.filter(room => room.size >= filterInput.minSize && room.size <= filterInput.maxSize);
        if (filterInput.breakfast) {
            tempRooms = tempRooms.filter(room => room.breakfast === true)
        }
        if (filterInput.pets) {
            tempRooms = tempRooms.filter(room => room.pets === true)
        }
        setSortedRooms(tempRooms);
    }

    useEffect(() => {
        filterRooms()
    }, [filterInput])

    return (
        <RoomContext.Provider value={{
            rooms, 
            loading,
            featuredRooms,
            sortedRooms,
            getRoom,
            uniquePeople,
            uniqueTypes,
            filterInput,
            setFilterInput
        }}>
            {props.children}
        </RoomContext.Provider>
    )
}

const RoomConsumer = RoomContext.Consumer;
export { RoomProvider, RoomConsumer, RoomContext };
