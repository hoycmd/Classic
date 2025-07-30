/*
Hi boss, thanks for the training, but I'm already interested in Java script on my laptop, so I won't be around much. Maybe we'll see each other again!
Sincerely, TNT

Okay ;/ So, if you will need help, let me know. Bye?



Ку ТНТ. Я тут немного исправил код, если не подходит что-то скажи, уберу, ну или сам убери. Код находится после этого текста.
Так как ты не любишь когда я тебя заставляю учиться, то вот просто материал (сам писал), а ты уж сам думай (мини обучение по JS, если захочешь
прочитай, никто не заставляет, можешь просто удалить этот текст):

Весь код буду писать так, чтобы ты понимал где код а где текст - начало кода позначаю как #S а конец как #E.

Во первых - комментарии: ты уже знаешь //, они не влияют на программу. Но есть ещё такие, как я использую вокруг этого многострочного
текста (палка и звёздочка).

Во вторых - переменные, делаются так:
#S
// name - имя, value - значение.
let name = value;
#E
Или:
#S
// name - имя.
let name;
#E
Если значения нет (тогда её значние - undefined, смотри ниже).
Ну а константы (переменные, которые нельзя изменить) делаются анологично с помощью const.

В третьих - типы. Тип это всё что ты можешь найти: 1 это number (число), 'привет' это string (строка), true/false это boolean (логическое
значение - да/нет), undefined - ничего (в программировании ничего тоже нужно учитывать), null - тоже ничего (но другое).
Также есть: объекты (object), массивы (array) и функции (function).

Вот самое простое что можешь сделать с числами: +, -, *, /, ** (степень), % (остаток от деления). Дробные числа записываются через точку (например, 3.14).

Если говорить о строках, то они могут быть из трёх видов кавычек: ' (одинарные), " (двойные), и ` (обратные/апострофы).
Строки можно добавлять, например: 'Учись' + 'ТНТ' будет 'УчисьТНТ'. Чтобы взять из строки определённый символ: 'строка'[0] даст 'с'.
У строк есть определённые методы (встроенные функции), вот основные:
#S
'строка'.toUpperCase() // даёт 'СТРОКА' 
'СТРОКА'.toLowerCase() // даёт 'строка'
'строка'.includes('стр') // даёт true, так как 'стр' есть в строке 'строка' (иначе было бы false).
'строка'.indexOf('о') // даёт 3, так как 'о' находится на 4 месте (всегда уменьшаем на 1, так как это индекс).
#E

Теперь когда ты знаешь типы ну и прямо минимальную основу (если ты вообще это читаешь), давай о сравнении:
Когда ты сравниваешь что-то, тебе всегда даёт true (условие сравнивания сработало) или false (условие сравнивания не сработало).
Есть два варианта сравнения на равность: == и ===. Первый сравнивает нестрого, второй строго (также сравнивает типы),
вот например: '2' == 2 даст true, но если использовать === то нет (так как разные типы).
Вот все операторы (знаки) для сравнения:
==, ===, >, >= (больше или равно), <, <= (меньше или равно), != (не равно), !== (строгое не равно).
Также есть знак ! для отрицания, если true даёт false и наоборот.

Ну а теперь о конструкциях.
Ты уже знаешь if, else, function. Вот о них и чуть-чуть:
#S
// Условие должно давать true или false. Поэтому чаще всего там операторы сравнения.
if (variable === 0) {
        Do();
}

// Можно без скобок "{}", если то, что нужно сделать в случае успеха, это лишь одна строка.
if (variable === 0) Do();

// Это конструкция если хочешь сделать "если" и "иначе".
if (variable === 0) {
        Do1();
} else {
        Do2();
}

// Также можно комбинировать, вот так (но это уже трудные конструкции): if () {} else if () {} else {}
#E

С функциями нужно объяснить немного больше:
#S
function name(param1, param2) {} // name это имя, param это параметры, или аргументы (они не обязательны).

// Например в PC2 можно сделать такую функцию, которая будет выводить текст игроку:
function ph(p, h) {
        p.Ui.Hint.Value = h;
}
// И потом делать так:
ph(player, 'Привет!');

// Но это не весь их функционал, так как функции также могут давать значение, для этого есть return, например:
function add(a, b) {
        return a + b;
}

// Теперь при вызове:
add(1, 2); // Даёт 3.

// Ну а если return в функции нет (или есть но без ничего, просто return), то она возвращает (то есть даёт) undefined.
#E

Я думаю если ты научишься этого, тебе уже будет легче. Ну а если захочешь, могу учить дальше, тут много чего интересного:
циклы (важная вещь, for, while), массивы ([1, 2, 3]), объекты ({name: 'TNT', lvl: 0}), замыкания (сложная тема, в скобках не покажу),
import и export, связка с HTML и CSS.

Если прочитал это, или пропустил, можешь удалить.
Ну а дальше идёт твой код, который я, надеюсь, исправил...
*/
import { Players, Inventory, Teams, Ui, Game, Spawns, LeaderBoard, Damage, GameMode, BuildBlocksSet, BreackGraph , Properties, Map, AreaPlayerTriggerService, AreaService, Timers, TeamsBalancer, msg } from 'pixel_combats/room';
import { DisplayValueHeader, Color } from 'pixel_combats/basic';

try {

// =====Настройки=====
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

// =====Зоны=====
CreateNewArea('MeleeTrigger', ['MeleeTrigger'], function(player, area){
        if (player.inventory.Melee.Value) {
                p.Ui.Hint.Value = 'У вас, уже есть: холодное оружие!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: холодное оружие!';
        player.inventory.Melee.Value = true;
}, function(player, area) {}, 'ViewMeleeTrigger', new Color(0, 1, 0, 0), true);
CreateNewArea('SecondaryTrigger', ['SecondaryTrigger'], function(player, area){
        if (player.inventory.Secondary.Value) {
                player.Ui.Hint.Value = 'У вас, уже есть: вторичное оружие!';
                return;
        }
        player.Ui.Hint.Value = 'Вы, взяли: вторичное оружие!';
        player.inventory.Secondary.Value = true;
}, function(player, area) {}, 'ViewSecondaryTrigger', new Color(0, 1, 0, 0), true);
CreateNewArea('MainTrigger', ['MainTrigger'], function(player, area){
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
Map.Rotation = GameMode.Parameters.GetBool('MapRotation');
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool('PartialDesruction');
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool('LoosenBlocks');
Damage.GetContext().DamageOut.Value = true;
Damage.GetContext().FriendlyFire.Value = true;
BreackGraph.PlayerBlocksBoost = true;

// =====Создание команд=====
const PlayersTeam = CreateNewTeam('Players', 'Игроки', new Color(0, 0, 0.5, 0), 1, BuildBlocksSet.Blue)

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
spawns.OnSpawn.Add(function(player) {
        player.Properties.Immortality.Value = true;
        player.Timers.Get('Immortality').Restart(10);
});
Timers.OnPlayerTimer.Add(function(timer) {
        if (timer.Id === 'Immortality') timer.player.Properties.Immortality.Value = false;
});
spawns.OnSpawn.Add(function(player) {
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
        spawns.Enable = false;
        spawns.Despawn();
        ScoresTimer.Stop();
        MainTimer.Restart(End0fMatchTime);
        Game.GameOver(LeaderBoard.GetPlayers());
}
function RestartGame() {
        if (GameMode.Parameters.GetBool('LoadRandomMap')) Map.LoadRandomMap();
        Game.RestartGame();
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
        Room.Players.All.forEach(msg => {
             msg.Show(`${e.name}: ${e.message} ${e.stack}`);
        });
}
