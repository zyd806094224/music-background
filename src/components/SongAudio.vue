<template>
  <div class="song-audio">
    <audio id="player" :src="url"
           controls="controls"
           preload="true"
           @canplay="startPlay"
           @ended="ended">

    </audio>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "SongAudio",
  computed:{
    ...mapGetters([
      'isPlay',
      'url',
      'id'
    ])
  },
  watch:{ //监听播放还是暂停状态
    isPlay: function (){
      this.togglePlay();
    }
  },
  methods:{
    startPlay(){ //获取连接后准备播放
      let player = document.querySelector('#player');
      player.play(); //开始播放
    },
    ended(){//播放完成之后触发
      this.isPlay = false;
    },
    togglePlay(){//开始、暂停
      let player = document.querySelector('#player');
      if(this.isPlay){
        player.play();
      }else{
        player.pause();
      }
    }
  }

}
</script>

<style>

.song-audio{
  display: none;
}

</style>
