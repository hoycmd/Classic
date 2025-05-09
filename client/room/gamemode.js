// * Константы. * //
import * as room from 'pixel_combats/room';
import * as basic from 'pixel_combats/basic';

// * Настройки. * //
const MaxScores = 6;
const WaitingPlayersSeconds = 11;
const BuildModeSeconds = 31;
const GameModeSeconds = 121;
const EndGameSeconds = 5;
const End0fMatchTime = 11;
const WaitingStateValue = 'Waiting';
const BuildModeStateValue = 'BuildMode';
const GameStateValue = 'Game';
const End0fMatchStateValue = 'End0fMatch';
const SCORES_PROP_NAME = 'Scores';

// * Создаём команды. * //
let BlueTeam = CreateNewTeam('Blue', 'Teams/Blue \n Команда синия', new basic.Color(0, 0, 1, 0), room.BuildBlocksSet.Blue);
room.Spawns.SpawnPointsGroups.Add(1);
let RedTeam = CreateNewTeam('Red', 'Teams/Red \n Команда красная', new basic.Color(1, 0, 0, 0), room.BuildBlocksSet.Red);
room.Spawns.SpawnPointsGroups.Add(2);
// * Настройки, интерфейс - команд. * //
room.Ui.GetContext().TeamProp1.Value = { Team: 'Blue', Prop: SCORES_PROP_NAME };
room.Ui.GetContext().TeamProp2.Value = { Team: 'Red', Prop: SCORES_PROP_NAME };

// * Вход, в команды - по запросу. * //
room.Teams.OnRequestJoinTeam.Add(function(Player) { Team.Add(Player); if (StateProp.Value === GameModeStateValue) return; Player.Spawns.Spawn()});

// * Параметры, режима - игры.* //
room.BreackGraph.PlayerBlockBoost = true;
room.Damage.GetContext().GranadeTouchExplosion.Value = false;
room.Ui.GetContext().MainTimerId.Value = MainTimer.Id;
room.Properties.GetContext().GameModeName.Value = 'GameModes/Team Dead Match';
room.TeamsBalancer.IsAutoBalance = true;
// * Параметры, создания - режима.* //
room.Map.Rotation = room.GameMode.Parameters.GetBool('MapRotation');
room.BreackGraph.OnlyPlayerBlocksDmg = room.GameMode.Parameters.GetBool('PartialDesruction');
room.Damage.GetContext().FriendlyFire.Value = room.GameMode.Parameters.GetBool('FriendlyFire');
room.BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlock');

// * ЛидерБорд. * //
room.LeaderBoard.PlayerLeaderBoardValues = [
 new  basic.DisplayValueHeader('Kills', 'Statistics/Kills', 'Statistics/Kills'),
 new basic.DisplayValueHeader('Deaths', 'Statistics/Deaths', 'Statistics/Deaths'),
 new basic.DisplayValueHeader(SCORES_PROP_NAME, 'Очки', 'Очки')
];
room.LeaderBoard.TeamLeaderBoardValue = new basic.DisplayValueHeader(SCORES_PROP_NAME, 'Очки', 'Очки');
// * Вес команды, в - лидерборде. * //
room.LeaderBoard.TeamWeightGetter.Set(function(Team) {
 const Prop = Team.Properties.Get(SCORES_PROP_NAME);
   if (Prop.Value === null) return 0;
 return Prop.Value;
});
// * Вес игрока, в - лидерборде. * //
room.LeaderBoard.PlayerWeightGetter.Set(function(Player) {
 const Prop = Player.Properties.Get('Scores');
   if (Prop.Value === null) return 0;
 return Prop.Value;
});

// * Изначальные, очки - команды: 0. * //
 for (const  Team of room.Teams.All) {
  Team.Properties.Get(SCORES_PROP_NAME).Value = 0;
 }

// * Счётчик смертей. * //
room.Damage.OnDeath.Add(function(Player) {
 ++Player.Properties.Deaths.Value;
});
// * Счётчик убийств. * //
room.Damage.OnKill.Add(function(Player, Killed) {
 if (Killed.Team != null && Killed.Team != Player.Team) {
   ++Player.Properties.Kills.Value;
        Player.Properties.Scores.Value += 100;
    } 
});

// * Получение, победе - команде. * //
function GET_WIN_TEAM() {
 win_team = null;
wins = 0;
  noAlife = true;
for (const Team of room.Teams.All) {
  if (Team.GetAlivePlayersCount() > 0) {
 ++wins;
  win_team = Team;
                 }  
      }
  if (wins === 1) return win_team;
   else return null;
}
function TRY_SWITCH_GAME_STATE() 
{
  if (StateProp.Value !== GameStateValue) return;
// * Победа раунд. * //
win_team = null;
  wins  = 0;
     alifeCount = 0;
         hasEmptyTeam = false;
    for (const  Team of room.Teams.All) {
     const alife_team = Team.GetAlivePlayersCount();
       alife_count += alife_team;
     if (alife_team > 0) {
       ++wins;
         win_team = Team;
     } 
        if (Team.Count === 0) hasEmptyTeam = true;
  }
  // * Победа, по команде - игроков. * //
   if (!hasEmptyTeam && alife_count > 0 && wins === 1) {
	  	//log.debug("hasEmptyTeam=" + hasEmptyTeam);
	  	//log.debug("alifeCount=" + alifeCount);
	  	//log.debug("wins=" + wins);
	  	win_team_id_prop.Value = win_team.Id;
	     	StartEndOfGame(win_team);
	  	return;
   }
  // * Если нет в команде, коинта - то ничего не задано. * //
  if (alife_count === 0) {
	   	//log.debug("ïîáåäèâøèõ íåò è æèâûõ íå îñòàëîñü - íè÷üÿ");
	      win_team_id_prop.Value = null;
	 	StartEndOfGame(null);
  }
  // * Если таймер, прошёл. * //
  if (!main_timer.IsStarted) {
	  	//log.debug("ïîáåäèâøèõ íåò è òàéìåð íå àêòèâåí - íè÷üÿ");
		win_team_id_prop.Value = null;
		StartEndOfGame(null);
	    }
}
function OnGameStateTimer() // Конец, матча.
{
	TrySwitchGameState();
}
room.Damage.OnDeath.Add(TrySwitchGameState);
room.Players.OnPlayerDisconnected.Add(TrySwitchGameState);

// * Настройки, переключателей - режима. * //
MainTimer.OnTimer.Add(function() {
 switch (StateProp.value) {
	case WaitingStateValue:
		SetBuildMode();
		break;
	case BuildModeStateValue:
		SetGameMode();
		break;
	case GameStateValue:
		OnGameStateTimer();
		break;
	case EndOfGameStateValue:
		EndEndOfGame();
		break;
	case EndOfMatchStateValue:
		RestartGame();
		break;
	}
});

// * Задаём, первое - игровое состояние. * //
SetWaitingMode();

// * Состояние игры. * //
function SetWaitingMode() { 
 StateProp.value = WaitingStateValue;
 room.Ui.GetContext().Hint.Value = 'Ожидание, всех - игроков...';
 room.Spawns.GetContext().Enable = false;
 room.TeamsBalancer.IsAutoBalance = true;
 MainTimer.Restart(WaitingModeSeconts);
}

function SetBuildMode() 
{
 StateProp.value = BuildModeStateValue;
 room.Ui.GetContext().Hint.Value = 'Застраивайте базу, и разрушайте - базу врагов!';

 const inventory = room.Inventory.GetContext();
  inventory.Main.Value = false;
  inventory.Secondary.Value = false;
  inventory.Melee.Value = true;
  inventory.Explosive.Value = false;
  inventory.Build.Value = true;

 MainTimer.Restart(BuildModeSeconds);
 room.Spawns.GetContext().enable = true;
 room.TeamsBalancer.IsAutoBalance = true; 
 SpawnTeams();
}
function SetGameMode() 
{
	StateProp.value = GameStateValue;
	room.Ui.GetContext().Hint.Value = 'Атакуйте, всех - врагов!';
	win_team_id_prop.Value = null; 

	var inventory = room.Inventory.GetContext();
	if (room.GameMode.Parameters.GetBool('OnlyKnives')) {
	  inventory.Main.Value = false;
	  inventory.Secondary.Value = false;
	  inventory.Melee.Value = true;
	  inventory.Explosive.Value = false;
	  inventory.Build.Value = true;
	} else {
	  inventory.Main.Value = true;
	  inventory.Secondary.Value = true;
	  inventory.Melee.Value = true;
          inventory.Explosive.Value = true;
	  inventory.Build.Value = true;
	}

	MainTimer.Restart(GameModeSeconds);
	room.Spawns.GetContext().Despawn();
	room.Spawns.GetContext().RespawnEnable = false;
	TeamsBalancer.IsAutoBalance = false;
	TeamsBalancer.BalanceTeams();
	SpawnTeams();
}
function StartEndOfGame(t) { 
log.debug("win team="+team);
 StateProp.value = EndOfGameStateValue;
 if (t !== null) {
log.debug(1);
	room.Ui.GetContext().Hint.Value = team + ' победила!';
		const prop = t.Properties.Get(SCORES_PROP_NAME);
		 if (prop.Value == null) prop.Value = 1;
		  else prop.Value = prop.Value + 1;
	}
	else Ui.GetContext().Hint.Value = 'Hint/Draw';
     MainTimer.Restart(EndGameSeconds);
}
function EndEndOfGame(){
	if (win_team_id_prop.Value !== null) {
	const prop = room.Teams.Get(win_team_id_prop.Value);
	  const prop = t.Properties.Get(scoresProp);
		if (prop.Value >= MaxScores) SetEndOfMatchMode();
		else SetGameMode();
	}
	else SetGameMode();
}

function SetEndOfMatchMode() {
	StateProp.value = EndOfMatchStateValue;
	room.Ui.GetContext().Hint.Value = 'Конец, матча!';

	var context = room.Spawns.GetContext();
	context.Enable = false;
	context.Despawn();
	room.Game.GameOver(room.LeaderBoard.GetTeams());
	MainTimer.Restart(EndOfMatchTime);
}
function RestartGame() {
	room.Game.RestartGame();
}

function SpawnTeams() {
  for (const Team of room.Teams) {
   Spawns.GetContext(Team).Spawn();
	}
}





 
     
 


