<script>
  import { getContext, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  const { Socket } = getContext('connect');
  const socket = Socket();
  import { game } from '../stores/chat-stores';

  onMount(() => {
    game.subscribe((roomName) => {
      room = roomName;
    });
    //////////////////////////////HERE IS WHERE U LEFT OFF IDIOT ????????????????????
    playerz = JSON.parse(sessionStorage.getItem('players')).filter((player) => player.room == room);
  });

  const resetPoints = () => {
    setTimeout(() => {
      newPoints = 0;
    }, 2500);
  };
  // $: drawer = JSON.parse(sessionStorage.getItem('drawer'));

  // socket.on('drawer', (drawerz) => {
  //   // drawer = JSON.parse(sessionStorage.getItem('drawer'));
  //   console.log(drawerz, 'drawer');
  //   drawer = drawerz;
  // });
  $: room = '';
  $: playerz = [];
  $: newPoints = 0;
  $: pointsAddedTo = [];
  socket.on('addPoints', ({ pointsAdded, data }) => {
    let playerx = JSON.parse(sessionStorage.getItem('players')).filter(
      (player) => player.room == room,
    );
    playerz = playerx.sort((a, b) => b.points - a.points);
    newPoints = pointsAdded;
    pointsAddedTo = data;
    resetPoints();
  });
</script>

<div
  class="border-2 rounded-md border-secondary shadow-69xl shadow-secondary overflow-y-auto h-[60%] w-[20%] sm:h-[20%] sm:w-[80%] bg-neutral p-3"
>
  {#if playerz.length > 0}
    {#each playerz as player}
      <div class="stats w-full mt-2">
        <div class="stat flex">
          <div class="flex items-center justify-center">
            <div>
              <div class="w-16">
                <ion-icon size="large" name={player.icon.icon} class={player.icon.color} />
              </div>
            </div>
          </div>
          <div>
            <div class="stat-title">
              <!-- {#if player.id === drawer.id}
                <p class="text-2x text-primary">{player.name} ✍️</p>
              {:else} -->
              <p class="text-2x text-accent">{player.name}</p>
              <!-- {/if} -->
            </div>
            <div class="flex">
              <div class="stat-value">{player.points}</div>
              <div class="stat-value">
                {#if pointsAddedTo === player.id}
                  {#if newPoints !== 0}
                    <span class="text-green-600" transition:fade={{ duration: 1000 }}
                      >+{newPoints}</span
                    >
                  {/if}
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
