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
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{name}</h2>
                        <p className="text-gray-600 text-lg mb-4">{description}</p>
                        {category && (
                            <div className="inline-block bg-amber-600 text-white px-3 py-1 rounded-full text-sm mb-4">
                                {category}
                            </div>
                        )}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

