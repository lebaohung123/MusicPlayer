const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const audio = $("#audio");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const playList = $(".playlist");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const songActive = $$(".song");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  listSongs: [
    {
      song: "Buông Đôi Tay Nhau Ra",
      author: "Sơn Tùng - MTP",
      path: "./assets/BuongDoiTayNhauRa-SonTungMTP-4184408.mp3",
      img: "./assets/s5.jpg",
    },
    {
      song: "Để Tôi Ôm Em Bằng Giai Điệu Này",
      author: "Min (ST319)",
      path: "./assets/DeToiOmEmBangGiaiDieuNay-KaiDinhMINGREYD-8416034.mp3",
      img: "./assets/s3.jpg",
    },
    {
      song: "I do",
      author: "Đức Phúc ft 911Band",
      path: "./assets/EmDongYIDo-DucPhucx911-8679310.mp3",
      img: "./assets/s1.jpg",
    },
    {
      song: "Em Làm Gì Tối Nay",
      author: "Khắc Việt",
      path: "./assets/EmLamGiToiNay-KhacViet-3602434.mp3",
      img: "./assets/s2.jpg",
    },
    {
      song: "Gác Lại Âu Lo",
      author: "  Miu Lê, Dalab",
      path: "./assets/GacLaiAuLo-DaLABMiuLe-6360815.mp3",
      img: "./assets/s4.jpg",
    },
    {
      song: "Hai Mươi Hai (22)",
      author: "  Amee",
      path: "./assets/HaiMuoiHai22-HuaKimTuyenAMEE-7231237.mp3",
      img: "./assets/s6.jpg",
    },
    {
      song: "Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau",
      author: "  Miu Le",
      path: "./assets/RoiTaSeNgamPhaoHoaCungNhau-OlewVietNam-8485329.mp3",
      img: "./assets/s7.jpg",
    },
  ],
  render: function () {
    const htmls = this.listSongs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = ${index}>
      <div
        class="thumb"
        style="
          background-image: url('${song.img}');
        "
      ></div>
      <div class="body">
        <h3 class="title">${song.song}</h3>
        <p class="author">${song.author}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.listSongs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    document.onscroll = function () {
      const widthScroll =
        document.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - widthScroll;
      // console.log(newWidth);
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
        _this.isPlaying = true;
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const currentTime = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        // console.log(currentTime);
        progress.value = currentTime;
      }
    };

    progress.onchange = function (e) {
      audio.currentTime = (audio.duration * e.target.value) / 100;
    };

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.preSong();
      }
      audio.play();
      _this.scrollToActiveSong();
    };

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        _this.currentIndex = _this.currentIndex;
      } else {
        if (_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.nextSong();
        }
      }
      audio.play();
    };

    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }, 200);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.song;
    cdThumb.style.backgroundImage = `url("${this.currentSong.img}")`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.listSongs.length) {
      this.currentIndex = 0;
    }
    // console.log(this.currentIndex, this.listSongs.length - 1);
    this.loadCurrentSong();
  },

  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.listSongs.length - 1;
    }
    // console.log(this.currentIndex, this.listSongs.length - 1);
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.listSongs.length);
    } while (randomIndex === this.currentIndex);
    this.currentIndex = randomIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Định nghĩa cho thuộc tính
    this.defineProperties();

    // Xử lí các sự kiện
    this.handleEvent();

    // Load bài hát đầu tiên khi chạy ứng dụng
    this.loadCurrentSong();

    // Render ra playlist
    this.render();
  },
};

app.start();
