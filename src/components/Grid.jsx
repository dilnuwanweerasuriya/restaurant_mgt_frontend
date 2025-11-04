import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Grid(props) {
    const navigate = useNavigate();
    return (
        <div
            key={props.name}
            onClick={() => navigate(props.path)}
            className="bg-zinc-900 border-2 border-zinc-800 hover:border-white shadow-md hover:shadow-lg cursor-pointer rounded-xl flex flex-col items-center justify-center py-10 transition-all"
        >
            <div className="text-white mb-4">{props.icon}</div>
            <span className="text-white text-lg font-semibold">{props.name}</span>
        </div>
    )
}
