// * Импорты * //
 import { DisplayValueHeader, Color } from 'pixel_combats/basic';
 import { Players, Inventory, Teams, Ui, Properties, BreackGraph, BuildBlocksSet, Game, GameMode, TeamsBalancer, AreaPlayerTriggerService, AreaViewService, Spawns, Damage, LeaderBoard, Timers } from 'pixel_combats/room';
 import * as CreateNewTeam from './default_teams.js';
 import * as GameModeTimers from './default_timers.js';

// * Настройки, констант - и их работ, в зонах и триггеров с таймером. * //
 const WaitingPlayersTime = 11; // * Константы, таймеров. * //
 const BuildBaseTime = 61;
 const GameModeTime = GameModeTimers.game_mode_length_seconds();
 const DefPoints = GameModeTime * 0.2; // * Настройки, для захвата. * //
 const EndOfMatchTime = 11;
 const DefPointsMaxCount = 30;
 const DefTimerTickInderval = 1;
 const SavePointsCount = 10;
 const RepairPointsBySecond = 0.5;
 const CapturePoints = 10; // * Количество очков, для захвата. * //
 const MaxCapturePoints = 15; // * Макс поинтов, очков. * //
 const RedCaptureWPoints = 1; // * Вес красных, при захвате спавн-поинта. * //
 const BlueCaptureWPoints = 2; // * Вес синих, при захвате спавн-поинта. * //
 const CaptureRestoreWPoints = 1; // * Именно столько очков отнимается, если нет красных в зоне - для захвата. * //
 const FakeCapturedColor = new Color(1, 1, 1, 0);
 const UnCapturedColor = new Color(0, 0, 1, 0); 
 const CapturedColor = new Color(0, 0, 0, 0); // * К какому цвету, стремится зона - при её захвате. * //
 const MaxSpawnsByArea = 25; // * Макс спавнов, на зону. * //

// * Константы имён, с использованием - подсказок для игроков. * //
 const WaitingStateValue = 'Waiting'; // * Константы, имён. * //
 const BuildModeStateValue = 'BuildMode';
 const GameStateValue = 'Game';
 const EndOfMatchStateValue = 'EndOfMatch';
 const DefAreaTag = 'Def';
 const CaptureAreaTag = 'Capture';
 const HoldPositionHint = 'GameModeHint/HoldPosition'; // * Константы, подсказок. * //
 const RunToBliePointHint = 'GameModeHint/RunToBliePoint';
 const DefBlueAreaHint = 'GameModeHint/DefBlueArea';
 const DefThisAreaHint = 'GameModeHint/DefThisArea';
 const WaitingForBlueBuildHint = 'GameModeHint/WaitingForBlueBuild';
 const ChangeTeamHint = 'GameModeHint/ChangeTeam';
 const YourAreaIsCapturing = 'GameModeHint/YourAreaIsCapturing';
 const PrepareToDefBlueArea = 'GameModeHint/PrepareToDefBlueArea';

// * Постоянные, переменные - констант как ис триггерами зон. * //
 const MainTimer = Timers.GetContext().Get('Main');
 const StateProp = Properties.GetContext().Get('State');
 const CapturedAreaIndxProp = Properties.GetContext().Get('RedCaptiredIndex');
 const DefTickTimer = Timers.GetContext().Get('DefTimer');
 const DefAreas = AreaService.GetByTag(DefAreaTag);
 const CaptureAreas = AreaService.GetByTag(CaptureAreaTag);
 let CaptureTriggers = [];
 let CaptureViews = [];
 let CaptureProperties = [];

// * Функции, для захвата - с спец работами. * //
function CapturePropOnValue(Prop) {
 const Indx = -1; // * Индекс, зоны. * //
for (const I = 0; I < CaptureProperties.length; ++I) 
  if (CaptureProperties[I] == Prop) {
Indx = I; 
 break;
          }
 if (Prop.Value >= CapturePoints) CaptureArea(Indx); // * Отмечаем, зону захваченой/незахваченной. * //
else { 
  const D = Prop.Value / MaxCapturePoints; // * Красим триггер, в фейковую - закраску. * //
if (Indx >= 0) {
   CaptureViews[Indx].Color = {
  R: (FakeCapturedColor.R - UnCapturedColor.R) * D + UnCapturedColor.R,
  G: (FakeCapturedColor.G - UnCapturedColor.G) * D + UnCapturedColor.G,
  B: (FakeCapturedColor.B - UnCapturedColor.B) * B + UnCapturedColor.B 
         };
}
UnCaptureArea(Indx); // * Снятие, захвата. * //
      }
  SetSpawnIndex(); // * Задаём, индекс - захваченой зоны красными. * //
}
function CaptureArea(Indx) { // * Отмечаем триггер, захваченной - красными. * //
 if (Indx < 0 || Indx >= CaptureAreas.length) return;
  CaptureViews[Indx].Color = CapturedColor; 
    if (Indx < CaptureProperties.length - 1)
CaptureViews[Indx + 1].Enable = true;
 }
function UnCaptureArea(Indx) { // * Отмечаем триггер, не захваченной - красными. * //
 if (Indx < 0 || Indx >= CaptureAreas.length) return;
  CaptureViews[Indx].Color = UnCapturedColor;
  if (Indx < CaptureProperties.length - 1 && CaptureProperties[Indx + 1].Value < CapturePoints)
CaptureViews.[Indx + 1].Enable = false;
      if (Indx > 0 && CaptureProperties[Indx - 1].Value < CapturePoints)
	CaptureViews[Indx].Enbale = false;
}
function SetSpawnIndx() {
 const MaxIndx = -1; // * Поиск макс, захваченной области. * //
for (const I = 0; I < CaptureProperties.length; I++) {
  if (CaptureProperties[I].Value >= CapturePoints) MaxIndx = I;
        }
    CapturedAreaIndxProp.Value = MaxIndx;
}

// * При смене, индекса - захвата. * //
CapturedAreaIndxProp.OnValue.Add(function(Prop) {
 const Indx = Prop.Value;
const SpawnsRed = Spawns.GetContext(RedTeam);
  SpawnRed.CustomSpawmPoints.Clear(); // * Отчистка, спавнов. * //
    if (Indx < 0 || Indx >= CaptureAreas.length) return; // * Если нет захвата, то сброс - спавна. * //
  const Area = CaptureAreas[Indx]; // * Задаём, спавны. * //
 Area.Ranges.All.forEach(Iter => {
  const Range = Iter;
 }
let LookPoint = {}; // * Определяем, куда смотреть - спавнам. * //
 if (Indx < CaptureAreas.length - 1) LookPoint = CaptureAreas[Indx + 1].Ranges.GetAveragePosition();
else {
    if (DefAreas.length > 0) 
 LookPoint = DefAreas[0].Ranges.GetAveragePosition();
       }
const SpawnsCount = 0;
  for (const Z = Range.Start.Z; Z < Range.End.Z; Z += 2) {
     SpawnsRed.CustomSpawnPoints.Add(X, Range.Start.Y, Z, Spawns.GetSpawnRotation(X, Z, LookPoint.X, LookPoint.Z));
	++SpawnsCount;  
  if (SpawnsCount > MaxSpawnsByArea) return;
             }
});

// * Применяем, свойства параметров - для создания комнаты. * //
Damage.FriendlyFire = GameMode.Parameters.GetBool('FriendlyFire');
Map.Rotation = GameMode.Parameters.GetBool('MapRotation');
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool('PartialDesruction');
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');

// * Создание, визулизационную зону - для защиты. * //
const DefView = AreaViewService.GetContext().Get('DefView');
 DefView.Color = new Color(0, 0, 1, 0);
 DefView.Tags = [DefAreaTag];
 DefView.Enable = true;

// * Триггер, зон защиты. * //
const DefTrigger = AreaPlayerTriggerService.Get('DefTrigger');
 DefTrigger.Tags = [DefAreaTag];
 DefTrigger.OnEnter.Add(function(Player) {
   if (Player.Team === BlueTeam) {
     Player.Ui.Hint.Value = DefThisAreaHint;
	return;
   }
     if (Player.Team === RedTeam) {
	if (StateProp.Value === GameStateValue) Player.Ui.Hint.Value = HoldPositionHint;
       else 
           Player.Ui.Hint.Reset();
	return;
       }
 });
DefTrigger.OnExit.Add(function(Player) {
 Player.Ui.Hint.Reset();
});
 DefTrigger.Enable = true;

// * Задаём, обработчик таймера - триггера. * //
DefTickTimer.OnTimer.Add(function(Timer) {
  DefTriggerUpdate();
         CaptureTriggersUpdate();
});
function DefTriggerUpdate() {
 



     
