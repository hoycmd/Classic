import { Players, Inventory, Teams, Ui, Game, Spawns, LeaderBoard, Damage, GameMode, BuildBlocksSet, BreackGraph , Properties, Map, AreaPlayerTriggerService, AreaService, Timers, TeamsBalancer, msg } from 'pixel_combats/room';
import { DisplayValueHeader, Color } from 'pixel_combats/basic';

try {
	
// настройки
const WaitingPlayersTime = 11;
const SearchWeaponTime = 51;
const GameModeTime = 361;
const End0fMatchTime = 6;
const WaitingStateValue = 'Waiting';
const SearchWeaponStateValue = 'SertchWeapon';
const GameStateValue = 'Game';
const End0fMatchStateValue = 'End0fMatch';
const WinnersScores = 10000;
const TimerScores = 500;
const KillScores = 300;
const ScoresTimerInterval = 20;
const inventory = Inventory.GetContext();
const spawns = Spawns.GetContext();
const MainTimer = Timers.GetContext().Get('Main');
const StateProp = Properties.GetContext().Get('State');
const ScoresTimer = Timers.GetContext().Get('Scores');

// параметры создания режима
Map.Rotation = GameMode.Parameters.GetBool('MapRotation');
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool('PartialDesruction');
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');
// параметры игры
Damage.GetContext().DamageOut.Value = true;
Damage.GetContext().FriendlyFire.Value = true;
BreackGraph.PlayerBlocksBoost = true;

// создаем команду
Teams.Add('Blue', 'Teams/Blue \n Синия команда', new Color(0, 0, 0.5, 0));
const BlueTeam = Teams.Get('Blue');
BlueTeam.Spawns.SpawnPointsGroups.Add(1);
BlueTeam.Spawns.RespawnTime.Value = 10;
BlueTeam.Build.BlocksSet.Value = BuildBlocksSet.Blue;

// задаем что выводить в лидербордах
LeaderBoard.PlayerLeaderBoardValues = [
 new DisplayValueHeader('Kills', 'K', 'K'),
 new DisplayValueHeader('Deaths', 'D', 'D'),
 new DisplayValueHeader('Sores', 'Очки', 'Очки'),
 new DisplayValueHeader('Spawns', 'S', 'S')
];
LeaderBoard.TeamWeightGetter.Set(function(player) {
 return player.Properties.Get('Deaths').Value;
});

// задаем что вводить вверху экрана
const Deaths = 'Приятной игры!';
Ui.GetContext().TeamProp1.Value = { Team: 'Blue', Prop: 'Deaths' };
BlueTeam.Properties.Get('Deaths').Value = Deaths;

// вход в команды по запросу
Teams.OnRequestJoinTeam.Add(function(player, team){ team.Add(player);});
// спавн, после входа в команду
Teams.OnPlayerChangeTeam.Add(function(player){ player.Spawns.Spawn()});

// задаем щит 
spawns.OnSpawn.Add(function(player) {
 player.Properties.Immortality.Value = true;
 player.Timers.Get('Immortality').Restart(10);
});
Timers.OnPlayerTimer.Add(function(timer) {
 if (timer.Id != Immortality) player.Properties.Immortality.Value = false;
	return;
});

// счетчик спавнов
spawns.OnSpawn.Add(function(player) {
 ++player.Properties.Spawns.Value;
});

// счётчик смертей
Damage.OnDeath.Add(function(player) {
 ++player.Properties.Deaths.Value;
if (player.Properties.Deaths.Value === 1) 
 player.Ui.Hint.Value = 'Вас убили.Ожидайте конца матча!';
 player.Spawns.Enable = false;
 player.Spawns.Despawn();
if (BlueTeam.Player === 1) SetEnd0fMatch(); // если выживший один
});

// счётчик убийств
Damage.OnKill.Add(function(player, killed) {
 if (killed.Team != null && killed.Team != player.Team) {
   ++player.Properties.Kills.Value; 
          player.Properties.Scores.Value += KillScores;
	player.Properties.Scores.Value += 100;
         } 
});

// таймер очков
ScoresTimer.OnTimer.Add(function() {
 for (const player of Players.All) {
    if (player.Team === null) continue;
   player.Properties.Scores.Value += TimerScores;
         }
});

// настройки переключения режимов
MainTimer.OnTimer.Add(function() {
 switch (StateProp.Value) {
case  WaitingStateValue:
  SetSertchWeapon();
	break;
case SearchWeaponStateValue:
  SetGameMode();
	 break;
case GameModeStateValue:
  SetEnd0fMatch();
	 break;
case End0fMatchStateValue:
  RestartGame();
	break;
          }
});

// задаем первое игровое состояние 
SetWaitingMode();

// состояние игры
function SetWaitingMode() {
 StateProp.Value = WaitingStateValue;
 Ui.GetContext().Hint.Value = 'Ожидание, всех - игроков...';
 Spawns.GetContext().Enable = false;
 MainTimer.Restart(WaitingPlayersTime);
}
function SetSertchWeapon() {
 StateProp.Value = SearchWeaponStateValue;
 BlueTeam.Ui.Hint.Value = 'Собирайте ресурсы, с зон!';

 inventory.Main.Value = false;
 inventory.Secondary.Value = false;
 inventory.Melee.Value = false;
 inventory.Explosive.Value = false;
 inventory.Build.Value = false;

 // создаем триггеры 
 CreateNewArea('MeleeTrigger', ['MeleeTrigger'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: холодное оружие!';
  player.inventory.Melee.Value = true;
if (player.inventory.Melee.Value) {
   p.Ui.Hint.Value = 'У вас, уже есть: холодное оружие!';
	return;
    }
 }, function(player, area) {}, 'ViewMeleeTrigger', new Color(0, 1, 0, 0), true);

CreateNewArea('SecondaryTrigger', ['SecondaryTrigger'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: вторичное оружие!';
  player.inventory.Secondary.Value = true;
if (player.inventory.Secondary.Value) {
     player.Ui.Hint.Value = 'У вас, уже есть: вторичное оружие!';
	return;
    }
 }, function(player, area) {}, 'ViewSecondaryTrigger', new Color(0, 1, 0, 0), true);

CreateNewArea('MainTrigger', ['MainTrigger'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: основное оружие!';
  player.inventory.Main.Value = true;
if (player.inventory.Main.Value) {
  p.Ui.Hint.Value = 'У вас, уже есть: основное оружие!';
	return;
    }
 }, function(player, area) {}, 'ViewMainTrigger', new Color(0, 1, 0, 0), true);

CreateNewArea('SecondaryInfinityTrigger', ['SecondaryInfinityTrigger'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: бесконечные боеприпасы, для вторичного - оружия!';
  player.inventory.SecondaryInfinity.Value = true;
 if (player.Properties.SecondaryInfinity.Value) {
  player.Ui.Hint.Value = 'У вас, уже есть: бесконечные боеприпасы, для вторичного - оружия!';
    return 
    }
 }, function(player, area) {}, 'ViewSecondaryInfinityTrigger', new Color(0, 1, 0, 0), true);

CreateNewArea('MainInfinityTrigger', ['MainInfinityTrigger'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: бесконечные боеприпасы, для основного - оружия!';
  player.inventory.MainInfinity.Value = true;
if (player.Properties.MainInfinity.Value) {
  player.Ui.Hint.Value = 'У вас, уже есть: бесконечные боеприпасы, для основного - оружия!';
    return 
}
 }, function(player, area) {}, 'ViewMainInfinityTrigger', new Color(0, 1, 0, 0), true);

CreateNewArea('Hp50', ['Hp50'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: (x50) бинты!';
  player.Properties.Get('Hp50').Value = true;
  player.contextedProperties.MaxHp.Value += 50;
if (player.Properties.Get('Hp50').Value) {
  player.Ui.Hint.Value = 'бинтов: (x50) нету!';
 }, function(player, area) {}, 'ViewHp50', new Color(1, 0, 0, 0), true);

CreateNewArea('Hp500', ['Hp500'], function(player, area){
  player.Ui.Hint.Value = 'Вы, взяли: (x500) бинты!';
  player.Properties.Get('Hp500').Value = true;
  player.contextedProperties.MaxHp.Value += 500;
if (player.Properties.Get('Hp500').Value) {
  player.Ui.Hint.Value = 'бинтов: (x500) нету!';
 }, function(player, area) {}, 'ViewHp500', new Color(1, 0, 0, 0), true);

 MainTimer.Restart(SearchWeaponTime);
 Damage.GetContext().FriendlyFire.Value = false;
 Spawns.GetContext().Enable = true;
 SpawnPlayers();
}
function SetGameMode() {
 StateProp.Value = GameModeStateValue;
 Ui.GetContext().Hint.Value = 'Атакуйте, всех - врагов!';
 Damage.GetContext().FriendlyFire.Value = true;
 MainTimer.Restart(GameModeTime);
 Spawns.GetContext().Despawn();
 SpawnPlayers();
}
function SetEnd0fMatch() {
 StateProp.Value = EndOfMatchStateValue;
 Ui.GetContext().Hint.Value = 'Конец, матча!';
if (player.Properties.Deaths.Value === 0) {
  player.Properties.Scores.Value += WinnersScores;
}
    
 spawns.Enable = false;
 spawns.Despawn();
 ScoresTimer.Stop();
 Game.GameOver(LeaderBoard.GetPlayers());
}
function RestartGame() {
 if (GameMode.Parameters.GetBool('LoadRandomMap')) {
Map.LoadRandomMap();
 }
 Game.RestartGame();
}

function SpawnPlayers() {
 for (const player of Players) {
Spawns.GetContext(player).Spawn();
     }
}

ScoresTimer.RestartLoop(ScoresTimerInterval);
	
} catch (e) {
        Room.Players.All.forEach(msg => {
             msg.Show(`${e.name}: ${e.message} ${e.stack}`);
        });
}
