'use client'

import Image from 'next/image'
import {useState} from 'react'

interface ProductProps {
    id: number;
    name: string;
    imageUrl: string;
    category?: string; 
    description: string;
}

export default function ProductCard({
    id, // eslint-disable-line @typescript-eslint/no-unused-vars
    name,
    imageUrl,
    category,
    description
}:ProductProps){
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-64 w-full cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <Image 
                    src={imageUrl || '/default-image.jpg'}
                    alt={name}
                    fill
                    className="object-cover"
                />
                {category && (
                    <div className="absolute top-2 left-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs">
                        {category}
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-1">{description}</p>
            </div>
        </div>

        {/* Modal للصورة والوصف */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="relative h-[70vh] w-full">
                        <Image 
                            src={imageUrl || '/default-image.jpg'}
                            alt={name}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="p-6">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 left-2 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold"
                        >
                            X
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{name}</h2>
                        <p className="text-gray-600 text-lg mb-4">{description}</p>
                        {category && (
                            <div className="inline-block bg-amber-600 text-white px-3 py-1 rounded-full text-sm mb-4">
                                {category}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

