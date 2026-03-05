## Networking and Replication

### Replication Basics

Replication is UE5's system for synchronizing game state across a networked session (server and clients).

> **In your games:**
> - **DnD RPG**: Replication matters if you add local co-op or online multiplayer later. Even in single-player, understanding replication helps you write "network-ready" code from the start. If you structure your gameplay logic with authority checks now, adding multiplayer later is much easier than retrofitting.
> - **Wizard's Chess**: Online multiplayer chess is a natural fit. Two players, turn-based, low bandwidth. Replication is straightforward for this use case since you only need to sync board state and piece movements, not real-time physics.

#### DOREPLIFETIME

In the `.cpp` file, override `GetLifetimeReplicatedProps`:

```cpp
void AMyActor::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AMyActor, Health);
    DOREPLIFETIME_CONDITION(AMyActor, Ammo, COND_OwnerOnly);
}
```

Condition macros: `COND_None`, `COND_InitialOnly`, `COND_OwnerOnly`, `COND_SkipOwner`, `COND_SimulatedOnly`, `COND_AutonomousOnly`, `COND_SimulatedOrPhysics`, `COND_InitialOrOwner`, `COND_Custom`, `COND_ReplayOrOwner`, `COND_ReplayOnly`, `COND_SimulatedOnlyNoReplay`, `COND_SimulatedOrPhysicsNoReplay`, `COND_SkipReplay`, `COND_Dynamic`, `COND_Never`.

> **In your games:**
> - **DnD RPG**: If you add co-op, replicate key character stats like Health, Mana, and StatusEffects. Use `COND_OwnerOnly` for inventory data (only the owning player needs their own inventory details). Use `COND_InitialOnly` for static properties like CharacterClass that never change after spawn.
> - **Wizard's Chess**: Replicate the board state array and the current turn indicator. Use `COND_None` (replicate to everyone) for the board state since both players need the full picture. Captured piece lists can also use `COND_None` since both players see the same captures.

#### UPROPERTY(Replicated)

```cpp
UPROPERTY(Replicated)
float Health;
```

This marks a property for replication. The property is sent from server to clients when it changes. Requires `DOREPLIFETIME` registration.

#### ReplicatedUsing

```cpp
UPROPERTY(ReplicatedUsing = OnRep_Health)
float Health;

UFUNCTION()
void OnRep_Health();
```

`ReplicatedUsing` triggers a callback on the client when the value changes. The `OnRep_` function fires after the new value is applied. Use this for reactive logic (updating UI, playing effects, etc.).

> **In your games:**
> - **DnD RPG**: Use `ReplicatedUsing` for Health to trigger damage number popups and health bar updates on clients. Use it for StatusEffects to trigger visual changes (poison green tint, frozen ice shader overlay) when a debuff is applied by the server.
> - **Wizard's Chess**: Use `ReplicatedUsing` for the board state. When `OnRep_BoardState` fires, the client plays the piece movement animation, capture animation, and sound effects. This keeps the server authoritative over game logic while clients handle presentation.

### RPCs (Remote Procedure Calls)

#### Server RPCs

```cpp
UFUNCTION(Server, Reliable)
void ServerFireWeapon();
```

Called from owning client, executes on server. Only the owning client can call Server RPCs.

#### Client RPCs

```cpp
UFUNCTION(Client, Reliable)
void ClientShowDamageNumber(float Damage);
```

Called from server, executes on the owning client only.

#### NetMulticast RPCs

```cpp
UFUNCTION(NetMulticast, Unreliable)
void MulticastPlayExplosionEffect();
```

Called from server, executes on server AND all connected clients.

#### Reliable vs Unreliable

- **Reliable**: Guaranteed delivery and ordering. Used for important gameplay events (damage, death, game state changes). Excessive reliable RPCs can saturate the reliable buffer and cause disconnects.
- **Unreliable**: Fire-and-forget. Can be dropped or arrive out of order. Used for cosmetic/non-critical events (particles, sounds, frequent updates). Lower overhead.

> **In your games:**
> - **DnD RPG** (if co-op is added):
>   - **Server RPCs**: `ServerRequestMove(FVector Destination)` for player movement, `ServerCastSpell(ESpellType Spell, AActor* Target)` for spell casting, `ServerUseItem(int32 SlotIndex)` for inventory actions. All gameplay-changing actions go through Server RPCs.
>   - **Client RPCs**: `ClientShowLootDrop(FLootData Loot)` to notify a specific player about loot only they can see.
>   - **NetMulticast (Unreliable)**: `MulticastPlaySpellVFX(FVector Location, ESpellType Spell)` for visual effects all players see. Unreliable is fine because a missed particle effect is not game-breaking.
>   - **NetMulticast (Reliable)**: `MulticastPlayDeathAnimation(AActor* DeadEnemy)` for important events everyone must see.
> - **Wizard's Chess** (online multiplayer):
>   - **Server RPCs**: `ServerRequestMove(FChessMove Move)` is the main one. The client sends the desired move, the server validates it (legal move check), applies it, and replicates the new board state. This is the core of the entire network architecture.
>   - **Client RPCs**: `ClientNotifyIllegalMove()` to tell a player their move was rejected. `ClientNotifyCheck()` to tell a player they are in check.
>   - **NetMulticast (Reliable)**: `MulticastAnnounceCheckmate(EChessColor Winner)` for game-ending events.
>   - **NetMulticast (Unreliable)**: `MulticastPlayCaptureEffect(FVector Location)` for visual flair during captures.

### Actor Replication

- Enable per-actor: `bReplicates = true` in constructor or **Details > Replication > Replicates**.
- `bAlwaysRelevant`: Actor is always replicated to all clients regardless of distance.
- `bNetUseOwnerRelevancy`: Use owner's relevancy instead of own.
- `AActor::GetLifetimeReplicatedProps()` defines which properties replicate.
- Actors are only replicated if they are relevant to the client (see Relevancy below).

> **In your games:**
> - **DnD RPG**: The GameState actor (dungeon progress, quest state, enemy status) should have `bAlwaysRelevant = true` so all co-op players always know the game state. Individual enemy actors can use default distance-based relevancy since players only need to know about nearby enemies.
> - **Wizard's Chess**: The ChessBoard actor and all ChessPiece actors should have `bAlwaysRelevant = true`. The entire board is always visible to both players, so distance-based culling makes no sense here. The GameState (whose turn, time remaining, check status) is also always relevant.

### Component Replication

- `UActorComponent::SetIsReplicatedByDefault(true)` in the component constructor.
- Or set `bReplicates = true` at runtime via `SetIsReplicated(true)`.
- Component properties use the same `UPROPERTY(Replicated)` and `DOREPLIFETIME` pattern.
- Components must be registered before replication works.

> **In your games:**
> - **DnD RPG**: An InventoryComponent on the player character should replicate so the server tracks what items each player has. A HealthComponent with replicated Health/MaxHealth/Shield values keeps stats synced. A SpellbookComponent tracking available spells and cooldowns per player.
> - **Wizard's Chess**: A BoardStateComponent on the ChessBoard actor could hold the 8x8 array and replicate it. A TimerComponent for chess clocks should replicate so both players see accurate remaining time.

### Subobject Replication

- For replicating UObjects that are not components, use `AActor::ReplicateSubobjects()`.
- Override `ReplicateSubobjects` on the owning actor and call `Channel->ReplicateSubobject(SubObj, *Bunch, *RepFlags)`.
- Alternatively, use `DOREPLIFETIME` on `UObject`-derived classes with the Actor's replicated subobject list.

> **In your games:**
> - **DnD RPG**: If you represent inventory items as UObjects (not actors), you would need subobject replication to sync them. Consider whether items should be actors (simpler replication) or UObjects (lighter weight, more complex replication). For a small inventory, actors are simpler.
> - **Wizard's Chess**: Each chess piece could be a UObject subobject of the board actor rather than a separate actor. This reduces actor count but adds replication complexity. For 32 pieces, either approach works. Separate actors per piece is simpler to set up.

### NetMode

Access via `GetNetMode()` or `GetWorld()->GetNetMode()`:

| NetMode | Description |
|---------|-------------|
| `NM_Standalone` | Single-player, no networking. |
| `NM_DedicatedServer` | Headless server, no local player. |
| `NM_ListenServer` | Server with a local player. |
| `NM_Client` | Connected client. |

> **In your games:**
> - **DnD RPG**: Starts as `NM_Standalone`. If you add local co-op, it stays standalone (split-screen is handled locally, not through networking). If you add online co-op, the host would be `NM_ListenServer` and the joining player would be `NM_Client`. No need for a dedicated server for a 2-4 player co-op game.
> - **Wizard's Chess**: For online play, the host would be `NM_ListenServer` and the opponent would be `NM_Client`. This is the simplest setup for a 1v1 game. A dedicated server (`NM_DedicatedServer`) becomes worthwhile only if you add ranked matchmaking, anti-cheat, or tournament features.

### Authority, Ownership, Role, Remote Role

**Authority:**
- `HasAuthority()` returns true on the server for server-spawned actors, or on the client for client-only actors.
- Server has authority over all replicated actors.

**Ownership:**
- Set via `SetOwner(AActor*)`. Typically, Pawns are owned by their PlayerController.
- Ownership determines which client can call Server RPCs and receive Client RPCs and `COND_OwnerOnly` properties.

**Role and Remote Role:**

| Property | Server Value | Client Value |
|----------|-------------|-------------|
| `GetLocalRole()` | `ROLE_Authority` | `ROLE_SimulatedProxy` or `ROLE_AutonomousProxy` |
| `GetRemoteRole()` | `ROLE_SimulatedProxy` or `ROLE_AutonomousProxy` | `ROLE_Authority` |

- `ROLE_Authority`: This machine has authority over this actor.
- `ROLE_AutonomousProxy`: Client-controlled (owning client's pawn).
- `ROLE_SimulatedProxy`: Server-controlled, client receives updates.
- `ROLE_None`: Not replicated.

> **In your games:**
> - **DnD RPG**: Each player's character pawn is `ROLE_AutonomousProxy` on their own machine and `ROLE_SimulatedProxy` on other players' machines. The authority (server/host) validates all combat, spell, and movement logic. Enemies are `ROLE_SimulatedProxy` on all clients since the server controls them entirely.
> - **Wizard's Chess**: Each player's cursor/selector actor would be `ROLE_AutonomousProxy` on their machine. The chess pieces themselves are server-authoritative (`ROLE_Authority` on server, `ROLE_SimulatedProxy` on clients). The server validates every move, preventing cheating.

### Relevancy

- Actors are only replicated to clients for whom they are "relevant."
- Default relevancy: distance-based. `AActor::NetCullDistanceSquared` controls the maximum replication distance.
- `bAlwaysRelevant = true` overrides distance check.
- `bOnlyRelevantToOwner = true` replicates only to the owning client.
- `IsNetRelevantFor()` can be overridden for custom relevancy logic.
- **Net Priority** (`NetPriority`, default 1.0): Higher priority actors get bandwidth preference. PlayerControllers default to 3.0.
- **Net Update Frequency** (`NetUpdateFrequency`, default 100.0): Maximum updates per second for this actor. Lower values reduce bandwidth.

> **In your games:**
> - **DnD RPG**: In a dungeon, enemies in unexplored rooms could be `bAlwaysRelevant = false` with a moderate NetCullDistanceSquared so they do not replicate until players are nearby. This saves bandwidth in large dungeons. Boss actors and the GameState should be `bAlwaysRelevant = true`. Player characters should have high NetPriority (2.0-3.0) for responsive movement.
> - **Wizard's Chess**: Set `bAlwaysRelevant = true` on everything. The entire game state is always visible to both players, and there are only about 35 actors total (board + 32 pieces + game state + cursor per player). Bandwidth is trivial. Set NetUpdateFrequency low (5-10) for pieces since they only move once per turn.

### Dormancy

Dormancy allows actors to stop replicating when their state is stable:

- `DORM_Never`: Never dormant, always replicates.
- `DORM_Awake`: Currently active, will replicate.
- `DORM_DormantAll`: Dormant for all connections. No replication until woken.
- `DORM_DormantPartial`: Dormant for some connections.
- `DORM_Initial`: Starts dormant, wakes on first change.
- Wake with `FlushNetDormancy()` or `ForceNetUpdate()`.

> **In your games:**
> - **DnD RPG**: Set dungeon props (static furniture, decoration, treasure that has not been interacted with) to `DORM_Initial`. They start dormant and only wake when a player interacts with them (opens a chest, picks up loot). Enemies in distant rooms can start `DORM_DormantAll` and wake when players enter their area. This is efficient for large dungeon levels.
> - **Wizard's Chess**: Pieces that are not currently moving can use `DORM_Awake` with low NetUpdateFrequency. When a piece moves, call `ForceNetUpdate()` to ensure immediate replication. Captured pieces off the board can go `DORM_DormantAll` since their state will not change again.

### NetDriver, Connections, Channels

- **NetDriver** (`UNetDriver`): Manages all network connections. One per world (or per net context).
- **NetConnection** (`UNetConnection`): Represents a connection to a remote machine. One per client on the server.
- **Channels** (`UChannel`): Each connection has multiple channels:
  - **Control Channel** (channel 0): Handshake, login, level loading.
  - **Actor Channels**: One per replicated actor per connection. Handles property replication and RPCs.
  - **Voice Channel**: Voice data.
- `UNetDriver` subclasses: `UIpNetDriver` (default UDP), `USteamNetDriver` (Steam), etc.

> **In your games:**
> - **DnD RPG**: The default `UIpNetDriver` (UDP) works for LAN co-op. If you add online co-op through Steam, switch to `USteamNetDriver` so connections go through Steam's relay (handles NAT traversal and uses Steam IDs for authentication). Voice Channel could enable party voice chat during co-op dungeon runs.
> - **Wizard's Chess**: For online play, `USteamNetDriver` or Epic Online Services (EOS) NetDriver handles matchmaking and NAT traversal. A 1v1 chess game has minimal bandwidth needs, so either driver works fine. Voice Channel could be fun for trash-talking your opponent during games.

### Online Subsystem and Sessions

- **Online Subsystem** (OSS): Abstraction layer for platform services (Steam, EOS, Xbox Live, PSN, etc.).
- Enable the appropriate plugin: `OnlineSubsystem`, `OnlineSubsystemSteam`, `OnlineSubsystemEOS`, etc.
- **IOnlineSessionInterface**: Create, find, join, destroy sessions.
  - `CreateSession()`: Host a session with settings (map, max players, is LAN).
  - `FindSessions()`: Search for available sessions.
  - `JoinSession()`: Connect to a found session.
  - `DestroySession()`: Tear down the session.
- Configure in `DefaultEngine.ini`:

```ini
[OnlineSubsystem]
DefaultPlatformService=Steam

[OnlineSubsystemSteam]
bEnabled=true
SteamDevAppId=480
```

- **Session Settings** (`FOnlineSessionSettings`): NumPublicConnections, NumPrivateConnections, bIsLANMatch, bUsesPresence, bAllowJoinInProgress, bAllowInvites.

> **In your games:**
> - **DnD RPG**: If you add online co-op, use Steam or EOS Online Subsystem. Session settings: NumPublicConnections = 4 (for a 4-player party), bAllowJoinInProgress = true (let friends drop in mid-dungeon), bAllowInvites = true. Use `bUsesPresence = true` so Steam shows "Playing DnD RPG - Floor 3" in friends lists.
> - **Wizard's Chess**: Perfect use case for sessions. NumPublicConnections = 2 (1v1 only), bAllowJoinInProgress = false (cannot join a game mid-match), bIsLANMatch = false for online play. Use `FindSessions()` to build a lobby browser, or implement invite-only play with `bAllowInvites = true`. Session settings could include custom properties like time control (blitz, rapid, classical) so players can filter when searching for games.
