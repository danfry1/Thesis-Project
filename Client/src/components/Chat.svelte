<script>
  import { beforeUpdate, afterUpdate, getContext, onMount } from 'svelte';
  import { secretWords } from '../stores/chat-stores';
  import { timer } from '../stores/gameStates';
  import wordDb from '../assets/db';

  const { Socket } = getContext('connect');
  const socket = Socket();
  //////////may not need this////////////////
  import { game } from '../stores/chat-stores';
  $: room = '';


  onMount(() => {
    game.subscribe((roomName) => {
      room = roomName;
    });
    playerz = JSON.parse(sessionStorage.getItem('players')).filter((player) => player.room == room);
  });
  ///////////////////////////////////////////////

  const randomWords = wordDb;

  // enabling chat to autoscroll
  let scroll;
  let autoscroll;
  let message = '';

  let messages = [];
  socket.on('chat message', (data) => {

    messages = [...messages, { user: data.user.name, message: data.message, guessed: false }];
  });

  let data = sessionStorage.getItem('socketid');
  drawer = JSON.parse(sessionStorage.getItem('drawer'));
  socket.on('drawer', (drawerw) => {
    drawer = drawerw;
  });

  $: pointsAdded = 0;
  $: guesserz = [];
  $: playerz = [];
  $: drawer = [];
  socket.on('addPoints', ({ guessersInTheRoom }) => {

    guesserz = guessersInTheRoom;

    if (playerz.length - 1 === guesserz.length) {
      socket.emit('allGuessed', randomWords[Math.floor(Math.random() * randomWords.length)].word);
    }
  });

  function sendMessage() {
    if (message === '') {
      return;
    }

    let pointCount = setPoints();
    socket.emit('chat message', { message, data });
    if (message === $secretWords.at(-1)) {
      pointsAdded = pointCount;
      socket.emit('points', { data, pointCount, pointsAdded });
    }
    message = '';
  }

  beforeUpdate(() => {
    autoscroll = scroll && scroll.offsetHeight + scroll.scrollTop > scroll.scrollHeight - 20;
  });

  afterUpdate(() => {
    if (autoscroll) scroll.scrollTo(0, scroll.scrollHeight);
  });

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }
  function setPoints() {
    const points = $timer;

    return points;
  }
  socket.on('allGuessed', () => {
    guesserz = [];
  });
</script>

<div
  class="flex flex-col justify-start h-[60%] w-[20%] sm:h-[20%] sm:w-[80%] sm:mb-10 border-2 rounded-md border-solid border-secondary shadow-69xl shadow-secondary bg-neutral"
>
  <div
    class="max-w-box md:w-df text-left flex-auto overflow-y-auto flex flex-col p-4 text-secondary"
    bind:this={scroll}
  >
    <ul>
      {#each messages as text}
        {#if text.message === $secretWords.at(-1)}
          <li class="break-all text-green-500">
            {text.user} guessed the word
          </li>
        {:else}
          <li class="break-all">{text.user}: <span class="text-white">{text.message}</span></li>
        {/if}
      {/each}
    </ul>
  </div>

  <div>
    <input
      class="input input-ghost input-sm text-secondary w-[97%] ml-1.5 mb-1"
      type="text"
      name=""
      id=""
      bind:value={message}
      placeholder="Enter your guess here...."
      on:keydown={handleKeydown}
    />
  </div>
</div>
