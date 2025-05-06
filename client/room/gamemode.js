import * as room from 'pixel_combats/room';
import * as basic from 'pixel_combats/basic';
import * as teams from './teams.js';
import * as default_timer from './timer.js';

// настройки 
const WaitingPlayersTime = 10;
const BuildBaseTime = 60;
const GameModeTime = default_timer.game_mode_length_seconds();
const End0fMatchTime = 10;
const VoteTime = 15;
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

const SCORES_PROP_NAME = 'Scores';
const KILLS_PROP_NAME = 'Kills';
const IMMORTALITY_TIMER_NAME = 'Immortality';
const KILL_SCORES = 5;
const WINNER_SCORES = 10;
const TIMER_SCORES = 5;
const SCORES_TIMER_INTERVAL = 30;

// имена используемых объектов 
const WaitingStateValue = 'Waiting';
const BuildModeStateValue = 'BuildMode';
const GameModeStateValue = 'Game';
const End0fMatchStateValue = 'End0fMatch';
const DefAreaTag = 'def';
const CaptureAreaTag = 'capture';
const ProtectionBlueZonesHint = 'Не дайте красным, захватить - все зоны!';
const BuildUpBlueZoneHint = 'Застраивайте - синию/белые, зону/ы!';
const PreparationCaptureZoneBlueHint = 'Подгатавливайтесь, к захвату - зону!';
const CaptureZoneWhiteBlueHint = 'Захватите, все - зоны!';
	
// получаем объекты, с которыми работает режим
const mainTimer = room.Timers.GetContext().Get('Main');
const stateProp = room.Properties.GetContext().Get('State');
const timer_scores = room.Timers.GetContext().Get(SCORES_PROP_NAME);
const DefTickTimer = room.Timers.GetContext().Get('DefTimer');
const StateProp = room.Properties.GetContext().Get('State');
const defAreas = room.AreaService.GetByTag(DefAreaTag);
const captureAreas = room.AreaService.GetByTag(CaptureAreaTag);
let captureTriggers = [];
let captureViews = [];
let captureProperties = [];
const CapturedAreaIndxProp = Properties.GetContext().Get('RedCaptiredIndex');

// применяем параметры конструктора режима
room.Damage.GetContext().FriendlyFire.Value = room.GameMode.Parameters.GetBool('FriendlyFire');
const MapRotation = room.GameMode.Parameters.GetBool('MapRotation');
room.BreackGraph.WeakBlocks = room.GameMode.Parameters.GetBool('LoosenBlocks');
room.BreackGraph.OnlyPlayerBlocksDmg = room.GameMode.Parameters.GetBool('OnlyPlayerBlocksDmg');

// параметры игрового режима (устарело)
room.Properties.GetContext().GameModeName.Value = 'GameModes/Team Dead Match';
room.TeamsBalancer.IsAutoBalance = true;
room.BreackGraph.PlayerBlockBoost = true;
Ui.GetContext().MainTimerId.Value = maimTimer.Id;

// создаем стандартные команды
const blueTeam = teams.create_team_blue();
const redTeam = teams.create_team_red();
blueTeam.Build.BlocksSet.Value = room.BuildBlocksSet.Blue;
redTeam.Build.BlocksSet.Value = room.BuildBlocksSet.Red;
blueTeam.Spawns.RespawnTime.Value = 0;
redTeam.Spawns.RespawnTime.Value = 10;

// макс поинтов в команде
blueTeam.Properties.Get('Deaths').Value = DefPoints;
// настраиваем параметры, которые нужно выводить в лидерборде
room.LeaderBoard.PlayerLeaderBoardValues = [
	new DisplayValueHeader(KILLS_PROP_NAME, 'Statistics/Kills', 'Statistics/KillsShort'),
	new DisplayValueHeader('Deaths', 'Statistics/Deaths', 'Statistics/DeathsShort'),
	new DisplayValueHeader('Spawns', 'Statistics/Spawns', 'Statistics/SpawnsShort'),
	new DisplayValueHeader(SCORES_PROP_NAME, 'Statistics/Scores', 'Statistics/ScoresShort')
];
room.LeaderBoard.TeamLeaderBoardValue = new DisplayValueHeader(SCORES_PROP_NAME, 'Statistics\Scores', 'Statistics\Scores');
// задаем сортировку игроков для списка лидирующих
room.LeaderBoard.PlayersWeightGetter.Set(function (player) {
 return player.Properties.Get(SCORES_PROP_NAME).Value;
});

// отображаем значения вверху экрана
room.Ui.GetContext().TeamProp1.Value = { Team: 'Blue', Prop: 'Deaths' };

// при запросе смены команды игрока - добавляем его в запрашиваемую команду
room.Teams.OnRequestJoinTeam.Add(function (player, team) { team.Add(player); });
// при запросе спавна игрока - спавним его
room.Teams.OnPlayerChangeTeam.Add(function (player) { player.Spawns.Spawn() });

// бессмертие после респавна
room.Spawns.GetContext().OnSpawn.Add(function (player) {
 player.Properties.Immortality.Value = true;
 player.Timers.Get(IMMORTALITY_TIMER_NAME).Restart(5);
});
room.Timers.OnPlayerTimer.Add(function (timer) {
 if (timer.Id != IMMORTALITY_TIMER_NAME) return;
timer.Player.Properties.Immortality.Value = false;
});

// если в команде количество смертей занулилось то завершаем игру
 room.Properties.OnTeamProperty.Add(function (context, value) {
if (context.Team = blueTeam) return;
if (value.Name !== 'Deaths') return;
  if (value.Value <= 0) {
 RedWin();
     }
 });

// обработчик спавнов
room.Spawns.OnSpawn.Add(function (player) {
 ++player.Properties.Spawns.Value;
});

// обработчик смертей
room.Damage.OnDeath.Add(function (player) {
 ++player.Properties.Deaths.Value;
});

// обработчик убийств 
room.Damage.OnKill.Add(function (player, killed) {
 if (killed.Team != null && killed.Team != player.Team) {
++player.Properties.Kills.Value;
// добавляем очки кила игроку и команде
player.Properties.Scores.Value += 100;	 
 player.Properties.Scores.Value += KILL_SCORES;
if (stateProp.Value !== End0fMatchStateValue && player.Team != null)
  player.Team.Properties.Get(SCORES_PROP_NAME).Value += KILL_SCORES;
        }
});

// таймер очков за проведенное время
scores_timer.OnTimer.Add(function () {
 for (const player of Players.All) {
if (player.Team === null) continue;
 player.Properties.Scores.Value += TIMER_SCORES;
     }
});

// таймер переключения состояний 
mainTimer.OnTimer.Add(function () {
 switch (stateProp.Value) {
case WaitingStateValue:
 SetBuildMode();
  break;
case BuildModeStateValue:
 SetGameMode();
  break;
case GameStateValue:
 BlueWin();
  break;
case End_End0fMatch:
 End0fMatchStateValue();
   break;
      }
});

// изначально задаем состояние ожидания других игроков
 SetWaitingMode();

// состояние игры
function SetWaitingMode() {
 stateProp.Value = WaitingStateValue;
 room.Ui.GetContext().Hint.Value = 'Ожидание, всех - игроков...';
 room.Spawns.GetContext().Enable = false;
 mainTimer.Restart(WaitingPlayersTime);
}
function SetBuildMode()
{
  // инициализация режима
 for (const i = 0; i < captureAreas.length; ++i) {
  // визуализатор
 const capture_view = captureViews[i];
  capture_view.Area = captureAreas[i];
  capture_view.Color = UnCapturedColor;
  capture_view.Enable = i == 0;
  // триггер
 const capture_trigger = captureTriggers[i];
  capture_triggers.Area = captureAreas[i];
  capture_triggers.Enable = true;
//capture_trigger.OnEnter.Add(LogTrigger);
  // свойста для захвата	
 const capture_prop = captureProperties[i]; 
capture_prop.Value = 0;
    }

stateProp.Value = BuildModeStateValue;
blueTeam.Ui.Hint.Value = BuildUpBlueZoneHint;
redTeam.Ui.Hint.Value = PreparationCaptureZoneBlueHint;

blueTeam.inventory.Main.Value = false;
blueTeam.inventory.Secondary.Value = false;
blueTeam.inventory.Melee.Value = true;
blueTeam.inventory.Explosive.Value = false;
blueTeam.inventory.Build.Value = true;
blueTeam.inventory.BuildInfinity.Value = true;	
redTeam.inventory.Main.Value = false;
redTeam.inventory.Secondary.Value = false;
redTeam.inventory.Melee.Value = false;
redTeam.inventory.Explosive.Value = false;
redTeam.inventory.Build.Value = false;

 mainTimer.Restart(BuildBaseTime);
 room.Spawns.GetContext().Enable = true;
 SpawnTeams();
}
function SetGameMode()
{
  stateProp.Value = GameStateValue;
  blueTeam.Ui.Hint.Value = ProtectionBlueZonesHint;
  redTeam.Ui.Hint.Value = CaptureZoneWhiteBlueHint;	

  blueTeam.inventory.Main.Value = true;
  blueTeam.inventory.MainInfinity.Value = true;
  blueTeam.inventory.Secondary.Value = true;
  blueTeam.inventory.SecondaryInfinity.Value = true;
  blueTeam.inventory.Melee.Value = true;
  blueTeam.inventory.Explosive.Value = true;
  blueTeam.inventory.Build.Value = true;
  redTeam.inventory.Main.Value = true;
  redTeam.inventory.Secondary.Value = true;
  redTeam.inventory.Melee.Value = true;
  redTeam.inventory.Explosive.Value = true;
  redTeam.inventory.Build.Value = true;

   mainTimer.Restart(GameModeTime);
   DefTickTimer.RestartLoop(DefTimerTickInderval);
   room.Spawns.GetContext().Despawn();
   SpawnTeams();
}
function BlueWin() 
{
  stateProp.Value = End0fMatchStateValue;
  blueTeam.Properties.Get(SCORES_PROP_NAME).Value += WINNER_SCORES;
  redTeam.Properties.Get(SCORES_PROP_NAME).Value -= WINNER_SCORES;
  room.Ui.GetContext().Hint.Value = 'Конец, матча - победила команда: синия!';

  const spawns = room.Spawns.GetContext();
  spawns.Enable = false;
  spawns.Despawn();

  room.Game.GameOver(blueTeam);
  mainTimer.Restart(End0fMatchTime);
}
function RedWin()
{
  stateProp.Value = End0fMatchStateValue;
  blueTeam.Properties.Get(SCORES_PROP_NAME).Value -= WINNER_SCORES;
  redTeam.Properties.Get(SCORES_PROP_NAME).Value += WINNER_SCORES;
  room.Ui.GetContext().Hint.Value = 'Конец, матча - победила команда: красная!';

  const spawns = room.Spawns.GetContext(); 
  spawns.Enable = false;
  spawns.Despawn();

  room.Game.GameOver(redTeam);
  mainTimer.Restart(End0fMatchTime);
}
function RestartGame() {
 if (room.GameMode.Parameters.GetBool('LoadMap')) room.Map.LoadRandomMap();
room.Game.RestartGame();
 }

function SpawnTeams() {
 for (const team of room.Teams) {
room.Spawns.GetContext(team).Spawn();
     }
}

scores_timer.RestartLoop(SCORES_TIMER_INTERVAL);
