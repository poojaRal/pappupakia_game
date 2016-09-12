(function() {

  // There will be only 1 Pappu

  mit.Pappu = {
    x: 50,
    y: 10,
    w: 50,
    h: 50,

    invincible: 0,
    invincibility_start: 0,
    invincibility_time: 0,
    slow_mode: 0,
    slow_start: 0,
    slow_time: 0,
    clones: [],

    rotate_angle: 0,

    sprite: {},
    sound: '',

    // Rate of sprite frame change
    // per animation frame.
    change_per_frame: 10,

    fly_frame_count: 0,
    max_fly_frame_count: 10,
    cloneCharges : 3,
    invincibilityCharges : 3,
    invincibilityDuration : 5000,
    slowCharges : 1,
    slowDuration : 5000,

    init: function() {
      this.sound = document.getElementById("flap");

      // Initializing Pappu Sprite, lolzzz..!
      // this.sprite = new Image();
      // this.sprite.src = 'img/pappu.png';
      this.sprite = mit.image.pappu;

      //pappu.w = pappu.sprite.width;
      mit.Pappu.w = mit.Pappu.sprite.width;
      mit.Pappu.h = 60;

      // Sprite Frame Count
      mit.Pappu.max_fly_frame_count = 8;
      mit.Pappu.max_fly_frame_count--;

      // Sprite Frame Change Speed.
      // This will affect the flap speed.
      // 1.6 is the perfect value!
      mit.Pappu.change_per_frame = 1.6;

      // X Pos
      mit.Pappu.x = 33;
    },

    undoInvincible: function() {
      this.invincible = 0;
      this.invincibility_start = 0;
      this.invincible_time = 0;

      mit.ui.invincible_timer.hide();
    },

    undoSlowMode: function() {
      this.slow_mode = 0;
      this.slow_start = 0;
      this.slow_time = 0;
      mit.Backgrounds.resetAllSpeed();
      mit.PakiaUtils.slow_pakia = false;
      mit.ui.slow_timer.hide();
    },

    enterSlowMode: function()
    {
      if(this.slowCharges >= 1)
      {
        mit.Backgrounds.setAllSpeed(1, 1, 2, 3, 1);
        mit.PakiaUtils.slow_pakia = true;
        this.slow_mode = 1;
        this.slow_time = this.slowDuration;
        this.slow_start = new Date().getTime();
        mit.ui.slow_timer.show();
        this.slowCharges -= 1;
      }
    },

    setInvincibility: function()
    {
      if(this.invincibilityCharges >= 1)
      {
        this.invincible = 1;
        this.invincibility_start = new Date().getTime();
        this.invincibility_time = this.invincibilityDuration;
        // Show timer
        mit.ui.invincible_timer.show();
        this.invincibilityCharges -= 1;
      }
    },

    draw: function(ctx) {
      var cur_sprite_frame = this.fly_frame_count / this.change_per_frame;

      if (utils.isInt(cur_sprite_frame)) {
        var source_y = cur_sprite_frame * 60;
      }

      else {
        //var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)%this.change_per_frame;

        // Ultra smooth animations
        var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)
        var source_y = old_sprite_frame * 60;
      }

      // console.log(cur_sprite_frame, source_x);

      // Rotation on Flying
      if (mit.flying_up) {
        this.sound.play();

        if (this.rotate_angle > -15) {
          this.rotate_angle -= 2;
        }
      }
      else if (mit.game_over) {
        // draw() is called as long as
        // pappu hasnt hit boundaries and over'ed the game :P

        // Game Over Gugglu!
        this.rotate_angle += 4;
      }
      else {
        if (this.rotate_angle < 30) {
          this.rotate_angle += 2;
        }
      }

      ctx.save();

      ctx.translate(this.x, this.y);
      ctx.translate(this.w/2, this.h/2);
      ctx.rotate(utils.toRadian(this.rotate_angle));

      if (this.invincible) {
        ctx.globalAlpha = 0.4;

        // Current time
        var cur_time = new Date().getTime();
        var time_diff = cur_time - this.invincibility_start;

        var timer_progress = (time_diff/this.invincibility_time) * 100;

        if (timer_progress > 100)
          this.undoInvincible();
        else
          mit.ui.invincible_loader.css('width', timer_progress + '%');

        // console.log(timer_progress)
      }

      if (this.slow_mode) {
        // Current time
        var cur_time = new Date().getTime();
        var time_diff = cur_time - this.slow_start;

        var timer_progress = (time_diff/this.slow_time) * 100;

        if (timer_progress > 100)
          this.undoSlowMode();
        else
          mit.ui.slow_loader.css('width', timer_progress + '%');

        // console.log(timer_progress)
      }

      ctx.drawImage(
          this.sprite,
          0,
          source_y,
          this.w,
          60,
          -this.w/2,
          -this.h/2,
          this.w,
          60
        );

      ctx.restore();
    },

    drawStatic: function(ctx) {
      var cur_sprite_frame = this.fly_frame_count / this.change_per_frame;

      if (utils.isInt(cur_sprite_frame)) {
        var source_y = cur_sprite_frame * 60;
      }

      else {
        //var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)%this.change_per_frame;

        // Ultra smooth animations
        var old_sprite_frame = parseInt(this.fly_frame_count/this.change_per_frame)
        var source_y = old_sprite_frame * 60;
      }


      this.y = mit.Backgrounds.log_y-42;

      /*ctx.drawImage(
        this.sprite,
        0,
        0,
        this.w,
        60,
        this.x,
        this.y,
        this.w,
        60
      );*/

      ctx.drawImage(
        this.sprite,
        0,
        source_y,
        this.w,
        60,
        this.x,
        this.y,
        this.w,
        60
      );
    },

    updateFlyFrameCount: function(count) {
      if (typeof count !== 'number') {
        this.fly_frame_count++;

        if (parseInt(this.fly_frame_count/this.change_per_frame) > this.max_fly_frame_count) {
          this.fly_frame_count = 0;
        }

        return;
      }

      this.fly_frame_count = count;
    },

    hasReachedBoundary: function(canvas_width, canvas_height) {
      // Crossed Sides ?
      // `c` stands for crossed

      var ctop = (this.y < 0 - this.h);
      var cbtm = (this.y > mit.H);
      var cleft = (this.x < 0);
      var crgt = (this.x > mit.W);

      // return true if crossed any sides
      if (ctop || cbtm || cleft || crgt) {
        return true;
      }

      return false;
    },

    getBounds: function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    },

    createClones: function(count) {
      // This method will be usually called
      // when pappu gathers a 'clone' collectible.
if(this.cloneCharges > 0)
{
      var pappu_clone;

      for (var i = 0; i < count; i++) {
        pappu_clone = Object.create(mit.Pappu);

        pappu_clone.invincible = 0;

        this.clones.push(pappu_clone);
      }

      this.cloneCharges = this.cloneCharges - 1;
}
      return;
    },

    increaseCloneCharges: function()
    {
      this.cloneCharges = this.cloneCharges + 1;
      return;
    },

    increaseInvincibilityCharges: function()
    {
      this.invincibilityCharges = this.invincibilityCharges + 1;
      return;
    },

    increaseSlowmodeCharges: function()
    {
      this.slowCharges = this.slowCharges + 1;
      return;
    },

    drawClones: function(ctx) {

      var self = this;

      self.clones.forEach(function(clone, index) {
        if (clone.x > mit.W || clone.y < 0 || clone.y > mit.H)
          self.clones.splice(index, 1);

        clone.x += utils.randomNumber(5, 10);
        clone.y += utils.randomNumber(-20, 20);

        clone.draw(ctx);
      });

      return;
    },

    checkCloneCollision: function() {

      var self = this;

      // super optimization :P
      if (!self.clones.length)
        return;

      var branches = mit.BranchUtils.branches;
      var forks = mit.ForkUtils.forks;
      var pakias = mit.PakiaUtils.pakias;

      // Check collisions with branches
      branches.forEach(function(branch, branch_index) {
        var branch_bound = branch.getBounds();

        var branch_broke = 0;

        self.clones.forEach(function(clone) {

          if (branch_broke)
            return;

          var clone_bound = clone.getBounds();

          if (utils.intersect(branch_bound, clone_bound)) {
            branches.splice(branch_index, 1);

            branch_broke = 1;
          }
        });

        return;
      });

      // Check collisions with forks
      forks.forEach(function(fork, fork_index) {
        var fork_head_bound = fork.getHeadBounds();
        var fork_handle_bound = fork.getHandleBounds();

        var fork_broke = 0;

        self.clones.forEach(function(clone) {

          if (fork_broke)
            return;

          var clone_bound = clone.getBounds();

          if (
            utils.intersect(fork_head_bound, clone_bound) ||
            utils.intersect(fork_handle_bound, clone_bound)
          ) {

            // 2 pakias could kill same fork
            // hence just check whether it exists or not
            forks.splice(fork_index, 1);

            fork_broke = 1;
          }

          return;
        });

        return;
      });

      // Check collisions with pakias
      pakias.forEach(function(pakia, pakia_index) {
        var pakia_bound = pakia.getBounds();

        var pakia_dead = 0;

        self.clones.forEach(function(clone) {

          if (pakia_dead)
            return;

          var clone_bound = clone.getBounds();

          if (utils.intersect(pakia_bound, clone_bound)) {
            mit.PakiaUtils.cur_pakia = false;

            pakia_dead = 1;
          }

          return;
        });

        return;
      });

      return;
    }
  };

}());
