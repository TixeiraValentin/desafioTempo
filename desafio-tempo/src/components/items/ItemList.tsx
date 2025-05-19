'use client';

import { useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Image from 'next/image';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  height: number;
  weight: number;
  [key: string]: any;
}

interface ItemListProps {
  items: Pokemon[];
}

export default function ItemList({ items }: ItemListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(items.length / pageSize);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, page, pageSize]);

  const rowVirtualizer = useVirtualizer({
    count: paginatedItems.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 100,
    overscan: 3,
  });

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      normal: 'bg-gray-300',
      fire: 'bg-red-400',
      water: 'bg-blue-400',
      electric: 'bg-yellow-300',
      grass: 'bg-green-400',
      ice: 'bg-blue-200',
      fighting: 'bg-red-600',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-400',
      bug: 'bg-green-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-300'
    };
    
    return typeColors[type] || 'bg-gray-200';
  };

  const handleImageError = useCallback((pokemonId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [pokemonId]: true
    }));
  }, []);

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Pokédex ({items.length} Pokémon)
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50 text-black cursor-pointer"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50 text-black cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>

      <div
        ref={setParentRef}
        className="h-[650px] overflow-auto border border-gray-200 rounded-md"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const pokemon = paginatedItems[virtualItem.index];
            const mainType = pokemon.types[0]?.type.name || 'normal';
            const typeColor = getTypeColor(mainType);
            
            return (
              <div
                key={pokemon.id}
                className="absolute top-0 left-0 w-full border-b border-gray-200 p-4 hover:bg-gray-50"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full flex items-center justify-center bg-gray-100">
                    {pokemon.sprites?.front_default && !imageErrors[pokemon.id] ? (
                      <Image
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        width={80}
                        height={80}
                        className="object-cover"
                        onError={() => handleImageError(pokemon.id)}
                        unoptimized={true}
                        loading="lazy"
                        priority={false}
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${typeColor}`}>
                        <span className="text-xl font-bold text-white">
                          {pokemon.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium text-white capitalize text-lg">
                        #{pokemon.id} {capitalize(pokemon.name)}
                      </h3>
                    </div>
                    <div className="flex mt-1 space-x-2">
                      {pokemon.types.map((typeInfo) => (
                        <span 
                          key={typeInfo.slot} 
                          className={`${getTypeColor(typeInfo.type.name)} px-2 py-1 rounded text-xs capitalize text-white`}
                        >
                          {typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                      <span>Altura: {pokemon.height / 10}m</span>
                      <span>Peso: {pokemon.weight / 10}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}