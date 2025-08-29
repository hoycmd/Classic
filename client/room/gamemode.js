import { Players, Inventory, Teams, Ui, Game, Spawns, LeaderBoard, Damage, GameMode, BuildBlocksSet, BreackGraph , Properties, Map, AreaPlayerTriggerService, AreaService, Timers, TeamsBalancer, msg } from 'pixel_combats/room';
import { DisplayValueHeader, Color } from 'pixel_combats/basic';

try 

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

// триггеры
const MeleeTrigger = CreateNewArea('MeleeTrigger', ['MeleeTrigger'], function(p,a){
 if (p.inventory.Melee.Value) p.Ui.Hint.Value = 'У вас, уже есть: холодное оружие!'; return;
  p.Ui.Hint.Value = 'Вы, взяли: холодное оружие!';
  p.inventory.Melee.Value = true;
}, function(p,a) {}, 'ViewMeleeTrigger', new Color(0, 1, 0, 0), true)CreateNewAreae'SecondaryTrigger', ['SecondaryTrigger'], function(player,area){
        if (player.inventory.Secondary.Value) {
                player.Ui.Hint.Value = 'У вас, уже есть: вторичное оружие!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: вторичное оружие!';
        player.inventory.Secondary.Value = true;
}, function(player, area) {}, 'ViewSecondaryTrigger', new Color(0, 1, 0, 0), true)
CreateNewArea'MainTrigger''MainTrigger'r', ['MainTrigger'], function(player, area){
        if (player.inventory.Main.Value) {
                p.Ui.Hint.Value = 'У вас, уже есть: основное оружие!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: основное оружие!';
        player.inventory.Main.Value = true;
}, function(player, area) {}, 'ViewMainTrigger', new Color(0, 1, 0, 0), true);
CreateNewArea('SecondaryInfinityTrigger', ['SecondaryInfinityTrigger'], function(player, area){
        if (player.Properties.SecondaryInfinity.Value) {
                player.Ui.Hint.Value = 'У вас, уже есть: бесконечные боеприпасы, для вторичного - оружия!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: бесконечные боеприпасы, для вторичного - оружия!';
        player.inventory.SecondaryInfinity.Value = true;
}, function(player, area) {}, 'ViewSecondaryInfinityTrigger', new Color(0, 1, 0, 0), true);
CreateNewArea('MainInfinityTrigger', ['MainInfinityTrigger'], function(player, area){
        if (player.Properties.MainInfinity.Value) {
                player.Ui.Hint.Value = 'У вас, уже есть: бесконечные боеприпасы, для основного - оружия!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: бесконечные боеприпасы, для основного - оружия!';
        player.inventory.MainInfinity.Value = true;
}, function(player, area) {}, 'ViewMainInfinityTrigger', new Color(0, 1, 0, 0), true);
CreateNewArea('Hp50', ['Hp50'], function(player, area){
        if (!player.Properties.Get('Hp50').Value) {
                player.Ui.Hint.Value = 'бинтов: (x50) нету!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: (x50) бинты!';
        player.Properties.Get('Hp50').Value = true;
        player.contextedProperties.MaxHp.Value += 50;
}, function(player, area) {}, 'ViewHp50', new Color(1, 0, 0, 0), true);
CreateNewArea('Hp500', ['Hp500'], function(player, area){
        if (!player.Properties.Get('Hp500').Value) {
                player.Ui.Hint.Value = 'Бинтов: (x500) нету!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: (x500) бинты!';
        player.Properties.Get('Hp500').Value = true;
        player.contextedProperties.MaxHp.Value += 500;
}, function(player, area) {}, 'ViewHp500', new Color(1, 0, 0, 0), true);

// =====Настройки режима=====
const Map.Rotation = GameMode.Parameters.GetBool('MapRotation');
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool('PartialDesruction');
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');
Damage.GetContext().DamageOut.Value = true;
Damage.GetContext().FriendlyFire.Value = true;
BreackGraph.PlayerBlocksBoost = true;

// =====Создание команд=====
const PlayersTeam = CreateNewTeam('Players', 'Игроки', new Color(0, 0, 0.5, 0), 1, BuildBlocksSet.Blue);

// =====Лидерборд=====
LeaderBoard.PlayerLeaderBoardValues = [
        new DisplayValueHeader('Kills', 'K', 'K'),
        new DisplayValueHeader('Deaths', 'D', 'D'),
        new DisplayValueHeader('Sores', 'Очки', 'Очки'),
        new DisplayValueHeader('Spawns', 'S', 'S')
];
LeaderBoard.TeamWeightGetter.Set(function(player) {
        return player.Properties.Get('Deaths').Value;
});

// =====Вывод надписи сверху экрана (в полосе лидерборда)=====
Ui.GetContext().TeamProp1.Value = { Team: 'Blue', Prop: 'TeamHint' };
BlueTeam.Properties.Get('TeamHint').Value = 'Приятной игры!';

// =====Запросы входа в команду и спавна после них=====
Teams.OnRequestJoinTeam.Add(function(player, team){
        team.Add(player);
});
Teams.OnPlayerChangeTeam.Add(function(player){
        player.Spawns.Spawn();
});

// =====Счётчик спавнов=====
Spawns.OnSpawn.Add(function(player) {
        player.Properties.Immortality.Value = true;
        player.Timers.Get('Immortality').Restart(10);
});
Timers.OnPlayerTimer.Add(function(timer) {
        if (timer.Id === 'Immortality') timer.player.Properties.Immortality.Value = false;
});
Spawns.OnSpawn.Add(function(player) {
        ++player.Properties.Spawns.Value;
});

// =====Счётчик смертей=====
Damage.OnDeath.Add(function(player) {
        ++player.Properties.Deaths.Value;
        if (PlayersTeam.GetAlivePlayersCount() <= 0) SetEnd0fMatch();
        player.Ui.Hint.Value = 'Вас убили. Ожидайте конца матча!';
        player.Spawns.Enable = false;
        player.Spawns.Despawn();
});

// =====Счётчик убийств=====
Damage.OnKill.Add(function(player, killed) {
        if (killed.Team != null && killed.Team != player.Team) {
                ++player.Properties.Kills.Value; 
                player.Properties.Scores.Value += KillScores;
                player.Properties.Scores.Value += 100;
        } 
});

// =====Таймер очков=====
ScoresTimer.OnTimer.Add(function() {
        for (const player of Players.All) {
                if (player.Team === null) continue;
                player.Properties.Scores.Value += TimerScores;
        }
});

// =====Переключение режимов=====
MainTimer.OnTimer.Add(function() {
        switch (StateProp.Value) {
                case  WaitingStateValue:
                        SetSertchWeapon();
                        break;
                case SearchWeaponStateValue:
                        SetGameMode();
                        break;
                case GameStateValue:
                        SetEnd0fMatch();
                        break;
                case End0fMatchStateValue:
                        RestartGame();
                        break;
        }
});

// =====Установка первого режима=====
SetWaitingMode();

// =====Режимы=====
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
        MainTimer.Restart(SearchWeaponTime);
        Damage.GetContext().FriendlyFire.Value = false;
        Spawns.GetContext().Enable = true;
        SpawnPlayers();
}
function SetGameMode() {
        StateProp.Value = GameStateValue;
        Ui.GetContext().Hint.Value = 'Атакуйте, всех - врагов!';
        Damage.GetContext().FriendlyFire.Value = true;
        MainTimer.Restart(GameModeTime);
        Spawns.GetContext().Despawn();
        SpawnPlayers();
}
function SetEnd0fMatch() {
        StateProp.Value = End0fMatchStateValue;
        Ui.GetContext().Hint.Value = 'Конец, матча!';
        Players.All.forEach(player => {
                if (player.Properties.Deaths.Value === 0) player.Properties.Scores.Value += WinnersScores;
        });
        Spawns.Enable = false;
        Spawns.Despawn();
        ScoresTimer.Stop();
        MainTimer.Restart(End0fMatchTime);
        Game.GameOver(LeaderBoard.GetPlayers());
}
function RestartGame() {
        if (GameMode.Parameters.GetBool('LoadRandomMap')) Map.LoadRandomMap();
        else Game.RestartGame();
}
function SpawnPlayers() {
        for (const player of Players) {
                Spawns.GetContext(player).Spawn();
        }
}

// =====Запуск таймера очков=====
ScoresTimer.RestartLoop(ScoresTimerInterval);

// =====Вспомогательные функции=====
function CreateNewTeam(TeamName, TeamDisplayName, TeamColor, TeamSpawnPointGroup, TeamBuildBlocksSet) {
        Room.Teams.Add(TeamName, TeamDisplayName, TeamColor);
        const NewTeam = Room.Teams.Get(TeamName);
        NewTeam.Spawns.SpawnPointsGroups.Add(TeamSpawnPointGroup);
        NewTeam.Build.BlocksSet.Value = TeamBuildBlocksSet;
        return NewTeam;
}
function CreateNewArea(AreaName, AreaTags, AreaEnable, AreaOnEnter, AreaOnExit, AreaViewName, AreaViewColor, AreaViewEnable) {
        const NewArea = Room.AreaPlayerTriggerService.Get(AreaName);
        NewArea.Tags = AreaTags;
        NewArea.Enable = AreaEnable;
        NewArea.OnEnter.Add(AreaOnEnter);
        NewArea.OnExit.Add(AreaOnExit);
        const NewAreaView = Room.AreaViewService.GetContext().Get(AreaViewName);
        NewAreaView.Color = AreaViewColor;
        NewAreaView.Tags = AreaTags;
        NewAreaView.Enable = AreaViewEnable;
}

// =====Ловля ошибок=====
} catch (e) {
        Players.All.forEach(msg => {
             msg.Show(`${e.name}: ${e.message} ${e.stack}`);
        });
}
