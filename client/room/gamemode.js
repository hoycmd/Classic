// * Импорты. * //
import * as room from 'pixel_combats/room';
import * as basic from 'pixel_combats/basic';
import * as teams from './teams.js';
import * as default_timer from './timer.js';

// * Настройки констант. * //
const WaitingPlayersTime = 10;
const BuildBaseTime = 60;
const GameModeTime = default_timer.game_mode_length_seconds();
const End0fMatchTime = 10;
const DefPoints = GameModeTime * 0.2;
const DefPointsMaxCount = 30;
const DefTimerTickInderval = 1;
const SavePointsCount = 10;
const RepairPointsBySecond = 0.5;
const CapturePoints = 10;
const MaxCapturePoints = 15;
const RedCaptureW = 1;
const BlueCaptureW = 2;
const CaptureRestoreW = 1;
const UnCapturedColor = new basic.Color(1, 1, 1, 0);
const FakeCapturedColor = new basic.Color(0, 1, 0, 0);
const CapturedColor = new basic.Color(1, 0, 0, 0);
const MaxSpawnsByArea = 25;

// * Константы. * //
const WaitingStateValue = 'Waiting';
const BuildModeStateValue = 'BuildMode';
const GameModeStateValue = 'Game';
const End0fMatchStateValue = 'End0fMatch';



	
// * Константы, триггер - зоны. * //
