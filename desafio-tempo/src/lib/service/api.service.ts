import { api } from '../axios';
import { AxiosResponse } from 'axios';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
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
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  [key: string]: any;
}

export const fetchAllItems = async (): Promise<PokemonDetail[]> => {
  // Reducimos a solo 50 Pokémon para evitar límites de tasa
  const pokemonListResponse = await api.get<PokemonListResponse>('/pokemon?limit=50');
  const pokemonList = pokemonListResponse.data.results;
  
  // Obtener detalles de cada Pokémon
  const detailPromises = pokemonList.map(pokemon => 
    api.get<PokemonDetail>(pokemon.url.replace(api.defaults.baseURL || '', ''))
  );
  
  // Esperamos a que todas las promesas se resuelvan
  const detailResponses = await Promise.all(detailPromises);
  
  // Extraer los datos de todas las respuestas
  const pokemonDetails = detailResponses.map(response => response.data);
  
  return pokemonDetails;
}; 