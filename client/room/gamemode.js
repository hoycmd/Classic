// * Константы. * //
import * as room from 'pixel_combats/room';
import * as basic from 'pixel_combats/basic';

// * Создаём команды. * //
let BlueTeam = CreateNewTeam('Blue', 'Teams/Blue \n Команда синия', new basic.Color(0, 0, 1, 0), room.BuildBlocksSet.Blue, room.Spawns.SpawnPointsGroups.Add(1));
let RedTeam = CreateNewTeam('Red', 'Teams/Red \n Команда красная', new basic.Color(1, 0, 0, 0), room.BuildBlocksSet.Red, room.Spawns.SpawnPointsGroups.Add(2));
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



 
     
 


