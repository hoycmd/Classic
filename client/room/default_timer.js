// библиотека для работы со стандартными длинами матчей
import * as room from 'pixel_combats/room';

// константы
const PARAMETER_GAME_LENGTH = 'game_mode_length_seconds';
const GAME_MODE_TIME = game_mode_length_seconds;
const lENGTH_GAME_MODE = room.GameMode.Parameters.GetString(PARAMETER_GAME_LENGTH);

// возвращает длину матча
export function GAME_MODE_TIME() {
    switch (LENGTH_GAME_MODE) {
        case 'LENGTH_sTIME': return 290;
        case 'LENGTH_mTIME': return 350;
        case 'LENGTH_lTIME': return 670; 
        case 'LENGTH_xlTIME': return 760; 
    }
    return 290;
}
