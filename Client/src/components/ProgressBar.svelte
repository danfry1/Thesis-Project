<script>
  import { onMount } from 'svelte';
  import { timer, waitingTime, roundTime, gameRound, numberOfRounds } from '../stores/gameStates';
  import { getContext } from 'svelte';
  const { Socket } = getContext('connect');
  const socket = Socket();
  import wordDb from '../assets/db';
  const randomWords = wordDb;
  let socketId = sessionStorage.getItem('socketid');
  let drawer = JSON.parse(sessionStorage.getItem('drawer'));
  let time;

  if ($gameRound === $numberOfRounds) {
    gameRound.set(0);
    socket.emit('clear');
 
    clearInterval(time);

  }

  socket.on('start', () => {
    time = setInterval(() => {
      if ($timer <= 0) {
        gameRound.set($gameRound + 1);
        timer.set($roundTime + $waitingTime);
        if (socketId === drawer.id) {
          socket.emit(
            'roundOver',
            randomWords[Math.floor(Math.random() * randomWords.length)].word,
          );
          socket.emit('drawer');
        }
        socket.emit('clear');
      }
      if (socketId === drawer.id) {
        socket.emit('timer', $timer);
      }
      timer.set($timer - 1);
    }, 1000);
  });

  socket.on('allGuessed', () => {
    timer.set($roundTime + $waitingTime);
    gameRound.set($gameRound + 1);
    if (socketId === drawer.id) {
      socket.emit('drawer');
    }
    socket.emit('clear');
  });

  $: realTime = $roundTime;

  socket.on('timer', (timer) => {
    realTime = timer;
  });
  let setTime;
  onMount(() => {
    //Need to set this so the value of the progressbar percentage is correct for any timer
    setTime = $timer;
  });
</script>

<div class="w-full">
  <div
    class="radial-progress text-primary"
    style="--value:{(realTime * 100) / setTime}; --size:4rem;"
  >
    {(realTime * 100) / setTime / 2}
  </div>
</div>
